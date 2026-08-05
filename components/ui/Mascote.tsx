"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSom } from "@/components/providers/SoundProvider";
import type { Mascote as Personagem } from "@/content/mascotes";
import type { Humor } from "./Estetoscopio";

/**
 * O motor de conversa dos mascotes.
 *
 * Um componente só, usado pelos dois personagens. Antes isto era o Estetô e
 * mais nada; virou genérico quando o Termô entrou, porque duplicar o arquivo
 * significaria manter duas cópias de temporização, som, digitação e
 * acessibilidade — e a segunda cópia começaria a divergir na primeira correção
 * feita só de um lado.
 *
 * A referência é o assistente do Windows antigo: personagem no canto, balão de
 * fala, texto que sai aos poucos com um somzinho por sílaba.
 *
 * **Eles aparecem em toda visita, em toda recarga e em toda página** — decisão
 * do Dr. José Victor. Não há memória de "já viu": cada carregamento é uma
 * chegada nova.
 *
 * O que sobra do cuidado original, e que segue valendo:
 *
 * 1. **Não aparece no instante em que a página abre.** Espera a pessoa começar
 *    a ler — meia tela de rolagem, ou alguns segundos.
 * 2. **Fala e se cala.** Diz o que tem para dizer, faz o convite e some
 *    sozinho se ninguém responder.
 * 3. **Nunca prende ninguém.** O X está lá desde o primeiro instante, e um
 *    toque no balão pula a digitação inteira.
 * 4. **Não atrapalha quem já decidiu:** somem da própria página de cadastro,
 *    da área restrita e do cancelamento de avisos.
 */

/**
 * Rotas em que eles não entram. Não é para "poupar" a pessoa: é que nas três o
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

/**
 * O contador que faz a alternância acontecer, guardado fora do componente.
 *
 * Fora de propósito: o React zera o estado a cada troca de rota, e é
 * justamente entre uma página e outra que a alternância precisa ser lembrada.
 * Uma chave por personagem, para que o Estetô e o Termô alternem cada um no
 * seu ritmo em vez de andarem sempre em par.
 */
const vezes = new Map<string, number>();

type Props = {
  personagem: Personagem;
  /** O desenho. Recebe humor e tamanho — os dois têm a mesma assinatura. */
  Desenho: (p: { humor?: Humor; tamanho?: number; className?: string }) => React.ReactNode;
  /** Quando `false`, ele não entra em cena. Quem coordena os dois é o pai. */
  ativo?: boolean;
  /** Segundos até aparecer, no computador. */
  esperaSegundos?: number;
  /** Avisa o pai que a conversa acabou — ou que a pessoa fechou. */
  aoSair?: () => void;
};

export function Mascote({
  personagem,
  Desenho,
  ativo = true,
  esperaSegundos = 4,
  aoSair,
}: Props) {
  const caminho = usePathname();
  const { tocar } = useSom();

  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);
  /**
   * A missão desta aparição, decidida na hora de aparecer: a própria do
   * personagem, ou o convite para agendar. Alterna a cada vez.
   */
  const [missao, setMissao] = useState(personagem.propria);
  const [conversa, setConversa] = useState(personagem.propria.conversas[0]);
  const [indice, setIndice] = useState(0);
  const [terminou, setTerminou] = useState(false);
  /**
   * Muda duas vezes por frase — ao começar e ao terminar de falar. É o que
   * abre e fecha a boca. A letra a letra NÃO passa por aqui.
   */
  const [falando, setFalando] = useState(false);
  /**
   * Quem pediu menos movimento continua vendo o personagem — só não vê a
   * digitação. Esconder seria tirar dessa pessoa o convite que todo mundo
   * recebe; o que incomoda ali é a animação, não a existência dele.
   */
  const [semAnimacao, setSemAnimacao] = useState(false);

  const jaMostrou = useRef(false);
  const textoRef = useRef<HTMLParagraphElement>(null);
  /** Guardada pelo efeito de digitação; um toque no balão a chama. */
  const pular = useRef<(() => void) | null>(null);
  const avisou = useRef(false);
  const falaAtual = conversa[indice];

  /** O pai só é avisado uma vez, mesmo que saída e término se cruzem. */
  const avisarSaida = useCallback(() => {
    if (avisou.current) return;
    avisou.current = true;
    aoSair?.();
  }, [aoSair]);

  const encerrar = useCallback(() => {
    setSaindo(true);
    avisarSaida();
    setTimeout(() => setVisivel(false), 450);
  }, [avisarSaida]);

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
    avisou.current = false;
    setVisivel(false);
    setSaindo(false);
    setIndice(0);
    setTerminou(false);
    setFalando(false);
    // o parágrafo é escrito direto no DOM, então limpar é aqui e não por estado
    if (textoRef.current) textoRef.current.textContent = "";

    if (!ativo) return;
    if (ROTAS_SEM_MASCOTE.some((r) => caminho.startsWith(r))) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSemAnimacao(reduzido);

    const mostrar = () => {
      if (jaMostrou.current) return;
      jaMostrou.current = true;

      /**
       * Alterna a missão e sorteia a conversa dentro dela.
       *
       * Alternar em vez de sortear entre as duas missões garante que ninguém
       * receba o mesmo pedido três vezes seguidas — e que quem navega por
       * algumas páginas veja os dois convites, não só o mais sorteado.
       */
      const n = (vezes.get(personagem.nome) ?? 0) + 1;
      vezes.set(personagem.nome, n);
      const alvo = n % 2 === 1 ? personagem.propria : personagem.agenda;
      setMissao(alvo);
      setConversa(alvo.conversas[Math.floor(Math.random() * alvo.conversas.length)]);
      setVisivel(true);
    };

    /**
     * Meia tela de rolagem basta — distingue "está lendo" de "abriu e saiu",
     * sem adiar tanto que a pessoa clique antes de ele aparecer.
     */
    const porRolagem = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > window.innerHeight * 0.5) return mostrar();
      if (total > 0 && window.scrollY / total > 0.1) mostrar();
    };

    window.addEventListener("scroll", porRolagem, { passive: true });

    /**
     * No celular ele espera um sinal de vida — toque, rolagem, clique — ou
     * dez segundos.
     *
     * A fala escreve uma letra a cada 26 ms durante uns quatro segundos. Num
     * aparelho modesto isso é a thread ocupada justamente enquanto a pessoa lê
     * o título, e foi o que o Lighthouse mediu como página travada. No
     * computador continua nos poucos segundos: lá a digitação não disputa com
     * nada.
     */
    const noCelular = window.matchMedia("(pointer: coarse)").matches;
    let soltarGesto: (() => void) | null = null;
    const sinais = ["pointerdown", "touchstart", "keydown"] as const;

    if (noCelular) {
      soltarGesto = () => {
        sinais.forEach((s) => window.removeEventListener(s, soltarGesto!));
        mostrar();
      };
      sinais.forEach((s) => window.addEventListener(s, soltarGesto!, { once: true, passive: true }));
    }

    const porTempo = setTimeout(mostrar, noCelular ? 10_000 : esperaSegundos * 1000);

    return () => {
      window.removeEventListener("scroll", porRolagem);
      clearTimeout(porTempo);
      if (soltarGesto) sinais.forEach((s) => window.removeEventListener(s, soltarGesto!));
    };
  }, [caminho, ativo, esperaSegundos, personagem]);

  /**
   * A digitação, letra a letra, com a voz junto — escrita direto no DOM.
   *
   * Por estado do React, cada caractere disparava uma renderização do
   * componente inteiro, personagem em SVG incluído, com seus gradientes. São
   * cerca de 150 letras por conversa: 150 reconciliações completas em quatro
   * segundos, bem no meio da janela que o Lighthouse mede. Foi isso que levou
   * o tempo de bloqueio a 1.650 ms — o site parecia lento porque, naquele
   * instante, estava.
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
    // avisa o pai assim que termina, para o outro poder entrar sem esperar
    avisarSaida();
    const some = setTimeout(() => setSaindo(true), 30_000);
    const fim = setTimeout(() => setVisivel(false), 30_450);
    return () => {
      clearTimeout(some);
      clearTimeout(fim);
    };
  }, [terminou, avisarSaida]);

  if (!visivel) return null;

  const humor: Humor = falando ? "falando" : (falaAtual.humor ?? "feliz");
  const acao = missao.acao;

  return (
    <div
      className={`flex w-[min(16.5rem,calc(100vw-5.5rem))] items-end gap-1.5 transition-all duration-450 sm:w-[min(21rem,calc(100vw-3rem))] sm:gap-2 ${
        saindo ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        animation: saindo || semAnimacao ? undefined : "est-entrada 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/*
        No celular o personagem encolhe de 68 para 44 px de largura. Ele e o
        balão juntos ocupavam quase metade da tela de um telefone, e um convite
        que cobre o que a pessoa está lendo deixa de ser convite. A escala é por
        CSS, não pela propriedade `tamanho`: assim o mesmo elemento serve os
        dois tamanhos sem renderizar de novo ao girar a tela.
      */}
      <div className={semAnimacao ? "shrink-0" : "shrink-0 animate-float"}>
        <Desenho humor={humor} tamanho={68} className="h-auto w-11 sm:w-[68px]" />
      </div>

      {/*
        O balão é OPACO, não de vidro. O vidro é bonito sobre uma imagem, mas
        isto flutua sobre texto corrido — e ali a transparência faz as letras de
        trás atravessarem as da frente. Entre o efeito e a leitura, a leitura
        ganha sempre.
      */}
      <div
        onClick={adiantar}
        /*
          `flex-1` é o que trava a largura. Sem isso o balão se ajusta ao texto
          — e como o texto nasce com uma letra e cresce até a frase inteira, a
          caixa aparecia do tamanho de um caractere e ia inchando.
        */
        className="hairline relative min-w-0 flex-1 rounded-2xl rounded-bl-sm border p-3 shadow-2xl sm:p-4"
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
          aria-label={personagem.fecharRotulo}
          /*
            24 px era pequeno demais: o Lighthouse reprova área de toque abaixo
            de 24×24 COM folga ao redor, e um X de 24 px encostado na borda do
            balão não tem folga nenhuma. Em dedo de verdade, errar o alvo e
            fechar sem querer o convite é pior ainda. 36 px resolve os dois.
          */
          className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-faint transition-colors hover:text-[var(--fg)] sm:right-1.5 sm:top-1.5"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/*
          `aria-live="polite"` faz o leitor de tela anunciar cada fala quando ela
          termina. Sem isso, quem não enxerga a tela não saberia que existe
          alguém falando ali — e o texto que aparece letra a letra seria lido de
          forma ininteligível.
        */}
        <p
          ref={textoRef}
          className={`min-h-[2.6rem] pr-7 text-[0.84rem] leading-snug sm:min-h-[3.2rem] sm:text-[0.92rem] sm:leading-relaxed ${falando ? "est-cursor" : ""}`}
          aria-live="polite"
          aria-atomic="true"
        />

        {/*
          Os botões só entram quando a conversa acaba. Aparecendo antes, a
          pessoa clicaria no meio da frase — e o convite ficaria pela metade.
        */}
        {terminou && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-3" style={{ animation: "est-entrada 0.4s ease-out" }}>
            {acao.externo ? (
              /*
                O convite de agendar sai para a ponte `/agendar`, em aba nova,
                como todo botão de agendamento do site. Passar por lá é o que
                permite contar a conversão no Google Ads.
              */
              <a
                href={acao.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={encerrar}
                className="btn-primary !px-3.5 !py-2 text-[0.78rem] sm:!px-4 sm:text-[0.82rem]"
              >
                {acao.rotulo}
              </a>
            ) : (
              <Link
                href={acao.href}
                onClick={encerrar}
                className="btn-primary !px-3.5 !py-2 text-[0.78rem] sm:!px-4 sm:text-[0.82rem]"
              >
                {acao.rotulo}
              </Link>
            )}
            <button
              type="button"
              onClick={encerrar}
              className="text-[0.76rem] text-faint underline underline-offset-4 transition-colors hover:text-[var(--fg)] sm:text-[0.8rem]"
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
          O cursor é pseudo-elemento porque o texto é escrito direto no DOM: um
          elemento irmão dentro do mesmo parágrafo seria apagado a cada escrita.
          Como ::after, ele acompanha o fim da frase sem fazer parte do
          conteúdo, e sem entrar no que o leitor de tela lê.
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
