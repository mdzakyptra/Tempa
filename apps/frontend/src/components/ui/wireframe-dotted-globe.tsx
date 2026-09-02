import { forwardRef, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  attachGlobeInteractions,
  clusterZones,
  INDONESIA_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  YAW_RANGE,
  type GlobeZone,
  type GlobeZoneCluster,
} from './globe-interactions'
import { useContainerSize } from './use-container-size'
import { getCachedLandData, loadLandData, type LandData } from './globe-land-data'
import { useGlobeZoomHandle, type WireframeDottedGlobeHandle } from './globe-zoom-controller'

export type { GlobeZone, GlobeZoneCluster, WireframeDottedGlobeHandle }

interface WireframeDottedGlobeProps {
  /** Max canvas width/height in px — the canvas otherwise fills its container edge-to-edge. */
  width?: number
  height?: number
  className?: string
  /** Called with [lng, lat] when the user clicks a point on the globe (not a drag). */
  onLocationPick?: (coords: [number, number]) => void
  /** Aduan-density markers (one per kawasan) — merge visually when zoomed out, split apart on zoom-in. */
  zones?: GlobeZone[]
  /** Called instead of onLocationPick when the click lands on a zone cluster. */
  onZoneClick?: (cluster: GlobeZoneCluster) => void
  /** Sphere radius as a multiple of the base radius (container/2.5). Default 1.6 fills the frame
   *  edge-to-edge; drop below ~1.25 to keep the whole globe inside a small container. */
  zoom?: number
  /** Interaction hint pill. Turn off where the globe is decorative or the box is too narrow for it. */
  showHint?: boolean
}

//<---------- clusterColor -------------->
// A cluster still holding more than one kawasan gets the severity scale; once
// it's down to a single kawasan (zoomed in enough to separate, or was always
// alone) it's just a location marker, not a hotzone — neutral blue instead.
function clusterColor(cluster: GlobeZoneCluster) {
  if (cluster.members.length > 1) {
    if (cluster.count >= 8) return '#dc2626'
    if (cluster.count >= 4) return '#f97316'
    return '#eab308'
  }
  return '#2563eb'
}

//<---------- WireframeDottedGlobe -------------->
const WireframeDottedGlobe = forwardRef<WireframeDottedGlobeHandle, WireframeDottedGlobeProps>(
  function WireframeDottedGlobe(
    {
      width: maxWidth = 3000,
      height: maxHeight = 3000,
      className = 'w-full h-full',
      onLocationPick,
      zones = [],
      onZoneClick,
      zoom = INITIAL_ZOOM,
      showHint = true,
    },
    ref,
  ) {
    const { wrapperRef, width, height } = useContainerSize(maxWidth, maxHeight)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isLoading, setIsLoading] = useState(() => !getCachedLandData())
    const [error, setError] = useState<string | null>(null)

    const projectionRef = useRef<d3.GeoProjection | null>(null)
    const renderRef = useRef<() => void>(() => {})
    const baseRadiusRef = useRef(0)
    const rotationRef = useRef<[number, number, number]>([-INDONESIA_CENTER[0], -INDONESIA_CENTER[1], 0])
    const landDataRef = useRef<LandData | null>(null)
    const onLocationPickRef = useRef(onLocationPick)
    useEffect(() => {
      onLocationPickRef.current = onLocationPick
    }, [onLocationPick])

    const zonesRef = useRef(zones)
    const onZoneClickRef = useRef(onZoneClick)
    useEffect(() => {
      zonesRef.current = zones
      onZoneClickRef.current = onZoneClick
      renderRef.current()
    }, [zones, onZoneClick])

    // Auto-rotate drifts the yaw back and forth across the clamped Indonesia
    // range on its own; paused while the user drags or a zoomIn/reset tween
    // (imperative handle below) is animating the same rotationRef.
    const interactingRef = useRef(false)
    const suspendAutoRotateRef = useRef(false)
    const autoRotateDirRef = useRef<1 | -1>(1)

    useGlobeZoomHandle({
      ref,
      canvasRef,
      projectionRef,
      baseRadiusRef,
      rotationRef,
      renderRef,
      suspendAutoRotateRef,
      initialZoom: zoom,
    })

    useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context || width === 0 || height === 0) return

      const radius = Math.min(width, height) / 2.5
      baseRadiusRef.current = radius

      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.scale(dpr, dpr)

      const projection = d3
        .geoOrthographic()
        .scale(radius * zoom)
        .translate([width / 2, height / 2])
        .clipAngle(90)
      projectionRef.current = projection
      projection.rotate(rotationRef.current)

      const path = d3.geoPath().projection(projection).context(context)

      const render = () => {
        context.clearRect(0, 0, width, height)
        const scaleFactor = projection.scale() / radius

        const data = landDataRef.current
        if (!data) return

        // Bola laut — proyeksi orthographic selalu tampil bulat sepanjang
        // scale() (radius layar dalam px), isi warna sebelum gambar apa-apa.
        context.beginPath()
        context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI)
        context.fillStyle = '#bfdbfe'
        context.fill()

        context.beginPath()
        path(d3.geoGraticule()())
        context.strokeStyle = '#a1a1aa'
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = 0.35
        context.stroke()
        context.globalAlpha = 1

        context.beginPath()
        data.features.forEach((feature) => path(feature))
        context.strokeStyle = '#3f3f46'
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        data.dots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (projected && projected[0] >= 0 && projected[0] <= width && projected[1] >= 0 && projected[1] <= height) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = '#16a34a'
            context.fill()
          }
        })

        // Fixed radius regardless of report count — only the color escalates,
        // so a busy cluster never grows into a blob that swallows its neighbors.
        // Clustering itself is recomputed live off the current projection, so
        // zooming in naturally splits merged kawasan back into separate dots.
        clusterZones(zonesRef.current, projection).forEach((cluster) => {
          const projected = projection([cluster.lng, cluster.lat])
          if (!projected) return
          context.beginPath()
          context.arc(projected[0], projected[1], 1.8 * scaleFactor, 0, 2 * Math.PI)
          context.fillStyle = clusterColor(cluster)
          context.globalAlpha = 0.4
          context.fill()
          context.globalAlpha = 1
        })
      }
      renderRef.current = render
      render()

      const detachInteractions = attachGlobeInteractions({
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
        minZoom: Math.min(MIN_ZOOM, zoom),
      })

      const AUTO_ROTATE_DEG_PER_SEC = 4
      const minYaw = -INDONESIA_CENTER[0] - YAW_RANGE
      const maxYaw = -INDONESIA_CENTER[0] + YAW_RANGE
      let lastTime = performance.now()
      let frameId = requestAnimationFrame(function tick(time) {
        const dt = time - lastTime
        lastTime = time

        // Only auto-rotate at the untouched default view — any zoom (wheel or
        // programmatic) holds still so the dots stop drifting under the cursor.
        const atDefaultZoom = Math.abs(projection.scale() - radius * zoom) < 1
        if (atDefaultZoom && !interactingRef.current && !suspendAutoRotateRef.current) {
          let yaw = rotationRef.current[0] + autoRotateDirRef.current * AUTO_ROTATE_DEG_PER_SEC * (dt / 1000)
          if (yaw >= maxYaw) {
            yaw = maxYaw
            autoRotateDirRef.current = -1
          } else if (yaw <= minYaw) {
            yaw = minYaw
            autoRotateDirRef.current = 1
          }
          rotationRef.current[0] = yaw
          projection.rotate(rotationRef.current)
          render()
        }

        frameId = requestAnimationFrame(tick)
      })

      return () => {
        cancelAnimationFrame(frameId)
        detachInteractions()
      }
    }, [width, height, zoom])

    useEffect(() => {
      const cached = getCachedLandData()
      if (cached) {
        landDataRef.current = cached
        renderRef.current()
        return
      }

      loadLandData()
        .then((data) => {
          landDataRef.current = data
          renderRef.current()
          setIsLoading(false)
        })
        .catch(() => {
          setError('Failed to load land map data')
          setIsLoading(false)
        })
    }, [])

    if (error) {
      return (
        <div className={`flex items-center justify-center bg-card rounded-2xl p-8 ${className}`}>
          <div className="text-center">
            <p className="text-destructive font-semibold mb-2">Error loading Earth visualization</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      )
    }

    return (
      <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
        {/* touch-pan-y: scroll vertikal halaman tetap milik browser, sisanya (drag 1 jari,
            pinch 2 jari) ditangani attachGlobeInteractions. */}
        <canvas ref={canvasRef} className="cursor-pointer touch-pan-y" />
        {(showHint || isLoading) && (
          <div className="absolute bottom-4 left-4 text-xs text-foreground/70 px-2 py-1 rounded-md bg-white/80 border border-border backdrop-blur">
            {isLoading ? 'Memuat peta…' : 'Klik lokasi • Geser untuk putar • Scroll untuk zoom'}
          </div>
        )}
      </div>
    )
  },
)

export default WireframeDottedGlobe
