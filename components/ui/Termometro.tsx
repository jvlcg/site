"use client";

import type { Humor } from "./Estetoscopio";

/**
 * Termô — o personagem dos cursos.
 *
 * Um termômetro clínico com olhos: o bulbo vira a cabeça e a haste vira o
 * corpo. Irmão do Estetô, e de propósito — mesma linguagem de desenho (traço
 * grosso, olho com brilho, bochecha rosada, mesmo tamanho de rosto), para que
 * os dois se leiam como da mesma família em vez de dois desenhos avulsos que
 * calharam de aparecer juntos.
 *
 * A escolha do termômetro não é decorativa: ele mede, e curso é sobre entender
 * o que os números querem dizer. O Estetô escuta o paciente; o Termô mede.
 *
 * ## Por que a caixa é a mesma do Estetô
 *
 * `viewBox="0 0 100 120"` e rosto centrado em (44, 96), raio 21 — idênticos.
 * Isso faz os dois ocuparem exatamente o mesmo espaço com o mesmo `tamanho`,
 * e é o que permite trocá-los de lugar sem a caixa do balão pular. Num
 * revezamento, um pixel de diferença aparece como tremor a cada troca.
 */

/** A coluna de mercúrio sobe quando ele está animado. É a "expressão" do corpo. */
const NIVEL: Record<Humor, number> = {
  normal: 52,
  feliz: 40,
  aceno: 34,
  falando: 44,
  dormindo: 66,
};

export function Termometro({
  humor = "normal",
  tamanho = 84,
  className = "",
}: {
  humor?: Humor;
  tamanho?: number;
  className?: string;
}) {
  const olhoAberto = humor !== "dormindo";
  const topo = NIVEL[humor];

  return (
    <svg
      viewBox="0 0 100 120"
      width={tamanho}
      height={tamanho * 1.2}
      className={className}
      role="img"
      aria-label="Termô, o assistente dos cursos"
    >
      <defs>
        <linearGradient id="ter-vidro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-400, #34d399)" />
          <stop offset="100%" stopColor="var(--color-teal-flow, #2dd4bf)" />
        </linearGradient>
        <radialGradient id="ter-bulbo" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8f2f0" />
          <stop offset="100%" stopColor="#c3d6d2" />
        </radialGradient>
        <linearGradient id="ter-coluna" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>

      {/* haste de vidro — o corpo */}
      <rect
        x="35"
        y="16"
        width="18"
        height="72"
        rx="9"
        fill="#ffffff"
        fillOpacity="0.55"
        stroke="url(#ter-vidro)"
        strokeWidth="4"
      />

      {/*
        A coluna sobe do bulbo até a altura do humor. `y` e `height` mudam
        juntos porque em SVG o retângulo cresce para baixo — para ele parecer
        subir, o topo precisa andar na mesma medida em que a altura aumenta.
      */}
      <rect
        className="ter-coluna"
        x="40"
        y={topo}
        width="8"
        height={86 - topo}
        rx="4"
        fill="url(#ter-coluna)"
      />

      {/* marcações da escala: três traços, o do meio mais longo */}
      {[30, 44, 58].map((y, i) => (
        <line
          key={y}
          x1="55"
          y1={y}
          x2={i === 1 ? 64 : 60}
          y2={y}
          stroke="url(#ter-vidro)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />
      ))}

      {/* bulbo: a cabeça */}
      <g className={humor === "aceno" ? "est-acena" : undefined} style={{ transformOrigin: "44px 96px" }}>
        <circle cx="44" cy="96" r="21" fill="url(#ter-bulbo)" stroke="url(#ter-vidro)" strokeWidth="4" />
        {/* o mercúrio do bulbo, atrás do rosto — é o que o liga à coluna */}
        <circle cx="44" cy="96" r="15" fill="url(#ter-coluna)" opacity="0.16" />

        {olhoAberto ? (
          <g className="est-pisca">
            <circle cx="37" cy="93" r="4.2" fill="#0f172a" />
            <circle cx="51" cy="93" r="4.2" fill="#0f172a" />
            <circle cx="38.4" cy="91.5" r="1.5" fill="#ffffff" />
            <circle cx="52.4" cy="91.5" r="1.5" fill="#ffffff" />
          </g>
        ) : (
          <>
            <path d="M33 93 q4 3.5 8 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M47 93 q4 3.5 8 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}

        {humor === "falando" ? (
          <ellipse className="est-boca" cx="44" cy="103" rx="4.6" ry="3.6" fill="#0f172a" opacity="0.85" />
        ) : humor === "feliz" || humor === "aceno" ? (
          <path d="M37 102 q7 7 14 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        ) : humor === "dormindo" ? (
          <ellipse cx="44" cy="103" rx="3" ry="3.6" fill="#0f172a" opacity="0.75" />
        ) : (
          <path d="M39 102 q5 4 10 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        )}

        <circle cx="29" cy="100" r="3.4" fill="#f472b6" opacity="0.35" />
        <circle cx="59" cy="100" r="3.4" fill="#f472b6" opacity="0.35" />
      </g>

      {humor === "dormindo" && (
        <text x="66" y="70" fontSize="13" fill="var(--color-accent-400, #34d399)" opacity="0.8">
          z
        </text>
      )}

      <style>{`
        /* A coluna se acomoda quando o humor muda — sem isso o mercúrio salta,
           e salto de líquido é a única coisa que um termômetro não faz. */
        .ter-coluna { transition: y 420ms ease-out, height 420ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .ter-coluna { transition: none; } }
      `}</style>
    </svg>
  );
}
