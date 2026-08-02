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
 * de fala, texto que sai aos poucos com um somzinho por sílaba.
 *
 * **Ele aparece em toda visita, em toda recarga e em toda página** — decisão
 * do Dr. José Victor. Não há memória de "já viu": cada carregamento é uma
 * chegada nova.
 *
 * O que sobra do cuidado original, e que segue valendo:
 *
 * 1. **Não aparece no instante em que a página abre.** Espera a pessoa
 *    começar a ler — uma tela e meia de rolagem, ou doze segundos. Convite no
 *    primeiro segundo é interrupção; logo depois, é oferta.
 * 2. **Fala e se cala.** Diz o que tem para dizer, faz o convite e some
 *    sozinho se ninguém responder.
 * 3. **Nunca prende ninguém.** O X está lá desde o primeiro instante, e um
 *    toque no balão pula a digitação inteira.
 * 4. **Não atrapalha quem já decidiu:** some da própria página de cadastro
 *    (onde ele já aparece dentro da página, ao lado do formulário), da área
 *    restrita e do cancelamento de avisos.
 *
 * Ele entra pelo canto esquerdo porque o direito já tem WhatsApp, assistente e
 * o atalho do cadastro — mais um ali viraria uma parede de botões.
 */

/**
 * Rotas em que ele não entra. Não é para "poupar" a pessoa: é que nas três o
 * balão atrapalharia algo que já está em curso — cobrir o formulário de quem
 * está preenchendo, poluir a área do médico, ou convidar ao cadastro
 * justamente quem está clicando para sair da lista.
 */
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

const sortear = () => CONVERSAS[Math.floor(Math.random() * CONVERSAS.length)];

export function Mascote() {
  const caminho = usePathname();
  const { tocar } = useSom();

  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [conversa, setConversa] = useState(() => sortear());
  const [indice, setIndice] = useState(0);
  const [terminou, setTerminou] = useState(false);
  /**
   * Muda duas vezes por frase — ao começar e ao terminar de falar. É o que
   * abre e fecha a boca. A letra a letra NÃO passa por aqui: ver o efeito de
   * digitação mais abaixo.
   */
  const [falando, setFalando] = useState(false);
  /**
   * Quem pediu menos movimento continua vendo o Estetô — só não vê a
   * digitação. Esconder o personagem seria tirar dessa pessoa o convite que
   * todo mundo recebe; o que incomoda ali é a animação, não a existência dele.
   */
  const [semAnimacao, setSemAnimacao] = useState(false);

  const jaMostrou = useRef(false);
  const textoRef = useRef<HTMLParagraphElement>(null);
  /** Guardada pelo efeito de digitação; um toque no balão a chama. */
  const pular = useRef<(() => void) | null>(null);
  const falaAtual = conversa[indice];

  const encerrar = useCallback(() => {
    setSaindo(true);
    setTimeout(() => setVisivel(false), 450);
  }, []);

  /** Um toque no balão pula a digitação — esperar texto sair nunca é a graça. */
  const adiantar = useCallback(() => pular.current?.(), []);

  // ---- quando aparecer (recomeça a cada página)
  useEffect(() => {
    /**
     * Zera tudo na troca de rota. O componente vive no layout e não é
     * desmontado ao navegar, então sem isto ele guardaria o estado da página
     * anterior — teria "já mostrado", e não apareceria mais.
     */
    jaMostrou.current = false;
    setVisivel(false);
    setSaindo(false);
    setIndice(0);
    setTerminou(false);
    setFalando(false);
    setConversa(sortear());
    // o parágrafo é escrito direto no DOM, então limpar é aqui e não por estado
    if (textoRef.current) textoRef.current.textContent = "";

    if (ROTAS_SEM_MASCOTE.some((r) => caminho.startsWith(r))) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSemAnimacao(reduzido);

    const mostrar = () => {
      if (jaMostrou.current) return;
      jaMostrou.current = true;
      setVisivel(true);
    };

    /**
     * Meia tela de rolagem basta.
     *
     * A régua era de uma tela e meia, pensada para só abordar quem já estava
     * lendo de verdade. Na prática ela adiava demais: numa página longa a
     * pessoa desce um pouco, decide o que quer e clica — e nunca chegava lá.
     * Meia tela ainda distingue "está lendo" de "abriu e saiu", que era o
     * ponto.
     */
    const porRolagem = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > window.innerHeight * 0.5) return mostrar();
      if (total > 0 && window.scrollY / total > 0.1) mostrar();
    };

    window.addEventListener("scroll", porRolagem, { passive: true });
    /**
     * Quatro segundos.
     *
     * Já foram 35, depois 12. O erro dos dois números era supor que quem chega
     * fica parado esperando: quatro segundos é o tempo de ler o título e a
     * primeira linha — a pessoa ainda está na página, e ainda não decidiu para
     * onde ir. Doze já era tarde: muita gente clica ou sai antes disso.
     *
     * Continua não sendo zero de propósito. Aparecer junto com a página é
     * pop-up; aparecer logo depois é alguém que percebeu que você chegou.
     */
    const porTempo = setTimeout(mostrar, 4_000);

    return () => {
      window.removeEventListener("scroll", porRolagem);
      clearTimeout(porTempo);
    };
  }, [caminho]);

  /**
   * A digitação, letra a letra, com a voz junto — escrita direto no DOM.
   *
   * Por estado do React, cada caractere disparava uma renderização do
   * componente inteiro, personagem em SVG incluído, com seus gradientes e
   * máscaras. São cerca de 150 letras por conversa: 150 reconciliações
   * completas em quatro segundos, bem no meio da janela que o Lighthouse
   * mede. Foi isso que levou o tempo de bloqueio a 1.650 ms e o Speed Index a
   * 8,5 s — o site parecia lento porque, naquele instante, estava.
   *
   * Escrevendo em `textContent`, o navegador repinta um nó de texto e nada
   * mais. O React volta a ser chamado duas vezes por frase: ao começar e ao
   * terminar de falar, que é o de que a boca precisa.
   */
  useEffect(() => {
    if (!visivel) return;
    const alvo = textoRef.current;
    if (!alvo) return;

    const texto = falaAtual.texto;
    let relogio = 0;

    const avancar = () => {
      if (indice < conversa.length - 1) setIndice((n) => n + 1);
      else setTerminou(true);
    };

    if (semAnimacao) {
      alvo.textContent = texto;
      relogio = window.setTimeout(avancar, PAUSA);
      return () => clearTimeout(relogio);
    }

    let i = 0;
    setFalando(true);

    const encerrarFala = () => {
      alvo.textContent = texto;
      setFalando(false);
      pular.current = null;
      relogio = window.setTimeout(avancar, PAUSA);
    };

    const escrever = () => {
      i += 1;
      alvo.textContent = texto.slice(0, i);
      // `tocar` já respeita o botão de silêncio; aqui só decidimos o ritmo
      if (i % CARACTERES_POR_NOTA === 0) tocar("fala");
      if (i >= texto.length) return encerrarFala();
      relogio = window.setTimeout(escrever, VELOCIDADE);
    };

    pular.current = () => {
      clearTimeout(relogio);
      encerrarFala();
    };

    relogio = window.setTimeout(escrever, VELOCIDADE);

    return () => {
      clearTimeout(relogio);
      pular.current = null;
    };
  }, [visivel, indice, conversa, falaAtual.texto, semAnimacao, tocar]);

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

  const humor: Humor = falando ? "falando" : (falaAtual.humor ?? "feliz");

  return (
    <div
      className={`fixed bottom-6 left-6 z-[60] flex w-[min(21rem,calc(100vw-3rem))] items-end gap-2 transition-all duration-450 ${
        saindo ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        animation: saindo || semAnimacao ? undefined : "est-entrada 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className={semAnimacao ? "shrink-0" : "shrink-0 animate-float"}>
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
        /*
          `flex-1` é o que trava a largura.
          Sem isso o balão se ajusta ao texto — e como o texto nasce com uma
          letra e cresce até a frase inteira, a caixa aparecia do tamanho de um
          caractere e ia inchando. No celular ficava evidente: um quadradinho
          com "D" dentro, crescendo aos saltos a cada letra digitada.
        */
        className="hairline relative min-w-0 flex-1 rounded-2xl rounded-bl-sm border p-4 shadow-2xl"
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
          /*
            24 px era pequeno demais: o Lighthouse reprova área de toque abaixo
            de 24×24 COM folga ao redor, e um X de 24 px encostado na borda do
            balão não tem folga nenhuma. Em dedo de verdade, errar o alvo e
            fechar sem querer o convite é pior ainda. 36 px resolve os dois.
          */
          className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full text-faint transition-colors hover:text-[var(--fg)]"
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
          ref={textoRef}
          className={`min-h-[3.2rem] pr-6 text-[0.92rem] leading-relaxed ${falando ? "est-cursor" : ""}`}
          aria-live="polite"
          aria-atomic="true"
        />

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
        /*
          O cursor é pseudo-elemento porque o texto agora é escrito direto no
          DOM: um elemento irmão dentro do mesmo parágrafo seria apagado a cada
          escrita. Como ::after, ele acompanha o fim da frase sem fazer parte
          do conteúdo, e sem entrar no que o leitor de tela lê.
        */
        .est-cursor::after {
          content: "▍";
          opacity: 0.55;
          animation: est-piscar 0.9s steps(1) infinite;
        }
        @keyframes est-piscar { 0%, 49% { opacity: 0.55; } 50%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}
