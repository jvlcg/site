"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Alternador de tema.
 *
 * `variant="row"` é a versão do menu no celular: linha larga com rótulo
 * escrito. O ícone sozinho basta no desktop, onde existe a dica ao passar o
 * mouse — mas em tela de toque não há hover, e sem o texto o botão passa
 * despercebido.
 */
export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "row" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const acao = mounted ? (isDark ? "Ativar modo claro" : "Ativar modo escuro") : "Alternar tema";
  const alternar = () => setTheme(isDark ? "light" : "dark");

  const icones = (
    <>
      {/* sol — visível no tema escuro, porque o clique leva ao claro */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${mounted && isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* lua — visível no tema claro, porque o clique leva ao escuro */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${mounted && !isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"}`}
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </>
  );

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={alternar}
        aria-label={acao}
        className="hairline flex w-full items-center justify-between border-b py-4 font-display text-2xl font-medium"
      >
        <span>{mounted && isDark ? "Modo claro" : "Modo escuro"}</span>
        <span
          aria-hidden="true"
          className="glass relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          {icones}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={acao}
      /* dica nativa ao passar o mouse — jeito mais barato de revelar o que o ícone faz */
      title={acao}
      onClick={alternar}
      className="glass relative flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-[color-mix(in_srgb,var(--fg)_20%,transparent)] transition-all hover:scale-105 hover:ring-[var(--accent)]"
    >
      {icones}
    </button>
  );
}
