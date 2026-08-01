/**
 * Análise de oportunidade do FAQ.
 *
 *   node scripts/faq-oportunidades.mjs
 *
 * Cruza o que o site já responde (lib/chat-faq.ts) com o que o site já publica
 * (content/artigos/*.mdx) e aponta as lacunas: assunto que aparece nos artigos
 * mas não tem pergunta correspondente, pergunta que o próprio artigo já
 * respondeu e nunca foi promovida ao FAQ, categoria com pouca cobertura.
 *
 * Com `ANTHROPIC_API_KEY` no ambiente, uma segunda etapa pede à IA que redija
 * as perguntas e respostas faltantes já no formato do arquivo, seguindo as
 * mesmas regras de publicidade médica do resto do site.
 *
 * **O script nunca publica nada.** Ele escreve um relatório em
 * `content/faq-oportunidades.md` e o fluxo do GitHub abre um Pull Request com
 * ele. Quem decide o que entra no ar é o médico: são textos que vão ao ar com
 * o nome e o CRM dele, e conteúdo médico não se publica sozinho.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { FAQ_COMPLETO, CATEGORIAS } from "../lib/chat-faq.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const PASTA_ARTIGOS = path.join(RAIZ, "content/artigos");
const SAIDA = path.join(RAIZ, "content/faq-oportunidades.md");

const MODELO = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
/** Quantas perguntas novas pedir à IA por rodada. */
const QUANTAS = 5;

const normalizar = (t) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Palavras vazias: aparecem em tudo e não dizem nada sobre o assunto. */
const VAZIAS = new Set(
  ("a o e de da do das dos em no na nos nas um uma uns umas para por com sem que se " +
    "como qual quais quando onde quem porque e ou mais menos ja nao sim ser esta este " +
    "essa esse isso aquilo seu sua meus minha meu tem ter faz fazer pode posso vai " +
    "sobre entre ate apos antes depois muito pouco todo toda todos todas outro outra " +
    "consulta consultas medico medica paciente pacientes dr").split(" ")
);

const palavras = (texto) => normalizar(texto).split(" ").filter((p) => p.length > 3 && !VAZIAS.has(p));

async function lerArtigos() {
  let arquivos = [];
  try {
    arquivos = (await readdir(PASTA_ARTIGOS)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const artigos = [];
  for (const arquivo of arquivos) {
    const bruto = await readFile(path.join(PASTA_ARTIGOS, arquivo), "utf8");
    const { data, content } = matter(bruto);
    artigos.push({
      slug: arquivo.replace(/\.mdx$/, ""),
      title: data.title ?? arquivo,
      description: data.description ?? "",
      category: data.category ?? "",
      tags: data.tags ?? [],
      faq: Array.isArray(data.faq) ? data.faq : [],
      origem: data.origem ?? "manual",
      corpo: content,
    });
  }
  return artigos;
}

/**
 * Uma pergunta é considerada "já coberta" quando divide vocabulário relevante
 * com alguma pergunta existente. É comparação de palavras, não de sentido —
 * suficiente para não propor de novo o que já está lá, e o julgamento fino fica
 * com quem revisa o relatório.
 */
function jaCoberta(pergunta, existentes) {
  const alvo = new Set(palavras(pergunta));
  if (alvo.size === 0) return true;
  return existentes.some((e) => {
    const outras = new Set(palavras(`${e.q} ${e.full ?? ""}`));
    let comuns = 0;
    for (const p of alvo) if (outras.has(p)) comuns++;
    return comuns / alvo.size >= 0.6;
  });
}

function analisar(artigos) {
  const faq = FAQ_COMPLETO;

  // 1. Perguntas que os próprios artigos já responderam e nunca viraram FAQ.
  //    São as melhores candidatas: o texto já existe e já passou pelo médico.
  const prontas = [];
  for (const a of artigos) {
    for (const item of a.faq) {
      const q = item.q ?? item.question;
      const r = item.a ?? item.answer;
      if (!q || !r) continue;
      if (!jaCoberta(q, faq)) prontas.push({ q, a: r, artigo: a.slug, titulo: a.title });
    }
  }

  // 2. Assuntos publicados sem nenhuma pergunta no FAQ.
  const vocabularioFaq = new Set(faq.flatMap((f) => palavras(`${f.q} ${f.full ?? ""} ${f.a}`)));
  const semCobertura = [];
  for (const a of artigos) {
    const termos = [...new Set([...a.tags.map(String), a.category].filter(Boolean))];
    const orfaos = termos.filter((t) => {
      const ps = palavras(t);
      return ps.length > 0 && !ps.some((p) => vocabularioFaq.has(p));
    });
    if (orfaos.length) semCobertura.push({ artigo: a.slug, titulo: a.title, termos: orfaos });
  }

  // 3. Distribuição por categoria — mostra onde o FAQ está raso.
  const porCategoria = CATEGORIAS.map((c) => ({
    categoria: c,
    total: faq.filter((f) => f.categoria === c).length,
    noChat: faq.filter((f) => f.categoria === c && !f.soPagina).length,
  })).sort((a, b) => a.total - b.total);

  return { prontas, semCobertura, porCategoria };
}

/** Pede à IA que redija as perguntas faltantes já no formato do arquivo. */
async function pedirSugestoes(analise, artigos) {
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) return null;

  const contexto = [
    "PERGUNTAS QUE O SITE JÁ RESPONDE:",
    ...FAQ_COMPLETO.map((f) => `- [${f.categoria}] ${f.full ?? f.q}`),
    "",
    "ARTIGOS PUBLICADOS NO BLOG:",
    ...artigos.map((a) => `- ${a.title} — ${a.description} (tags: ${a.tags.join(", ")})`),
    "",
    "LACUNAS DETECTADAS:",
    ...analise.semCobertura.map((s) => `- "${s.titulo}" trata de ${s.termos.join(", ")}, sem pergunta no FAQ`),
    ...analise.porCategoria.slice(0, 2).map((c) => `- categoria "${c.categoria}" tem só ${c.total} perguntas`),
  ].join("\n");

  const instrucoes = `Você ajuda a manter o FAQ do site de um médico brasileiro (clínica médica, medicina endocanabinoide, medicina esportiva, telemedicina; consultório em Goiânia-GO).

Proponha ${QUANTAS} perguntas NOVAS que pacientes realmente fariam e que o site ainda não responde. Priorize dúvidas que antecedem o agendamento e assuntos que o blog já trata mas o FAQ ignora.

REGRAS OBRIGATÓRIAS (publicidade médica, CFM 2.336/2023) — uma resposta que violar qualquer uma delas é inútil:
- Nunca prometa resultado, cura ou melhora.
- Nunca dê diagnóstico, conduta, tratamento ou dose.
- Nunca cite preço, desconto ou promoção; valores só "informados no agendamento".
- Nunca use superlativo ou autopromoção ("o melhor", "referência", "pioneiro").
- Nunca trate medicina endocanabinoide como especialidade — é área de atuação.
- Nunca faça publicidade de produto à base de cannabis.
- Nunca invente horário, endereço, número, nota de avaliação ou estatística.

FORMATO: devolva SOMENTE um array JSON, sem texto em volta, com objetos:
{"categoria": "Agendamento"|"Consultório"|"Telemedicina"|"Tratamentos"|"Sobre", "q": "rótulo curto do botão", "full": "pergunta completa", "a": "resposta em 2 a 3 parágrafos separados por \\n\\n, podendo usar **negrito**", "cta": true|false, "porque": "em uma frase, por que esta pergunta é uma oportunidade"}`;

  const resposta = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": chave,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 3000,
      system: instrucoes,
      messages: [{ role: "user", content: contexto }],
    }),
  });

  if (!resposta.ok) {
    console.error(`API respondeu ${resposta.status}: ${await resposta.text()}`);
    return null;
  }

  const dados = await resposta.json();
  const texto = (dados.content ?? []).map((b) => b.text ?? "").join("");
  const inicio = texto.indexOf("[");
  const fim = texto.lastIndexOf("]");
  if (inicio < 0 || fim < 0) return null;
  try {
    const sugestoes = JSON.parse(texto.slice(inicio, fim + 1));
    if (!Array.isArray(sugestoes)) return null;
    // segunda peneira: a IA pode repetir algo que já existe
    return sugestoes.filter((s) => s?.q && s?.a && !jaCoberta(s.full ?? s.q, FAQ_COMPLETO));
  } catch (erro) {
    console.error("Resposta da IA não era JSON válido:", erro.message);
    return null;
  }
}

function montarRelatorio({ prontas, semCobertura, porCategoria }, sugestoes, artigos) {
  const hoje = new Date().toISOString().slice(0, 10);
  const l = [];

  l.push(`# Oportunidades para o FAQ — ${hoje}`);
  l.push("");
  l.push(
    "Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**",
    "Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.",
    "Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat."
  );
  l.push("");
  l.push(
    `Situação atual: **${FAQ_COMPLETO.length} perguntas** no site ` +
      `(${FAQ_COMPLETO.filter((f) => !f.soPagina).length} também no chat), ` +
      `**${artigos.length} artigos** publicados.`
  );
  l.push("");

  l.push("## 1. Perguntas já respondidas nos artigos e ausentes do FAQ");
  l.push("");
  if (prontas.length === 0) {
    l.push("_Nenhuma. Todo FAQ de artigo já tem equivalente no site._");
  } else {
    l.push(
      "São as candidatas mais seguras: o texto já foi escrito e revisado para o artigo.",
      ""
    );
    for (const p of prontas) {
      l.push(`### ${p.q}`);
      l.push(`Origem: \`content/artigos/${p.artigo}.mdx\` — ${p.titulo}`);
      l.push("");
      l.push("```ts");
      l.push("{");
      l.push(`  categoria: "Tratamentos", // confira a categoria`);
      l.push(`  q: ${JSON.stringify(p.q)},`);
      l.push(`  a: ${JSON.stringify(p.a)},`);
      l.push("  soPagina: true,");
      l.push("},");
      l.push("```");
      l.push("");
    }
  }
  l.push("");

  l.push("## 2. Assuntos publicados sem pergunta correspondente");
  l.push("");
  if (semCobertura.length === 0) {
    l.push("_Nenhum. Todo assunto do blog aparece de alguma forma no FAQ._");
  } else {
    for (const s of semCobertura) {
      l.push(`- **${s.titulo}** (\`${s.artigo}\`) — sem cobertura para: ${s.termos.join(", ")}`);
    }
  }
  l.push("");

  l.push("## 3. Cobertura por categoria");
  l.push("");
  l.push("| Categoria | Perguntas | Também no chat |");
  l.push("| --- | ---: | ---: |");
  for (const c of porCategoria) l.push(`| ${c.categoria} | ${c.total} | ${c.noChat} |`);
  l.push("");
  l.push("_Ordenado da menor para a maior cobertura._");
  l.push("");

  l.push("## 4. Perguntas sugeridas");
  l.push("");
  if (!sugestoes) {
    l.push(
      "_Etapa não executada: `ANTHROPIC_API_KEY` ausente. As seções 1 a 3 acima são calculadas",
      "direto do conteúdo do site e não dependem de IA._"
    );
  } else if (sugestoes.length === 0) {
    l.push("_A análise não encontrou lacuna relevante nesta rodada._");
  } else {
    l.push(
      "Rascunhos gerados por IA a partir das lacunas acima. **Leia e edite antes de usar** —",
      "o texto sai com o nome e o CRM do médico.",
      ""
    );
    for (const s of sugestoes) {
      l.push(`### ${s.full ?? s.q}`);
      if (s.porque) l.push(`_Por que agora:_ ${s.porque}`);
      l.push("");
      l.push("```ts");
      l.push("{");
      l.push(`  categoria: ${JSON.stringify(s.categoria ?? "Sobre")},`);
      l.push(`  q: ${JSON.stringify(s.q)},`);
      if (s.full) l.push(`  full: ${JSON.stringify(s.full)},`);
      l.push(`  a: ${JSON.stringify(s.a)},`);
      if (s.cta) l.push("  cta: true,");
      l.push("},");
      l.push("```");
      l.push("");
    }
  }

  l.push("---");
  l.push("");
  l.push(
    "Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:",
    "sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e",
    "medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade."
  );
  l.push("");

  return l.join("\n");
}

const artigos = await lerArtigos();
const analise = analisar(artigos);
const sugestoes = await pedirSugestoes(analise, artigos);
await writeFile(SAIDA, montarRelatorio(analise, sugestoes, artigos), "utf8");

console.log(
  `Relatório em content/faq-oportunidades.md — ` +
    `${analise.prontas.length} pergunta(s) pronta(s) nos artigos, ` +
    `${analise.semCobertura.length} artigo(s) sem cobertura, ` +
    `${sugestoes ? sugestoes.length : 0} sugestão(ões) da IA.`
);
