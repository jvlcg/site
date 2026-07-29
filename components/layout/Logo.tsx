"use client";

import { useId } from "react";
import { site } from "@/lib/site-config";
import {
  BRAND_FROM,
  BRAND_TO,
  HEAD_PATH,
  HEAD_TF,
  JV_PATH,
  JV_TF,
  SYNAPSE_EDGES,
  SYNAPSE_EDGE_W,
  SYNAPSE_NODES,
  SYNAPSE_NODE_R,
} from "@/lib/brand-geometry";

/**
 * Marca "Dr.JV".
 *
 * A silhueta é o perfil real do Dr. José Victor, vetorizado da foto em
 * contraluz e enquadrado como foto de perfil — coroa perto do topo do anel e
 * um pouco de pescoço saindo pela base, recortado pelo círculo.
 *
 * A rede de sinapses e o monograma "JV" (Space Grotesk Bold, a fonte de
 * display do site) são vazados em espaço negativo: mostram o fundo da página
 * através da cabeça. É isso que faz a marca ler nos dois temas com um único
 * arquivo — no escuro o "JV" aparece escuro sobre o verde, no claro aparece
 * claro sobre o verde, sempre com contraste.
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

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={site.shortName}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND_FROM} />
          <stop offset="100%" stopColor={BRAND_TO} />
        </linearGradient>
        <clipPath id={cid}>
          <circle cx="50" cy="50" r="45" />
        </clipPath>
        <mask id={mid}>
          <rect width="100" height="100" fill="white" />
          <g
            stroke="black"
            strokeWidth={SYNAPSE_EDGE_W}
            strokeLinecap="round"
            fill="none"
          >
            {SYNAPSE_EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={SYNAPSE_NODES[a][0]}
                y1={SYNAPSE_NODES[a][1]}
                x2={SYNAPSE_NODES[b][0]}
                y2={SYNAPSE_NODES[b][1]}
              />
            ))}
          </g>
          {SYNAPSE_NODES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={SYNAPSE_NODE_R} fill="black" />
          ))}
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
        <path transform={HEAD_TF} d={HEAD_PATH} fill={mono ? "currentColor" : `url(#${gid})`} />
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
