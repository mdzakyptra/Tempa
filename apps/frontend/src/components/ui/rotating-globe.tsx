import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from './use-container-size'
import { getCachedWorldLandData, loadWorldLandData, type LandData } from './globe-land-data'

interface RotatingGlobeProps {
  width?: number
  height?: number
  className?: string
}

const ROTATE_DEG_PER_SEC = 6
const PITCH_DEG = -14

//<---------- RotatingGlobe -------------->
// Decorative globe for the 404 page — auto-rotates continuously around the
// whole world, no drag/zoom/click. Unlike WireframeDottedGlobe (which stays
// clamped to Indonesia for the report map), this one has nothing to focus on.
export default function RotatingGlobe({ width: maxWidth = 900, height: maxHeight = 900, className = 'w-full h-full' }: RotatingGlobeProps) {
  const { wrapperRef, width, height } = useContainerSize(maxWidth, maxHeight)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landDataRef = useRef<LandData | null>(null)
  const [, setLoaded] = useState(0)

  useEffect(() => {
    const cached = getCachedWorldLandData()
    if (cached) {
      landDataRef.current = cached
      return
    }
    loadWorldLandData().then((data) => {
      landDataRef.current = data
      setLoaded((n) => n + 1)
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || width === 0 || height === 0) return

    const radius = Math.min(width, height) / 2.5
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.scale(dpr, dpr)

    const projection = d3.geoOrthographic().scale(radius).translate([width / 2, height / 2]).clipAngle(90)
    const path = d3.geoPath().projection(projection).context(context)

    let yaw = 0

    const render = () => {
      context.clearRect(0, 0, width, height)
      projection.rotate([yaw, PITCH_DEG, 0])

      context.beginPath()
      path(d3.geoGraticule()())
      context.strokeStyle = '#a1a1aa'
      context.lineWidth = 1
      context.globalAlpha = 0.35
      context.stroke()
      context.globalAlpha = 1

      const data = landDataRef.current
      if (!data) return

      context.beginPath()
      data.features.forEach((feature) => path(feature))
      context.strokeStyle = '#3f3f46'
      context.lineWidth = 1
      context.stroke()

      // Point projection (unlike path()) doesn't clip to the front hemisphere on
      // its own, so backside dots have to be dropped by hand via great-circle
      // distance from the point currently facing the viewer.
      const front = projection.invert?.([width / 2, height / 2])
      if (!front) return

      data.dots.forEach((dot) => {
        if (d3.geoDistance([dot.lng, dot.lat], front) > Math.PI / 2) return
        const projected = projection([dot.lng, dot.lat])
        if (!projected) return
        context.beginPath()
        context.arc(projected[0], projected[1], 1, 0, 2 * Math.PI)
        context.fillStyle = '#52525b'
        context.fill()
      })
    }
    render()

    let lastTime = performance.now()
    let frameId = requestAnimationFrame(function tick(time) {
      const dt = time - lastTime
      lastTime = time
      yaw += ROTATE_DEG_PER_SEC * (dt / 1000)
      render()
      frameId = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(frameId)
  }, [width, height])

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  )
}
