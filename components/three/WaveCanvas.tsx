"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Malha de pontos em onda contínua — movimento, ritmo e recuperação. */

const vertex = /* glsl */ `
  uniform float uTime;
  varying float vElev;
  varying float vX;

  void main() {
    vec3 p = position;
    float t = uTime * 0.6;
    float e = sin(p.x * 1.15 + t) * 0.32
            + sin(p.x * 2.3 - t * 1.35 + p.y * 1.8) * 0.14
            + cos(p.y * 2.2 + t * 0.8) * 0.12;
    p.z += e;
    vElev = e;
    vX = p.x;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + (e + 0.6) * 1.5) * (30.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vElev;
  varying float vX;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * uOpacity * (0.45 + (vElev + 0.6) * 0.5);
    if (a < 0.012) discard;
    vec3 c = mix(uColorA, uColorB, smoothstep(-4.0, 4.0, vX));
    gl_FragColor = vec4(c, a);
  }
`;

function Wave({ dark }: { dark: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => {
    const cols = 130;
    const rows = 52;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        pos[k++] = (i / (cols - 1) - 0.5) * 11;
        pos[k++] = (j / (rows - 1) - 0.5) * 4.6;
        pos[k++] = 0;
      }
    }
    return pos;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#10b981") },
      uColorB: { value: new THREE.Color("#0ea5e9") },
      uOpacity: { value: 0.7 },
    }),
    []
  );

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    (m.uniforms.uColorA.value as THREE.Color).lerp(
      new THREE.Color(dark ? "#10b981" : "#059669"),
      0.08
    );
    (m.uniforms.uColorB.value as THREE.Color).lerp(
      new THREE.Color(dark ? "#0ea5e9" : "#0369a1"),
      0.08
    );
    m.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      m.uniforms.uOpacity.value,
      dark ? 0.7 : 0.5,
      0.08
    );
    m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
  });

  return (
    <points rotation={[-0.9, 0, 0.08]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

export default function WaveCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0.4, 4.2], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Wave dark={dark} />
    </Canvas>
  );
}
