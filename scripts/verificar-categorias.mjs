/**
 * Confere a classificação dos artigos do blog.
 *
 *   npm run verificar-categorias
 *
 * Duas coisas, e a segunda é a que importa.
 *
 * **Nenhum artigo sem categoria, e nenhuma categoria fora da lista.** Um erro
 * de digitação no frontmatter não quebra build nenhum: o artigo simplesmente
 * aparece no site com um rótulo torto, e ninguém percebe.
 *
 * **O classificador continua concordando com a classificação feita à mão.**
 * Os dezesseis artigos de hoje foram classificados um a um, lendo cada um. Se
 * `classificar()` diverge de algum, ou a lista de termos regrediu, ou aquele
 * artigo mudou de assunto — os dois casos pedem olho humano.
 *
 * ## De onde veio isto
 *
 * O `sync-soro.mjs` carimbava a mesma categoria em tudo que chegava. Onze dos
 * dezesseis artigos anunciavam "Medicina Endocanabinoide" ao leitor, incluindo
 * os que falavam de telemedicina, check-up e dor no treino. Nada no código
 * acusava: o frontmatter estava bem formado, o build passava, e o rótulo
 * errado só aparecia para quem lesse a página.
 */
import { readFileSync, readdirSync } from "node:fs";
import { CATEGORIAS, classificar } from "./categorias.mjs";

const DIR = "content/artigos";
const problemas = [];
const porCategoria = new Map();

for (const arquivo of readdirSync(DIR).filter((f) => f.endsWith(".mdx"))) {
  const slug = arquivo.replace(/\.mdx$/, "");
  const bruto = readFileSync(`${DIR}/${arquivo}`, "utf8");

  const fim = bruto.indexOf("\n---", 4);
  if (fim === -1) {
    problemas.push(`${slug} — frontmatter sem fechamento`);
    continue;
  }
  const frontmatter = bruto.slice(0, fim);
  const corpo = bruto.slice(fim);

  const titulo = (frontmatter.match(/^title: "(.*)"$/m) ?? [])[1];
  const categoria = (frontmatter.match(/^category: "(.*)"$/m) ?? [])[1];

  if (!categoria) {
    problemas.push(`${slug} — sem categoria`);
    continue;
  }
  if (!CATEGORIAS.includes(categoria)) {
    problemas.push(
      `${slug} — categoria "${categoria}" não está na lista de categorias.mjs`
    );
    continue;
  }

  porCategoria.set(categoria, [...(porCategoria.get(categoria) ?? []), slug]);

  const automatica = classificar(titulo ?? "", corpo);
  if (automatica !== categoria) {
    problemas.push(
      `${slug} — está em "${categoria}", mas o classificador diria "${automatica}"`
    );
  }
}

for (const categoria of CATEGORIAS) {
  const artigos = porCategoria.get(categoria) ?? [];
  console.log(`  ${String(artigos.length).padStart(2)}  ${categoria}`);
}

const total = [...porCategoria.values()].reduce((s, a) => s + a.length, 0);
console.log(`\n${total} artigos em ${porCategoria.size} categorias.`);

if (problemas.length > 0) {
  console.error(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log("Cada artigo no seu assunto.");
