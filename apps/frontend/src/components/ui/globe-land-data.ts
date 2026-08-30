import * as d3 from 'd3'
import { generateDotsInFeature, type DotDatum } from './globe-dots'
import { INDONESIA_BOUNDS } from './globe-interactions'

export interface LandData {
  features: d3.ExtendedFeature[]
  dots: DotDatum[]
}

const LAND_DATA_URL =
  'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'

// Fetched once per page load and reused across mounts — the geojson never changes mid-session.
let cachedLandData: LandData | null = null

//<---------- getCachedLandData -------------->
export function getCachedLandData(): LandData | null {
  return cachedLandData
}

//<---------- loadLandData -------------->
export async function loadLandData(): Promise<LandData> {
  if (cachedLandData) return cachedLandData

  const response = await fetch(LAND_DATA_URL)
  if (!response.ok) throw new Error('Failed to load land data')

  const collection = (await response.json()) as d3.ExtendedFeatureCollection
  const nearbyFeatures = collection.features.filter((feature) => {
    const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
    return (
      minLng <= INDONESIA_BOUNDS.maxLng &&
      maxLng >= INDONESIA_BOUNDS.minLng &&
      minLat <= INDONESIA_BOUNDS.maxLat &&
      maxLat >= INDONESIA_BOUNDS.minLat
    )
  })

  cachedLandData = {
    features: nearbyFeatures,
    dots: nearbyFeatures.flatMap((feature) => generateDotsInFeature(feature, 16)),
  }
  return cachedLandData
}

let cachedWorldLandData: LandData | null = null

//<---------- getCachedWorldLandData -------------->
export function getCachedWorldLandData(): LandData | null {
  return cachedWorldLandData
}

//<---------- loadWorldLandData -------------->
export async function loadWorldLandData(): Promise<LandData> {
  if (cachedWorldLandData) return cachedWorldLandData

  const response = await fetch(LAND_DATA_URL)
  if (!response.ok) throw new Error('Failed to load land data')

  const collection = (await response.json()) as d3.ExtendedFeatureCollection
  cachedWorldLandData = {
    features: collection.features,
    dots: collection.features.flatMap((feature) => generateDotsInFeature(feature, 24)),
  }
  return cachedWorldLandData
}
