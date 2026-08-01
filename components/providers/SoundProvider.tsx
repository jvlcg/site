"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Som de interface do site.
 *
 * Duas decisões que valem explicar:
 *
 * 1. **Começa desligado.** Navegador nenhum toca áudio antes de o visitante
 *    interagir com a página — é uma trava do próprio navegador, não uma
 *    escolha nossa. Além disso, som inesperado num site médico incomoda quem
 *    abre o link no trabalho, na sala de espera ou de madrugada.
 *
 * 2. **Os sons são sintetizados, não baixados.** Um oscilador da Web Audio API
 *    gera cada clique na hora. Isso significa zero arquivo para carregar,
 *    nenhum domínio novo liberado na política de segurança e nenhuma questão
 *    de licenciamento de áudio.
 */

type SomCtx = {
  ativo: boolean;
  alternar: () => void;
  /** Música de fundo disponível (só quando existe arquivo configurado). */
  temMusica: boolean;
};

const Ctx = createContext<SomCtx>({ ativo: false, alternar: () => {}, temMusica: false });

export const useSom = () => useContext(Ctx);

const CHAVE = "som-interface";

/** Caminho da música de fundo. Vazio = sem música, só os cliques. */
const MUSICA = process.env.NEXT_PUBLIC_MUSICA_FUNDO ?? "";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [ativo, setAtivo] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const musica = useRef<HTMLAudioElement | null>(null);

  // recupera a preferência de visitas anteriores
  useEffect(() => {
    setAtivo(localStorage.getItem(CHAVE) === "1");
  }, []);

  /** Toca um clique curto e discreto — dois tons breves com queda de volume. */
  const tocar = useCallback((freq: number, duracao = 0.06, volume = 0.05) => {
    try {
      audioCtx.current ??= new AudioContext();
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;

      // ataque e queda suaves: sem isso o corte seco vira um "clique" áspero
      const agora = ctx.currentTime;
      ganho.gain.setValueAtTime(0, agora);
      ganho.gain.linearRampToValueAtTime(volume, agora + 0.008);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

      osc.connect(ganho).connect(ctx.destination);
      osc.start(agora);
      osc.stop(agora + duracao);
    } catch {
      /* navegador sem Web Audio — o site funciona igual, só sem som */
    }
  }, []);

  // som nos elementos clicáveis, por um único ouvinte no documento:
  // evita ter de tocar em cada botão do site
  useEffect(() => {
    if (!ativo) return;
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement | null)?.closest("a, button");
      if (!alvo) return;
      // botão principal soa um pouco mais grave, para ter peso
      const principal = alvo.classList.contains("btn-primary");
      tocar(principal ? 520 : 720, principal ? 0.08 : 0.055);
    };
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, [ativo, tocar]);

  // música de fundo, se houver arquivo configurado
  useEffect(() => {
    if (!MUSICA) return;
    if (!ativo) {
      musica.current?.pause();
      return;
    }
    musica.current ??= Object.assign(new Audio(MUSICA), { loop: true, volume: 0.12 });
    void musica.current.play().catch(() => {
      /* o navegador ainda não liberou áudio — toca no próximo clique */
    });
  }, [ativo]);

  const alternar = useCallback(() => {
    setAtivo((v) => {
      const novo = !v;
      localStorage.setItem(CHAVE, novo ? "1" : "0");
      // confirma a ativação com um som, para o visitante saber que funcionou
      if (novo) tocar(660, 0.09, 0.05);
      return novo;
    });
  }, [tocar]);

  return <Ctx.Provider value={{ ativo, alternar, temMusica: !!MUSICA }}>{children}</Ctx.Provider>;
}
