"use client";

import { useId } from "react";
import { site } from "@/lib/site-config";
import {
  BRAND_FROM,
  BRAND_TO,
  HEAD_CUT_Y,
  HEAD_PATH,
  HEAD_TF,
  JV_PATH,
  JV_TF,
} from "@/lib/brand-geometry";

/**
 * Marca "Dr.JV" (provisória).
 *
 * A silhueta é o perfil real do Dr. José Victor, vetorizado da foto em
 * contraluz, cortado logo abaixo do pescoço e centralizado no anel com folga.
 *
 * O monograma "JV" (Space Grotesk Bold, a fonte de display do site) é vazado
 * em espaço negativo: mostra o fundo da página através da cabeça. É isso que
 * faz a marca ler nos dois temas com um único arquivo — no escuro o "JV"
 * aparece escuro sobre o verde, no claro aparece claro sobre o verde, sempre
 * com contraste.
 */
export function LogoMark({
  className = "h-9 w-9",
  mono = false,
}: {
  className?: string;
  mono?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gid = `g${uid}`;
  const mid = `m${uid}`;
  const cid = `c${uid}`;
  const kid = `k${uid}`;

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={site.shortName}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND_FROM} />
          <stop offset="100%" stopColor={BRAND_TO} />
        </linearGradient>
        {/* corta o busto no espaço nativo da silhueta, antes da transformação */}
        <clipPath id={kid}>
          <rect x="0" y="0" width="800" height={HEAD_CUT_Y} />
        </clipPath>
        <clipPath id={cid}>
          <circle cx="50" cy="50" r="45" />
        </clipPath>
        <mask id={mid}>
          <rect width="100" height="100" fill="white" />
          <path transform={JV_TF} d={JV_PATH} fill="black" />
        </mask>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="46.3"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1.3"
      />
      <g clipPath={`url(#${cid})`} mask={`url(#${mid})`}>
        <g transform={HEAD_TF} clipPath={`url(#${kid})`}>
          <path d={HEAD_PATH} fill={mono ? "currentColor" : `url(#${gid})`} />
        </g>
      </g>
    </svg>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shrink-0 text-[var(--fg)]" />
      <span className={`flex-col leading-tight ${compact ? "hidden sm:flex" : "flex"}`}>
        <span className="font-display text-[1.02rem] font-semibold tracking-tight">Dr.JV</span>
        <span className="whitespace-nowrap text-[0.6rem] uppercase tracking-[0.14em] text-faint">
          José Victor · {site.crm}
        </span>
      </span>
    </span>
  );
}
