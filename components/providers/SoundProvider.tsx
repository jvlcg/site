"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Soundscape } from "@/lib/soundscape";

/**
 * Som do site: efeitos nos botões e música ambiente.
 *
 * Duas decisões que valem explicar:
 *
 * 1. **Tudo é sintetizado** (ver `lib/soundscape.ts`): nenhum arquivo é
 *    baixado, não há questão de direitos autorais e nada precisa ser liberado
 *    na política de segurança.
 *
 * 2. **Começa desligado na primeira visita.** Navegador nenhum toca áudio
 *    antes de o visitante interagir com a página — é trava do próprio
 *    navegador, não escolha nossa. Mas quem já ligou o som uma vez tem a
 *    preferência guardada: nas próximas visitas a música entra sozinha no
 *    primeiro toque, rolagem ou tecla, que é o mais perto de "automático" que
 *    a web permite hoje.
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
   * Música ambiente. O navegador só libera áudio depois de uma interação, então
   * quando a preferência vem guardada esperamos o primeiro gesto do visitante —
   * qualquer um serve: rolar, tocar na tela, apertar uma tecla.
   */
  useEffect(() => {
    const motorSom = motor();
    if (!ativo) {
      motorSom.pararMusica();
      return;
    }

    let vivo = true;
    const eventos = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    const limpar = () => eventos.forEach((e) => window.removeEventListener(e, tentar));

    async function tentar() {
      if (!vivo) return;
      // se o navegador ainda não liberou, saímos sem remover os ouvintes —
      // o próximo gesto tenta de novo
      if (!(await motorSom.destravar()) || !vivo) return;
      motorSom.iniciarMusica();
      limpar();
    }

    // Quando o visitante acabou de clicar no botão de som, o áudio já está
    // liberado e a música começa aqui mesmo. Quando a preferência veio guardada
    // de outra visita, isto falha de propósito e o primeiro gesto destrava.
    if (!motorSom.iniciarMusica()) {
      eventos.forEach((e) => window.addEventListener(e, tentar, { passive: true }));
    }

    return () => {
      vivo = false;
      limpar();
      motorSom.pararMusica();
    };
  }, [ativo, motor]);

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

  // aba em segundo plano não deve continuar tocando (nem gastar bateria)
  useEffect(() => {
    if (!ativo) return;
    const motorSom = motor();
    const aoTrocarAba = () => (document.hidden ? motorSom.pausar() : motorSom.retomar());
    document.addEventListener("visibilitychange", aoTrocarAba);
    return () => document.removeEventListener("visibilitychange", aoTrocarAba);
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
