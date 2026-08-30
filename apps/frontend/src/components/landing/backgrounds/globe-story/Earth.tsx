import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { getCachedWorldLandData, loadWorldLandData } from "@/components/ui/globe-land-data";
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

//<---------- useDotPositions -------------->
function useDotPositions() {
  const [dots, setDots] = useState<[number, number][]>(
    () => getCachedWorldLandData()?.dots.map((d) => [d.lng, d.lat] as [number, number]) ?? [],
  );

  useEffect(() => {
    if (dots.length > 0) return;
    let cancelled = false;
    loadWorldLandData().then((data) => {
      if (!cancelled) setDots(data.dots.map((d) => [d.lng, d.lat]));
    });
    return () => {
      cancelled = true;
    };
  }, [dots.length]);

  return useMemo(() => {
    const arr = new Float32Array(dots.length * 3);
    dots.forEach(([lng, lat], i) => {
      const v = latLngToVector3(lat, lng, RADIUS * 1.004);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [dots]);
}

//<---------- dotSpriteTexture -------------->
function dotSpriteTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.8)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

//<---------- Earth -------------->
export function Earth() {
  const positions = useDotPositions();
  const dotTexture = useMemo(() => dotSpriteTexture(), []);

  if (positions.length === 0) return null;

  return (
    <>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 48]} />
        <meshStandardMaterial color="#0b3d68" roughness={0.55} metalness={0.2} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dotTexture}
          color="#6fd66f"
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
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
