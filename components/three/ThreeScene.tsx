"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ParticlesCanvas = dynamic(() => import("./ParticlesCanvas"), { ssr: false });
const NetworkCanvas = dynamic(() => import("./NetworkCanvas"), { ssr: false });
const WaveCanvas = dynamic(() => import("./WaveCanvas"), { ssr: false });
const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), { ssr: false });

type SceneKind = "particles" | "network" | "wave" | "neural";

/**
 * Monta a cena WebGL apenas quando: (1) o usuário não prefere movimento
 * reduzido, (2) WebGL está disponível e (3) o container se aproxima do
 * viewport. Antes disso, nada é baixado — o Three.js fica fora do bundle
 * inicial. O fundo em mesh gradient (CSS) serve de fallback visual.
 */
export function ThreeScene({ kind, className = "" }: { kind: SceneKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      const canvas = document.createElement("canvas");
      if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return;
    } catch {
      return;
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {ready && kind === "particles" && <ParticlesCanvas />}
      {ready && kind === "network" && <NetworkCanvas />}
      {ready && kind === "wave" && <WaveCanvas />}
      {ready && kind === "neural" && <NeuralCanvas />}
    </div>
  );
}
