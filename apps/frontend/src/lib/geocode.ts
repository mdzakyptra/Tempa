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
export async function reverseGeocodeID(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lng), format: 'jsonv2' })

  const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`)
  if (!response.ok) throw new Error('Reverse geocode failed')

  const data = (await response.json()) as { display_name?: string }
  return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}
