import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Threads — WebGL animated flowing lines (grayscale).
 * Inspired by React Bits "Threads". Renders a soft fullscreen shader.
 *
 * Performance: renders at a fraction of the display resolution (the result
 * is a blurry background so nobody notices) and pauses its render loop
 * whenever it scrolls out of view.
 */

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uAmplitude;
  uniform float uCount;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(p);
    float b = hash(p + vec2(1.0, 0.0));
    float c = hash(p + vec2(0.0, 1.0));
    float d = hash(p + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // 2-octave fbm — cheap
  float fbm(vec2 p) {
    return noise(p) * 0.6 + noise(p * 2.0) * 0.3;
  }

  void main() {
    vec2 uv = vUv;

    float intensity = 0.0;
    float count = uCount;

    for (float i = 0.0; i < 16.0; i += 1.0) {
      if (i >= count) break;
      float fi = i / count;

      float warp = fbm(vec2(uv.x * 3.0 + uTime * 0.15, fi * 4.0 + uTime * 0.05));
      float mouseInfluence = (uMouse.x - 0.5) * uAmplitude * (0.5 - abs(uv.x - 0.5));

      float y = fi
        + 0.06 * sin(uv.x * 6.2831 + uTime * 0.4 + i)
        + warp * 0.12
        + mouseInfluence;

      float d = abs(uv.y - y);
      intensity += smoothstep(0.014, 0.0, d) * (0.35 + 0.65 * fi);
    }

    intensity = clamp(intensity, 0.0, 1.0);
    float vignette = smoothstep(1.1, 0.35, distance(uv, vec2(0.5)));
    float alpha = intensity * vignette;

    gl_FragColor = vec4(vec3(intensity), alpha);
  }
`;

interface ThreadsProps {
  amplitude?: number;
  count?: number;
  className?: string;
}

//<---------- Threads -------------->
export default function Threads({
  amplitude = 0.3,
  count = 14,
  className = "",
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // render at 55% resolution — it's a soft background, so it stays crisp enough
    const SCALE = 0.55;

    const renderer = new Renderer({ alpha: true, antialias: false, dpr: 1 });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uAmplitude: { value: amplitude },
        uCount: { value: count },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const w = Math.max(1, Math.floor(container.clientWidth * SCALE));
      const h = Math.max(1, Math.floor(container.clientHeight * SCALE));
      renderer.setSize(w, h);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      program.uniforms.uResolution.value = [w, h];
    }
    resize();
    window.addEventListener("resize", resize);

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    function onMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    // pause rendering when the section is off-screen
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
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMouse.value = [current.x, current.y];
      renderer.render({ scene: mesh });
    }
    raf = requestAnimationFrame(update);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, count]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
