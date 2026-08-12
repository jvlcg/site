/**
 * Confere o que o teclado e o leitor de tela encontram no site.
 *
 *   npm run build && npm run verificar-acessibilidade
 *
 * ## O que ele pegou no dia em que foi escrito
 *
 * **O menu fechado recebia foco.** O painel some por opacidade, não por
 * `display`: com o menu fechado a medição dava `opacity: 0`,
 * `visibility: visible` e os doze links ainda focáveis. Quem navega por teclado
 * dava Tab e o foco entrava num menu invisível — doze paradas em elementos que
 * a pessoa não vê, sem forma de saber onde está.
 *
 * **Não havia como pular o cabeçalho.** Em toda página, antes do texto, vinham
 * marca, conta, som, tema, agendar e menu; acima de 1500 px, mais onze links de
 * seção. Sem atalho, é o percurso obrigatório de quem não usa mouse, em toda
 * página que abre.
 *
 * ## Nome acessível se lê na árvore, não no `textContent`
 *
 * Esta é a parte que erra quem escreve o teste às pressas — eu errei duas vezes
 * antes de acertar. Um link que envolve `<img alt="Fachada da clínica">` não
 * tem texto nenhum, e mesmo assim **tem** nome: o leitor de tela anuncia o
 * `alt`. Procurar `textContent` vazio acusa quatro links perfeitos na home.
 *
 * O mesmo vale ao contrário: `alt=""` numa imagem decorativa ao lado do próprio
 * título é o **certo**, e um teste ingênuo pede para "corrigir" — o conserto
 * faria o leitor anunciar a mesma frase duas vezes.
 *
 * Por isso a fonte aqui é `page.accessibility.snapshot()`, que é a árvore que o
 * leitor de tela realmente lê.
 */
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

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
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3214";
const PORTA = new URL(BASE).port;

const ROTAS = [
  "/",
  "/contato",
  "/cadastro",
  "/busca",
  "/perguntas-frequentes",
  "/blog/quem-pode-prescrever-canabidiol",
  "/cursos/reflexoes",
];

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

  for (const rota of ROTAS) {
    await page.goto(`${BASE}${rota}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    /* ---------- nome acessível, pela árvore ---------- */
    const arvore = await page.accessibility.snapshot({ interestingOnly: true });
    let semNome = 0;
    (function anda(no) {
      if (!no) return;
      if ((no.role === "link" || no.role === "button") && !(no.name ?? "").trim()) semNome++;
      for (const filho of no.children ?? []) anda(filho);
    })(arvore);
    if (semNome > 0) problemas.push(`${semNome} controle(s) sem nome acessível: ${rota}`);

    /* ---------- estrutura ---------- */
    const e = await page.evaluate(() => ({
      main: document.querySelectorAll("main").length,
      h1: document.querySelectorAll("h1").length,
      lang: document.documentElement.lang,
      atalho: !!document.querySelector('a[href="#conteudo"]'),
      alvo: !!document.getElementById("conteudo"),
    }));
    if (e.main !== 1) problemas.push(`${e.main} elemento(s) <main>: ${rota}`);
    if (e.h1 !== 1) problemas.push(`${e.h1} elemento(s) <h1>: ${rota}`);
    if (e.lang !== "pt-BR") problemas.push(`lang="${e.lang}": ${rota}`);
    if (!e.atalho) problemas.push(`sem atalho "pular para o conteúdo": ${rota}`);
    if (!e.alvo) problemas.push(`atalho sem destino (#conteudo não existe): ${rota}`);

    /*
      ---------- nada focável escondido ----------

      Percorre a página inteira com Tab e reprova quem receber foco estando
      fora da vista ou transparente. É a assinatura do menu fechado que ficava
      focável, e de qualquer painel que venha a ser escondido do mesmo jeito.
    */
    await page.evaluate(() => document.body.focus());
    const escondidos = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const f = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          nome: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 32),
          transparente: parseFloat(cs.opacity) === 0,
          semTamanho: r.width === 0 || r.height === 0,
          /* o atalho vive fora da tela até ser focado — e aí ele já está visível */
          atalho: el.matches('a[href="#conteudo"]'),
        };
      });
      if (!f || f.atalho) continue;
      if (f.transparente || f.semTamanho) escondidos.push(f.nome || "(sem texto)");
    }
    if (escondidos.length > 0) {
      problemas.push(
        `${escondidos.length} elemento(s) recebem foco estando invisíveis (${escondidos
          .slice(0, 3)
          .join(", ")}): ${rota}`
      );
    }
  }

  /* ---------- o atalho leva mesmo ao conteúdo? ---------- */
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const chegou = await page.evaluate(() => location.hash === "#conteudo");
  if (!chegou) problemas.push("o atalho não leva a #conteudo ao ser acionado");

  console.log(`${ROTAS.length} páginas conferidas, mais o atalho de teclado.`);
  await navegador.close();
} finally {
  encerrar();
}

if (problemas.length > 0) {
  console.error(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log("\nTeclado e leitor de tela encontram tudo o que precisam.");
