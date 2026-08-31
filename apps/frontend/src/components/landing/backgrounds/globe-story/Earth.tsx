import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { getCachedWorldLandData, loadWorldLandData, type LandData } from "@/components/ui/globe-land-data";
import { latLngToVector3, RADIUS } from "./constants";


const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(0.4, 0.7, 1.0, clamp(intensity, 0.0, 1.0) * 0.6);
  }
`;

//<---------- useLandData ------------>
function useLandData() {
  const [landData, setLandData] = useState<LandData | null>(() => getCachedWorldLandData());

  useEffect(() => {
    if (landData) return;
    let cancelled = false;
    loadWorldLandData().then((data) => {
      if (!cancelled) setLandData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [landData]);

  return landData;
}

//<---------- projectCoordinate ------------>
function projectCoordinate([lng, lat]: number[], radius = RADIUS * 1.008) {
  return latLngToVector3(lat, lng, radius);
}

//<---------- appendCurvedTriangle ------------>
function appendCurvedTriangle(
  vertices: number[],
  first: THREE.Vector3,
  second: THREE.Vector3,
  third: THREE.Vector3,
  depth: number,
) {
  if (depth === 0) {
    vertices.push(
      first.x, first.y, first.z,
      second.x, second.y, second.z,
      third.x, third.y, third.z,
    );
    return;
  }

  const radius = first.length();
  const midpoint = (start: THREE.Vector3, end: THREE.Vector3) => (
    start.clone().add(end).normalize().multiplyScalar(radius)
  );
  const firstSecond = midpoint(first, second);
  const secondThird = midpoint(second, third);
  const thirdFirst = midpoint(third, first);
  const nextDepth = depth - 1;

  appendCurvedTriangle(vertices, first, firstSecond, thirdFirst, nextDepth);
  appendCurvedTriangle(vertices, firstSecond, second, secondThird, nextDepth);
  appendCurvedTriangle(vertices, thirdFirst, secondThird, third, nextDepth);
  appendCurvedTriangle(vertices, firstSecond, secondThird, thirdFirst, nextDepth);
}

//<---------- createLandGeometries ------------>
function createLandGeometries(features: LandData["features"]) {
  const landVertices: number[] = [];
  const outlineVertices: number[] = [];

  features.forEach((feature) => {
    const geometry = feature.geometry;
    if (!geometry || (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")) return;

    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    polygons.forEach((polygon) => {
      const [outerRing, ...holes] = polygon;
      if (!outerRing || outerRing.length < 4) return;

      const contour = outerRing.slice(0, -1).map(([lng, lat]) => new THREE.Vector2(lng, lat));
      const holeShapes = holes.map((ring) => ring.slice(0, -1).map(([lng, lat]) => new THREE.Vector2(lng, lat)));
      const points = [contour, ...holeShapes].flat();
      const triangles = THREE.ShapeUtils.triangulateShape(contour, holeShapes);

      triangles.forEach(([a, b, c]) => {
        const first = projectCoordinate([points[a].x, points[a].y]);
        const second = projectCoordinate([points[b].x, points[b].y]);
        const third = projectCoordinate([points[c].x, points[c].y]);
        appendCurvedTriangle(landVertices, first, second, third, 3);
      });

      polygon.forEach((ring) => {
        ring.forEach((coordinate, index) => {
          if (index === ring.length - 1) return;
          const nextCoordinate = ring[index + 1];
          const point = projectCoordinate(coordinate, RADIUS * 1.012);
          const nextPoint = projectCoordinate(nextCoordinate, RADIUS * 1.012);
          outlineVertices.push(point.x, point.y, point.z, nextPoint.x, nextPoint.y, nextPoint.z);
        });
      });
    });
  });

  const land = new THREE.BufferGeometry();
  land.setAttribute("position", new THREE.Float32BufferAttribute(landVertices, 3));
  const outline = new THREE.BufferGeometry();
  outline.setAttribute("position", new THREE.Float32BufferAttribute(outlineVertices, 3));
  return { land, outline };
}

//<---------- Earth ------------>
export function Earth() {
  const landData = useLandData();
  const geometries = useMemo(
    () => (landData ? createLandGeometries(landData.features) : null),
    [landData],
  );

  if (!geometries) return null;

  return (
    <>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 48]} />
        <meshStandardMaterial color="#0b3d68" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh geometry={geometries.land}>
        <meshStandardMaterial
          color="#64c96b"
          roughness={0.72}
          metalness={0.05}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={geometries.outline}>
        <lineBasicMaterial color="#d8ffd2" transparent opacity={0.65} />
      </lineSegments>
      <mesh scale={1.06}>
        <sphereGeometry args={[RADIUS, 48, 32]} />
        <shaderMaterial
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
