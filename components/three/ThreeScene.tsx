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

    let ocioso = 0;
    let aoCarregar: (() => void) | null = null;
    let limpar: (() => void) | null = null;

    /**
     * Entrar no viewport não basta para montar: a cena do topo já está visível
     * quando a página abre, então ela subia junto com a hidratação e disputava
     * a thread principal com o próprio conteúdo. É o que o Lighthouse mostrava
     * como dezenas de tarefas longas atribuídas ao layout.
     *
     * Agora a cena espera o carregamento terminar e a thread ficar ociosa. Ela
     * aparece uma fração de segundo depois — visualmente igual, porque entra
     * com fade — mas fora do caminho crítico do texto e da foto.
     *
     * O `timeout` do `requestIdleCallback` é o seguro: em aparelho que nunca
     * fica ocioso, a cena entra assim mesmo em 1,5 s em vez de nunca.
     */
    /**
     * No celular, a cena espera um sinal de vida — rolagem, toque ou clique —
     * ou oito segundos.
     *
     * Não é para adiar por adiar. Num aparelho modesto cada quadro do WebGL
     * leva perto de 80 ms, e a cena roda a 60 quadros por segundo: enquanto ela
     * desenha, a thread principal não é de mais ninguém. Nos primeiros segundos
     * a pessoa está lendo o título, e é justamente aí que a disputa custa mais.
     *
     * Quem rola, toca ou espera vê a cena igual. Quem só passou os olhos e
     * saiu nunca precisou dela.
     */
    const noCelular = window.matchMedia("(pointer: coarse)").matches;

    const agendar = () => {
      const pedir =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));

      if (!noCelular) {
        ocioso = pedir(() => setReady(true), { timeout: 1500 }) as number;
        return;
      }

      const sinais = ["pointerdown", "touchstart", "scroll", "keydown"] as const;
      const soltar = () => {
        sinais.forEach((s) => window.removeEventListener(s, soltar));
        clearTimeout(espera);
        ocioso = pedir(() => setReady(true), { timeout: 1200 }) as number;
      };
      sinais.forEach((s) => window.addEventListener(s, soltar, { once: true, passive: true }));
      const espera = window.setTimeout(soltar, 8000);
      limpar = () => {
        sinais.forEach((s) => window.removeEventListener(s, soltar));
        clearTimeout(espera);
      };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (document.readyState === "complete") agendar();
        else window.addEventListener("load", (aoCarregar = agendar), { once: true });
      },
      { rootMargin: "240px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (ocioso) (window.cancelIdleCallback ?? window.clearTimeout)(ocioso);
      if (aoCarregar) window.removeEventListener("load", aoCarregar);
      limpar?.();
    };
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
