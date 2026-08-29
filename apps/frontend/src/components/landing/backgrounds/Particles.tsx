import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

/**
 * Particles — WebGL floating particle field (grayscale).
 * A GPU point cloud that drifts slowly and reacts to the pointer.
 */

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;

  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform vec2 uMouse;

  varying vec4 vRandom;

  void main() {
    vRandom = random;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    // gentle push away from the pointer
    mPos.xy += uMouse * 0.6 * (random.x - 0.5);

    vec4 mvPos = mPos;
    gl_PointSize = (uBaseSize * (1.0 + random.y)) / (1.0 + length(mvPos.xyz) * 0.15);
    gl_Position = mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec4 vRandom;

  void main() {
    vec2 uv = gl_PointCoord.xy - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    float shade = mix(0.5, 1.0, vRandom.y);
    gl_FragColor = vec4(vec3(shade), alpha * 0.85);
  }
`;

interface ParticlesProps {
  count?: number;
  spread?: number;
  baseSize?: number;
  className?: string;
}

//<---------- Particles -------------->
export default function Particles({
  count = 600,
  spread = 6,
  baseSize = 90,
  className = "",
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, depth: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 20 });
    camera.position.set(0, 0, 12);

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      // uniform-ish distribution inside a sphere
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      positions.set([x, y, z], i * 3);
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4
      );
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: spread },
        uBaseSize: { value: baseSize },
        uMouse: { value: [0, 0] },
      },
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    function resize() {
      if (!container) return;
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    function onMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    // pause when off-screen
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(update);
      },
      { threshold: 0 }
    );
    io.observe(container);

    let raf = 0;
    function update(t: number) {
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.0004;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      renderer.render({ scene: mesh, camera });
    }
    raf = requestAnimationFrame(update);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [count, spread, baseSize]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
