"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/**
 * Aviso de cookies e medição de audiência.
 *
 * ## Por que isto existe, e por que num site de médico existe com mais razão
 *
 * O site usa Google Analytics. Até agora ele subia sozinho, sem avisar
 * ninguém — o que é o padrão da internet brasileira e continua sendo um risco
 * desnecessário aqui.
 *
 * A LGPD não exige "banner de cookie" com essas palavras; o que ela exige é
 * **base legal e transparência** para tratar dado pessoal, e identificador de
 * navegação é dado pessoal. Para medição de audiência caberia legítimo
 * interesse — mas legítimo interesse pede, no mínimo, aviso claro e um jeito
 * de recusar, e nenhum dos dois existia.
 *
 * O que muda o cálculo é o contexto: **quem visita este site pode estar
 * pesquisando a própria doença.** A página visitada revela, por dedução, um
 * interesse de saúde — e dado de saúde é categoria especial na LGPD, com
 * exigência maior. Não é que o Analytics receba diagnóstico; é que o rastro
 * "esta pessoa leu três vezes a página de cannabis medicinal" é mais sensível
 * num consultório do que numa loja de sapatos.
 *
 * Por isso aqui a escolha é **consentimento antes**, e não aviso depois: o
 * Analytics só sobe se a pessoa disser sim.
 *
 * ## O que NÃO fica atrás do consentimento
 *
 * Nada que o site precise para funcionar. Tema, som, sessão de aluno, o
 * identificador de quem já votou num artigo — tudo isso é cookie estritamente
 * necessário, não vai para terceiro nenhum, e continua funcionando com o aviso
 * na tela ou recusado. Pedir permissão para lembrar que a pessoa escolheu tema
 * escuro seria transformar transparência em burocracia.
 *
 * ## Detalhes de implementação que não são detalhe
 *
 * **Nada aparece antes da montagem.** Renderizar o aviso no HTML e escondê-lo
 * depois faria a barra piscar em toda visita, inclusive para quem já
 * respondeu — e piscar é pior do que aparecer.
 *
 * **A escolha fica em `localStorage`, não em cookie.** Guardar a recusa num
 * cookie seria responder "não quero ser marcado" criando uma marca.
 *
 * **Dá para mudar de ideia.** A decisão é revogável a qualquer momento pelo
 * link no rodapé — é direito expresso da LGPD, e sem caminho de volta o "sim"
 * vale menos.
 */

const CHAVE = "consentimento-medicao";

export type Escolha = "aceito" | "recusado";

/** Lê a escolha guardada. `null` = ainda não respondeu. */
export function escolhaGuardada(): Escolha | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    // navegação anônima com armazenamento bloqueado: trata como "não respondeu"
    return null;
  }
}

/**
 * Evento disparado quando a escolha muda.
 *
 * É o que permite ao Analytics subir **no mesmo instante** em que a pessoa
 * aceita, em vez de só na próxima página. Sem isso, quem aceita e sai não é
 * contado — e a pessoa teria clicado em "aceitar" para nada.
 */
export const EVENTO = "consentimento-mudou";

export function ConsentimentoCookies() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (escolhaGuardada() === null) setMostrar(true);
  }, []);

  const responder = useCallback((escolha: Escolha) => {
    try {
      localStorage.setItem(CHAVE, escolha);
    } catch {
      /* sem armazenamento, a escolha vale só nesta página */
    }
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: escolha }));
    setMostrar(false);
  }, []);

  if (!mostrar) return null;

  return (
    /*
      `data-flutuante` faz o aviso sumir junto com os outros quando o menu de
      toque abre — senão ele cobriria os últimos itens da lista em 390 px, que
      é o mesmo defeito já corrigido com o balão do mascote.

      `z-[70]`: acima dos mascotes e do WhatsApp, porque em celular ele divide
      a faixa de baixo com eles e precisa ser o que se lê primeiro.
    */
    <div
      data-flutuante=""
      role="dialog"
      aria-label="Aviso sobre medição de audiência"
      className="glass-solido fixed inset-x-3 bottom-3 z-[70] rounded-2xl border hairline p-5 shadow-lg sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
    >
      <p className="text-[0.92rem] leading-relaxed">
        Este site usa uma ferramenta de medição para saber quais páginas ajudam mais.
        Ela não recebe seu nome nem nada que você escreva aqui.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-faint">
        O que o site precisa para funcionar — tema, som e sua conta — não depende desta
        escolha.{" "}
        <Link href="/politica-de-privacidade" className="underline underline-offset-2">
          Política de privacidade
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button type="button" onClick={() => responder("aceito")} className="btn-primary !py-2.5 text-sm">
          Aceitar
        </button>
        {/*
          "Recusar" com o mesmo peso visual de "Aceitar", e não escondido num
          link cinza. Consentimento obtido por botão difícil de achar não é
          consentimento livre — e é exatamente o que a ANPD aponta como vício
          nos avisos que vê por aí.
        */}
        <button type="button" onClick={() => responder("recusado")} className="btn-ghost !py-2.5 text-sm">
          Recusar
        </button>
      </div>
    </div>
  );
}
