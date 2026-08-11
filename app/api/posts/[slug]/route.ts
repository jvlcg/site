import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { alunoAtual } from "@/lib/aluno";
import { analisar } from "@/lib/palavroes";
import {
  LIMITE_TEXTO,
  comentar,
  contarVotos,
  identidade,
  interacoesConfiguradas,
  listarComentarios,
  votar,
  votoDe,
  type Voto,
} from "@/lib/interacoes";

/**
 * Reações e comentários de um post do blog.
 *
 * Uma rota só para as duas coisas, e não duas rotas: quem abre o post precisa
 * das duas ao mesmo tempo, e separá-las custaria duas viagens de rede para
 * montar um bloco só. O corpo do POST diz qual das duas é.
 *
 * ## A identidade de quem não tem conta
 *
 * Visitante recebe um identificador aleatório em cookie. Ele **não é** dado
 * pessoal: são 32 caracteres de acaso, sem relação com nome, e-mail ou
 * aparelho. Serve para uma coisa só — saber que este navegador já votou neste
 * post, para o segundo clique desfazer o voto em vez de contar duas vezes.
 *
 * `httpOnly` de propósito: nada no site precisa ler esse valor no navegador, e
 * o que o JavaScript não lê, script de terceiro também não rouba.
 */

const COOKIE_VISITANTE = "visita";
const ANO = 365 * 86_400;

async function quemE(req: NextRequest): Promise<{ id: string; aluno: boolean; nome: string; novo?: string }> {
  const aluno = await alunoAtual();
  if (aluno) return { id: identidade(aluno.email), aluno: true, nome: aluno.nome };

  const existente = req.cookies.get(COOKIE_VISITANTE)?.value;
  if (existente) return { id: identidade(existente), aluno: false, nome: "" };

  const novo = crypto.randomUUID();
  return { id: identidade(novo), aluno: false, nome: "", novo };
}

/** Põe o cookie do visitante na resposta, quando ele acabou de ser criado. */
function comCookie(resposta: NextResponse, novo?: string) {
  if (novo) {
    resposta.cookies.set(COOKIE_VISITANTE, novo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ANO,
    });
  }
  return resposta;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!interacoesConfiguradas()) {
    /*
      Sem banco, a resposta é "vazio", e não erro. O bloco de reações some da
      página sozinho em vez de mostrar mensagem de falha — quem lê o artigo não
      tem o que fazer com um aviso de infraestrutura.
    */
    return NextResponse.json({ disponivel: false, positivos: 0, negativos: 0, meu: null, comentarios: [] });
  }

  const quem = await quemE(req);
  const [contagem, meu, comentarios] = await Promise.all([
    contarVotos(slug),
    votoDe(slug, quem.id),
    listarComentarios(slug),
  ]);

  return comCookie(
    NextResponse.json({ disponivel: true, ...contagem, meu, comentarios }),
    quem.novo
  );
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!interacoesConfiguradas()) {
    return NextResponse.json({ erro: "indisponivel" }, { status: 503 });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "corpo invalido" }, { status: 400 });
  }
  const dados = corpo as { acao?: string; voto?: number; texto?: string; nome?: string };
  const quem = await quemE(req);

  if (dados.acao === "voto") {
    const v = dados.voto === 1 ? 1 : dados.voto === -1 ? -1 : null;
    if (v === null) return NextResponse.json({ erro: "voto invalido" }, { status: 400 });
    const contagem = await votar(slug, quem.id, v as Voto);
    const meu = await votoDe(slug, quem.id);
    return comCookie(NextResponse.json({ ...contagem, meu }), quem.novo);
  }

  if (dados.acao === "comentario") {
    if (typeof dados.texto !== "string" || dados.texto.trim().length < 2) {
      return NextResponse.json({ erro: "texto curto" }, { status: 400 });
    }
    if (dados.texto.length > LIMITE_TEXTO * 2) {
      return NextResponse.json({ erro: "texto longo" }, { status: 413 });
    }
    /*
      O nome de quem tem conta vem da sessão, e nunca do corpo da requisição.
      Aceitar o nome enviado pelo cliente deixaria qualquer pessoa assinar como
      qualquer outra — inclusive como o próprio médico.
    */
    /*
      O filtro roda no SERVIDOR, e não só no navegador.

      Validação de cliente é conforto para quem escreveu — mostra o aviso na
      hora, sem viagem de rede. Não é defesa: quem quiser xingar chama a rota
      direto, sem passar pela nossa tela. A verificação que vale é esta.
    */
    const veredito = analisar(dados.texto);
    if (!veredito.permitido) {
      return NextResponse.json({ erro: "conteudo", motivo: veredito.motivo }, { status: 422 });
    }

    const nome = quem.aluno ? quem.nome : typeof dados.nome === "string" ? dados.nome : "";
    const salvo = await comentar(slug, {
      nome,
      texto: dados.texto,
      aluno: quem.aluno,
      suspeito: veredito.suspeito,
    });
    if (!salvo) return NextResponse.json({ erro: "texto vazio" }, { status: 400 });
    return comCookie(NextResponse.json({ moderacao: true }), quem.novo);
  }

  return NextResponse.json({ erro: "acao desconhecida" }, { status: 400 });
}
