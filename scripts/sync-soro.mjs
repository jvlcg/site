/**
 * Sincroniza os artigos publicados na Soro para o blog em MDX.
 *
 *   node scripts/sync-soro.mjs
 *
 * A Soro é a ferramenta de escrita; o blog em MDX é a saída publicada. O que
 * sai daqui recebe o pacote completo de SEO — Schema por artigo, entrada no
 * sitemap, imagem de compartilhamento — que conteúdo montado no navegador não
 * recebe.
 *
 * O script é idempotente: roda quantas vezes quiser, só grava o que mudou.
 * Artigos escritos à mão em content/artigos/ nunca são tocados — a marca
 * `origem: soro` no frontmatter é o que autoriza a sobrescrita.
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { classificar } from "./categorias.mjs";

const TOKEN = process.env.SORO_EMBED_TOKEN ?? "85ab1693-799e-4f7e-8017-4b1ea52c3567";
const API = "https://app.trysoro.com";
const DESTINO = "content/artigos";
const IMAGENS = "public/images/blog";

/*
  A categoria sai do texto do artigo, e não de uma constante.

  Aqui havia `const CATEGORIA = "Medicina Endocanabinoide"`, carimbada em tudo
  que chegava. No site no ar isso virou um artigo sobre telemedicina, outro
  sobre check-up e outro sobre dor no treino, os três anunciados ao leitor como
  se fossem sobre cannabis — onze dos dezesseis. Ver `categorias.mjs`, e
  `npm run verificar-categorias`, que confere o classificador contra a
  classificação feita à mão.
*/

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

// O <h1> do artigo vira o título do frontmatter; repeti-lo no corpo criaria
// dois títulos de primeiro nível na página.
td.addRule("removeH1", { filter: ["h1"], replacement: () => "" });

/** Busca a lista de artigos, que vem embutida no JavaScript do embed. */
async function listar() {
  const res = await fetch(`${API}/api/embed/${TOKEN}`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`listagem falhou: HTTP ${res.status}`);
  const js = await res.text();
  if (js.includes("Embed is disabled")) {
    throw new Error("o embed está desativado no painel da Soro");
  }
  const m = js.match(/var SORO_ARTICLES = (\[[\s\S]*?\]);/);
  if (!m) throw new Error("não encontrei SORO_ARTICLES no script — o formato do embed mudou");
  return JSON.parse(m[1]);
}

/** Busca o conteúdo em HTML de um artigo. */
async function conteudo(id) {
  const res = await fetch(`${API}/api/embed/${TOKEN}/article/${id}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`artigo ${id}: HTTP ${res.status}`);
  const j = await res.json();
  return (j.article ?? j).content ?? "";
}

/**
 * Baixa a imagem de destaque para o próprio domínio.
 *
 * Hospedar localmente evita depender de terceiro para a página carregar,
 * dispensa liberar outro domínio na política de segurança e mantém a imagem
 * mesmo que a Soro remova o arquivo.
 */
async function baixarImagem(url, slug) {
  if (!url) return undefined;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) return undefined;
    const tipo = res.headers.get("content-type") ?? "";
    const ext = tipo.includes("png") ? "png" : tipo.includes("webp") ? "webp" : "jpg";
    const arquivo = `${slug}.${ext}`;
    await mkdir(IMAGENS, { recursive: true });
    await writeFile(path.join(IMAGENS, arquivo), Buffer.from(await res.arrayBuffer()));
    return `/images/blog/${arquivo}`;
  } catch {
    return undefined;
  }
}

/** Escapa aspas para uso dentro de string YAML entre aspas duplas. */
const yaml = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();

function montarMdx(artigo, markdown, imagemLocal) {
  const data = (artigo.isoDate ?? new Date().toISOString()).slice(0, 10);
  const frontmatter = [
    "---",
    `title: "${yaml(artigo.title)}"`,
    `description: "${yaml(artigo.excerpt)}"`,
    `date: "${data}"`,
    `category: "${yaml(classificar(artigo.title ?? "", markdown))}"`,
    "tags: []",
    "faq: []",
    imagemLocal ? `image: "${imagemLocal}"` : null,
    "# Gerado por scripts/sync-soro.mjs — edições manuais são sobrescritas.",
    "origem: soro",
    `soroId: "${artigo.id}"`,
    "---",
    // filtra só os nulos: `.filter(Boolean)` descartaria strings vazias e
    // colaria o fechamento do frontmatter na primeira linha do texto
  ].filter((linha) => linha !== null);
  return `${frontmatter.join("\n")}\n\n${markdown.trim()}\n`;
}

/** Slugs presentes na pasta que NÃO vieram da Soro — nunca podem ser tocados. */
async function slugsManuais() {
  if (!existsSync(DESTINO)) return new Set();
  const arquivos = (await readdir(DESTINO)).filter((f) => f.endsWith(".mdx"));
  const manuais = new Set();
  for (const f of arquivos) {
    const texto = await readFile(path.join(DESTINO, f), "utf8");
    if (!/^origem:\s*soro\s*$/m.test(texto)) manuais.add(f.replace(/\.mdx$/, ""));
  }
  return manuais;
}

async function main() {
  const artigos = await listar();
  console.log(`Soro: ${artigos.length} artigo(s) publicado(s)`);

  const protegidos = await slugsManuais();
  await mkdir(DESTINO, { recursive: true });

  let novos = 0;
  let atualizados = 0;
  let ignorados = 0;

  for (const artigo of artigos) {
    const slug = artigo.slug;
    if (!slug) {
      console.warn(`  ! artigo sem slug (${artigo.id}) — pulado`);
      continue;
    }
    if (protegidos.has(slug)) {
      console.log(`  = ${slug} — existe um artigo escrito à mão com esse nome, preservado`);
      ignorados++;
      continue;
    }

    const html = await conteudo(artigo.id);
    if (!html.trim()) {
      console.warn(`  ! ${slug} — conteúdo vazio, pulado`);
      continue;
    }

    const imagem = await baixarImagem(artigo.image, slug);
    const mdx = montarMdx(artigo, td.turndown(html), imagem);
    const destino = path.join(DESTINO, `${slug}.mdx`);
    const existia = existsSync(destino);

    if (existia && (await readFile(destino, "utf8")) === mdx) {
      console.log(`  · ${slug} — sem mudança`);
      continue;
    }

    await writeFile(destino, mdx);
    console.log(`  ${existia ? "~" : "+"} ${slug}${imagem ? " (com imagem)" : ""}`);
    existia ? atualizados++ : novos++;
  }

  await avisarOrfaos(artigos);

  console.log(`\n${novos} novo(s), ${atualizados} atualizado(s), ${ignorados} preservado(s)`);
}

/**
 * Aponta artigos que vieram da Soro e não estão mais na listagem — provavelmente
 * despublicados de lá.
 *
 * **Avisa, não apaga.** A listagem pode voltar incompleta por cache ou por uma
 * falha momentânea da API, e apagar em cima disso destruiria conteúdo publicado
 * sem chance de recuperação. Excluir um artigo é raro e reversível à mão;
 * excluir por engano, não.
 */
async function avisarOrfaos(artigos) {
  const naSoro = new Set(artigos.map((a) => a.slug).filter(Boolean));
  const arquivos = (await readdir(DESTINO)).filter((f) => f.endsWith(".mdx"));

  const orfaos = [];
  for (const f of arquivos) {
    const texto = await readFile(path.join(DESTINO, f), "utf8");
    if (!/^origem:\s*soro\s*$/m.test(texto)) continue;
    const slug = f.replace(/\.mdx$/, "");
    if (!naSoro.has(slug)) orfaos.push(slug);
  }

  if (orfaos.length === 0) return;
  console.log(
    `\n  ! ${orfaos.length} artigo(s) no blog não estão mais publicados na Soro:\n` +
      orfaos.map((s) => `      content/artigos/${s}.mdx`).join("\n") +
      `\n    Continuam no ar. Para tirar do site, apague o arquivo e faça o commit.`
  );
}

main().catch((e) => {
  console.error("Falha ao sincronizar:", e.message);
  process.exit(1);
});
