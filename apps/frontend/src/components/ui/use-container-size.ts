import { useEffect, useRef, useState } from 'react'

//<---------- useContainerSize -------------->
export function useContainerSize(maxWidth: number, maxHeight: number) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const applyRect = (width: number, height: number) => {
      if (width === 0 || height === 0) return
      setRect({ width: Math.round(Math.min(width, maxWidth)), height: Math.round(Math.min(height, maxHeight)) })
    }

    // Some layouts (e.g. deep down a long scrollable page) never deliver a
    // ResizeObserver callback for the initial size — read it directly too.
    const initial = wrapper.getBoundingClientRect()
    applyRect(initial.width, initial.height)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]?.contentRect
      if (entry) applyRect(entry.width, entry.height)
    })

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [maxWidth, maxHeight])

  return { wrapperRef, ...rect }
}
