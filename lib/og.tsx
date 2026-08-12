import { ImageResponse } from "next/og";
import { site } from "./site-config";

/**
 * A imagem que aparece quando alguém compartilha um link do site.
 *
 * ## Por que uma por página
 *
 * Antes existia só a imagem geral da marca, e ela ia junto de qualquer link.
 * Quem mandasse a página de telemedicina no WhatsApp e quem mandasse a de
 * cannabis medicinal produziam **o mesmo cartão** — a pessoa do outro lado via
 * "Dr. José Victor" e nada sobre o que estava recebendo.
 *
 * Isso importa mais do que parece porque é assim que o site circula de
 * verdade: paciente manda para parente, médico manda para colega, e o cartão
 * é a única coisa que a maioria lê antes de decidir se abre. Um cartão que
 * diz "Cannabis medicinal — indicação, prescrição e acompanhamento" é uma
 * frase de apresentação; o cartão genérico é um logotipo.
 *
 * ## Por que gerada e não desenhada à mão
 *
 * Doze imagens feitas em editor seriam doze arquivos para manter em sincronia
 * com o texto do site — e ficariam desatualizadas na primeira mudança de
 * título. Geradas a partir do mesmo dado, acompanham sozinhas.
 *
 * ## Detalhes que o desenhista do `next/og` impõe
 *
 * Ele não é um navegador: aceita um subconjunto de CSS e reclama de coisas que
 * funcionam em qualquer página. Os dois tropeços que já custaram tempo aqui
 * estão marcados no código — cor de fundo separada do gradiente, e texto num
 * nó só.
 */

export const TAMANHO_OG = { width: 1200, height: 630 };

/**
 * Sem `runtime = "edge"` de propósito.
 *
 * O edge impede que a imagem seja gerada no build: ela passaria a ser
 * desenhada a cada acesso, gastando invocação e fazendo o robô do WhatsApp
 * esperar. No Node ela é gerada uma vez e servida como arquivo estático.
 */
export function imagemOg(opcoes: { eyebrow: string; titulo: string; linha?: string }) {
  const { eyebrow, titulo, linha } = opcoes;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          /*
            Cor de fundo e gradiente em propriedades separadas: no atalho
            `background`, o desenhista tenta ler a cor sólida final como se
            fosse mais uma camada de imagem e recusa.
          */
          backgroundColor: "#0a0e12",
          backgroundImage:
            "radial-gradient(circle at 78% 18%, #0d3b34 0%, transparent 55%), radial-gradient(circle at 12% 88%, #0a2e3a 0%, transparent 55%)",
          color: "#edf2f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #34d399, #2dd4bf)",
              color: "#06231d",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            JV
          </div>
          {/* texto num nó só: `{variável} texto` vira dois nós, e aí o
              desenhista passa a exigir `display` explícito na caixa */}
          <div style={{ fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#9fb0bf" }}>
            {`${site.crm} · ${site.address.city}-${site.address.state}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#2dd4bf",
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
          {/*
            O título usa o gradiente da marca, e o tamanho encolhe quando o
            texto é longo. Sem isso, um título de cinco palavras estoura a
            caixa e o desenhista corta o final sem avisar — o cartão sai com
            meia frase.
          */}
          <div
            style={{
              fontSize: titulo.length > 34 ? 56 : 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              background: "linear-gradient(100deg, #10b981, #2dd4bf)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 1000,
            }}
          >
            {titulo}
          </div>
          {linha && (
            <div style={{ marginTop: 24, fontSize: 30, color: "#9fb0bf", maxWidth: 940 }}>
              {linha}
            </div>
          )}
        </div>

        <div style={{ fontSize: 24, color: "#6b7c8c" }}>
          {`${site.name} · Presencial em Goiânia e telemedicina para todo o Brasil`}
        </div>
      </div>
    ),
    TAMANHO_OG
  );
}
