/**
 * Confere título, descrição e cabeçalhos de todas as páginas do sitemap.
 *
 *   npm run build && npm run verificar-metadados
 *
 * ## Por que abrindo o navegador, e não lendo os arquivos
 *
 * O que o Google vê não está escrito em lugar nenhum do repositório. O título
 * de uma página é o `title` do arquivo **mais** o sufixo do `layout`; a
 * descrição de um artigo vem do frontmatter, mas a da home vem do
 * `site-config`. Conferir no fonte mediria o pedaço, não o resultado — e
 * quatorze descrições passaram meses acima do limite exatamente por isso.
 *
 * ## Os limites, e de onde vêm
 *
 * O Google não corta por número de caracteres, e sim por largura em pixels
 * (cerca de 600 px no título, 920 px na descrição). Caractere é a aproximação
 * usada por todo mundo porque é o que dá para medir sem renderizar a página de
 * resultado. Por isso os números aqui são teto de alerta, não regra: um título
 * longo cujo começo já diz tudo é aceitável, e está anotado como tolerado.
 */
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const LIMITE_TITULO = 60;
const LIMITE_DESCRICAO = 155;

/**
 * Páginas cujo título passa do limite e está tudo bem assim.
 *
 * São as que têm **título editorial**: artigo, aula e poema. Ali o título é a
 * manchete que o médico escreveu, e encurtá-la para caber num corte de tela
 * seria piorar o site para quem lê a fim de agradar quem indexa. O Google
 * corta a exibição, mas continua lendo a frase inteira — e o começo, que é o
 * que aparece, já identifica a página.
 *
 * Os títulos de página de serviço não estão aqui de propósito: aqueles fui eu
 * que escrevi, são rótulos e não texto, e cabem sem perder nada. Eram oito, do
 * tipo "Perguntas frequentes — consultas, telemedicina e agendamento", que o
 * Google exibia como "Perguntas frequentes — consultas, telemedic…".
 */
const TITULO_TOLERADO = [
  /^\/blog\/[^/]+$/,
  /^\/cursos\/[^/]+\/[^/]+$/,
  /^\/poemas\/[^/]+$/,
];

async function carregarChromium() {
  const tentativas = [
    () => createRequire(import.meta.url).resolve("playwright"),
    () => {
      const raiz = execSync("npm root -g", { encoding: "utf8" }).trim();
      return createRequire(pathToFileURL(`${raiz}/`)).resolve("playwright");
    },
  ];
  for (const tentar of tentativas) {
    try {
      const mod = await import(pathToFileURL(tentar()).href);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch {
      /* tenta o próximo */
    }
  }
  console.error("Playwright não encontrado — instale com `npm i -g playwright`.");
  process.exit(2);
}

const chromium = await carregarChromium();
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3212";
const PORTA = new URL(BASE).port;

/* Mesma razão do `verificar-fundos`: medir o servidor errado é pior que não medir. */
const { createServer } = await import("node:net");
await new Promise((ok, falha) => {
  const s = createServer();
  s.once("error", () => falha(new Error(`A porta ${PORTA} já está ocupada.`)));
  s.once("listening", () => s.close(ok));
  s.listen(Number(PORTA), "127.0.0.1");
});

const servidor = spawn("npx", ["next", "start", "-p", PORTA], {
  stdio: "ignore",
  detached: true,
});
const encerrar = () => {
  try {
    process.kill(-servidor.pid, "SIGKILL");
  } catch {
    /* já morreu */
  }
};
process.on("exit", encerrar);
for (const sinal of ["SIGINT", "SIGTERM"]) {
  process.on(sinal, () => {
    encerrar();
    process.exit(1);
  });
}

const problemas = [];
const tolerados = [];

try {
  const navegador = await chromium.launch();
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  for (let i = 0; i < 60; i++) {
    try {
      const r = await page.goto(BASE, { timeout: 2000 });
      if (r?.ok()) break;
    } catch {
      await page.waitForTimeout(500);
    }
  }

  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const rotas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

  for (const rota of rotas) {
    await page.goto(`${BASE}${rota}`, { waitUntil: "domcontentloaded" });
    const d = await page.evaluate(() => ({
      titulo: document.title,
      descricao: document.querySelector('meta[name="description"]')?.content ?? "",
      canonical: document.querySelector("link[rel=canonical]")?.href ?? "",
      h1: document.querySelectorAll("h1").length,
      jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
    }));

    if (d.titulo.length > LIMITE_TITULO) {
      const alvo = TITULO_TOLERADO.some((re) => re.test(rota)) ? tolerados : problemas;
      alvo.push(`título com ${d.titulo.length} caracteres (máx. ${LIMITE_TITULO}): ${rota}`);
    }
    if (!d.descricao) problemas.push(`sem descrição: ${rota}`);
    else if (d.descricao.length > LIMITE_DESCRICAO) {
      problemas.push(
        `descrição com ${d.descricao.length} caracteres (máx. ${LIMITE_DESCRICAO}): ${rota}`
      );
    }
    if (d.h1 !== 1) problemas.push(`${d.h1} elementos h1 (deve ser 1): ${rota}`);
    if (!d.canonical) problemas.push(`sem canonical: ${rota}`);
    if (!d.jsonld) problemas.push(`sem JSON-LD: ${rota}`);
  }

  console.log(`${rotas.length} páginas conferidas.`);
  if (tolerados.length > 0) {
    console.log(`\n${tolerados.length} título(s) longo(s) por escolha (aula e poema):`);
    for (const t of tolerados.slice(0, 3)) console.log(`  · ${t}`);
    if (tolerados.length > 3) console.log(`  · … e mais ${tolerados.length - 3}`);
  }

  await navegador.close();
} finally {
  encerrar();
}

if (problemas.length > 0) {
  console.error(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log("\nTítulos, descrições e cabeçalhos dentro do esperado.");
