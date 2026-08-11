import { NextResponse } from "next/server";
import { CABECALHOS_API, corpoLimitado, mesmaOrigem } from "@/lib/api-guard";
import { COOKIE, bilheteValido, lerCookie } from "@/lib/area-restrita";
import { getAllArticles } from "@/lib/articles";
import { aprovar, interacoesConfiguradas, listarPendentes, remover } from "@/lib/interacoes";

/**
 * Fila de moderação dos comentários.
 *
 * Atrás da mesma senha da área restrita, e não de uma senha nova: mais um
 * segredo para o Dr. José Victor guardar seria mais um segredo para perder, e
 * quem já entrou na área restrita tem acesso a dados mais sensíveis que estes.
 *
 * ## Por que a fila varre todos os posts
 *
 * Não existe índice global de pendentes de propósito. Manter um índice
 * paralelo significa mantê-lo em sincronia com as listas por post, e todo par
 * de estruturas que precisa concordar acaba discordando — normalmente no dia
 * em que uma escrita falha no meio.
 *
 * Varrer é barato aqui: são poucas dezenas de artigos, uma leitura por artigo,
 * e a página de moderação é aberta por uma pessoa só, algumas vezes por
 * semana. Correção vale mais que microssegundos nesta rota.
 */

function autorizado(req: Request): boolean {
  return bilheteValido(lerCookie(req, COOKIE));
}

export async function GET(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: "nao autorizado" }, { status: 401, headers: CABECALHOS_API });
  }
  if (!interacoesConfiguradas()) {
    return NextResponse.json({ disponivel: false, pendentes: [] }, { headers: CABECALHOS_API });
  }

  const artigos = getAllArticles();
  const listas = await Promise.all(
    artigos.map(async (a) => {
      const pendentes = await listarPendentes(a.slug);
      return pendentes.map((c) => ({ ...c, slug: a.slug, titulo: a.title }));
    })
  );

  const pendentes = listas
    .flat()
    // mais antigo primeiro: quem esperou mais é atendido antes
    .sort((x, y) => x.criadoEm.localeCompare(y.criadoEm));

  return NextResponse.json({ disponivel: true, pendentes }, { headers: CABECALHOS_API });
}

export async function POST(req: Request) {
  /*
    `mesmaOrigem` é o que impede outro site de aprovar comentário no nosso.
    Sem isso, uma página maliciosa poderia disparar esta rota usando o cookie
    do navegador de quem estiver logado — o clássico pedido forjado entre
    sites. `SameSite: Strict` no cookie já cobre a maior parte dos casos; esta
    verificação é a segunda tranca.
  */
  if (!mesmaOrigem(req)) {
    return NextResponse.json({ erro: "origem invalida" }, { status: 403, headers: CABECALHOS_API });
  }
  if (!autorizado(req)) {
    return NextResponse.json({ erro: "nao autorizado" }, { status: 401, headers: CABECALHOS_API });
  }

  const corpo = (await corpoLimitado(req, 2_000)) as
    | { slug?: unknown; id?: unknown; acao?: unknown }
    | null;

  if (typeof corpo?.slug !== "string" || typeof corpo?.id !== "string") {
    return NextResponse.json({ erro: "dados invalidos" }, { status: 400, headers: CABECALHOS_API });
  }

  const ok =
    corpo.acao === "aprovar"
      ? await aprovar(corpo.slug, corpo.id)
      : corpo.acao === "remover"
        ? await remover(corpo.slug, corpo.id)
        : null;

  if (ok === null) {
    return NextResponse.json({ erro: "acao desconhecida" }, { status: 400, headers: CABECALHOS_API });
  }
  return NextResponse.json({ ok }, { headers: CABECALHOS_API });
}
