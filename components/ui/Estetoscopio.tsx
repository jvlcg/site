"use client";

/**
 * Estetô — o personagem do consultório.
 *
 * Um estetoscópio com olhos: a oliva vira orelha, o tubo vira o corpo e o
 * diafragma vira a cabeça. Desenhado em SVG, e não como imagem, por três
 * razões: fica nítido em qualquer tela, não pesa nada e as expressões são
 * trocadas por propriedade em vez de exigir um arquivo por pose.
 *
 * Nada aqui imita um personagem existente. A ideia de "assistente com carinha"
 * é do gênero; o desenho é original.
 */

export type Humor = "normal" | "feliz" | "aceno" | "dormindo";

/**
 * `inteiro` mostra o personagem de corpo todo — é assim que ele se apresenta
 * quando tem espaço. `cabeca` corta na altura do diafragma.
 *
 * O corte existe porque abaixo de uns 40 px o corpo inteiro não se lê: o rosto
 * fica com poucos pixels e o desenho vira um borrão esverdeado. Num botão ou no
 * cabeçalho do chat, o que precisa ser reconhecido é a **cara**, não a anatomia
 * do estetoscópio.
 */
type Recorte = "inteiro" | "cabeca";

/** Caixa do rosto: o disco tem centro (44, 96) e raio 21, com folga para o traço. */
const CAIXA: Record<Recorte, { vb: string; proporcao: number }> = {
  inteiro: { vb: "0 0 100 120", proporcao: 1.2 },
  cabeca: { vb: "20 72 48 48", proporcao: 1 },
};

export function Estetoscopio({
  humor = "normal",
  tamanho = 84,
  recorte = "inteiro",
  className = "",
}: {
  humor?: Humor;
  tamanho?: number;
  recorte?: Recorte;
  className?: string;
}) {
  const olhoAberto = humor !== "dormindo";
  const { vb, proporcao } = CAIXA[recorte];

  return (
    <svg
      viewBox={vb}
      width={tamanho}
      height={tamanho * proporcao}
      className={className}
      role="img"
      aria-label="Estetô, o assistente do consultório"
    >
      <defs>
        <linearGradient id="est-tubo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-400, #34d399)" />
          <stop offset="100%" stopColor="var(--color-teal-flow, #2dd4bf)" />
        </linearGradient>
        <radialGradient id="est-disco" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8f2f0" />
          <stop offset="100%" stopColor="#c3d6d2" />
        </radialGradient>
      </defs>

      {/* olivas — as "orelhinhas" no alto */}
      <circle cx="24" cy="12" r="7" fill="url(#est-tubo)" />
      <circle cx="76" cy="12" r="7" fill="url(#est-tubo)" />

      {/*
        A haste em Y é o corpo. As duas curvas descem das olivas e se encontram,
        e é essa silhueta que faz o desenho ser reconhecido como estetoscópio
        antes mesmo de a pessoa reparar nos olhos.
      */}
      <path
        d="M24 18 C 24 44, 40 52, 50 58 C 60 52, 76 44, 76 18"
        fill="none"
        stroke="url(#est-tubo)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* braço que vai até o diafragma */}
      <path
        d="M50 58 C 50 70, 44 76, 44 84"
        fill="none"
        stroke="url(#est-tubo)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* diafragma: a cabeça */}
      <g className={humor === "aceno" ? "est-acena" : undefined} style={{ transformOrigin: "44px 96px" }}>
        <circle cx="44" cy="96" r="21" fill="url(#est-disco)" stroke="url(#est-tubo)" strokeWidth="4" />

        {olhoAberto ? (
          <g className="est-pisca">
            <circle cx="37" cy="93" r="4.2" fill="#0f172a" />
            <circle cx="51" cy="93" r="4.2" fill="#0f172a" />
            {/* o brilho é o que separa "olho" de "ponto preto" */}
            <circle cx="38.4" cy="91.5" r="1.5" fill="#ffffff" />
            <circle cx="52.4" cy="91.5" r="1.5" fill="#ffffff" />
          </g>
        ) : (
          <>
            <path d="M33 93 q4 3.5 8 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M47 93 q4 3.5 8 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}

        {/* boca */}
        {humor === "feliz" || humor === "aceno" ? (
          <path d="M37 102 q7 7 14 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        ) : humor === "dormindo" ? (
          <ellipse cx="44" cy="103" rx="3" ry="3.6" fill="#0f172a" opacity="0.75" />
        ) : (
          <path d="M39 102 q5 4 10 0" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        )}

        {/* bochechas: o toque que faz o desenho parecer simpático, e não clínico */}
        <circle cx="29" cy="100" r="3.4" fill="#f472b6" opacity="0.35" />
        <circle cx="59" cy="100" r="3.4" fill="#f472b6" opacity="0.35" />
      </g>

      {humor === "dormindo" && (
        <text x="70" y="74" fontSize="13" fill="var(--color-accent-400, #34d399)" opacity="0.8">
          z
        </text>
      )}

      <style>{`
        /* Piscar de vez em quando é o que transforma um desenho parado em
           alguém presente. Fica raro de propósito: piscar demais irrita. */
        .est-pisca { animation: est-blink 6.5s infinite; transform-origin: 44px 93px; }
        @keyframes est-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.1); }
        }
        .est-acena { animation: est-wave 1.6s ease-in-out infinite; }
        @keyframes est-wave {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-7deg); }
          75%      { transform: rotate(7deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .est-pisca, .est-acena { animation: none; }
        }
      `}</style>
    </svg>
  );
}
