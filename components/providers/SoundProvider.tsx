"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Soundscape } from "@/lib/soundscape";

/**
 * Som da interface: o retorno sonoro de cada clique. Sem música de fundo.
 *
 * Duas decisões que valem explicar:
 *
 * 1. **Tudo é sintetizado** (ver `lib/soundscape.ts`): nenhum arquivo é
 *    baixado, não há questão de direitos autorais e nada precisa ser liberado
 *    na política de segurança.
 *
 * 2. **Começa desligado.** Som inesperado num site médico incomoda quem abre o
 *    link no trabalho, na sala de espera ou de madrugada. Quem liga uma vez tem
 *    a preferência guardada para as próximas visitas.
 */

type SomCtx = {
  ativo: boolean;
  alternar: () => void;
};

const Ctx = createContext<SomCtx>({ ativo: false, alternar: () => {} });

export const useSom = () => useContext(Ctx);

const CHAVE = "som-interface";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [ativo, setAtivo] = useState(false);
  const som = useRef<Soundscape | null>(null);
  const motor = useCallback(() => (som.current ??= new Soundscape()), []);

  // recupera a preferência de visitas anteriores
  useEffect(() => {
    if (localStorage.getItem(CHAVE) === "1") setAtivo(true);
  }, []);

  /**
   * Um único ouvinte no documento cobre todos os links e botões do site — não
   * é preciso encostar em cada componente.
   */
  useEffect(() => {
    if (!ativo) return;
    const motorSom = motor();

    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement | null)?.closest("a, button");
      if (!alvo) return;

      // Agendamento tem som próprio: todo caminho para marcar consulta passa
      // pelo WhatsApp, então basta reconhecer o link — nenhum botão precisa
      // ser marcado à mão, inclusive os que vierem depois.
      const href = alvo.getAttribute("href") ?? "";
      if (href.includes("wa.me")) return motorSom.efeito("agendar");

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
