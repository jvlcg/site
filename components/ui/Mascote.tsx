"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Estetoscopio, type Humor } from "./Estetoscopio";

/**
 * Estetô aparece no canto e convida a pessoa a se cadastrar.
 *
 * As decisões que separam isto de uma janela chata:
 *
 * 1. **Não aparece ao abrir a página.** Espera a pessoa demonstrar interesse —
 *    passar de um terço da rolagem ou 35 segundos de leitura. Convite feito no
 *    primeiro segundo é interrupção; feito depois, é oferta.
 * 2. **Aparece uma vez só.** Quem fecha não vê de novo, quem se cadastra
 *    também não. A escolha fica gravada no navegador.
 * 3. **Some sozinho** depois de meio minuto, sem exigir nada de ninguém.
 * 4. **Não aparece onde não faz sentido:** na própria página de cadastro, na
 *    área restrita, nem para quem prefere menos movimento na tela.
 *
 * Ele entra pelo canto esquerdo porque o direito já tem WhatsApp, assistente e
 * o atalho do cadastro — mais um ali viraria uma parede de botões.
 */

const CHAVE = "estetô-visto";
const ROTAS_SEM_MASCOTE = ["/cadastro", "/area-restrita", "/cancelar-avisos"];

/** Frases sorteadas: quem volta ao site não vê sempre a mesma abordagem. */
const CONVITES = [
  {
    fala: "Oi! Posso te mostrar uma coisa rápida?",
    detalhe: "Com o cadastro, seu contato fica direto com o consultório — sem passar por triagem toda vez.",
  },
  {
    fala: "Psiu… já pensou em ter canal direto?",
    detalhe: "Deixe seus dados uma vez e o retorno das suas mensagens deixa de depender de fila.",
  },
  {
    fala: "Gostou do que leu por aqui?",
    detalhe: "Quem se cadastra recebe os artigos novos e os avisos de agenda antes de irem ao site.",
  },
];

export function Mascote() {
  const caminho = usePathname();
  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [humor, setHumor] = useState<Humor>("aceno");
  const [convite] = useState(() => CONVITES[Math.floor(Math.random() * CONVITES.length)]);
  const jaMostrou = useRef(false);

  const encerrar = useCallback((definitivo: boolean) => {
    setSaindo(true);
    if (definitivo) localStorage.setItem(CHAVE, "1");
    setTimeout(() => setVisivel(false), 450);
  }, []);

  useEffect(() => {
    if (ROTAS_SEM_MASCOTE.some((r) => caminho.startsWith(r))) return;
    if (localStorage.getItem(CHAVE) === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mostrar = () => {
      if (jaMostrou.current) return;
      jaMostrou.current = true;
      setVisivel(true);
      // o aceno é só na chegada; depois ele fica quietinho, sorrindo
      setTimeout(() => setHumor("feliz"), 2600);
      // se ninguém interagir, ele mesmo se retira — sem exigir um clique
      setTimeout(() => setVisivel((v) => (v ? (setSaindo(true), true) : v)), 30_000);
      setTimeout(() => setVisivel(false), 30_450);
    };

    /**
     * Duas medidas, e basta uma.
     *
     * A fração sozinha não serve: a home tem quase 30 000 px, então "um terço"
     * exigiria 10 000 px de rolagem — o convite só apareceria para quem já leu
     * a página inteira, tarde demais para ser convite. A distância absoluta
     * sozinha também não serve: numa página curta ela nunca é alcançada.
     *
     * Então: passou de uma tela e meia (saiu do hero e está lendo de verdade)
     * **ou** já venceu um quinto do documento, o que vier primeiro.
     */
    const porRolagem = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > window.innerHeight * 1.5) return mostrar();
      if (total > 0 && window.scrollY / total > 0.2) mostrar();
    };

    window.addEventListener("scroll", porRolagem, { passive: true });
    const porTempo = setTimeout(mostrar, 35_000);

    return () => {
      window.removeEventListener("scroll", porRolagem);
      clearTimeout(porTempo);
    };
  }, [caminho]);

  if (!visivel) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-[60] flex max-w-[min(20rem,calc(100vw-3rem))] items-end gap-2 transition-all duration-450 ${
        saindo ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ animation: saindo ? undefined : "est-entrada 0.55s cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div className="shrink-0 animate-float">
        <Estetoscopio humor={humor} tamanho={68} />
      </div>

      {/*
        O balão é OPACO, não de vidro.
        O vidro é bonito sobre uma imagem, mas isto flutua sobre texto corrido —
        e ali a transparência faz as letras de trás atravessarem as da frente.
        Entre o efeito e a leitura, a leitura ganha sempre.
      */}
      <div
        className="hairline relative rounded-2xl rounded-bl-sm border p-4 shadow-2xl"
        style={{ background: "var(--bg)" }}
      >
        {/* bico do balão, apontando para o personagem */}
        <span
          aria-hidden="true"
          className="hairline absolute -left-1.5 bottom-3 h-3 w-3 rotate-45 border-b border-l"
          style={{ background: "var(--bg)" }}
        />
        <button
          type="button"
          onClick={() => encerrar(true)}
          aria-label="Fechar mensagem do Estetô"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-faint transition-colors hover:text-[var(--fg)]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="font-display pr-5 text-[0.95rem] font-semibold leading-snug">{convite.fala}</p>
        <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">{convite.detalhe}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <Link
            href="/cadastro"
            onClick={() => encerrar(true)}
            className="btn-primary !px-4 !py-2 text-[0.82rem]"
          >
            Quero conhecer
          </Link>
          <button
            type="button"
            onClick={() => encerrar(true)}
            className="text-[0.8rem] text-faint underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
          >
            Agora não
          </button>
        </div>
      </div>

      <style>{`
        @keyframes est-entrada {
          from { transform: translateY(22px) scale(0.94); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
