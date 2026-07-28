"use client";

import { useId } from "react";
import { site } from "@/lib/site-config";

/**
 * Marca "Dr.JV" — perfil de cabeça com o monograma "JV" no crânio: a ideia que
 * o médico está pensando.
 *
 * O perfil é um traçado geométrico próprio (não o contorno bruto da foto, que
 * carregava ombros e detalhes de cabelo — virava um borrão abaixo de 40px).
 * Crânio, testa, nariz, lábios, queixo e pescoço são desenhados como curvas
 * limpas, de modo que a silhueta continua legível a 32px no favicon.
 *
 * Para trocar de variante, mude `LOGO_VARIANT` abaixo — todo o site, o favicon
 * e as imagens de compartilhamento acompanham.
 */

export type LogoVariant =
  | "retrato" // cabeça e pescoço recortados pelo anel
  | "folga" // cabeça inteira dentro do anel, com respiro
  | "livre" // sem anel
  | "contorno" // silhueta em linha, JV sólido
  | "disco" // disco cheio, cabeça e JV em negativo
  | "sinapses"; // contorno + rede de sinapses

export const LOGO_VARIANT: LogoVariant = "retrato";

/** Perfil virado para a direita. bbox x 25.4–81, y 9–92. */
const HEAD =
  "M 48 9 C 62 9, 72.6 18, 74.6 31 C 75.7 38, 75.3 42.6, 74.3 46 C 73.5 48.6, 72.7 49.6, 73.5 51.6 C 75.7 55.6, 81 60, 80.8 62.3 C 80.6 64.3, 77 64.7, 74 64.9 C 72.6 65.1, 72 65.7, 72.2 66.7 C 72.4 67.7, 74.6 68.1, 74.6 69.5 C 74.6 71.1, 72.6 71.5, 72 72.7 C 71.4 74.3, 74.2 75.3, 74.6 77.9 C 74.9 80.4, 71 83.6, 64.5 85.6 C 61 86.7, 59.5 88.6, 59 92 L 36.5 92 C 36 84.5, 33.5 81, 30.5 77 C 27 71.6, 25.4 62, 25.4 52 C 25.4 26, 34 9, 48 9 Z";

/** Monograma JV geométrico — independente de fonte (favicon, SVG de download). */
const JV_J = "M 51.08 29 L 51.08 49.16 Q 51.08 57 43.24 55.43";
const JV_V = "M 57.24 29 L 63.4 57 L 69.56 29";

/**
 * Transforms pré-calculados: a cabeça é posicionada por escala + centro, e o JV
 * é derivado do centro do crânio *depois* da transformação da cabeça, para que
 * o monograma acompanhe a silhueta em qualquer variante.
 */
const TF: Record<LogoVariant, { head: string; jv: string; jvW: number }> = {
  retrato: { head: "translate(3.184 8.56) scale(0.88)", jv: "translate(2.016 6.788) scale(0.8087)", jvW: 5.4 },
  folga: { head: "translate(10.632 12.63) scale(0.74)", jv: "translate(9.65 11.14) scale(0.68)", jvW: 5.4 },
  livre: { head: "translate(-3.2 -0.5) scale(1)", jv: "translate(-4.527 -2.514) scale(0.9189)", jvW: 5.4 },
  contorno: { head: "translate(9.568 11.62) scale(0.76)", jv: "translate(8.559 10.85) scale(0.6984)", jvW: 5.2 },
  disco: { head: "translate(4.248 9.57) scale(0.86)", jv: "translate(3.107 7.838) scale(0.7903)", jvW: 5.4 },
  sinapses: { head: "translate(9.568 11.62) scale(0.76)", jv: "translate(11.729 14.026) scale(0.6422)", jvW: 5 },
};

/** Nós/arestas da variante "sinapses", já no espaço do viewBox. */
const SYN_NODES: [number, number][] = [
  [37.7, 34.4],
  [55.2, 32.1],
  [33.9, 47.3],
  [52.9, 51.1],
  [43.8, 59.5],
];
const SYN_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [0, 3],
];

export function LogoMark({
  className = "h-9 w-9",
  mono = false,
  variant = LOGO_VARIANT,
}: {
  className?: string;
  mono?: boolean;
  variant?: LogoVariant;
}) {
  const uid = useId().replace(/:/g, "");
  const gid = `g${uid}`;
  const mid = `m${uid}`;
  const cid = `c${uid}`;
  const tf = TF[variant];
  const paint = mono ? "currentColor" : `url(#${gid})`;

  const jvStrokes = (stroke: string) => (
    <g
      transform={tf.jv}
      fill="none"
      stroke={stroke}
      strokeWidth={tf.jvW}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={JV_J} />
      <path d={JV_V} />
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={site.shortName}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>

        {/* JV recortado em espaço negativo na silhueta preenchida */}
        {(variant === "retrato" || variant === "folga" || variant === "livre") && (
          <mask id={mid}>
            <rect width="100" height="100" fill="white" />
            {jvStrokes("black")}
          </mask>
        )}
        {/* disco: cabeça e JV vazados do círculo */}
        {variant === "disco" && (
          <mask id={mid}>
            <rect width="100" height="100" fill="white" />
            <path d={HEAD} fill="black" transform={tf.head} />
            {jvStrokes("white")}
          </mask>
        )}
        {variant === "retrato" && (
          <clipPath id={cid}>
            <circle cx="50" cy="50" r="45" />
          </clipPath>
        )}
      </defs>

      {/* anel */}
      {variant !== "livre" && variant !== "disco" && (
        <circle
          cx="50"
          cy="50"
          r="46.3"
          fill="none"
          stroke="currentColor"
          strokeOpacity={variant === "contorno" || variant === "sinapses" ? 0.24 : 0.3}
          strokeWidth="1.3"
        />
      )}

      {variant === "retrato" && (
        <g clipPath={`url(#${cid})`} mask={`url(#${mid})`}>
          <path d={HEAD} fill={paint} transform={tf.head} />
        </g>
      )}

      {(variant === "folga" || variant === "livre") && (
        <g mask={`url(#${mid})`}>
          <path d={HEAD} fill={paint} transform={tf.head} />
        </g>
      )}

      {variant === "disco" && <circle cx="50" cy="50" r="46" fill={paint} mask={`url(#${mid})`} />}

      {variant === "contorno" && (
        <>
          <path
            d={HEAD}
            fill="none"
            stroke={paint}
            strokeWidth={3.4 / 0.76}
            strokeLinejoin="round"
            transform={tf.head}
          />
          {jvStrokes("currentColor")}
        </>
      )}

      {variant === "sinapses" && (
        <>
          <path
            d={HEAD}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth={2.8 / 0.76}
            strokeLinejoin="round"
            transform={tf.head}
          />
          <g stroke={paint} strokeWidth="0.9" opacity="0.7">
            {SYN_EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={SYN_NODES[a][0]}
                y1={SYN_NODES[a][1]}
                x2={SYN_NODES[b][0]}
                y2={SYN_NODES[b][1]}
              />
            ))}
          </g>
          {SYN_NODES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.9" fill={paint} />
          ))}
          {jvStrokes("currentColor")}
        </>
      )}
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
