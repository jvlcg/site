"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Rede tridimensional de nós e conexões em rotação suave — o sistema
 * endocanabinoide como malha reguladora, em linguagem abstrata e sóbria.
 */

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return pts;
}

function Network({ dark }: { dark: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { nodes, linePositions } = useMemo(() => {
    const pts = fibonacciSphere(46, 1.55);
    // leve irregularidade orgânica
    pts.forEach((p) => p.multiplyScalar(0.92 + Math.random() * 0.18));
    const lines: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 0.78) {
          lines.push(...pts[i].toArray(), ...pts[j].toArray());
        }
      }
    }
    return { nodes: pts, linePositions: new Float32Array(lines) };
  }, []);

  const accent = dark ? "#2dd4bf" : "#059669";
  const base = dark ? "#9fb0bf" : "#47566b";

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, state.pointer.x * 0.15, 0.04);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.07;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={dark ? 0.22 : 0.3} />
      </lineSegments>

      {nodes.map((p, i) => {
        const highlight = i % 9 === 0;
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[highlight ? 0.075 : 0.035, 16, 16]} />
            {highlight ? (
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={dark ? 1.4 : 0.5}
                roughness={0.25}
              />
            ) : (
              <meshStandardMaterial
                color={base}
                roughness={0.4}
                metalness={0.5}
                transparent
                opacity={0.85}
              />
            )}
          </mesh>
        );
      })}
    </group>
  );
}

export default function NetworkCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={dark ? 0.55 : 0.9} />
      <directionalLight position={[4, 5, 6]} intensity={dark ? 1.6 : 1.9} />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#2dd4bf" />
      <Network dark={dark} />
    </Canvas>
  );
}
