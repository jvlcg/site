import { createElement, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
};

/** Wrapper server-safe: marca o elemento para o reveal progressivo no scroll. */
export function Reveal({ children, as = "div", delay = 0, className = "", id }: RevealProps) {
  return createElement(
    as,
    {
      id,
      "data-reveal": true,
      className,
      style: delay ? { "--reveal-delay": `${delay}ms` } : undefined,
    },
    children
  );
}
