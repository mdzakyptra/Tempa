import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Markers, type ScreenAnchor } from "./Markers";
import { LOCK_ROTATION_Y } from "./constants";
import { beatRange } from "./beats";


const [, ZOOM_START] = beatRange(0);


//<---------- RotatingRig -------------->
function RotatingRig({ progressRef, children }: { progressRef: React.RefObject<number>; children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current ?? 0;
    const lockAmount = THREE.MathUtils.smoothstep(progress, 0.05, 0.16);
    spinRef.current += delta * 0.16 * (1 - lockAmount);
    const wobble = Math.sin(state.clock.elapsedTime / 6) * 0.015;
    group.rotation.y = THREE.MathUtils.lerp(spinRef.current, LOCK_ROTATION_Y + wobble, lockAmount);

    const zoomAmount = THREE.MathUtils.smoothstep(progress, ZOOM_START, 1);
    state.camera.position.z = THREE.MathUtils.lerp(8, 3.5, zoomAmount);
    state.camera.position.y = THREE.MathUtils.lerp(0.2, -0.35, zoomAmount);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={groupRef}>{children}</group>;
}

//<---------- GlobeStoryScene -------------->
export default function GlobeStoryScene({
  progressRef,
  className,
  screenAnchor,
}: {
  progressRef: React.RefObject<number>;
  className?: string;
  screenAnchor?: ScreenAnchor;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden>
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} camera={{ fov: 45, position: [0, 0.2, 8] }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 3, 5]} intensity={1.2} />
        <hemisphereLight args={["#bfe3ff", "#08182a", 0.4]} />
        <RotatingRig progressRef={progressRef}>
          <Earth />
          <Markers progressRef={progressRef} screenAnchor={screenAnchor} />
        </RotatingRig>
      </Canvas>
    </div>
  );
}
