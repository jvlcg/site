/**
 * Gera os arquivos de marca a partir da MESMA geometria do componente React
 * (components/layout/Logo.tsx), para que site, favicon e mídias nunca divirjam.
 *
 *   node scripts/gen-brand.mjs
 *
 * Saída: public/brand/ (SVG vetorial + PNGs) e os ícones do PWA em public/.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const HEAD =
  "M 48 9 C 62 9, 72.6 18, 74.6 31 C 75.7 38, 75.3 42.6, 74.3 46 C 73.5 48.6, 72.7 49.6, 73.5 51.6 C 75.7 55.6, 81 60, 80.8 62.3 C 80.6 64.3, 77 64.7, 74 64.9 C 72.6 65.1, 72 65.7, 72.2 66.7 C 72.4 67.7, 74.6 68.1, 74.6 69.5 C 74.6 71.1, 72.6 71.5, 72 72.7 C 71.4 74.3, 74.2 75.3, 74.6 77.9 C 74.9 80.4, 71 83.6, 64.5 85.6 C 61 86.7, 59.5 88.6, 59 92 L 36.5 92 C 36 84.5, 33.5 81, 30.5 77 C 27 71.6, 25.4 62, 25.4 52 C 25.4 26, 34 9, 48 9 Z";
const JV_J = "M 51.08 29 L 51.08 49.16 Q 51.08 57 43.24 55.43";
const JV_V = "M 57.24 29 L 63.4 57 L 69.56 29";

const TF = {
  retrato: { head: "translate(3.184 8.56) scale(0.88)", jv: "translate(2.016 6.788) scale(0.8087)", jvW: 5.4 },
  folga: { head: "translate(10.632 12.63) scale(0.74)", jv: "translate(9.65 11.14) scale(0.68)", jvW: 5.4 },
  livre: { head: "translate(-3.2 -0.5) scale(1)", jv: "translate(-4.527 -2.514) scale(0.9189)", jvW: 5.4 },
  contorno: { head: "translate(9.568 11.62) scale(0.76)", jv: "translate(8.559 10.85) scale(0.6984)", jvW: 5.2 },
  disco: { head: "translate(4.248 9.57) scale(0.86)", jv: "translate(3.107 7.838) scale(0.7903)", jvW: 5.4 },
  sinapses: { head: "translate(9.568 11.62) scale(0.76)", jv: "translate(11.729 14.026) scale(0.6422)", jvW: 5 },
};
const SYN_NODES = [
  [37.7, 34.4],
  [55.2, 32.1],
  [33.9, 47.3],
  [52.9, 51.1],
  [43.8, 59.5],
];
const SYN_EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [0, 3],
];

const GRAD =
  '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#2dd4bf"/></linearGradient>';

const jvG = (tf, stroke, w) =>
  `<g transform="${tf}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${JV_J}"/><path d="${JV_V}"/></g>`;

/** @param variant chave de TF  @param fg cor do anel/traço  @param mono cor única (ou null p/ gradiente) */
export function markSvg(variant, fg = "#EDF2F4", mono = null) {
  const t = TF[variant];
  const paint = mono ?? "url(#g)";
  const ring = (op) =>
    `<circle cx="50" cy="50" r="46.3" fill="none" stroke="${fg}" stroke-opacity="${op}" stroke-width="1.3"/>`;
  let defs = GRAD;
  let body = "";

  if (variant === "retrato" || variant === "folga" || variant === "livre") {
    defs += `<mask id="m"><rect width="100" height="100" fill="white"/>${jvG(t.jv, "black", t.jvW)}</mask>`;
    if (variant === "retrato") defs += '<clipPath id="c"><circle cx="50" cy="50" r="45"/></clipPath>';
    if (variant !== "livre") body += ring(0.3);
    const head = `<path d="${HEAD}" fill="${paint}" transform="${t.head}"/>`;
    body +=
      variant === "retrato"
        ? `<g clip-path="url(#c)" mask="url(#m)">${head}</g>`
        : `<g mask="url(#m)">${head}</g>`;
  } else if (variant === "disco") {
    defs += `<mask id="m"><rect width="100" height="100" fill="white"/><path d="${HEAD}" fill="black" transform="${t.head}"/>${jvG(t.jv, "white", t.jvW)}</mask>`;
    body += `<circle cx="50" cy="50" r="46" fill="${paint}" mask="url(#m)"/>`;
  } else if (variant === "contorno") {
    body += ring(0.24);
    body += `<path d="${HEAD}" fill="none" stroke="${paint}" stroke-width="${(3.4 / 0.76).toFixed(3)}" stroke-linejoin="round" transform="${t.head}"/>`;
    body += jvG(t.jv, fg, t.jvW);
  } else {
    body += ring(0.24);
    body += `<path d="${HEAD}" fill="none" stroke="${fg}" stroke-opacity="0.5" stroke-width="${(2.8 / 0.76).toFixed(3)}" stroke-linejoin="round" transform="${t.head}"/>`;
    body += `<g stroke="${paint}" stroke-width="0.9" opacity="0.7">${SYN_EDGES.map(
      ([a, b]) =>
        `<line x1="${SYN_NODES[a][0]}" y1="${SYN_NODES[a][1]}" x2="${SYN_NODES[b][0]}" y2="${SYN_NODES[b][1]}"/>`
    ).join("")}</g>`;
    body += SYN_NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.9" fill="${paint}"/>`).join("");
    body += jvG(t.jv, fg, t.jvW);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${defs}</defs>${body}</svg>`;
}

const OUT = "public/brand";

async function main() {
  await mkdir(OUT, { recursive: true });
  const variants = Object.keys(TF);

  for (const v of variants) {
    const escuro = markSvg(v, "#EDF2F4");
    const claro = markSvg(v, "#0F172A");
    const mono = markSvg(v, "#0F172A", "#0F172A");
    await writeFile(`${OUT}/drjv-${v}-escuro.svg`, escuro);
    await writeFile(`${OUT}/drjv-${v}-claro.svg`, claro);
    await writeFile(`${OUT}/drjv-${v}-mono.svg`, mono);
    for (const s of [512, 192]) {
      await sharp(Buffer.from(escuro), { density: 600 }).resize(s, s).png().toFile(`${OUT}/drjv-${v}-escuro-${s}.png`);
      await sharp(Buffer.from(claro), { density: 600 }).resize(s, s).png().toFile(`${OUT}/drjv-${v}-claro-${s}.png`);
    }
  }

  // ícones do app usam a variante ativa no site
  const ATIVA = "retrato";
  const svg = markSvg(ATIVA, "#EDF2F4");
  const fundo = { r: 10, g: 14, b: 18, alpha: 1 };
  for (const [file, size] of [
    ["public/icon-512.png", 512],
    ["public/icon-192.png", 192],
  ]) {
    await sharp(Buffer.from(svg), { density: 600 })
      .resize(size, size)
      .flatten({ background: fundo })
      .png()
      .toFile(file);
  }
  // maskable precisa de margem de segurança (safe zone de 80%)
  const inner = await sharp(Buffer.from(svg), { density: 600 }).resize(410, 410).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: fundo } })
    .composite([{ input: inner, left: 51, top: 51 }])
    .png()
    .toFile("public/icon-maskable.png");

  console.log(`marca gerada: ${variants.length} variantes em ${OUT}/ + ícones do PWA (variante "${ATIVA}")`);
}

main();
