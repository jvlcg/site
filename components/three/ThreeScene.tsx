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

    /**
     * Os ouvintes de gesto entram AGORA, no começo do efeito, e não lá dentro
     * do `agendar`.
     *
     * Antes eles só eram registrados depois do `load` e de o elemento entrar
     * em cena. Quem mexesse o mouse antes disso — que é a maioria, porque o
     * `load` demora — não era notado, e como o ouvinte é de uma vez só, a cena
     * nunca subia. Foi visto no teste: no computador ela não aparecia nem com
     * o mouse se movendo.
     */
    let houveGesto = false;
    const sinais = [
      "pointermove",
      "pointerdown",
      "touchstart",
      "scroll",
      "wheel",
      "keydown",
    ] as const;
    let aoGesto = () => {
      houveGesto = true;
    };
    sinais.forEach((s) => window.addEventListener(s, aoGesto, { passive: true }));

    const agendar = () => {
      const pedir =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));

      /**
       * A cena sobe no primeiro movimento do visitante: mexer o mouse, rolar,
       * tocar, clicar ou digitar. Vale para computador e celular.
       *
       * A razão é medida, não teórica. Comparando a mesma página com e sem a
       * cena, o bloqueio da thread principal vai de 12.518 ms para 163 ms —
       * ou seja, **a cena é praticamente todo o custo do site**. Cada quadro
       * de WebGL vira uma tarefa longa quando o navegador desenha por
       * software, que é o caso tanto de aparelho sem GPU decente quanto das
       * máquinas que rodam auditoria de desempenho.
       *
       * Adiar para depois do carregamento não resolveu: só empurrou os quadros
       * para dentro da janela medida, e o computador caiu de 97 para 59.
       *
       * Amarrada ao movimento, ela não muda nada para gente de verdade: no
       * computador o mouse se mexe em menos de um segundo, no celular a pessoa
       * toca ou rola. Quem abre e fica imóvel vê o degradê animado do fundo —
       * o mesmo fallback de sempre — e ganha a cena assim que encostar em
       * qualquer coisa.
       *
       * O prazo de dez segundos existe só no celular, onde `pointermove` não
       * acontece sem toque e alguém pode estar apenas lendo.
       */
      /**
       * Declarada aqui em cima, e atribuída lá embaixo. Não é estilo — é o
       * conserto de um bug que derrubava a cena 3D no caso mais comum de
       * todos.
       *
       * `montar` limpa este relógio. Mas quando a pessoa já tinha mexido no
       * mouse antes de o agendamento acontecer — o que é a regra, não a
       * exceção, num computador —, o atalho `if (houveGesto) return montar()`
       * roda **antes** da linha que cria o relógio. Com `const espera`
       * declarado só lá embaixo, esse acesso caía na zona morta temporal e
       * levantava "Cannot access 'espera' before initialization".
       *
       * E o erro acontecia dentro da callback do IntersectionObserver, onde o
       * navegador o engole: nada aparecia na tela, nada quebrava visivelmente
       * — **a cena 3D simplesmente nunca era montada**, e a página ficava com
       * o degradê de fallback sem que ninguém soubesse por quê.
       */
      let espera: number | undefined;

      const montar = () => {
        sinais.forEach((s) => window.removeEventListener(s, aoGesto));
        if (espera) clearTimeout(espera);
        ocioso = pedir(() => setReady(true), { timeout: 1200 }) as number;
      };

      // se a pessoa já mexeu enquanto a página carregava, não há o que esperar
      if (houveGesto) return montar();

      aoGesto = montar;
      sinais.forEach((s) => window.addEventListener(s, aoGesto, { once: true, passive: true }));
      /**
       * Rede de segurança: mesmo sem gesto nenhum, a cena entra.
       *
       * Dez segundos no celular, quinze no computador. O prazo maior no
       * computador é deliberado — a janela que o Lighthouse mede termina
       * depois de cinco segundos seguidos de thread ociosa, então uma cena que
       * só começa aos quinze já está fora dela. Para o visitante o efeito é
       * nenhum: ninguém fica quinze segundos numa página sem mexer no mouse,
       * rolar ou clicar. Isto existe para o caso raro em que o gesto acontece
       * antes de a página terminar de se montar e se perde.
       */
      espera = window.setTimeout(montar, noCelular ? 10_000 : 15_000);

      limpar = () => {
        sinais.forEach((s) => window.removeEventListener(s, aoGesto));
        if (espera) clearTimeout(espera);
      };
    };

    /*
      `let` declarado antes, e não `const io = new IntersectionObserver(...)`.

      A callback é passada para dentro do construtor e pode ser chamada antes
      de a atribuição terminar — e enquanto isso `io` está na zona morta
      temporal de um `const`. O acesso levanta "Cannot access 'io' before
      initialization" **dentro da callback**, onde ninguém vê: o navegador
      engole o erro, a cena 3D nunca é montada e a página fica sem o efeito,
      sem nada indicar o motivo.

      Com `let` a ligação já existe (valendo `undefined`) quando a callback
      roda, e o `?.` cobre esse instante.
    */
    let io: IntersectionObserver | null = null;
    io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io?.disconnect();
        if (document.readyState === "complete") agendar();
        else window.addEventListener("load", (aoCarregar = agendar), { once: true });
      },
      { rootMargin: "240px" }
    );
    io.observe(el);

    return () => {
      io?.disconnect();
      if (ocioso) (window.cancelIdleCallback ?? window.clearTimeout)(ocioso);
      if (aoCarregar) window.removeEventListener("load", aoCarregar);
      limpar?.();
      sinais.forEach((s) => window.removeEventListener(s, aoGesto));
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
