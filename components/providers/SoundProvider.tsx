"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Soundscape } from "@/lib/soundscape";
import { PADROES, vibrar } from "@/lib/vibrar";

/**
 * Retorno de interface: som e vibração ao clicar.
 *
 * Três decisões que valem explicar:
 *
 * 1. **Tudo é sintetizado** (ver `lib/soundscape.ts`): nenhum arquivo é
 *    baixado, não há questão de direitos autorais e nada precisa ser liberado
 *    na política de segurança.
 *
 * 2. **Começa ligado.** Como todo som nasce de um clique, o navegador nunca é
 *    surpreendido: a própria interação é a autorização que ele exige. Quem
 *    desliga tem a escolha guardada e nunca mais ouve nada.
 *
 * 3. **A vibração não obedece ao botão de som.** São canais diferentes: quem
 *    silencia o aparelho geralmente quer justamente o tátil no lugar do som. É
 *    também como o celular se comporta fora do navegador.
 */

type SomCtx = {
  ativo: boolean;
  alternar: () => void;
};

const Ctx = createContext<SomCtx>({ ativo: true, alternar: () => {} });

export const useSom = () => useContext(Ctx);

const CHAVE = "som-interface";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // começa ligado; só fica desligado se a pessoa tiver desligado antes
  const [ativo, setAtivo] = useState(true);
  const som = useRef<Soundscape | null>(null);
  const motor = useCallback(() => (som.current ??= new Soundscape()), []);

  useEffect(() => {
    if (localStorage.getItem(CHAVE) === "0") setAtivo(false);
  }, []);

  /**
   * Um único ouvinte no documento cobre todos os links e botões do site — não
   * é preciso encostar em cada componente, e o que for criado depois já entra
   * com o comportamento certo.
   */
  useEffect(() => {
    const motorSom = motor();

    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement | null)?.closest("a, button");
      if (!alvo) return;

      // Agendamento: todo caminho para marcar consulta passa pelo WhatsApp,
      // então basta reconhecer o link — nenhum botão precisa ser marcado à
      // mão, inclusive os que vierem depois.
      const agendamento = (alvo.getAttribute("href") ?? "").includes("wa.me");
      const noMenu = !agendamento && alvo.closest("header") !== null;

      if (agendamento) vibrar(PADROES.agendar);
      else if (noMenu) vibrar(PADROES.menu);

      if (!ativo) return;
      if (agendamento) return motorSom.efeito("agendar");
      motorSom.efeito(alvo.classList.contains("btn-primary") ? "botao" : "clique");
    };

    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, [ativo, motor]);

  const alternar = useCallback(() => {
    setAtivo((v) => {
      const novo = !v;
      localStorage.setItem(CHAVE, novo ? "1" : "0");
      motor().efeito(novo ? "ligar" : "desligar");
      return novo;
    });
  }, [motor]);

  return <Ctx.Provider value={{ ativo, alternar }}>{children}</Ctx.Provider>;
}
