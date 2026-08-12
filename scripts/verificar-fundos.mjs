/**
 * Confere que cada página do site tem um fundo animado, e que ele é só dela.
 *
 * ## Por que isto virou script
 *
 * A regra "um fundo por página" já quebrou duas vezes, das duas por engano meu
 * e nenhuma por acidente do navegador:
 *
 *  1. O fundo nasceu dentro do `PageHero`, então alcançava só quem passa por
 *     ele. Artigo, poema, curso, aula, cadastro e mapa ficaram sem nenhum —
 *     mais de cinquenta endereços, justamente os mais numerosos do site.
 *  2. Quatro páginas repetiam o fundo de outra. A última que descobri foi
 *     `/artigos` usando o mesmo de `/blog`: conferi "listagem de texto" como
 *     se fosse um tipo só de página, e passou.
 *
 * As duas falhas têm a mesma forma — eu conferi o mecanismo (o atributo existe,
 * a animação existe) em vez do resultado (esta página tem movimento, e ele é
 * diferente do da página ao lado). Um humano relendo o diff não pega isso: é
 * preciso abrir as trinta e poucas rotas e comparar.
 *
 * ## O que ele mede, e por que assim
 *
 * **Não** via `getComputedStyle`. Animação de CSS composta pela GPU não aparece
 * ali — o `transform` calculado volta como identidade mesmo com a animação
 * rodando, e isso já me fez declarar "não funciona" sobre código que
 * funcionava, três vezes. A verdade está em `Element.getAnimations()`, que
 * devolve as animações de verdade, com estado.
 *
 * Como o movimento vive no `::before` da `.aurora`, o script pede as animações
 * com `{ subtree: true }` — sem isso a lista volta vazia e o script mentiria
 * exatamente como eu menti.
 *
 * Roda contra o servidor de produção (`next start`), não o de desenvolvimento:
 * é o CSS compilado que vai ao ar.
 *
 *     npm run build && npm run verificar-fundos
 */
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * O Playwright é ferramenta, não dependência do site.
 *
 * Pô-lo no `package.json` faria a Vercel baixar um navegador inteiro a cada
 * build de produção para rodar um script que nunca roda lá. Então ele é
 * procurado onde estiver instalado na máquina — no projeto, ou global.
 */
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
      const caminho = tentar();
      const mod = await import(pathToFileURL(caminho).href);
      /*
        O Playwright é CommonJS. Num `import()` dinâmico o Node não consegue
        ler os nomes exportados de um módulo CJS estaticamente, então tudo
        chega dentro de `default` — pedir `mod.chromium` direto devolve
        `undefined` sem erro nenhum, e o script só quebra lá na frente.
      */
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch {
      /* tenta o próximo */
    }
  }

  console.error(
    "Playwright não encontrado. Instale-o na máquina (`npm i -g playwright`)\n" +
      "— ele não entra nas dependências do site de propósito."
  );
  process.exit(2);
}

const chromium = await carregarChromium();

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3210";
const PORTA = new URL(BASE).port;

/**
 * Uma rota por *tipo* de página, não uma por endereço.
 *
 * As dezoito aulas compartilham um arquivo; conferir as dezoito confirmaria
 * dezoito vezes a mesma coisa e faria o script demorar por nada. O que precisa
 * ser conferido é o molde.
 */
const ROTAS = [
  "/",
  "/sobre",
  "/cannabis-medicinal",
  "/clinica-medica",
  "/medicina-esportiva",
  "/telemedicina",
  "/consultorio",
  "/contato",
  "/perguntas-frequentes",
  "/blog",
  "/artigos",
  "/poemas",
  "/cursos",
  "/aplicativos",
  "/voluntariado",
  "/cadastro",
  "/mapa-do-site",
];

/** Rotas dinâmicas: um exemplo de cada molde, descoberto no próprio site. */
async function rotasDinamicas(page) {
  const achar = async (lista, seletor) => {
    await page.goto(`${BASE}${lista}`, { waitUntil: "domcontentloaded" });
    return page.$eval(seletor, (a) => new URL(a.href).pathname).catch(() => null);
  };

  const artigo = await achar("/blog", 'a[href^="/blog/"]');
  const poema = await achar("/poemas", 'a[href^="/poemas/"]');
  const curso = await achar("/cursos", 'a[href^="/cursos/"]');
  let aula = null;
  if (curso) aula = await achar(curso, `a[href^="${curso}/"]`);

  return [artigo, poema, curso, aula].filter(Boolean);
}

/** Todos os endereços de uma família, tirados da própria listagem. */
async function todosOsEnderecos(page, lista, prefixo) {
  await page.goto(`${BASE}${lista}`, { waitUntil: "domcontentloaded" });
  const hrefs = await page.$$eval(
    `a[href^="${prefixo}"]`,
    (as) => as.map((a) => new URL(a.href).pathname)
  );
  return [...new Set(hrefs)].filter((h) => h !== lista && h.startsWith(prefixo));
}

/**
 * O que é observável de fora, para uma rota.
 *
 * `animationPlayState` vem do objeto `Animation`, não do CSS calculado — é a
 * diferença entre "o navegador conhece a regra" e "o pixel está se mexendo".
 *
 * A `impressao` é a identidade visível daquele fundo: o movimento em si mais a
 * variação da página (duração, fase, espelho, onde nascem as manchas). Duas
 * páginas com a mesma impressão são, para quem olha, a mesma página.
 */
async function medir(page, rota) {
  await page.goto(`${BASE}${rota}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);

  return page.evaluate(() => {
    const aurora = document.querySelector(".aurora[data-fundo]");
    if (!aurora) return { fundo: null, animacoes: [], impressao: null };

    const cs = getComputedStyle(aurora);
    const antes = getComputedStyle(aurora, "::before");
    const variaveis = [
      "--fundo-dur", "--fundo-fase", "--fundo-espelho",
      "--fundo-g1x", "--fundo-g1y", "--fundo-g2x",
      "--fundo-g2y", "--fundo-g3x", "--fundo-g3y",
    ].map((v) => cs.getPropertyValue(v).trim());

    return {
      fundo: aurora.getAttribute("data-fundo"),
      impressao: [
        aurora.getAttribute("data-fundo"),
        antes.animationDuration,
        antes.animationDelay,
        ...variaveis,
      ].join("|"),
      animacoes: aurora.getAnimations({ subtree: true }).map((a) => ({
        nome: a.animationName ?? null,
        estado: a.playState,
        duracao: a.effect?.getComputedTiming()?.duration ?? null,
      })),
    };
  });
}

/**
 * A porta precisa estar livre, e vale parar se não estiver.
 *
 * `next start` numa porta ocupada falha em silêncio, e o script segue medindo
 * o servidor **que já estava lá** — de outra build, de outra execução. Foi
 * exatamente o que aconteceu: sobraram servidores de execuções anteriores, e
 * as medidas passaram a variar de rodada para rodada sem nada mudar no código.
 * Cheguei a "corrigir" o script duas vezes por causa disso.
 *
 * Um erro alto custa dez segundos; uma medida errada custa a tarde.
 */
async function exigirPortaLivre() {
  const { createServer } = await import("node:net");
  await new Promise((ok, falha) => {
    const s = createServer();
    s.once("error", () =>
      falha(
        new Error(
          `A porta ${PORTA} já está ocupada — provavelmente um \`next start\` de\n` +
            `uma execução anterior. Encerre-o antes, ou passe BASE_URL apontando\n` +
            `para o servidor que você quer medir. Medir o servidor errado é pior\n` +
            `do que não medir.`
        )
      )
    );
    s.once("listening", () => s.close(ok));
    s.listen(Number(PORTA), "127.0.0.1");
  });
}

await exigirPortaLivre();

/**
 * `detached: true` para poder matar o **grupo** no fim.
 *
 * O `npx` não é o servidor: ele lança o `next-server` como filho. Matar só o
 * `npx` deixa o filho vivo segurando a porta — e foi assim que este script
 * passou a sabotar a própria execução seguinte, deixando um servidor de build
 * antiga no ar. Com o grupo próprio, `kill(-pid)` leva os dois.
 */
const servidor = spawn("npx", ["next", "start", "-p", PORTA], {
  stdio: "ignore",
  detached: true,
});

function encerrarServidor() {
  try {
    process.kill(-servidor.pid, "SIGKILL");
  } catch {
    /* já morreu */
  }
}
process.on("exit", encerrarServidor);
for (const sinal of ["SIGINT", "SIGTERM"]) {
  process.on(sinal, () => {
    encerrarServidor();
    process.exit(1);
  });
}

const problemas = [];

/**
 * Uma aba de cada vez, e nunca duas abertas juntas.
 *
 * O Chromium só mantém as animações rodando na aba visível. Com a de desktop e
 * a de celular abertas ao mesmo tempo, a de trás congela — e o script acusou
 * as vinte e uma páginas como paradas num site em que todas rodavam. Pior: na
 * primeira execução ele deixou passar, porque o resultado dependia de qual aba
 * tinha o foco no instante da medida.
 *
 * `bringToFront()` não resolveu. Contextos separados, criados e fechados em
 * sequência, resolveram — é o que esta função garante.
 */
async function comAba(navegador, opcoes, trabalho) {
  const ctx = await navegador.newContext(opcoes);
  const page = await ctx.newPage();

  // espera o servidor responder
  for (let i = 0; i < 60; i++) {
    try {
      const r = await page.goto(BASE, { timeout: 2000 });
      if (r?.ok()) break;
    } catch {
      await page.waitForTimeout(500);
    }
  }

  try {
    return await trabalho(page);
  } finally {
    await ctx.close();
  }
}

try {
  const navegador = await chromium.launch();

  /* ---------- Desktop: cobertura, unicidade e movimento ---------- */
  const vistos = new Map();
  const rotas = await comAba(navegador, { viewport: { width: 1440, height: 900 } }, async (page) => {
    const lista = [...ROTAS, ...(await rotasDinamicas(page))];

    for (const rota of lista) {
      const { fundo, animacoes } = await medir(page, rota);

      if (!fundo) {
        problemas.push(`${rota} — sem fundo nenhum`);
        continue;
      }

      const rodando = animacoes.filter((a) => a.estado === "running");
      if (rodando.length === 0) {
        problemas.push(`${rota} — fundo "${fundo}" declarado, mas nenhuma animação rodando`);
      }

      if (vistos.has(fundo)) {
        problemas.push(`${rota} — fundo "${fundo}" repetido de ${vistos.get(fundo)}`);
      } else {
        vistos.set(fundo, rota);
      }

      const dur = rodando[0]?.duracao;
      console.log(
        `  ${fundo.padEnd(13)} ${String(dur ? Math.round(dur / 1000) + "s" : "?").padStart(4)}  ${rota}`
      );
    }

    return lista;
  });

  console.log(`\n${vistos.size} fundos distintos em ${rotas.length} tipos de página.`);

  /*
    ---------- Dentro de cada família ----------

    A conferência acima trata "artigo" como uma página só, porque os dezesseis
    artigos saem do mesmo arquivo. Do lado de fora não é uma página só: são
    dezesseis endereços, e por um tempo os dezesseis tiveram o mesmo fundo —
    quem lesse dois seguidos via a mesma coisa duas vezes. Foi exatamente essa
    a queixa, e o molde idêntico é o que a esconde de quem confere pelo código.

    Aqui cada endereço é aberto de verdade e a impressão é comparada com a das
    irmãs. É a única passagem que enxerga esse tipo de repetição.
  */
  console.log("\nDentro de cada família:");
  await comAba(navegador, { viewport: { width: 1440, height: 900 } }, async (page) => {
    const cursos = await todosOsEnderecos(page, "/cursos", "/cursos/");

    /*
      As aulas não aparecem na listagem de cursos — estão um nível abaixo, uma
      lista dentro de cada curso. Se a família fosse montada só a partir de
      `/cursos`, as dezoito aulas ficariam de fora da conferência, que é
      justamente onde a repetição se esconde melhor: são as páginas mais
      numerosas e as menos visitadas por quem revisa.
    */
    const aulas = [];
    for (const curso of cursos) {
      aulas.push(...(await todosOsEnderecos(page, curso, `${curso}/`)));
    }

    const familias = [
      ["artigos", await todosOsEnderecos(page, "/blog", "/blog/")],
      ["poemas", await todosOsEnderecos(page, "/poemas", "/poemas/")],
      ["cursos", cursos],
      ["aulas", [...new Set(aulas)]],
    ];

    for (const [nome, enderecos] of familias) {
      const impressoes = new Map();

      for (const endereco of enderecos) {
        const { impressao } = await medir(page, endereco);
        if (!impressao) {
          problemas.push(`${endereco} — sem fundo nenhum`);
          continue;
        }
        if (impressoes.has(impressao)) {
          problemas.push(
            `${endereco} — fundo idêntico ao de ${impressoes.get(impressao)}`
          );
        } else {
          impressoes.set(impressao, endereco);
        }
      }

      console.log(
        `  ${nome.padEnd(8)} ${String(impressoes.size).padStart(2)}/${enderecos.length} distintos`
      );
    }
  });

  /*
    ---------- E de novo no celular ----------

    Esta segunda passagem existe por um erro específico. Eu tinha desligado as
    animações em `pointer: coarse` copiando a regra do `.mesh-bg` sem
    reavaliá-la — o mesh é desligado por causa de um `blur` caro, que a aurora
    já não tem. O resultado foi um celular sem nenhuma das animações,
    justamente onde está a maior parte das visitas, e a conferência de desktop
    passou limpa.
  */
  console.log("\nNo celular (390px):");
  let paradas = 0;
  await comAba(
    navegador,
    { viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true },
    async (celular) => {
      for (const rota of rotas) {
        const { fundo, animacoes } = await medir(celular, rota);
        if (!fundo || !animacoes.some((a) => a.estado === "running")) {
          paradas++;
          problemas.push(`${rota} — no celular: ${fundo ? `"${fundo}" parado` : "sem fundo"}`);
        }
      }
    }
  );
  console.log(`  ${rotas.length - paradas}/${rotas.length} rodando.`);

  await navegador.close();
} finally {
  encerrarServidor();
}

if (problemas.length > 0) {
  console.error(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log("Cada página com o seu movimento.");
