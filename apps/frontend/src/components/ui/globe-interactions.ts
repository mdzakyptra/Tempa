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
  /** Scroll-out floor. Defaults to MIN_ZOOM; a compact globe passes its own smaller initial zoom
   *  so wheeling out doesn't snap the sphere back to bigger-than-its-frame. */
  minZoom?: number
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
  minZoom = MIN_ZOOM,
}: AttachGlobeInteractionsArgs) {
  // Dua jari = pinch, bukan drag rotasi. Flag ini bikin pointer drag berhenti
  // begitu jari kedua turun, jadi bola gak ikut muter waktu user nge-zoom.
  let pinchStartDistance = 0
  let pinchStartScale = 0
  let pinching = false

  const handlePointerDown = (event: PointerEvent) => {
    if (pinching) return
    if (interactingRef) interactingRef.current = true
    const startX = event.clientX
    const startY = event.clientY
    const startRotation: [number, number, number] = [...rotationRef.current]
    let maxMovement = 0

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (pinching) return
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

    const handlePointerUp = (upEvent: PointerEvent) => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerUp)
      if (interactingRef) interactingRef.current = false

      if (maxMovement < CLICK_DRAG_THRESHOLD && !pinching) {
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

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('pointercancel', handlePointerUp)
  }

  //<---------- zoomBy -------------->
  const zoomBy = (factor: number) => {
    projection.scale(clamp(projection.scale() * factor, radius * minZoom, radius * MAX_ZOOM))
    render()
  }

  const touchDistance = (touches: TouchList) =>
    Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 2) return
    pinching = true
    pinchStartDistance = touchDistance(event.touches)
    pinchStartScale = projection.scale()
    if (interactingRef) interactingRef.current = true
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!pinching || event.touches.length !== 2 || pinchStartDistance === 0) return
    // Canvas-nya touch-action: pan-y, jadi scroll vertikal halaman tetap jalan;
    // gestur dua jari yang sampai ke sini memang buat globe, bukan buat page.
    event.preventDefault()
    const nextScale = pinchStartScale * (touchDistance(event.touches) / pinchStartDistance)
    projection.scale(clamp(nextScale, radius * minZoom, radius * MAX_ZOOM))
    render()
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length >= 2) return
    pinching = false
    pinchStartDistance = 0
    if (interactingRef) interactingRef.current = false
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    zoomBy(event.deltaY > 0 ? 0.9 : 1.1)
  }

  canvas.addEventListener('pointerdown', handlePointerDown)
  canvas.addEventListener('wheel', handleWheel)
  canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
  canvas.addEventListener('touchend', handleTouchEnd)
  canvas.addEventListener('touchcancel', handleTouchEnd)

  return () => {
    canvas.removeEventListener('pointerdown', handlePointerDown)
    canvas.removeEventListener('wheel', handleWheel)
    canvas.removeEventListener('touchstart', handleTouchStart)
    canvas.removeEventListener('touchmove', handleTouchMove)
    canvas.removeEventListener('touchend', handleTouchEnd)
    canvas.removeEventListener('touchcancel', handleTouchEnd)
  }
}
