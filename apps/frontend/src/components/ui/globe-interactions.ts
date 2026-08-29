import * as d3 from 'd3'

// Indonesia spans roughly 95–141°E, -11–6°N — keep the globe locked on that region.
export const INDONESIA_CENTER: [number, number] = [118, -2.5]
export const INDONESIA_BOUNDS = { minLng: 88, maxLng: 148, minLat: -14, maxLat: 9 }
export const YAW_RANGE = 26
export const PITCH_RANGE = 14
export const INITIAL_ZOOM = 1.6
export const MIN_ZOOM = 1.2
export const MAX_ZOOM = 5
const CLICK_DRAG_THRESHOLD = 4
const ZONE_HIT_RADIUS_PX = 12
// Screen-space, not geo distance — two zones whose projected points land within
// this many px of each other merge into one cluster at the current zoom level.
const CLUSTER_MERGE_PX = 18

//<---------- clamp -------------->
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

/** One clickable aduan-density marker on the globe — centroid + how many active reports sit in it. */
export interface GlobeZone {
  kawasan: string
  lat: number
  lng: number
  count: number
}

/** Zones whose projected points currently land close enough together to merge visually. */
export interface GlobeZoneCluster {
  lat: number
  lng: number
  count: number
  members: GlobeZone[]
}

//<---------- clusterZones -------------->
// Recomputed fresh every render/hit-test off the LIVE projection (not cached
// across frames) — as the globe zooms in, points that used to merge drift far
// enough apart on screen to split back into their own clusters automatically.
export function clusterZones(zones: GlobeZone[], projection: d3.GeoProjection): GlobeZoneCluster[] {
  const rotate = projection.rotate()
  const visibleCenter: [number, number] = [-rotate[0], -rotate[1]]

  const onFrontFace = zones
    .filter((zone) => d3.geoDistance([zone.lng, zone.lat], visibleCenter) < Math.PI / 2)
    .map((zone) => ({ zone, screen: projection([zone.lng, zone.lat]) }))
    .filter((item): item is { zone: GlobeZone; screen: [number, number] } => item.screen !== null)

  const groups: { screen: [number, number]; members: GlobeZone[] }[] = []
  for (const item of onFrontFace) {
    const near = groups.find((g) => Math.hypot(g.screen[0] - item.screen[0], g.screen[1] - item.screen[1]) <= CLUSTER_MERGE_PX)
    if (near) {
      near.members.push(item.zone)
      const n = near.members.length
      near.screen = [(near.screen[0] * (n - 1) + item.screen[0]) / n, (near.screen[1] * (n - 1) + item.screen[1]) / n]
    } else {
      groups.push({ screen: item.screen, members: [item.zone] })
    }
  }

  return groups.map(({ members }) => ({
    count: members.reduce((sum, m) => sum + m.count, 0),
    lat: members.reduce((sum, m) => sum + m.lat, 0) / members.length,
    lng: members.reduce((sum, m) => sum + m.lng, 0) / members.length,
    members,
  }))
}

//<---------- scaleToSeparate -------------->
// Absolute projection scale (not a multiplier) needed so the CLOSEST pair of
// kawasan in this cluster ends up more than marginPx apart on screen — one
// analytic zoom that fully separates every member, instead of guessing a
// multiplier and making the user click repeatedly. Screen distance for two
// points this close together, both near the rotation's sub-point, is well
// approximated by scale * angularDistance (radians).
export function scaleToSeparate(cluster: GlobeZoneCluster, marginPx = CLUSTER_MERGE_PX * 2.5): number | null {
  if (cluster.members.length < 2) return null

  let minAngular = Infinity
  for (let i = 0; i < cluster.members.length; i++) {
    for (let j = i + 1; j < cluster.members.length; j++) {
      const a = cluster.members[i]
      const b = cluster.members[j]
      const angular = d3.geoDistance([a.lng, a.lat], [b.lng, b.lat])
      if (angular < minAngular) minAngular = angular
    }
  }

  return minAngular > 0 ? marginPx / minAngular : null
}

interface AttachGlobeInteractionsArgs {
  canvas: HTMLCanvasElement
  projection: d3.GeoProjection
  width: number
  height: number
  radius: number
  rotationRef: { current: [number, number, number] }
  onLocationPickRef: { current?: (coords: [number, number]) => void }
  render: () => void
  /** Set true for the duration of a drag, so auto-rotate can pause while the user is in control. */
  interactingRef?: { current: boolean }
  zonesRef?: { current: GlobeZone[] }
  onZoneClickRef?: { current?: (cluster: GlobeZoneCluster) => void }
}

//<---------- attachGlobeInteractions -------------->
export function attachGlobeInteractions({
  canvas,
  projection,
  width,
  height,
  radius,
  rotationRef,
  onLocationPickRef,
  render,
  interactingRef,
  zonesRef,
  onZoneClickRef,
}: AttachGlobeInteractionsArgs) {
  const handleMouseDown = (event: MouseEvent) => {
    if (interactingRef) interactingRef.current = true
    const startX = event.clientX
    const startY = event.clientY
    const startRotation: [number, number, number] = [...rotationRef.current]
    let maxMovement = 0

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sensitivity = 0.5
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      maxMovement = Math.max(maxMovement, Math.hypot(dx, dy))

      rotationRef.current[0] = clamp(
        startRotation[0] + dx * sensitivity,
        -INDONESIA_CENTER[0] - YAW_RANGE,
        -INDONESIA_CENTER[0] + YAW_RANGE,
      )
      rotationRef.current[1] = clamp(
        startRotation[1] - dy * sensitivity,
        -INDONESIA_CENTER[1] - PITCH_RANGE,
        -INDONESIA_CENTER[1] + PITCH_RANGE,
      )

      projection.rotate(rotationRef.current)
      render()
    }

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (interactingRef) interactingRef.current = false

      if (maxMovement < CLICK_DRAG_THRESHOLD) {
        const rect = canvas.getBoundingClientRect()
        const [x, y] = [upEvent.clientX - rect.left, upEvent.clientY - rect.top]

        const clusterHit = clusterZones(zonesRef?.current ?? [], projection).find((cluster) => {
          const projected = projection([cluster.lng, cluster.lat])
          return projected && Math.hypot(projected[0] - x, projected[1] - y) <= ZONE_HIT_RADIUS_PX
        })
        if (clusterHit) {
          onZoneClickRef?.current?.(clusterHit)
          return
        }

        if (onLocationPickRef.current) {
          const coords = projection.invert?.([x, y])
          const withinSphere = Math.hypot(x - width / 2, y - height / 2) <= projection.scale()
          if (coords && withinSphere) onLocationPickRef.current(coords as [number, number])
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const factor = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = clamp(projection.scale() * factor, radius * MIN_ZOOM, radius * MAX_ZOOM)
    projection.scale(newScale)
    render()
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('wheel', handleWheel)

  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('wheel', handleWheel)
  }
}
