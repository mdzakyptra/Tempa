import { useEffect, useState } from 'react'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite/webpack break Leaflet's default marker icon path resolution — point it
// at the bundled asset URLs instead.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

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

//<---------- FlyTo -------------->
function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  const [lat, lng] = center

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [lat, lng, zoom, map])

  return null
}

// Stable reference for the "no zones" default — a literal `[]` default
// parameter would create a new array every render and defeat the
// `zones !== prevZones` check below, causing an infinite render loop.
const NO_ZONES: CityMapZone[] = []

//<---------- CityMap -------------->
export default function CityMap({ markers, zones = NO_ZONES, center, zoom = 15, onMarkerClick, className = 'h-full w-full' }: CityMapProps) {
  const resolvedCenter: [number, number] = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : [-2.5, 118])
  const resolvedZoom = center || markers.length > 0 ? zoom : 4

  // Which kawasan the viewer has clicked open — reset whenever a fresh set of
  // zones comes in (a new dive), so an old dive's revealed points don't leak
  // in. Adjusted during render (not an effect) so it lands in the same paint.
  const [expandedKawasan, setExpandedKawasan] = useState<Set<string>>(new Set())
  const [prevZones, setPrevZones] = useState(zones)
  if (zones !== prevZones) {
    setPrevZones(zones)
    setExpandedKawasan(new Set())
  }

  const visibleMarkers = zones.length > 0 ? markers.filter((marker) => marker.kawasan && expandedKawasan.has(marker.kawasan)) : markers

  return (
    <MapContainer center={resolvedCenter} zoom={resolvedZoom} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo center={resolvedCenter} zoom={resolvedZoom} />

      {zones.map((zone) => (
        <Circle
          key={zone.kawasan}
          center={[zone.lat, zone.lng]}
          radius={zoneRadiusMeters(zone.count)}
          pathOptions={{ color: zoneColor(zone.count), fillColor: zoneColor(zone.count), fillOpacity: 0.18, opacity: 0.5, weight: 1.5 }}
          eventHandlers={{
            click: () =>
              setExpandedKawasan((prev) => {
                const next = new Set(prev)
                if (next.has(zone.kawasan)) next.delete(zone.kawasan)
                else next.add(zone.kawasan)
                return next
              }),
          }}
        >
          <Popup>
            {zone.kawasan} — {zone.count} laporan
          </Popup>
        </Circle>
      ))}

      {visibleMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          eventHandlers={onMarkerClick ? { click: () => onMarkerClick(marker) } : undefined}
        >
          {marker.label && <Popup>{marker.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  )
}
