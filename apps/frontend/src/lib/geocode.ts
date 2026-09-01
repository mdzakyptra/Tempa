export interface GeocodeResult {
  label: string
  lat: number
  lng: number
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

//<---------- searchLocationID -------------->
export async function searchLocationID(query: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    countrycodes: 'id',
    limit: '5',
  })

  const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, { signal })
  if (!response.ok) return []

  const data = (await response.json()) as Array<{ display_name: string; lat: string; lon: string }>
  return data.map((item) => ({ label: item.display_name, lat: Number(item.lat), lng: Number(item.lon) }))
}

//<---------- reverseGeocodeID -------------->
// Ngembaliin nama kawasan level kelurahan/kecamatan dari titik yang dipilih
// di map — bukan alamat lengkap — biar field Kawasan konsisten antar warga
// (sama titik = sama nama), gak tergantung warga ngetik sendiri.
export async function reverseGeocodeID(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    addressdetails: '1',
  })

  const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`)
  if (!response.ok) throw new Error('Reverse geocode failed')

  const data = (await response.json()) as {
    display_name?: string
    address?: {
      village?: string
      suburb?: string
      city_district?: string
      town?: string
      city?: string
    }
  }

  const address = data.address
  const kawasan = address?.village ?? address?.suburb ?? address?.city_district ?? address?.town ?? address?.city

  return kawasan ?? data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}
