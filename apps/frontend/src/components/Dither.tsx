/* eslint-disable react/no-unknown-property */
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { EffectComposer, wrapEffect } from '@react-three/postprocessing'
import { Effect } from 'postprocessing'
import * as THREE from 'three'
import './Dither.css'


const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 value) { return value - floor(value * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 value) { return mod289(((value * 34.0) + 1.0) * value); }
vec4 taylorInvSqrt(vec4 value) { return 1.79284291400159 - 0.85373472095314 * value; }
vec2 fade(vec2 value) { return value * value * value * (value * (value * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 point) {
  vec4 pointInteger = floor(point.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 pointFraction = fract(point.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  pointInteger = mod289(pointInteger);
  vec4 x = pointInteger.xzxz;
  vec4 y = pointInteger.yyww;
  vec4 xFraction = pointFraction.xzxz;
  vec4 yFraction = pointFraction.yyww;
  vec4 permutation = permute(permute(x) + y);
  vec4 gradientX = fract(permutation * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gradientY = abs(gradientX) - 0.5;
  gradientX -= floor(gradientX + 0.5);
  vec2 gradient00 = vec2(gradientX.x, gradientY.x);
  vec2 gradient10 = vec2(gradientX.y, gradientY.y);
  vec2 gradient01 = vec2(gradientX.z, gradientY.z);
  vec2 gradient11 = vec2(gradientX.w, gradientY.w);
  vec4 normalizer = taylorInvSqrt(vec4(dot(gradient00, gradient00), dot(gradient01, gradient01), dot(gradient10, gradient10), dot(gradient11, gradient11)));
  gradient00 *= normalizer.x; gradient01 *= normalizer.y; gradient10 *= normalizer.z; gradient11 *= normalizer.w;
  float noise00 = dot(gradient00, vec2(xFraction.x, yFraction.x));
  float noise10 = dot(gradient10, vec2(xFraction.y, yFraction.y));
  float noise01 = dot(gradient01, vec2(xFraction.z, yFraction.z));
  float noise11 = dot(gradient11, vec2(xFraction.w, yFraction.w));
  vec2 fadeXY = fade(pointFraction.xy);
  return 2.3 * mix(mix(noise00, noise10, fadeXY.x), mix(noise01, noise11, fadeXY.x), fadeXY.y);
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = waveFrequency;
  for (int index = 0; index < 4; index++) {
    value += amplitude * abs(cnoise(point));
    point *= frequency;
    amplitude *= waveAmplitude;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
  uv.x *= resolution.x / resolution.y;
  float wave = fbm(uv + fbm(uv - time * waveSpeed));
  if (enableMouseInteraction == 1) {
    vec2 mouse = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouse.x *= resolution.x / resolution.y;
    wave -= 0.5 * (1.0 - smoothstep(0.0, mouseRadius, length(uv - mouse)));
  }
  gl_FragColor = vec4(mix(backgroundColor, waveColor, clamp(wave, 0.0, 1.0)), 1.0);
}
`

const ditherFragmentShader = `
uniform float colorNum;
uniform float pixelSize;
const float bayer[64] = float[64](
  0.,48.,12.,60.,3.,51.,15.,63.,32.,16.,44.,28.,35.,19.,47.,31.,
  8.,56.,4.,52.,11.,59.,7.,55.,40.,24.,36.,20.,43.,27.,39.,23.,
  2.,50.,14.,62.,1.,49.,13.,61.,34.,18.,46.,30.,33.,17.,45.,29.,
  10.,58.,6.,54.,9.,57.,5.,53.,42.,26.,38.,22.,41.,25.,37.,21.
);
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 pixelUv = (pixelSize / resolution) * floor(uv / (pixelSize / resolution));
  vec3 color = texture2D(inputBuffer, pixelUv).rgb;
  vec2 coordinate = floor(uv * resolution / pixelSize);
  int x = int(mod(coordinate.x, 8.0));
  int y = int(mod(coordinate.y, 8.0));
  float stepSize = 1.0 / (colorNum - 1.0);
  color += (bayer[y * 8 + x] / 64.0 - 0.25) * stepSize;
  color = floor(clamp(color, 0.0, 1.0) * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  outputColor = vec4(color, 1.0);
}
`

class RetroEffectImpl extends Effect {
  public uniforms: Map<string, THREE.Uniform>

  constructor() {
    const uniforms = new Map<string, THREE.Uniform>([
        ['colorNum', new THREE.Uniform(4)],
        ['pixelSize', new THREE.Uniform(2)],
      ])
    super('RetroEffect', ditherFragmentShader, { uniforms })
    this.uniforms = uniforms
  }

  set colorNum(value: number) {
    this.uniforms.get('colorNum')!.value = value
  }

  set pixelSize(value: number) {
    this.uniforms.get('pixelSize')!.value = value
  }
}

const WrappedRetroEffect = wrapEffect(RetroEffectImpl)

const RetroEffect = forwardRef<RetroEffectImpl, { colorNum: number; pixelSize: number }>((props, ref) => (
  <WrappedRetroEffect ref={ref} {...props} />
))

RetroEffect.displayName = 'RetroEffect'

interface DitherProps {
  waveSpeed?: number
  waveFrequency?: number
  waveAmplitude?: number
  waveColor?: [number, number, number]
  backgroundColor?: [number, number, number]
  colorNum?: number
  pixelSize?: number
  disableAnimation?: boolean
  enableMouseInteraction?: boolean
  mouseRadius?: number
}

interface DitheredWavesProps extends Required<DitherProps> {}

//<---------- DitheredWaves ------------>
function DitheredWaves(props: DitheredWavesProps) {
  const mouse = useRef(new THREE.Vector2())
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { gl, size, viewport } = useThree()
  const uniforms = useMemo(() => ({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2()),
    waveSpeed: new THREE.Uniform(props.waveSpeed),
    waveFrequency: new THREE.Uniform(props.waveFrequency),
    waveAmplitude: new THREE.Uniform(props.waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...props.waveColor)),
    backgroundColor: new THREE.Uniform(new THREE.Color(...props.backgroundColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2()),
    enableMouseInteraction: new THREE.Uniform(props.enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(props.mouseRadius),
  }), [])

  useEffect(() => {
    const pixelRatio = gl.getPixelRatio()
    materialRef.current?.uniforms.resolution.value.set(Math.floor(size.width * pixelRatio), Math.floor(size.height * pixelRatio))
  }, [gl, size])

  useFrame(({ clock }) => {
    const current = materialRef.current?.uniforms
    if (!current) return
    if (!props.disableAnimation) current.time.value = clock.getElapsedTime()
    current.waveSpeed.value = props.waveSpeed
    current.waveFrequency.value = props.waveFrequency
    current.waveAmplitude.value = props.waveAmplitude
    current.waveColor.value.set(...props.waveColor)
    current.backgroundColor.value.set(...props.backgroundColor)
    current.enableMouseInteraction.value = props.enableMouseInteraction ? 1 : 0
    current.mouseRadius.value = props.mouseRadius
    current.mousePos.value.copy(mouse.current)
  })

  //<---------- handlePointerMove ------------>
  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (!props.enableMouseInteraction) return
    const rect = gl.domElement.getBoundingClientRect()
    const pixelRatio = gl.getPixelRatio()
    mouse.current.set((event.clientX - rect.left) * pixelRatio, (event.clientY - rect.top) * pixelRatio)
  }

  return (
    <>
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial ref={materialRef} vertexShader={waveVertexShader} fragmentShader={waveFragmentShader} uniforms={uniforms} />
      </mesh>
      <EffectComposer>
        <RetroEffect colorNum={props.colorNum} pixelSize={props.pixelSize} />
      </EffectComposer>
      <mesh onPointerMove={handlePointerMove} position={[0, 0, 0.01]} scale={[viewport.width, viewport.height, 1]} visible={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

//<---------- Dither ------------>
export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  backgroundColor = [0, 0, 0],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  return (
    <Canvas className="dither-container" camera={{ position: [0, 0, 6] }} dpr={1} gl={{ antialias: true }}>
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        backgroundColor={backgroundColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  )
}
