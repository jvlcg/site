"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useTilt, type TiltRef } from "./useTilt";

/**
 * Rede neural / sinapses — assinatura visual do site. Nós e conexões em 3D com
 * SINAIS pulsando pelas arestas, brilho aditivo + bloom (desktop/tablet) e
 * reação a mouse / toque / giroscópio. Cenografia procedural (sem assets).
 */

type Tier = { nodes: number; signals: number; dpr: [number, number]; bloom: boolean };

function tierFor(width: number): Tier {
  if (width < 768) return { nodes: 60, signals: 26, dpr: [1, 1.3], bloom: false };
  if (width < 1024) return { nodes: 84, signals: 36, dpr: [1, 1.6], bloom: true };
  return { nodes: 112, signals: 52, dpr: [1, 1.8], bloom: true };
}

function fibSphere(n: number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad).multiplyScalar(r));
  }
  return pts;
}

function Network({ dark, tilt, tier }: { dark: boolean; tilt: RefObject<TiltRef>; tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const signalsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  const { nodes, edges, edgePairs, signalPos, signals, tmp } = useMemo(() => {
    const outer = fibSphere(tier.nodes, 1.7);
    outer.forEach((p) => p.multiplyScalar(0.85 + Math.random() * 0.28));
    // núcleo interno para dar profundidade
    const inner = fibSphere(Math.round(tier.nodes * 0.35), 0.95);
    inner.forEach((p) => p.multiplyScalar(0.7 + Math.random() * 0.3));
    const nodes = [...outer, ...inner];

    const linePos: number[] = [];
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.72) {
          linePos.push(...nodes[i].toArray(), ...nodes[j].toArray());
          pairs.push([nodes[i], nodes[j]]);
        }
      }
    }
    const signals = Array.from({ length: tier.signals }, () => ({
      edge: Math.floor(Math.random() * Math.max(1, pairs.length)),
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.6,
    }));
    return {
      nodes,
      edges: new Float32Array(linePos),
      edgePairs: pairs,
      signalPos: new Float32Array(tier.signals * 3),
      signals,
      tmp: new THREE.Object3D(),
    };
  }, [tier]);

  // No tema claro as cores são bem mais escuras: sobre fundo quase branco, um
  // teal claro some. O escuro pode usar tons luminosos porque o fundo é grafite.
  const accent = dark ? new THREE.Color("#2dd4bf") : new THREE.Color("#0f766e");
  const node = dark ? new THREE.Color("#5eead4") : new THREE.Color("#0d5c55");

  // textura circular suave para os sinais (evita pontos quadrados)
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.7)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  // posiciona os nós instanciados uma vez
  useMemo(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    nodes.forEach((p, i) => {
      tmp.position.copy(p);
      const s = 0.9 + (i % 7 === 0 ? 1.6 : 0);
      tmp.scale.setScalar(s);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes, tmp]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    g.rotation.y += dt * 0.14;
    // inclinação suave (mouse/toque/giroscópio)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tilt.current.y * 0.4, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, tilt.current.x * 0.22, 0.05);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

    // sinais viajando pelas arestas
    if (edgePairs.length) {
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i];
        s.t += dt * s.speed;
        if (s.t > 1) {
          s.t = 0;
          s.edge = Math.floor(Math.random() * edgePairs.length);
        }
        const [a, b] = edgePairs[s.edge];
        signalPos[i * 3] = THREE.MathUtils.lerp(a.x, b.x, s.t);
        signalPos[i * 3 + 1] = THREE.MathUtils.lerp(a.y, b.y, s.t);
        signalPos[i * 3 + 2] = THREE.MathUtils.lerp(a.z, b.z, s.t);
      }
      const geo = signalsRef.current?.geometry;
      if (geo) (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    if (matRef.current) matRef.current.opacity = dark ? 0.16 : 0.5;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={matRef} color={accent} transparent opacity={dark ? 0.18 : 0.5} />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={node} toneMapped={false} />
      </instancedMesh>

      <points ref={signalsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[signalPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={dark ? "#a5fbec" : "#0f766e"}
          map={sprite}
          size={0.16}
          sizeAttenuation
          transparent
          depthWrite={false}
          /*
            Mistura aditiva soma luz: no escuro isso acende o sinal, mas sobre
            fundo claro somar luz ao branco dá branco — o pulso ficava
            literalmente invisível. É o mesmo tratamento que ParticlesCanvas e
            WaveCanvas já faziam.
          */
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

export default function NeuralCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const tilt = useTilt();
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const tier =
    typeof window !== "undefined" ? tierFor(window.innerWidth) : { nodes: 112, signals: 52, dpr: [1, 1.8] as [number, number], bloom: true };

  // pausa o loop quando fora do viewport ou aba oculta (economia de CPU/GPU/bateria)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let inView = true;
    const sync = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { rootMargin: "100px" }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 4.6], fov: 46 }}
      dpr={tier.dpr}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <Network dark={dark} tilt={tilt} tier={tier} />
      {/* Bloom é brilho: só faz sentido onde há escuridão para contrastar. */}
      {tier.bloom && dark && (
        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
    </div>
  );
}
