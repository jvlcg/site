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
import { avisosConfigurados, linkDeCancelamento, listarAssinantes } from "../lib/avisos-email.ts";
import { emailConfigurado, enviarEmail, modeloAviso } from "../lib/enviar-email.ts";

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
  const assunto = process.env.VAPID_SUBJECT ?? "https://drjosevictor.com";
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

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjosevictor.com").replace(/\/+$/, "");

/**
 * Manda o aviso por e-mail para quem pediu no cadastro.
 *
 * Roda depois do push e nunca no lugar dele: são canais independentes, e falha
 * de um não pode calar o outro. Um erro num destinatário também não interrompe
 * a fila — endereço que não existe mais é comum, e travaria todo o resto.
 */
async function enviarPorEmail({ titulo, corpo, url }) {
  if (!emailConfigurado() || !avisosConfigurados()) return;

  const assinantes = await listarAssinantes();
  if (assinantes.length === 0) return;

  let entregues = 0;
  const falhas = [];

  for (const a of assinantes) {
    const cancelar = linkDeCancelamento(a.email, SITE);
    const { html, texto } = modeloAviso({
      nome: a.nome || "tudo bem",
      titulo: corpo || titulo,
      resumo: "Saiu conteúdo novo no site.",
      url: url.startsWith("http") ? url : `${SITE}${url}`,
      linkCancelar: cancelar,
    });

    const r = await enviarEmail({
      para: a.email,
      assunto: corpo ? `Novo no blog: ${corpo}` : titulo,
      html,
      texto,
      // o cabeçalho aponta para a API, que aceita o POST do "um clique" do
      // Gmail; o link visível no rodapé leva à página de confirmação
      linkCancelar: `${SITE}/api/avisos?${cancelar.split("?")[1]}`,
    });

    if (r.ok) entregues++;
    else falhas.push(`${a.email}: ${r.erro}`);
  }

  console.log(`  e-mail → ${entregues} de ${assinantes.length} entregue(s)`);
  for (const f of falhas.slice(0, 5)) console.error(`    ! ${f}`);
}

/**
 * Dispara um aviso para todos os aparelhos inscritos.
 * Devolve quantos receberam e quantos foram removidos por não existirem mais.
 */
async function enviar({ titulo, corpo, url, tag }) {
  if (!temPush) return { entregues: 0, removidos: 0 };
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

// O push pode estar desligado e o e-mail ligado, ou o contrário. Encerrar aqui
// por falta de VAPID calaria também os e-mails de quem pediu para receber.
const temPush = configurarVapid();
if (!temPush && !(emailConfigurado() && avisosConfigurados())) {
  console.log("Nenhum canal de aviso configurado — nada a fazer.");
  process.exit(0);
}

const tituloAvulso = argumento("titulo");

if (tituloAvulso) {
  // comunicado escrito na hora
  const aviso = {
    titulo: tituloAvulso,
    corpo: argumento("corpo") ?? "",
    url: argumento("url") ?? "/",
    tag: "comunicado",
  };
  await enviar(aviso);
  await enviarPorEmail(aviso);
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
    const aviso = {
      titulo: "Novo artigo no blog",
      corpo: artigo.title,
      url: `/blog/${artigo.slug}`,
      tag: `artigo-${artigo.slug}`,
    };
    await enviar(aviso);
    await enviarPorEmail(aviso);
    avisados.add(artigo.slug);
  }

  // os que passaram do teto entram como avisados na próxima rodada
  await gravarEstado(avisados);
}
