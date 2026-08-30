import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { searchLocationID } from '../../lib/geocode'
import type { GeocodeResult } from '../../lib/geocode'


const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN

export interface LocationValue {
  lat: number
  lng: number
}

interface LocationPickerProps {
  value: LocationValue | null
  onChange: (value: LocationValue) => void
}

const DEFAULT_CENTER: [number, number] = [118, -2.5]

//<---------- locationErrorMessage ------------>
function locationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) return 'Izin lokasi ditolak. Pilih titik secara manual di peta.'
  if (error.code === error.POSITION_UNAVAILABLE) return 'Lokasi perangkat belum tersedia. Pilih titik secara manual di peta.'
  return 'Pengambilan lokasi terlalu lama. Coba lagi atau pilih titik di peta.'
}

//<---------- LocationPicker ------------>
export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 3) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        setSearchResults(await searchLocationID(query, controller.signal))
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setSearchResults([])
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [searchQuery])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !MAPBOX_TOKEN) return

    const map = new mapboxgl.Map({
      container,
      // Samakan dengan CityMap di /antrean: basemap terang, kamera miring,
      // dan ekstrusi gedung 3D agar konteks titik lebih mudah dikenali.
      style: 'mapbox://styles/mapbox/light-v11',
      center: value ? [value.lng, value.lat] : DEFAULT_CENTER,
      zoom: value ? 15 : 4,
      pitch: 55,
      bearing: -12,
      antialias: true,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')
    map.on('load', () => {
      const layers = map.getStyle()?.layers
      const labelLayerId = layers?.find((layer) => layer.type === 'symbol' && layer.layout?.['text-field'])?.id
      map.addLayer(
        {
          id: 'location-picker-3d-buildings',
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
    })
    map.on('click', (event) => onChangeRef.current({ lat: event.lngLat.lat, lng: event.lngLat.lng }))

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // Peta dibuat sekali; pembaruan titik ditangani effect berikutnya.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !value) return

    const placeMarker = () => {
      markerRef.current?.remove()
      markerRef.current = new mapboxgl.Marker({ color: '#dc2626' }).setLngLat([value.lng, value.lat]).addTo(map)
      map.flyTo({ center: [value.lng, value.lat], zoom: Math.max(map.getZoom(), 15), duration: 650 })
    }

    if (map.loaded()) placeMarker()
    else map.once('load', placeMarker)
  }, [value])

  //<---------- handleUseCurrentLocation ------------>
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Browser ini tidak mendukung lokasi perangkat. Pilih titik secara manual di peta.')
      return
    }

    setIsLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({ lat: position.coords.latitude, lng: position.coords.longitude })
        setIsLocating(false)
      },
      (error) => {
        setLocationError(locationErrorMessage(error))
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    )
  }

  //<---------- handleSelectSearchResult ------------>
  function handleSelectSearchResult(result: GeocodeResult) {
    onChange({ lat: result.lat, lng: result.lng })
    setSearchQuery(result.label)
    setSearchResults([])
  }

  return (
    <section aria-labelledby="location-heading" className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="location-heading" className="text-sm font-medium text-gray-800">Titik lokasi kerusakan</h2>
          <p className="text-xs text-gray-500">Gunakan GPS atau klik titik di peta 3D.</p>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
        >
          {isLocating ? 'Mencari lokasi…' : 'Gunakan lokasi saya'}
        </button>
      </div>

      <div className="relative mb-3">
        <label htmlFor="location-search" className="sr-only">Cari lokasi di Indonesia</label>
        <input
          id="location-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari jalan, kelurahan, atau tempat…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
          autoComplete="off"
        />
        {isSearching && <p className="mt-1 text-xs text-gray-500">Mencari lokasi…</p>}
        {searchResults.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {searchResults.map((result) => (
              <li key={`${result.lat}-${result.lng}`}>
                <button
                  type="button"
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {MAPBOX_TOKEN ? (
        <div ref={containerRef} className="h-72 overflow-hidden rounded-md border border-gray-200 sm:h-96" />
      ) : (
        <p className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          Peta belum aktif. Tetap bisa memakai lokasi perangkat; setel VITE_MAPBOX_TOKEN untuk memilih titik manual.
        </p>
      )}

      {locationError && <p role="alert" className="mt-2 text-xs text-red-600">{locationError}</p>}
      {value && (
        <p className="mt-2 text-xs text-emerald-700">
          Titik dipilih: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </section>
  )
}
