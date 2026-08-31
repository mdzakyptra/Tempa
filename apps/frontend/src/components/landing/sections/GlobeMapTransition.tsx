import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import WireframeDottedGlobe, {
  type WireframeDottedGlobeHandle,
  type GlobeZone,
  type GlobeZoneCluster,
} from '@/components/ui/wireframe-dotted-globe'
import { CityMap, type CityMapMarker, type CityMapZone } from '@/components/city-map'
import { searchLocationID, type GeocodeResult } from '@/lib/geocode'
import { ALL_REPORTS_PATH, apiFetch } from '@/lib/api'
import type { ReportListItem } from '@/components/report-card'

type Phase = 'globe' | 'diving' | 'map'
interface MapTarget {
  center: [number, number]
  zoom: number
  markers: CityMapMarker[]
  /** Set only for a zone dive — per-kawasan hotzone circles, clicked to reveal real markers. */
  zones?: CityMapZone[]
  /** Set only when a zone dive lands on a single kawasan — shows a "lihat semua di Antrean" link. */
  kawasan?: string
}

const TRANSITION_MS = 1200
const ZOOM_DIVE_MULTIPLIER = 14
const ZONE_ZOOM_MULTIPLIER = 6

//<---------- GlobeMapTransition -------------->
export default function GlobeMapTransition() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('globe')
  const [mapTarget, setMapTarget] = useState<MapTarget | null>(null)
  // Kawasan opened by clicking a hotzone circle *inside* the already-zoomed
  // map — separate from mapTarget.kawasan (only set for a single-member
  // cluster at dive time). Lets "back" collapse just that zone instead of
  // re-diving from the globe.
  const [openedKawasan, setOpenedKawasan] = useState<string | null>(null)
  const [collapseCounter, setCollapseCounter] = useState(0)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [searching, setSearching] = useState(false)

  const globeRef = useRef<WireframeDottedGlobeHandle>(null)

  const { data: reports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>(ALL_REPORTS_PATH),
    staleTime: Infinity,
  })

  // Semua laporan berkoordinat — dipakai apa adanya waktu klik bebas/search
  // (biar warga lihat titik mana yang UDAH ada laporannya di sekitar situ,
  // bukan bikin pin baru), lalu difilter per-kawasan lagi khusus zone click.
  const allMarkers = useMemo<CityMapMarker[]>(() => {
    return (reports ?? [])
      .filter((r): r is ReportListItem & { lat: number; lng: number } => r.lat !== null && r.lng !== null)
      .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.judul }))
  }, [reports])

  // Satu zona per kawasan (titik tengahnya dirata-rata dari laporan asli di
  // situ). Kawasan yang berdekatan otomatis MERGE secara visual di globe
  // (lihat clusterZones) waktu zoom masih kecil, lalu misah lagi begitu
  // di-zoom — jadi tetap presisi per kawasan tanpa numpuk di tampilan luas.
  const zones = useMemo<GlobeZone[]>(() => {
    const byKawasan = new Map<string, { latSum: number; lngSum: number; count: number }>()
    for (const report of reports ?? []) {
      if (report.lat === null || report.lng === null) continue
      const entry = byKawasan.get(report.kawasan) ?? { latSum: 0, lngSum: 0, count: 0 }
      entry.latSum += report.lat
      entry.lngSum += report.lng
      entry.count += 1
      byKawasan.set(report.kawasan, entry)
    }
    return [...byKawasan.entries()].map(([kawasan, { latSum, lngSum, count }]) => ({
      kawasan,
      count,
      lat: latSum / count,
      lng: lngSum / count,
    }))
  }, [reports])

  useEffect(() => {
    if (query.trim().length < 3) return

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      searchLocationID(query, controller.signal)
        .then(setResults)
        .catch(() => {})
        .finally(() => setSearching(false))
    }, 400)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  //<---------- diveTo -------------->
  // Shared by manual pick/search and zone clicks: zoom the globe in on
  // [lng, lat] first, then crossfade into the SAME embedded Leaflet view —
  // one continuous zoom instead of a hard cut to a different page/component.
  function diveTo(lng: number, lat: number, scaleMultiplier: number, target: MapTarget) {
    setMapTarget(target)
    setOpenedKawasan(null)
    setPhase('diving')

    // A backgrounded/throttled tab can suspend the rAF-driven d3 transition
    // indefinitely, so its 'end' event may never fire — a timer fallback
    // guarantees the map still shows up instead of hanging on the globe.
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      setPhase('map')
    }

    globeRef.current?.zoomIn([lng, lat], { scaleMultiplier, duration: TRANSITION_MS, onComplete: settle })
    window.setTimeout(settle, TRANSITION_MS + 400)
  }

  //<---------- handleGlobeClick -------------->
  function handleGlobeClick([lng, lat]: [number, number]) {
    diveTo(lng, lat, ZOOM_DIVE_MULTIPLIER, { center: [lat, lng], zoom: 13, markers: allMarkers })
  }

  //<---------- handleSelectResult -------------->
  function handleSelectResult(result: GeocodeResult) {
    setResults([])
    setQuery(result.label)
    diveTo(result.lng, result.lat, ZOOM_DIVE_MULTIPLIER, {
      center: [result.lat, result.lng],
      zoom: 13,
      markers: allMarkers,
    })
  }

  //<---------- handleZoneClick -------------->
  // One zoom, straight into the embedded map — the hotzone's member kawasan
  // (still merged at globe scale, or just one) become transparent circles
  // sized by report count over the real streets, not individual pins. Only
  // clicking a circle reveals its actual coordinates (see CityMap).
  function handleZoneClick(cluster: GlobeZoneCluster) {
    const kawasanInCluster = new Set(cluster.members.map((member) => member.kawasan))
    const markers: CityMapMarker[] = (reports ?? [])
      .filter((r): r is ReportListItem & { lat: number; lng: number } => r.lat !== null && r.lng !== null)
      .filter((r) => kawasanInCluster.has(r.kawasan))
      .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.judul, kawasan: r.kawasan }))

    // Cluster 1 kawasan doang = gak ada yang perlu di-disambiguasi — skip
    // lingkaran zone (yang nyembunyiin marker sampe di-klik), langsung
    // tunjukin marker aslinya kayak dive biasa.
    const isSingleKawasan = cluster.members.length === 1
    const zones: CityMapZone[] = cluster.members.map((member) => ({
      kawasan: member.kawasan,
      lat: member.lat,
      lng: member.lng,
      count: member.count,
    }))

    diveTo(cluster.lng, cluster.lat, ZONE_ZOOM_MULTIPLIER, {
      center: [cluster.lat, cluster.lng],
      zoom: 13,
      markers,
      zones: isSingleKawasan ? undefined : zones,
      kawasan: isSingleKawasan ? cluster.members[0].kawasan : undefined,
    })
  }

  //<---------- handleReset -------------->
  // Mirrors diveTo in reverse: flip to 'globe' first so the crossfade
  // reveals the globe still zoomed in on the dive target, THEN animate its
  // zoom-out — same settle/timeout-fallback pattern as the dive-in.
  function handleReset() {
    setPhase('globe')
    setOpenedKawasan(null)
    setQuery('')

    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      setMapTarget(null)
    }

    globeRef.current?.reset({ duration: TRANSITION_MS, onComplete: settle })
    window.setTimeout(settle, TRANSITION_MS + 400)
  }

  //<---------- handleCollapseKawasan -------------->
  // "Back" from a single opened zone circle — stays zoomed into the same
  // map area, just hides that kawasan's revealed markers again.
  function handleCollapseKawasan() {
    setOpenedKawasan(null)
    setCollapseCounter((count) => count + 1)
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      {phase !== 'map' && (
        <div className="relative z-10 mb-4">
          <input
            value={query}
            onChange={(event) => {
              const value = event.target.value
              setQuery(value)
              if (value.trim().length < 3) setResults([])
              else setSearching(true)
            }}
            placeholder="Cari kawasan, mis. Menteng, Jakarta Pusat"
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          {searching && <p className="mt-2 text-xs text-neutral-500">Mencari…</p>}
          {results.length > 0 && (
            <ul className="mt-2 divide-y divide-black/10 overflow-hidden rounded-lg border border-black/15 bg-white">
              {results.map((result) => (
                <li key={`${result.lat}-${result.lng}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            phase === 'map' ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <WireframeDottedGlobe
            ref={globeRef}
            onLocationPick={handleGlobeClick}
            zones={zones}
            onZoneClick={handleZoneClick}
          />
        </div>

        {mapTarget && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              phase === 'map' ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <CityMap
              markers={mapTarget.markers}
              zones={mapTarget.zones}
              center={mapTarget.center}
              zoom={mapTarget.zoom}
              onMarkerClick={(marker) => navigate(`/laporan/${marker.id}`)}
              onZoneClick={(kawasan, expanded) => setOpenedKawasan(expanded ? kawasan : null)}
              resetExpandTrigger={collapseCounter}
            />
          </div>
        )}
      </div>

      {phase === 'map' && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-black/10 bg-neutral-50 px-3 py-2">
            <span className="flex items-center gap-2 font-medium">
              {openedKawasan && (
                <button
                  type="button"
                  onClick={handleCollapseKawasan}
                  aria-label="Kembali ke semua kawasan"
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  ←
                </button>
              )}
              {openedKawasan ?? mapTarget?.kawasan ?? 'Semua kawasan'}
            </span>
            <Link
              to={
                openedKawasan ?? mapTarget?.kawasan
                  ? `/antrean?kawasan=${encodeURIComponent(openedKawasan ?? mapTarget?.kawasan ?? '')}`
                  : '/antrean'
              }
              className="font-medium text-blue-600 hover:underline"
            >
              Lihat semua di Antrean →
            </Link>
          </div>
          <button type="button" onClick={handleReset} className="text-neutral-500 hover:text-neutral-900">
            ← Lihat globe lagi
          </button>
        </div>
      )}
    </div>
  )
}
