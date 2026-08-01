"use client";

import { useSom } from "@/components/providers/SoundProvider";

/**
 * Liga e desliga o som da interface.
 *
 * `variant="row"` é a versão do menu no celular, com rótulo escrito — em tela
 * de toque não há hover para revelar o que o ícone faz.
 */
export function SoundToggle({ variant = "icon" }: { variant?: "icon" | "row" }) {
  const { ativo, alternar } = useSom();
  const acao = ativo ? "Desativar som e música ambiente" : "Ativar som e música ambiente";

  const icone = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {ativo ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <path d="M17 9.5l4 5M21 9.5l-4 5" />
      )}
    </svg>
  );

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={alternar}
        aria-pressed={ativo}
        aria-label={acao}
        className="hairline flex w-full items-center justify-between border-b py-4 font-display text-2xl font-medium"
      >
        <span>{ativo ? "Som ligado" : "Som desligado"}</span>
        <span
          aria-hidden="true"
          className="glass relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          {icone}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={acao}
      aria-pressed={ativo}
      title={acao}
      onClick={alternar}
      className={`glass relative hidden h-10 w-10 items-center justify-center rounded-full ring-1 transition-all hover:scale-105 sm:flex ${
        ativo
          ? "text-[var(--accent)] ring-[var(--accent)]"
          : "ring-[color-mix(in_srgb,var(--fg)_20%,transparent)] hover:ring-[var(--accent)]"
      }`}
    >
      {icone}
    </button>
  );
}
