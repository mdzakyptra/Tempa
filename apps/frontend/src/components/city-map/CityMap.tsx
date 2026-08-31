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
  weight?: number
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
  heatmap?: boolean
  className?: string
  /** Mapbox style URL — default tetap light-v11 (minimalis, brand app). Override buat momen yang butuh peta lebih "hidup"/berwarna. */
  mapStyle?: string
  /** Muter bearing pelan terus-terusan — dekoratif, default off. */
  autoRotate?: boolean
  /** Marker jadi titik nge-pulse (radar ping) alih-alih pin biru default. */
  pulseMarkers?: boolean
  /** Sembunyiin logo Mapbox & tombol info attribution. */
  hideAttribution?: boolean
}

const DEFAULT_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12'

//<---------- zoneColor -------------->
function zoneColor(count: number) {
  if (count >= 8) return '#dc2626'
  if (count >= 4) return '#f97316'
  return '#eab308'
}

//<---------- zoneRadiusPx -------------->
// Radius pixel TETAP, gak dihitung dari radius meter dunia nyata lagi —
// dulu circle dikonversi dari meter ke pixel per zoom level, jadi makin
// zoom out target klik-nya makin ngecil di layar (kebalikan dari yang
// dibutuhin). Radius pixel murni gak kepengaruh zoom sama sekali, jadi
// tetep gampang diklik di zoom level manapun.
function zoneRadiusPx(count: number) {
  return Math.min(28 + count * 4, 70)
}

// Stable reference for the "no zones" default — a literal `[]` default
// parameter would create a new array every render and defeat the
// `zones !== prevZones` check below, causing an infinite render loop.
const NO_ZONES: CityMapZone[] = []

//<---------- pulseMarkerElement -------------->
function pulseMarkerElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'relative flex size-4 cursor-pointer items-center justify-center'
  el.innerHTML =
    '<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60"></span>' +
    '<span class="relative inline-flex size-3 rounded-full bg-blue-600 ring-2 ring-white"></span>'
  return el
}

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
  heatmap = false,
  className = 'h-full w-full',
  mapStyle = DEFAULT_STYLE,
  autoRotate = false,
  pulseMarkers = false,
  hideAttribution = false,
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
      style: mapStyle,
      ...initialView,
      pitch: 62,
      bearing: -12,
      antialias: true,
      attributionControl: !hideAttribution,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')

    // Logo control Mapbox nempel telat (bukan pas constructor/'load') DAN
    // Mapbox nyalain balik `style.display='block'`-nya sendiri tiap
    // source/style data update — observer harus jagain childList (nunggu
    // elemennya nongol) SEKALIGUS attribute style-nya (nangkep tiap kali
    // Mapbox nyalain balik), bukan cuma sekali hide terus disconnect.
    let logoObserver: MutationObserver | undefined
    if (hideAttribution) {
      const hideLogo = () => {
        const logo = container.querySelector<HTMLElement>('.mapboxgl-ctrl-logo')?.closest<HTMLElement>('.mapboxgl-ctrl')
        if (logo && logo.style.display !== 'none') logo.style.display = 'none'
      }
      hideLogo()
      logoObserver = new MutationObserver(hideLogo)
      logoObserver.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })
    }

    map.on('load', () => {
      // 3D building extrusions — the actual "3D" in this map, not just tilt.
      // coalesce ke tinggi default (8m ~ 2 lantai) — banyak area (mis. jalan
      // residensial di luar kota besar) gak punya data `height` di OSM,
      // tanpa fallback ini gedungnya rata alias gak keliatan 3D sama sekali.
      const layers = map.getStyle()?.layers
      const labelLayerId = layers?.find((l) => l.type === 'symbol' && l.layout?.['text-field'])?.id
      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          // Dulu ada filter ['==','extrude','true'] — Mapbox cuma nandain
          // extrude=true buat gedung yang UDAH punya data height, jadi
          // fallback height di bawah gak pernah kena (gedung tanpa data
          // ke-filter keluar duluan). Tanpa filter, SEMUA footprint gedung
          // di-extrude, fallback-nya beneran kepake.
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#d4d4d4',
            'fill-extrusion-height': ['coalesce', ['get', 'height'], 8],
            'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0],
            'fill-extrusion-opacity': 0.75,
          },
        },
        labelLayerId,
      )

      // Terrain (elevasi tanah beneran, bukan cuma gedung) — data global,
      // kepake di lokasi manapun, gak tergantung kelengkapan data gedung.
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.4 })

      // Sky layer — atmosphere di horizon, biar kerasa scene 3D beneran
      // pas pitched, bukan cuma foto miring.
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun-intensity': 15,
        },
      })

      map.addSource('zones', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addSource('reports-heatmap', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'zones-fill',
        type: 'circle',
        source: 'zones',
        // Opacity & stroke dinaikin — latar satelit warna-warni bikin fill
        // tipis lama (0.18/0.5) nyaris ilang, ketutup ributnya citra.
        paint: {
          'circle-radius': ['get', 'radiusPx'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.32,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.9,
          'circle-stroke-width': 2.5,
        },
      })
      map.addLayer({
        id: 'reports-heatmap-layer',
        type: 'heatmap',
        source: 'reports-heatmap',
        layout: { visibility: heatmap ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0, 0.2, 100, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 4, 0.7, 10, 1.8],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(255, 255, 255, 0)',
            0.2,
            '#fef08a',
            0.45,
            '#fb923c',
            0.7,
            '#ef4444',
            1,
            '#7f1d1d',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 4, 18, 10, 44],
          'heatmap-opacity': 0.82,
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
      logoObserver?.disconnect()
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

  //<---------- autoRotate ------------>
  useEffect(() => {
    const map = mapRef.current
    if (!map || !autoRotate) return

    let rafId: number
    const spin = () => {
      map.setBearing((map.getBearing() + 0.06) % 360)
      rafId = requestAnimationFrame(spin)
    }
    const start = () => {
      rafId = requestAnimationFrame(spin)
    }

    if (map.loaded()) start()
    else map.once('load', start)
    return () => cancelAnimationFrame(rafId)
  }, [autoRotate])

  // Zone circles — radiusPx sekarang pixel murni (lihat zoneRadiusPx), gak
  // perlu lagi re-set data tiap zoom tick buat kompensasi re-proyeksi.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const setZoneData = () => {
      const source = map.getSource('zones') as mapboxgl.GeoJSONSource | undefined
      if (!source) return
      source.setData({
        type: 'FeatureCollection',
        features: zones.map((zone) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [zone.lng, zone.lat] },
          properties: {
            kawasan: zone.kawasan,
            color: zoneColor(zone.count),
            radiusPx: zoneRadiusPx(zone.count),
          },
        })),
      })
    }

    if (map.loaded()) setZoneData()
    else map.once('load', setZoneData)
  }, [zones])

  //<---------- updateHeatmap ------------>
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const update = () => {
      const source = map.getSource('reports-heatmap') as mapboxgl.GeoJSONSource | undefined
      if (!source) return
      source.setData({
        type: 'FeatureCollection',
        features: markers.map((marker) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [marker.lng, marker.lat] },
          properties: { weight: marker.weight ?? 1 },
        })),
      })
      map.setLayoutProperty('reports-heatmap-layer', 'visibility', heatmap ? 'visible' : 'none')
    }

    if (map.loaded()) update()
    else map.once('load', update)
  }, [heatmap, markers])

  // Markers — plain DOM mapboxgl.Marker (no React reconciliation needed,
  // list is short and swaps wholesale on expand/collapse).
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const attach = () => {
      markerObjectsRef.current.forEach((m) => m.remove())
      markerObjectsRef.current = (heatmap ? [] : visibleMarkers).map((marker) => {
        const mbMarker = pulseMarkers
          ? new mapboxgl.Marker({ element: pulseMarkerElement() }).setLngLat([marker.lng, marker.lat]).addTo(map)
          : new mapboxgl.Marker({ color: '#2563eb' }).setLngLat([marker.lng, marker.lat]).addTo(map)
        if (marker.label) mbMarker.setPopup(new mapboxgl.Popup({ offset: 24 }).setText(marker.label))
        mbMarker.getElement().addEventListener('click', () => onMarkerClickRef.current?.(marker))
        return mbMarker
      })
    }

    if (map.loaded()) attach()
    else map.once('load', attach)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatmap, visibleMarkers, pulseMarkers])

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
