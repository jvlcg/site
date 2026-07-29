/**
 * Gera os arquivos de marca a partir de lib/brand-geometry.ts — a MESMA fonte
 * que o componente React usa, para que site, favicon e mídias nunca divirjam.
 * (Node importa o .ts direto, removendo os tipos.)
 *
 *   node scripts/gen-brand.mjs
 *
 * Saída: public/brand/ (SVG + PNG) e os ícones do PWA em public/.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
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
} from "../lib/brand-geometry.ts";

const OUT = "public/brand";
const FUNDO_ESCURO = { r: 10, g: 14, b: 18, alpha: 1 };

/**
 * @param {string} fg cor do anel (adapta ao tema)
 * @param {string|null} mono cor única, ou null para o gradiente da marca
 * @param {boolean} anel desenha o anel externo
 */
export function markSvg(fg = "#EDF2F4", mono = null, anel = true) {
  const paint = mono ?? "url(#g)";
  const arestas = SYNAPSE_EDGES.map(
    ([a, b]) =>
      `<line x1="${SYNAPSE_NODES[a][0]}" y1="${SYNAPSE_NODES[a][1]}" x2="${SYNAPSE_NODES[b][0]}" y2="${SYNAPSE_NODES[b][1]}"/>`
  ).join("");
  const nos = SYNAPSE_NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${SYNAPSE_NODE_R}" fill="black"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${BRAND_FROM}"/><stop offset="100%" stop-color="${BRAND_TO}"/></linearGradient>
<clipPath id="c"><circle cx="50" cy="50" r="45"/></clipPath>
<mask id="m"><rect width="100" height="100" fill="white"/><g stroke="black" stroke-width="${SYNAPSE_EDGE_W}" stroke-linecap="round" fill="none">${arestas}</g>${nos}<path transform="${JV_TF}" d="${JV_PATH}" fill="black"/></mask>
</defs>${anel ? `<circle cx="50" cy="50" r="46.3" fill="none" stroke="${fg}" stroke-opacity="0.32" stroke-width="1.3"/>` : ""}
<g clip-path="url(#c)" mask="url(#m)"><path transform="${HEAD_TF}" d="${HEAD_PATH}" fill="${paint}"/></g></svg>`;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const variantes = {
    escuro: markSvg("#EDF2F4"),
    claro: markSvg("#0F172A"),
    mono: markSvg("#0F172A", "#0F172A"),
    "sem-anel": markSvg("#EDF2F4", null, false),
  };

  for (const [nome, svg] of Object.entries(variantes)) {
    await writeFile(`${OUT}/drjv-${nome}.svg`, svg);
    for (const s of [1024, 512, 192]) {
      await sharp(Buffer.from(svg), { density: 900 }).resize(s, s).png().toFile(`${OUT}/drjv-${nome}-${s}.png`);
    }
  }

  // ícones do app (fundo sólido — lojas e abas não aceitam transparência)
  const svg = markSvg("#EDF2F4");
  for (const [file, size] of [
    ["public/icon-512.png", 512],
    ["public/icon-192.png", 192],
    ["app/apple-icon.png", 180],
  ]) {
    await sharp(Buffer.from(svg), { density: 900 })
      .resize(size, size)
      .flatten({ background: FUNDO_ESCURO })
      .png()
      .toFile(file);
  }

  // maskable: a marca precisa caber na zona segura (80%) do recorte do Android
  const inner = await sharp(Buffer.from(svg), { density: 900 }).resize(410, 410).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: FUNDO_ESCURO } })
    .composite([{ input: inner, left: 51, top: 51 }])
    .png()
    .toFile("public/icon-maskable.png");

  // favicon: o Next exige um arquivo estático, então ele sai daqui também —
  // com fundo arredondado, que é como as abas do navegador o exibem.
  await writeFile(
    "app/icon.svg",
    markSvg("#EDF2F4").replace(
      "</defs>",
      '</defs><rect width="100" height="100" rx="22" fill="#0a0e12"/>'
    )
  );

  console.log(`marca gerada: ${Object.keys(variantes).length} versões em ${OUT}/ + ícones do PWA + favicon`);
}

main();
