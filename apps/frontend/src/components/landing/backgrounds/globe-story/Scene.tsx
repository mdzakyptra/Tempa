import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Markers, type ScreenAnchor } from "./Markers";
import { LOCK_ROTATION_Y } from "./constants";
import { beatRange } from "./beats";


const [, ZOOM_START] = beatRange(0);


//<---------- RotatingRig -------------->
function RotatingRig({
  progressRef,
  compact = false,
  children,
}: {
  progressRef: React.RefObject<number>;
  compact?: boolean;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);
  // zoomed further out on mobile so the globe reads smaller within the
  // narrower viewport — camera always looks at the origin, so it stays
  // centered regardless of distance.
  const zStart = compact ? 11 : 8;
  const zEnd = compact ? 5 : 3.5;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current ?? 0;
    const lockAmount = THREE.MathUtils.smoothstep(progress, 0.05, 0.16);
    spinRef.current += delta * 0.16 * (1 - lockAmount);
    const wobble = Math.sin(state.clock.elapsedTime / 6) * 0.015;
    group.rotation.y = THREE.MathUtils.lerp(spinRef.current, LOCK_ROTATION_Y + wobble, lockAmount);

    const zoomAmount = THREE.MathUtils.smoothstep(progress, ZOOM_START, 1);
    state.camera.position.z = THREE.MathUtils.lerp(zStart, zEnd, zoomAmount);
    state.camera.position.y = THREE.MathUtils.lerp(0.2, -0.35, zoomAmount);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={groupRef}>{children}</group>;
}

//<---------- GlobeCastShadow ------------>
function GlobeCastShadow() {
  return (
    <mesh position={[1.65, -2.8, -2.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.15, 0.72, 1]}>
      <circleGeometry args={[2.02, 64]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
    </mesh>
  );
}

//<---------- GlobeStoryScene -------------->
export default function GlobeStoryScene({
  progressRef,
  className,
  screenAnchor,
  compact = false,
}: {
  progressRef: React.RefObject<number>;
  className?: string;
  screenAnchor?: ScreenAnchor;
  /** zoom the camera further out, e.g. for narrow mobile viewports */
  compact?: boolean;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 45, position: [0, 0.2, compact ? 11 : 8] }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 3, 5]} intensity={1.2} />
        <hemisphereLight args={["#bfe3ff", "#08182a", 0.4]} />
        <GlobeCastShadow />
        <RotatingRig progressRef={progressRef} compact={compact}>
          <Earth />
          <Markers progressRef={progressRef} screenAnchor={screenAnchor} />
        </RotatingRig>
      </Canvas>
    </div>
  );
}
