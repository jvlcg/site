"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSom } from "@/components/providers/SoundProvider";
import { Estetoscopio, type Humor } from "./Estetoscopio";

/**
 * Estetô aparece no canto e conversa com quem está lendo, até convidar ao
 * cadastro.
 *
 * A referência é o assistente do Windows antigo: personagem no canto, balão
 * de fala, texto que sai aos poucos com um somzinho por sílaba. O que dele
 * NÃO foi copiado é justamente o que fez todo mundo odiá-lo — aparecer sem
 * ser chamado, atrapalhar o que a pessoa fazia e voltar depois de dispensado.
 *
 * Daí as regras:
 *
 * 1. **Não aparece ao abrir a página.** Espera a pessoa demonstrar interesse —
 *    passar de uma tela e meia de leitura, ou 35 segundos. Convite feito no
 *    primeiro segundo é interrupção; feito depois, é oferta.
 * 2. **Aparece uma vez só.** Quem fecha não vê de novo, quem se cadastra
 *    também não. A escolha fica gravada no navegador.
 * 3. **Fala e se cala.** Diz o que tem para dizer, faz o convite e some
 *    sozinho se ninguém responder.
 * 4. **Nunca prende ninguém.** O X está lá desde o primeiro instante, e um
 *    toque no balão pula a digitação inteira.
 * 5. **Não aparece onde não faz sentido:** na própria página de cadastro, na
 *    área restrita, nem para quem prefere menos movimento na tela.
 *
 * Ele entra pelo canto esquerdo porque o direito já tem WhatsApp, assistente e
 * o atalho do cadastro — mais um ali viraria uma parede de botões.
 */

const CHAVE = "estetô-visto";
const ROTAS_SEM_MASCOTE = ["/cadastro", "/area-restrita", "/cancelar-avisos"];

/** Ritmo da digitação, em milissegundos por caractere. */
const VELOCIDADE = 26;
/**
 * Uma nota a cada 3 caracteres. Por caractere seria metralhadora; a cada 3 cai
 * perto do ritmo de sílaba do português falado.
 */
const CARACTERES_POR_NOTA = 3;
/** Respiro entre uma fala e a seguinte. */
const PAUSA = 900;

type Fala = { texto: string; humor?: Humor };

/**
 * Três conversas diferentes, sorteadas. Quem volta ao site não vê sempre a
 * mesma abordagem — e a última frase de cada uma é sempre o convite, porque é
 * ela que fica na tela quando os botões aparecem.
 */
const CONVERSAS: Fala[][] = [
  [
    { texto: "Oi! Eu sou o Estetô 👋", humor: "aceno" },
    { texto: "Vi que você está lendo há um tempinho por aqui." },
    { texto: "Quer deixar seu contato direto com o consultório? Sem passar por triagem toda vez." },
  ],
  [
    { texto: "Psiu… posso te contar uma coisa?", humor: "aceno" },
    { texto: "Quem se cadastra recebe os artigos novos e os avisos de agenda antes de irem ao site." },
    { texto: "É rápido, e você escolhe se quer receber ou não." },
  ],
  [
    { texto: "Ei! Gostou do que leu?", humor: "aceno" },
    { texto: "Dá para deixar seus dados uma vez só e falar direto com o consultório depois." },
    { texto: "Quer dar uma olhada em como funciona?" },
  ],
];

export function Mascote() {
  const caminho = usePathname();
  const { tocar } = useSom();

  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [conversa] = useState(() => CONVERSAS[Math.floor(Math.random() * CONVERSAS.length)]);
  const [indice, setIndice] = useState(0);
  const [escrito, setEscrito] = useState("");
  const [terminou, setTerminou] = useState(false);

  const jaMostrou = useRef(false);
  const falaAtual = conversa[indice];
  const digitando = escrito.length < falaAtual.texto.length;

  const encerrar = useCallback(() => {
    setSaindo(true);
    localStorage.setItem(CHAVE, "1");
    setTimeout(() => setVisivel(false), 450);
  }, []);

  /** Um toque no balão pula a digitação — esperar texto sair nunca é a graça. */
  const adiantar = useCallback(() => {
    if (digitando) setEscrito(falaAtual.texto);
  }, [digitando, falaAtual.texto]);

  // ---- quando aparecer
  useEffect(() => {
    if (ROTAS_SEM_MASCOTE.some((r) => caminho.startsWith(r))) return;
    if (localStorage.getItem(CHAVE) === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mostrar = () => {
      if (jaMostrou.current) return;
      jaMostrou.current = true;
      setVisivel(true);
    };

    /**
     * Duas medidas, e basta uma.
     *
     * A fração sozinha não serve: a home tem quase 30 000 px, então "um terço"
     * exigiria 10 000 px de rolagem — o convite só apareceria para quem já leu
     * a página inteira, tarde demais para ser convite. A distância absoluta
     * sozinha também não serve: numa página curta ela nunca é alcançada.
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

  // ---- a digitação, letra a letra, com a voz junto
  useEffect(() => {
    if (!visivel || !digitando) return;
    const t = setTimeout(() => {
      const proximo = escrito.length + 1;
      setEscrito(falaAtual.texto.slice(0, proximo));
      // `tocar` já respeita o botão de silêncio; aqui só decidimos o ritmo
      if (proximo % CARACTERES_POR_NOTA === 0) tocar("fala");
    }, VELOCIDADE);
    return () => clearTimeout(t);
  }, [visivel, digitando, escrito, falaAtual.texto, tocar]);

  // ---- da fala terminada para a próxima
  useEffect(() => {
    if (!visivel || digitando) return;
    if (indice < conversa.length - 1) {
      const t = setTimeout(() => {
        setIndice((i) => i + 1);
        setEscrito("");
      }, PAUSA);
      return () => clearTimeout(t);
    }
    setTerminou(true);
  }, [visivel, digitando, indice, conversa.length]);

  // ---- se ninguém responder, ele mesmo se retira
  useEffect(() => {
    if (!terminou) return;
    const some = setTimeout(() => setSaindo(true), 30_000);
    const fim = setTimeout(() => setVisivel(false), 30_450);
    return () => {
      clearTimeout(some);
      clearTimeout(fim);
    };
  }, [terminou]);

  if (!visivel) return null;

  const humor: Humor = digitando ? "falando" : (falaAtual.humor ?? "feliz");

  return (
    <div
      className={`fixed bottom-6 left-6 z-[60] flex max-w-[min(21rem,calc(100vw-3rem))] items-end gap-2 transition-all duration-450 ${
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
        onClick={adiantar}
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
          onClick={encerrar}
          aria-label="Fechar mensagem do Estetô"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-faint transition-colors hover:text-[var(--fg)]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/*
          `aria-live="polite"` faz o leitor de tela anunciar cada fala quando
          ela termina. Sem isso, quem não enxerga a tela não saberia que existe
          alguém falando ali — e o texto que aparece letra a letra seria lido
          de forma ininteligível.
        */}
        <p
          className="min-h-[3.2rem] pr-5 text-[0.92rem] leading-relaxed"
          aria-live="polite"
          aria-atomic="true"
        >
          {escrito}
          {digitando && <span className="est-cursor" aria-hidden="true">▍</span>}
        </p>

        {/*
          Os botões só entram quando a conversa acaba. Aparecendo antes, a
          pessoa clicaria no meio da frase — e o convite ficaria pela metade.
        */}
        {terminou && (
          <div className="mt-3 flex flex-wrap items-center gap-2" style={{ animation: "est-entrada 0.4s ease-out" }}>
            <Link href="/cadastro" onClick={encerrar} className="btn-primary !px-4 !py-2 text-[0.82rem]">
              Quero me cadastrar
            </Link>
            <button
              type="button"
              onClick={encerrar}
              className="text-[0.8rem] text-faint underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
            >
              Agora não
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes est-entrada {
          from { transform: translateY(22px) scale(0.94); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        .est-cursor { animation: est-piscar 0.9s steps(1) infinite; opacity: 0.55; }
        @keyframes est-piscar { 0%, 49% { opacity: 0.55; } 50%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}
