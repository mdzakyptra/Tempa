import { useImperativeHandle, type Ref, type RefObject } from 'react'
import * as d3 from 'd3'
import { INDONESIA_CENTER, INITIAL_ZOOM } from './globe-interactions'

export interface ZoomOptions {
  /** How much bigger than the base radius to scale to. Default 2.2. */
  scaleMultiplier?: number
  duration?: number
  onComplete?: () => void
}

export interface WireframeDottedGlobeHandle {
  zoomIn: (focus?: [number, number], options?: ZoomOptions) => void
  /** Animate back to the default Indonesia-centered view. */
  reset: (options?: Omit<ZoomOptions, 'scaleMultiplier'>) => void
}

interface UseGlobeZoomHandleArgs {
  ref: Ref<WireframeDottedGlobeHandle>
  canvasRef: RefObject<HTMLCanvasElement | null>
  projectionRef: RefObject<d3.GeoProjection | null>
  baseRadiusRef: RefObject<number>
  rotationRef: RefObject<[number, number, number]>
  renderRef: RefObject<() => void>
  suspendAutoRotateRef: RefObject<boolean>
  /** Zoom `reset()` returns to — mirrors the globe's own initial zoom. */
  initialZoom?: number
}

//<---------- useGlobeZoomHandle -------------->
export function useGlobeZoomHandle({
  ref,
  canvasRef,
  projectionRef,
  baseRadiusRef,
  rotationRef,
  renderRef,
  suspendAutoRotateRef,
  initialZoom = INITIAL_ZOOM,
}: UseGlobeZoomHandleArgs) {
  useImperativeHandle(ref, () => {
    const animateTo = (
      toScale: number,
      toRotate: [number, number, number],
      { duration = 1200, onComplete }: Omit<ZoomOptions, 'scaleMultiplier'> = {},
    ) => {
      const canvas = canvasRef.current
      const projection = projectionRef.current
      if (!canvas || !projection) return

      const fromScale = projection.scale()
      const fromRotate = projection.rotate() as [number, number, number]
      const interpolateScale = d3.interpolate(fromScale, toScale)
      const interpolateRotate = d3.interpolateArray(fromRotate, toRotate)

      suspendAutoRotateRef.current = true
      const transition = d3
        .select(canvas)
        .transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .tween('zoom', () => (t: number) => {
          projection.scale(interpolateScale(t))
          projection.rotate(interpolateRotate(t) as [number, number, number])
          rotationRef.current = projection.rotate() as [number, number, number]
          renderRef.current()
        })

      transition.on('end', () => {
        suspendAutoRotateRef.current = false
        onComplete?.()
      })
    }

    const zoomIn: WireframeDottedGlobeHandle['zoomIn'] = (focus, { scaleMultiplier = 2.2, ...rest } = {}) => {
      const projection = projectionRef.current
      if (!projection) return
      const toRotate: [number, number, number] = focus ? [-focus[0], -focus[1], 0] : (projection.rotate() as [number, number, number])
      animateTo(baseRadiusRef.current * scaleMultiplier, toRotate, rest)
    }

    return {
      zoomIn,
      reset: (options = {}) => zoomIn(INDONESIA_CENTER, { ...options, scaleMultiplier: initialZoom }),
    }
  })
}
