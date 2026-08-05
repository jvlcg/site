/**
 * Baixa as capas das aulas do YouTube e guarda no próprio site.
 *
 * ## Por que hospedar em vez de apontar para o YouTube
 *
 * A miniatura vinha de `i.ytimg.com`. Funciona para a maioria e falha
 * silenciosamente para uma parte que não é pequena: bloqueador de anúncios,
 * extensão de privacidade e DNS filtrado barram o domínio junto com o resto do
 * Google. Quem tem qualquer um dos três via um retângulo vazio no lugar do
 * convite para assistir — e não tinha como saber por quê.
 *
 * Servida do nosso domínio, a capa não tem terceiro envolvido: não há o que
 * bloquear. De quebra, some uma requisição ao Google em toda visita à página de
 * cursos, o que é coerente com o resto do site — aqui o YouTube só entra em
 * cena depois que a pessoa clica em assistir.
 *
 * ## Como usar
 *
 *     node scripts/baixar-capas.mjs
 *
 * Lê `content/cursos.ts`, baixa o que falta em `public/capas/` e não refaz o
 * que já existe. Rode depois de publicar aulas novas e faça o commit das
 * imagens junto.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CURSOS } from "../content/cursos.ts";

const DESTINO = path.join(process.cwd(), "public", "capas");

/**
 * `maxresdefault` primeiro, `hqdefault` como reserva.
 *
 * O primeiro é 1280×720 limpo, mas **só existe se o vídeo foi enviado em HD**.
 * O segundo existe sempre e vem em 4:3, com tarjas pretas em cima e embaixo —
 * daí o recorte de 45 px de cada lado, que devolve o 16:9 verdadeiro.
 */
const FONTES = [
  { nome: "maxresdefault", recorte: null },
  { nome: "hqdefault", recorte: { left: 0, top: 45, width: 480, height: 270 } },
];

const aulas = CURSOS.flatMap((c) =>
  c.modulos.flatMap((m) =>
    m.aulas
      .filter((a) => a.video.tipo === "youtube")
      .map((a) => ({ id: a.video.id, titulo: a.titulo }))
  )
);

await fs.mkdir(DESTINO, { recursive: true });
let baixadas = 0;
let existentes = 0;

for (const aula of aulas) {
  const saida = path.join(DESTINO, `${aula.id}.webp`);
  try {
    await fs.access(saida);
    existentes++;
    continue;
  } catch {
    /* não existe: baixa */
  }

  let gravou = false;
  for (const fonte of FONTES) {
    const r = await fetch(`https://i.ytimg.com/vi/${aula.id}/${fonte.nome}.jpg`);
    if (!r.ok) continue;
    const bytes = Buffer.from(await r.arrayBuffer());

    /*
      O YouTube devolve 200 com uma imagem cinza de 120×90 quando o tamanho
      pedido não existe. Conferir a largura é o que separa "não tem" de "tem" —
      confiar no status gravaria um borrão cinza como capa.
    */
    const meta = await sharp(bytes).metadata();
    if ((meta.width ?? 0) < 400) continue;

    let img = sharp(bytes);
    if (fonte.recorte) img = img.extract(fonte.recorte);
    await img.resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82 }).toFile(saida);

    const { size } = await fs.stat(saida);
    console.log(`  ${aula.id}  ${fonte.nome.padEnd(13)} ${String(Math.round(size / 1024)).padStart(4)} KB  ${aula.titulo.slice(0, 45)}`);
    gravou = true;
    baixadas++;
    break;
  }

  if (!gravou) console.error(`  ${aula.id}  FALHOU — nenhuma miniatura utilizável`);
}

/*
  A lista das capas que existem, num módulo TypeScript.

  `capaDa()` roda também no navegador, onde não há disco para consultar — e o
  build precisa saber, sem I/O, se deve apontar para `/capas` ou cair no
  YouTube. Um arquivo gerado resolve os dois: é dado estático, entra no bundle
  e vai versionado junto das imagens.
*/
const presentes = (await fs.readdir(DESTINO))
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.replace(/\.webp$/, ""))
  .sort();

await fs.writeFile(
  path.join(process.cwd(), "content", "capas-locais.ts"),
  `/**
 * Capas de aula guardadas em \`public/capas\`. **Arquivo gerado.**
 *
 * Não edite à mão: rode \`node --import ./scripts/resolver-ts.mjs scripts/baixar-capas.mjs\`
 * depois de publicar aulas novas, e faça o commit das imagens junto.
 *
 * O porquê de existir está em \`capaDa()\`, em \`lib/cursos.ts\`.
 */
export const CAPAS_LOCAIS = new Set<string>([
${presentes.map((id) => `  "${id}",`).join("\n")}
]);
`
);

console.log(`\n${baixadas} baixada(s), ${existentes} já existiam, ${aulas.length} aula(s) no total.`);
console.log(`content/capas-locais.ts atualizado com ${presentes.length} capa(s).`);
