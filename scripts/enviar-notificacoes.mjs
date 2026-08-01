/**
 * Envia as notificações do site.
 *
 * Dois modos:
 *
 *   node --import ./scripts/resolver-ts.mjs scripts/enviar-notificacoes.mjs
 *     → procura artigos publicados que ainda não foram avisados e envia um
 *       aviso para cada um.
 *
 *   ... scripts/enviar-notificacoes.mjs --titulo "Agenda de julho" \
 *       --corpo "Novos horários disponíveis" --url /contato
 *     → comunicado avulso, escrito na hora.
 *
 * Cuidados embutidos, porque notificação irrita rápido:
 *
 * - **Na primeira execução nada é enviado.** Os artigos que já existem são
 *   marcados como avisados, para ninguém receber seis avisos de uma vez.
 * - **Teto de 3 avisos por rodada**, mesmo que tenham entrado mais artigos.
 * - **Aparelho que não existe mais é removido da lista** (o serviço de push
 *   responde 404 ou 410 quando a pessoa desinstalou ou limpou o navegador).
 *
 * Nada aqui menciona paciente, atendimento ou dado clínico: os avisos são
 * sobre conteúdo publicado, e só.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import webpush from "web-push";
import { listarAssinaturas, removerAssinatura } from "../lib/assinaturas.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const PASTA_ARTIGOS = path.join(RAIZ, "content/artigos");
const ESTADO = path.join(RAIZ, "content/notificados.json");

/** Teto de avisos por execução. */
const MAX_POR_RODADA = 3;

function argumento(nome) {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function configurarVapid() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY ausentes — nada a enviar.");
    return false;
  }
  // o "assunto" identifica quem envia, exigido pelo padrão Web Push
  const assunto = process.env.VAPID_SUBJECT ?? "https://drjvlcg.com.br";
  webpush.setVapidDetails(assunto, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return true;
}

async function lerEstado() {
  try {
    const dados = JSON.parse(await readFile(ESTADO, "utf8"));
    return Array.isArray(dados.avisados) ? new Set(dados.avisados) : null;
  } catch {
    return null; // arquivo ainda não existe: primeira execução
  }
}

const gravarEstado = (avisados) =>
  writeFile(ESTADO, JSON.stringify({ avisados: [...avisados].sort() }, null, 2) + "\n", "utf8");

async function lerArtigos() {
  let arquivos = [];
  try {
    arquivos = (await readdir(PASTA_ARTIGOS)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const artigos = [];
  for (const arquivo of arquivos) {
    const { data } = matter(await readFile(path.join(PASTA_ARTIGOS, arquivo), "utf8"));
    artigos.push({
      slug: arquivo.replace(/\.mdx$/, ""),
      title: data.title ?? arquivo,
      description: data.description ?? "",
      date: data.date ?? "",
    });
  }
  // mais recentes primeiro, para o teto por rodada pegar o que interessa
  return artigos.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/**
 * Dispara um aviso para todos os aparelhos inscritos.
 * Devolve quantos receberam e quantos foram removidos por não existirem mais.
 */
async function enviar({ titulo, corpo, url, tag }) {
  const assinaturas = await listarAssinaturas();
  if (assinaturas.length === 0) {
    console.log("Nenhum aparelho inscrito.");
    return { entregues: 0, removidos: 0 };
  }

  const carga = JSON.stringify({ titulo, corpo, url, tag });
  let entregues = 0;
  let removidos = 0;

  for (const assinatura of assinaturas) {
    try {
      await webpush.sendNotification(assinatura, carga, { TTL: 24 * 60 * 60 });
      entregues++;
    } catch (erro) {
      // 404/410 = inscrição morta (app desinstalado, navegador limpo)
      if (erro?.statusCode === 404 || erro?.statusCode === 410) {
        await removerAssinatura(assinatura.endpoint);
        removidos++;
      } else {
        console.error(`Falha ao enviar (${erro?.statusCode ?? "sem código"}):`, erro?.body ?? erro?.message);
      }
    }
  }

  console.log(`"${titulo}" → ${entregues} entregue(s), ${removidos} inscrição(ões) removida(s).`);
  return { entregues, removidos };
}

// ---------------------------------------------------------------- execução

if (!configurarVapid()) process.exit(0);

const tituloAvulso = argumento("titulo");

if (tituloAvulso) {
  // comunicado escrito na hora
  await enviar({
    titulo: tituloAvulso,
    corpo: argumento("corpo") ?? "",
    url: argumento("url") ?? "/",
    tag: "comunicado",
  });
} else {
  const artigos = await lerArtigos();
  const avisados = await lerEstado();

  if (avisados === null) {
    // primeira execução: registra o que já existe sem avisar ninguém
    await gravarEstado(new Set(artigos.map((a) => a.slug)));
    console.log(
      `Primeira execução: ${artigos.length} artigo(s) marcados como já avisados. ` +
        `Os avisos começam a partir do próximo artigo publicado.`
    );
    process.exit(0);
  }

  const novos = artigos.filter((a) => !avisados.has(a.slug)).slice(0, MAX_POR_RODADA);
  if (novos.length === 0) {
    console.log("Nenhum artigo novo para avisar.");
    process.exit(0);
  }

  for (const artigo of novos) {
    await enviar({
      titulo: "Novo artigo no blog",
      corpo: artigo.title,
      url: `/blog/${artigo.slug}`,
      tag: `artigo-${artigo.slug}`,
    });
    avisados.add(artigo.slug);
  }

  // os que passaram do teto entram como avisados na próxima rodada
  await gravarEstado(avisados);
}
