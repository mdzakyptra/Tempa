import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3, RADIUS } from "./constants";
import { MARKER, VOTE_OFFSETS, beatRange, beatLocalProgress } from "./beats";


//<---------- useDotTexture -------------->
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

//<---------- useRingTexture -------------->
function useRingTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const center = size / 2;
    const outerRadius = center - 4;
    const innerRadius = outerRadius * 0.7;
    const gradient = ctx.createRadialGradient(center, center, innerRadius, center, center, outerRadius);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.55, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);
}

const RADAR_RING_COUNT = 3;
const RADAR_PERIOD = 1.8;

//<---------- MainMarker -------------->
function MainMarker({ progressRef, texture, ringTexture }: { progressRef: React.RefObject<number>; texture: THREE.Texture; ringTexture: THREE.Texture }) {
  const position = useMemo(() => latLngToVector3(MARKER.lat, MARKER.lng, RADIUS * 1.012), []);
  const dotRef = useRef<THREE.Sprite>(null);
  const ringRefs = useRef<(THREE.Sprite | null)[]>([]);
  const [beat1Start] = beatRange(0);

  useFrame((state) => {
    const progress = progressRef.current ?? 0;
    const reveal = THREE.MathUtils.smoothstep(progress, beat1Start, beat1Start + 0.03);
    const beat2 = beatLocalProgress(progress, 1);
    const intensity = 0.5 + beat2 * 0.5;
    if (dotRef.current) {
      const dotPulse = (Math.sin(state.clock.elapsedTime * 3) + 1) / 2;
      dotRef.current.scale.setScalar((0.2 + dotPulse * 0.04) * reveal);
    }
    ringRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const phase = ((state.clock.elapsedTime / RADAR_PERIOD + i / RADAR_RING_COUNT) % 1 + 1) % 1;
      const scale = THREE.MathUtils.lerp(0.28, 1.3, phase) * reveal * (0.6 + intensity * 0.4);
      sprite.scale.setScalar(scale);
      (sprite.material as THREE.SpriteMaterial).opacity = (1 - phase) * 0.6 * intensity * reveal;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: RADAR_RING_COUNT }).map((_, i) => (
        <sprite key={i} ref={(el) => { ringRefs.current[i] = el; }}>
          <spriteMaterial map={ringTexture} color="#ff5a3c" transparent depthWrite={false} opacity={0} />
        </sprite>
      ))}
      <sprite ref={dotRef}>
        <spriteMaterial map={texture} color="#ff5a3c" transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

//<---------- VoteDots -------------->
function VoteDots({ progressRef, texture }: { progressRef: React.RefObject<number>; texture: THREE.Texture }) {
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const positions = useMemo(
    () => VOTE_OFFSETS.map(([dLat, dLng]) => latLngToVector3(MARKER.lat + dLat, MARKER.lng + dLng, RADIUS * 1.012)),
    [],
  );

  useFrame(() => {
    const progress = progressRef.current ?? 0;
    const local = beatLocalProgress(progress, 2);
    refs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const threshold = i / VOTE_OFFSETS.length;
      const reveal = THREE.MathUtils.smoothstep(local, threshold, threshold + 0.12);
      sprite.scale.setScalar(0.14 * reveal);
      (sprite.material as THREE.SpriteMaterial).opacity = 0.8 * reveal;
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <sprite key={i} ref={(el) => { refs.current[i] = el; }} position={pos}>
          <spriteMaterial map={texture} color="#ffd166" transparent depthWrite={false} opacity={0} />
        </sprite>
      ))}
    </>
  );
}

//<---------- AiLink -------------->
function AiLink({ progressRef, texture }: { progressRef: React.RefObject<number>; texture: THREE.Texture }) {
  const markerPos = useMemo(() => latLngToVector3(MARKER.lat, MARKER.lng, RADIUS * 1.012), []);
  const nodePos = useMemo(() => latLngToVector3(MARKER.lat, MARKER.lng, RADIUS * 1.55), []);
  const nodeRef = useRef<THREE.Sprite>(null);

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([markerPos, nodePos]);
    const material = new THREE.LineDashedMaterial({
      color: "#5ee7ff",
      transparent: true,
      opacity: 0,
      dashSize: 0.06,
      gapSize: 0.04,
    });
    const object = new THREE.Line(geometry, material);
    object.computeLineDistances();
    return object;
  }, [markerPos, nodePos]);

  useFrame(() => {
    const progress = progressRef.current ?? 0;
    const local = beatLocalProgress(progress, 3);
    const reveal = THREE.MathUtils.smoothstep(local, 0.05, 0.4);
    if (nodeRef.current) {
      nodeRef.current.scale.setScalar(0.26 * reveal);
      (nodeRef.current.material as THREE.SpriteMaterial).opacity = reveal;
    }
    const material = line.material as THREE.LineDashedMaterial;
    material.opacity = reveal * 0.7;
  });

  return (
    <>
      <primitive object={line} />
      <sprite ref={nodeRef} position={nodePos}>
        <spriteMaterial map={texture} color="#5ee7ff" transparent depthWrite={false} opacity={0} />
      </sprite>
    </>
  );
}

//<---------- Markers -------------->
export function Markers({ progressRef }: { progressRef: React.RefObject<number> }) {
  const texture = useDotTexture();
  const ringTexture = useRingTexture();
  return (
    <>
      <MainMarker progressRef={progressRef} texture={texture} ringTexture={ringTexture} />
      <VoteDots progressRef={progressRef} texture={texture} />
      <AiLink progressRef={progressRef} texture={texture} />
    </>
  );
}
