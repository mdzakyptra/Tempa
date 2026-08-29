import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
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
}

interface CityMapProps {
  /** Many markers (Beranda queue) or a single marker (Detail Laporan). */
  markers: CityMapMarker[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: CityMapMarker) => void
  className?: string
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

//<---------- CityMap -------------->
export default function CityMap({ markers, center, zoom = 15, onMarkerClick, className = 'h-full w-full' }: CityMapProps) {
  const resolvedCenter: [number, number] = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : [-2.5, 118])
  const resolvedZoom = center || markers.length > 0 ? zoom : 4

  return (
    <MapContainer center={resolvedCenter} zoom={resolvedZoom} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo center={resolvedCenter} zoom={resolvedZoom} />
      {markers.map((marker) => (
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
