import * as d3 from 'd3'


export interface DotDatum {
  lng: number
  lat: number
}

//<---------- pointInPolygon -------------->
function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

//<---------- pointInFeature -------------->
function pointInFeature(point: [number, number], feature: d3.ExtendedFeature): boolean {
  const geometry = feature.geometry
  if (!geometry) return false

  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates
    if (!pointInPolygon(point, coordinates[0])) return false
    for (let i = 1; i < coordinates.length; i++) {
      if (pointInPolygon(point, coordinates[i])) return false
    }
    return true
  }

  if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      if (pointInPolygon(point, polygon[0])) {
        let inHole = false
        for (let i = 1; i < polygon.length; i++) {
          if (pointInPolygon(point, polygon[i])) {
            inHole = true
            break
          }
        }
        if (!inHole) return true
      }
    }
    return false
  }

  return false
}

//<---------- generateDotsInFeature -------------->
export function generateDotsInFeature(feature: d3.ExtendedFeature, dotSpacing = 16): DotDatum[] {
  const dots: DotDatum[] = []
  const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
  const stepSize = dotSpacing * 0.08

  for (let lng = minLng; lng <= maxLng; lng += stepSize) {
    for (let lat = minLat; lat <= maxLat; lat += stepSize) {
      if (pointInFeature([lng, lat], feature)) dots.push({ lng, lat })
    }
  }

  return dots
}
