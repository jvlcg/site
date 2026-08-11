import { createElement, type ElementType } from "react";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
};

/**
 * Texto que acende palavra a palavra conforme sobe na tela.
 *
 * ## Por que é componente de servidor
 *
 * A quebra em palavras acontece na geração do HTML, não no navegador. O
 * arquivo não tem `"use client"` e não manda um byte de JavaScript: o que
 * chega ao visitante já são os `<span>` prontos, e quem anima é o CSS por
 * `animation-timeline` (ver `.texto-revela` em globals.css).
 *
 * A alternativa comum — dividir o texto com JavaScript depois que a página
 * carrega — custa duas coisas que este site não quer pagar: o script em si e
 * um salto de layout no instante em que o parágrafo é reescrito.
 *
 * ## O espaço entre as palavras
 *
 * Vai **dentro** do `<span>`, e não entre eles. Fora, o HTML minificado pode
 * comer o espaço e as palavras grudam. Dentro, ele é conteúdo do elemento e
 * sobrevive a qualquer minificador.
 *
 * A última palavra não leva espaço para não empurrar a pontuação nem criar
 * uma quebra de linha órfã no fim do parágrafo.
 *
 * ## Acessibilidade
 *
 * Leitor de tela lê `<span>` sequenciais como texto corrido, então a divisão
 * é invisível para quem ouve a página. O que **não** pode acontecer é a
 * palavra ficar em `opacity: 0`: quem chega com a rolagem restaurada no meio
 * da página veria um vazio. Por isso o repouso é 0,18 e não zero.
 */
export function TextoRevela({ children, as = "p", className = "" }: Props) {
  const palavras = children.split(" ");

  return createElement(
    as,
    { className: `texto-revela ${className}`.trim() },
    palavras.map((palavra, i) =>
      createElement(
        "span",
        { key: i, style: { "--i": i } as React.CSSProperties },
        i === palavras.length - 1 ? palavra : palavra + " "
      )
    )
  );
}
