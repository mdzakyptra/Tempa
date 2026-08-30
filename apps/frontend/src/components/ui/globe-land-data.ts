import * as d3 from 'd3'
import { generateDotsInFeature, type DotDatum } from './globe-dots'

export interface LandData {
  features: d3.ExtendedFeature[]
  dots: DotDatum[]
}

const LAND_DATA_URL =
  'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'

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
