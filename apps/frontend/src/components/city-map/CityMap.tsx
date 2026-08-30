import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN

export interface CityMapMarker {
  id: string
  lat: number
  lng: number
  label?: string
  /** Which kawasan this report belongs to — used to gate it behind a zone circle when `zones` is set. */
  kawasan?: string
}

/** One kawasan's aduan-density hotzone — a transparent circle standing in for its real markers until clicked. */
export interface CityMapZone {
  kawasan: string
  lat: number
  lng: number
  count: number
}

interface CityMapProps {
  /** Many markers (Beranda queue) or a single marker (Detail Laporan). */
  markers: CityMapMarker[]
  /** When set, markers are hidden behind per-kawasan hotzone circles until their zone is clicked. */
  zones?: CityMapZone[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: CityMapMarker) => void
  /** Fired whenever a hotzone circle is clicked, with whether it's now expanded (markers revealed) or collapsed. */
  onZoneClick?: (kawasan: string, expanded: boolean) => void
  /** Bump this to force-collapse all expanded zones without changing `zones` itself (e.g. a "back" button). */
  resetExpandTrigger?: number
  className?: string
}

//<---------- zoneColor -------------->
function zoneColor(count: number) {
  if (count >= 8) return '#dc2626'
  if (count >= 4) return '#f97316'
  return '#eab308'
}

//<---------- zoneRadiusMeters -------------->
// Grows with report count but capped — a busy kawasan's circle stays legible
// instead of swallowing its neighbors on the same city view.
function zoneRadiusMeters(count: number) {
  return Math.min(180 + count * 35, 600)
}

// metersToPixelsAtLat — GeoJSON circles need a screen-space radius, so a
// literal-meter circle has to be reprojected on every zoom tick.
function metersToPixelsAtLat(meters: number, lat: number, zoom: number) {
  return meters / (0.075 * Math.cos((lat * Math.PI) / 180) * 2 ** (24 - zoom))
}

// Stable reference for the "no zones" default — a literal `[]` default
// parameter would create a new array every render and defeat the
// `zones !== prevZones` check below, causing an infinite render loop.
const NO_ZONES: CityMapZone[] = []

//<---------- boundsFromMarkers -------------->
function boundsFromMarkers(markers: CityMapMarker[]): mapboxgl.LngLatBounds {
  const bounds = new mapboxgl.LngLatBounds([markers[0].lng, markers[0].lat], [markers[0].lng, markers[0].lat])
  for (const marker of markers) bounds.extend([marker.lng, marker.lat])
  return bounds
}

//<---------- CityMap -------------->
// Mapbox GL swap-in for the old Leaflet renderer — same props, same
// FlyTo-on-center-change and zone click-to-expand behavior, but pitched
// 3D buildings instead of a flat raster tile.
export default function CityMap({
  markers,
  zones = NO_ZONES,
  center,
  zoom = 15,
  onMarkerClick,
  onZoneClick,
  resetExpandTrigger,
  className = 'h-full w-full',
}: CityMapProps) {
  const resolvedCenter: [number, number] = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : [-2.5, 118])
  const resolvedZoom = center || markers.length > 0 ? zoom : 4

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerObjectsRef = useRef<mapboxgl.Marker[]>([])
  const onMarkerClickRef = useRef(onMarkerClick)
  onMarkerClickRef.current = onMarkerClick
  const onZoneClickRef = useRef(onZoneClick)
  onZoneClickRef.current = onZoneClick

  // Which kawasan the viewer has clicked open — reset whenever a fresh set of
  // zones comes in (a new dive), so an old dive's revealed points don't leak
  // in. Adjusted during render (not an effect) so it lands in the same paint.
  const [expandedKawasan, setExpandedKawasan] = useState<Set<string>>(new Set())
  const [prevZones, setPrevZones] = useState(zones)
  if (zones !== prevZones) {
    setPrevZones(zones)
    setExpandedKawasan(new Set())
  }

  // External "collapse everything" trigger (e.g. a back button) — same
  // reset, just driven by a prop bump instead of a `zones` change.
  const [prevResetTrigger, setPrevResetTrigger] = useState(resetExpandTrigger)
  if (resetExpandTrigger !== prevResetTrigger) {
    setPrevResetTrigger(resetExpandTrigger)
    setExpandedKawasan(new Set())
  }

  const visibleMarkers = zones.length > 0 ? markers.filter((marker) => marker.kawasan && expandedKawasan.has(marker.kawasan)) : markers

  // Mount once — style/terrain/pitch set up here, torn down on unmount.
  useEffect(() => {
    const container = containerRef.current
    if (!container || !MAPBOX_TOKEN) return

    // Lebih dari 1 marker & nggak ada `center` eksplisit — fit ke semua
    // marker (mis. Antrean, laporan tersebar se-Indonesia), bukan zoom ke
    // marker pertama doang (biasanya laporan skor tertinggi, kebetulan
    // numpuk di satu kota bikin peta serasa "ke-hardcode" ke situ).
    const initialView =
      !center && visibleMarkers.length > 1
        ? { bounds: boundsFromMarkers(visibleMarkers), fitBoundsOptions: { padding: 60, maxZoom: 12 } }
        : { center: [resolvedCenter[1], resolvedCenter[0]] as [number, number], zoom: resolvedZoom }

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/light-v11',
      ...initialView,
      pitch: 55,
      bearing: -12,
      antialias: true,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')

    map.on('load', () => {
      // 3D building extrusions — the actual "3D" in this map, not just tilt.
      const layers = map.getStyle()?.layers
      const labelLayerId = layers?.find((l) => l.type === 'symbol' && l.layout?.['text-field'])?.id
      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#d4d4d4',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.75,
          },
        },
        labelLayerId,
      )

      map.addSource('zones', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'zones-fill',
        type: 'circle',
        source: 'zones',
        paint: {
          'circle-radius': ['get', 'radiusPx'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.18,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.5,
          'circle-stroke-width': 1.5,
        },
      })

      map.on('click', 'zones-fill', (event) => {
        const kawasan = event.features?.[0]?.properties?.kawasan as string | undefined
        if (!kawasan) return
        setExpandedKawasan((prev) => {
          const next = new Set(prev)
          const expanded = !next.has(kawasan)
          if (expanded) next.add(kawasan)
          else next.delete(kawasan)
          onZoneClickRef.current?.(kawasan, expanded)
          return next
        })
      })
      map.on('mouseenter', 'zones-fill', () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', 'zones-fill', () => (map.getCanvas().style.cursor = ''))
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // FlyTo/fitBounds — recenter smoothly when the resolved view changes.
  // Lebih dari 1 marker tanpa `center` eksplisit → fit ke semua marker
  // (dipakai bareng `boundsSignature`, primitive string, biar effect ini
  // nggak keulang tiap render cuma gara-gara `markers` array baru dari
  // parent yang nggak di-memo).
  const [resolvedLat, resolvedLng] = resolvedCenter
  const boundsSignature =
    !center && visibleMarkers.length > 1
      ? visibleMarkers.map((m) => `${m.lat.toFixed(3)},${m.lng.toFixed(3)}`).join('|')
      : ''

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyView = () => {
      if (!center && visibleMarkers.length > 1) {
        map.fitBounds(boundsFromMarkers(visibleMarkers), { padding: 60, duration: 1200, maxZoom: 12 })
      } else {
        map.flyTo({ center: [resolvedLng, resolvedLat], zoom: resolvedZoom, duration: 1200 })
      }
    }

    if (map.loaded()) applyView()
    else map.once('load', applyView)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedLat, resolvedLng, resolvedZoom, boundsSignature, center])

  // Zone circles — re-project radius in pixels on every zoom tick so it
  // still reads as a fixed real-world radius while pitched/zoomed.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const setZoneData = () => {
      const source = map.getSource('zones') as mapboxgl.GeoJSONSource | undefined
      if (!source) return
      const currentZoom = map.getZoom()
      source.setData({
        type: 'FeatureCollection',
        features: zones.map((zone) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [zone.lng, zone.lat] },
          properties: {
            kawasan: zone.kawasan,
            color: zoneColor(zone.count),
            radiusPx: metersToPixelsAtLat(zoneRadiusMeters(zone.count), zone.lat, currentZoom),
          },
        })),
      })
    }

    if (map.loaded()) setZoneData()
    else map.once('load', setZoneData)
    map.on('zoom', setZoneData)
    return () => {
      map.off('zoom', setZoneData)
    }
  }, [zones])

  // Markers — plain DOM mapboxgl.Marker (no React reconciliation needed,
  // list is short and swaps wholesale on expand/collapse).
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const attach = () => {
      markerObjectsRef.current.forEach((m) => m.remove())
      markerObjectsRef.current = visibleMarkers.map((marker) => {
        const mbMarker = new mapboxgl.Marker({ color: '#2563eb' }).setLngLat([marker.lng, marker.lat]).addTo(map)
        if (marker.label) mbMarker.setPopup(new mapboxgl.Popup({ offset: 24 }).setText(marker.label))
        mbMarker.getElement().addEventListener('click', () => onMarkerClickRef.current?.(marker))
        return mbMarker
      })
    }

    if (map.loaded()) attach()
    else map.once('load', attach)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMarkers])

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-neutral-50 p-4 text-center text-sm text-neutral-500 ${className}`}>
        Peta belum aktif — set <code className="mx-1 rounded bg-neutral-200 px-1 py-0.5">VITE_MAPBOX_TOKEN</code> di{' '}
        <code className="mx-1 rounded bg-neutral-200 px-1 py-0.5">.env</code>.
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
