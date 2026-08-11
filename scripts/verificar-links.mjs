#!/usr/bin/env node
/**
 * Verificador de hiperlinks internos.
 *
 * ## O problema que ele resolve
 *
 * Link interno quebrado é a falha mais silenciosa que existe num site: nada
 * explode, nenhum teste falha, o build passa. A pessoa clica, cai num 404, e
 * vai embora — e ninguém fica sabendo. Para o Google é pior ainda, porque ele
 * gasta orçamento de rastreio em endereços que não existem e conclui que o
 * site está mal cuidado.
 *
 * O risco cresceu quando os links automáticos passaram a valer no site
 * inteiro: agora **o código gera links sozinho**, a partir da lista de
 * `DESTINOS`. Um destino com o caminho errado ali não quebra um link — quebra
 * todos os que aquele termo gerar, em todas as páginas, de uma vez.
 *
 * ## O que ele faz
 *
 * 1. Lê o mapa de rotas que o Next acabou de gerar, que é a verdade sobre o
 *    que existe — inclusive as páginas dinâmicas, como cada aula e cada
 *    artigo.
 * 2. Confere que **todo destino da lista de links automáticos aponta para uma
 *    rota real**. É a verificação mais importante, pelo efeito multiplicador.
 * 3. Varre o HTML gerado e confere todo `href` interno.
 * 4. Confere que os redirecionamentos declarados apontam para algo que existe
 *    — um redirecionamento para uma página inexistente troca um 404 por dois
 *    saltos até o mesmo 404.
 *
 * Sai com código 1 se achar qualquer coisa, para poder travar uma publicação.
 *
 * ## Por que sobre o build, e não sobre o site no ar
 *
 * Rodando contra a produção, ele só avisaria **depois** de o link quebrado
 * estar na frente do paciente. Sobre o build, avisa antes de publicar — que é
 * quando ainda dá para consertar de graça.
 *
 * Uso: `node scripts/verificar-links.mjs` (depois de `npm run build`)
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const SAIDA = path.join(RAIZ, ".next", "server", "app");

/**
 * A lista de rotas vem do MANIFESTO do Next, e não dos arquivos .html.
 *
 * Essa foi a primeira versão, e ela mentia. Contar só os `.html` gerados deixa
 * de fora tudo o que o Next renderiza **sob demanda** — `/agendar`,
 * `/minha-conta`, `/r/[codigo]` — e também os ícones que ele mesmo produz a
 * partir de `app/icon.svg`. Na primeira execução o verificador acusou dezenas
 * de links quebrados que **existem e funcionam**.
 *
 * Verificador que dá alarme falso é pior que não ter verificador: em duas
 * semanas ninguém lê mais a saída, e aí o link quebrado de verdade passa junto
 * com o ruído.
 *
 * `app-path-routes-manifest.json` é o que o Next usa para rotear em produção —
 * é a mesma verdade que o servidor consulta.
 */
const SEMPRE_VALIDOS = new Set([
  "/",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/manifest.webmanifest",
]);

const problemas = [];
const anota = (tipo, onde, alvo, nota = "") =>
  problemas.push({ tipo, onde, alvo, nota });

/** Todo arquivo .html gerado pelo build, com o caminho da rota correspondente. */
async function paginasGeradas(dir = SAIDA, base = "") {
  const achadas = [];
  let entradas;
  try {
    entradas = await readdir(dir, { withFileTypes: true });
  } catch {
    return achadas;
  }
  for (const e of entradas) {
    const cheio = path.join(dir, e.name);
    if (e.isDirectory()) {
      achadas.push(...(await paginasGeradas(cheio, `${base}/${e.name}`)));
    } else if (e.name.endsWith(".html")) {
      const rota = e.name === "index.html" ? base || "/" : `${base}/${e.name.replace(/\.html$/, "")}`;
      achadas.push({ rota, arquivo: cheio });
    }
  }
  return achadas;
}

/** Normaliza para comparar: sem âncora, sem query, sem barra no fim. */
function limpar(href) {
  const semAncora = href.split("#")[0].split("?")[0];
  if (semAncora === "") return null; // link só de âncora: não é navegação
  return semAncora.length > 1 ? semAncora.replace(/\/+$/, "") : semAncora;
}

const interno = (href) =>
  href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next") && !href.startsWith("/api/");

async function main() {
  const paginas = await paginasGeradas();
  if (paginas.length === 0) {
    console.error("Nenhuma página encontrada em .next/server/app — rode `npm run build` antes.");
    process.exit(1);
  }

  /* rotas declaradas pelo Next (estáticas, dinâmicas e ícones gerados) */
  let doManifesto = [];
  try {
    const bruto = await readFile(path.join(RAIZ, ".next", "app-path-routes-manifest.json"), "utf8");
    doManifesto = Object.values(JSON.parse(bruto));
  } catch {
    console.warn("Aviso: manifesto de rotas não encontrado; conferindo só o que virou HTML.");
  }

  const rotas = new Set([
    ...SEMPRE_VALIDOS,
    ...paginas.map((p) => p.rota),
    ...doManifesto.map((r) => (r.length > 1 ? r.replace(/\/+$/, "") : r)),
  ]);
  /*
    Rotas dinâmicas viram um arquivo por instância no build estático, então já
    entram acima. As que sobram — as renderizadas sob demanda — aparecem como
    pasta com colchetes; guardo o prefixo para não acusar falso positivo.
  */
  const prefixosDinamicos = [...rotas]
    .filter((r) => r.includes("["))
    .map((r) => r.slice(0, r.indexOf("[")));

  const existe = (alvo) =>
    rotas.has(alvo) ||
    rotas.has(alvo + "/") ||
    prefixosDinamicos.some((p) => alvo.startsWith(p));

  // ---------------------------------------------------------------- 1. destinos
  const auto = await readFile(path.join(RAIZ, "lib", "auto-links.ts"), "utf8");
  const destinos = [...auto.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const d of destinos) {
    if (!existe(d)) anota("destino automático", "lib/auto-links.ts", d, "gera link em TODO o site");
  }

  // ------------------------------------------------------------------ 2. hrefs
  let totalLinks = 0;
  for (const { rota, arquivo } of paginas) {
    const html = await readFile(arquivo, "utf8");
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    for (const bruto of hrefs) {
      if (!interno(bruto)) continue;
      const alvo = limpar(bruto);
      if (!alvo) continue;
      totalLinks++;
      // arquivo estático (imagem, pdf, capa): confere no disco
      if (/\.[a-z0-9]{2,5}$/i.test(alvo) && !alvo.endsWith(".xml") && !alvo.endsWith(".txt")) {
        /*
          Alguns "arquivos" são rota, não arquivo: `/icon.svg`, `/favicon.ico`
          e `/apple-icon.png` são gerados pelo Next a partir de `app/`, e nunca
          existem dentro de `public/`. Por isso a rota é conferida primeiro.
        */
        if (existe(alvo)) continue;
        if (!existsSync(path.join(RAIZ, "public", alvo))) anota("arquivo", rota, alvo);
        continue;
      }
      if (!existe(alvo)) anota("link", rota, alvo);
    }
  }

  // ----------------------------------------------------------- 3. redirecionamentos
  const config = await readFile(path.join(RAIZ, "next.config.ts"), "utf8");
  for (const m of config.matchAll(/destination:\s*"([^"]+)"/g)) {
    const alvo = m[1].replace(/\/:[^/]+/g, ""); // tira os parâmetros
    if (interno(alvo) && !existe(alvo) && !prefixosDinamicos.some((p) => alvo.startsWith(p))) {
      anota("redirecionamento", "next.config.ts", m[1]);
    }
  }

  // ------------------------------------------------------------------ resultado
  console.log(`Rotas geradas: ${rotas.size}`);
  console.log(`Destinos automáticos: ${destinos.length}`);
  console.log(`Links internos conferidos: ${totalLinks}`);

  if (problemas.length === 0) {
    console.log("\nNenhum link interno quebrado.");
    return;
  }

  console.log(`\n${problemas.length} problema(s):\n`);
  for (const p of problemas) {
    console.log(`  [${p.tipo}] ${p.alvo}`);
    console.log(`      em ${p.onde}${p.nota ? ` — ${p.nota}` : ""}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error("Falhou:", e.message);
  process.exit(1);
});
