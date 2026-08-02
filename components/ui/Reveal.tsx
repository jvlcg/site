import { createElement, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
  /**
   * Para o conteúdo que já está na tela quando a página abre.
   *
   * O reveal normal espera duas coisas: o JavaScript hidratar (para pôr
   * `.reveal-ready` no `<html>`) e o IntersectionObserver disparar. Até lá o
   * elemento fica em `opacity: 0` — e o Chrome só registra o LCP quando o
   * elemento aparece de fato. Era isso que o PageSpeed mostrava como "atraso
   * na renderização do elemento: 730 ms", com o `<h1>` do topo como elemento
   * de LCP: o título já estava pronto no HTML e ficava escondido esperando
   * script.
   *
   * Com `imediato`, a mesma entrada acontece por animação CSS, que começa
   * assim que o navegador lê o estilo — sem esperar nada. A animação é idêntica
   * aos olhos; o que muda é que ela não depende mais de JavaScript.
   *
   * Use apenas acima da dobra. Abaixo dela o reveal por rolagem é o certo:
   * animar o que ninguém está vendo é gasto sem efeito.
   */
  imediato?: boolean;
};

/** Wrapper server-safe: marca o elemento para o reveal progressivo no scroll. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
  id,
  imediato = false,
}: RevealProps) {
  return createElement(
    as,
    {
      id,
      ...(imediato ? {} : { "data-reveal": true }),
      className: imediato ? `reveal-imediato ${className}`.trim() : className,
      style: delay ? { "--reveal-delay": `${delay}ms` } : undefined,
    },
    children
  );
}
