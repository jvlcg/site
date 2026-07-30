"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Campo de partículas fluidas que reage ao mouse — representação abstrata
 * da rede endocanabinoide (adaptação e regulação). Shader próprio, sem
 * texturas nem modelos externos.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  attribute float aSeed;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    float t = uTime * 0.16;
    float phase = aSeed * 6.2831;

    p.x += sin(p.y * 1.5 + t * 2.1 + phase) * 0.26;
    p.y += cos(p.x * 1.3 + t * 1.7 + phase) * 0.2;
    p.z += sin(p.x * 1.1 + p.y * 1.2 + t + phase) * 0.3;

    vec2 d = p.xy - uMouse;
    float force = smoothstep(1.35, 0.0, length(d));
    p.xy += normalize(d + 0.0001) * force * 0.6;
    p.z += force * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed * 0.8) * (32.0 / -mv.z);

    vAlpha = 0.3 + 0.7 * fract(aSeed * 13.7);
    vMix = fract(aSeed * 7.31);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.06, d) * vAlpha * uOpacity;
    if (a < 0.012) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a);
  }
`;

function Particles({ dark }: { dark: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, camera } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));

  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 2200 : 5200;

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      seed[i] = Math.random();
    }
    return { positions: pos, seeds: seed };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uSize: { value: 1.5 },
      uColorA: { value: new THREE.Color("#10b981") },
      uColorB: { value: new THREE.Color("#2dd4bf") },
      uOpacity: { value: 0.55 },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;

    // ponteiro NDC -> plano z=0 no mundo
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const halfW = halfH * (size.width / size.height);
    target.current.set(state.pointer.x * halfW, state.pointer.y * halfH);
    m.uniforms.uMouse.value.lerp(target.current, 0.06);

    // cores adaptadas ao tema (transição suave)
    const a = m.uniforms.uColorA.value as THREE.Color;
    const b = m.uniforms.uColorB.value as THREE.Color;
    a.lerp(new THREE.Color(dark ? "#10b981" : "#059669"), 0.08);
    b.lerp(new THREE.Color(dark ? "#2dd4bf" : "#0d9488"), 0.08);
    m.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      m.uniforms.uOpacity.value,
      dark ? 0.62 : 0.42,
      0.08
    );
    m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticlesCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Particles dark={dark} />
    </Canvas>
  );
}
