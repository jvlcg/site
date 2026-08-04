import { CABECALHOS_API, corpoLimitado, mesmaOrigem } from "@/lib/api-guard";
import { COOKIE, areaConfigurada, bilheteValido, lerCookie } from "@/lib/area-restrita";
import {
  cancelarMatricula,
  listarMatriculas,
  matricular,
  matriculasConfiguradas,
} from "@/lib/aluno";
import { getCurso } from "@/lib/cursos";

/**
 * Matrículas — liberar, listar e cancelar. Só o Dr. José Victor.
 *
 * A autenticação é a mesma da área restrita, e usa o mesmo cookie de propósito:
 * uma segunda senha para o painel de cursos seria mais uma senha para gerenciar
 * e mais uma para vazar, protegendo dados menos sensíveis que os que aquela
 * senha já protege.
 *
 * A sessão de **aluno** não vale nada aqui. São dois cookies diferentes, e um
 * aluno logado que chame esta rota recebe 404 como qualquer desconhecido.
 */

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

const naoEncontrado = () => new Response("Not Found", { status: 404, headers: CABECALHOS_API });

const autenticado = (req: Request) =>
  areaConfigurada() && bilheteValido(lerCookie(req, COOKIE));

const emailValido = (e: unknown): e is string =>
  typeof e === "string" && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e.trim()) && e.length < 160;

export async function GET(req: Request) {
  if (!autenticado(req)) return naoEncontrado();
  if (!matriculasConfiguradas()) return responde({ erro: "banco indisponivel" }, 503);
  return responde({ matriculas: await listarMatriculas() });
}

/** Liberar acesso a um curso, à mão. */
export async function POST(req: Request) {
  if (!mesmaOrigem(req) || !autenticado(req)) return naoEncontrado();
  if (!matriculasConfiguradas()) return responde({ erro: "banco indisponivel" }, 503);

  const corpo = (await corpoLimitado(req, 1_000)) as {
    email?: unknown;
    nome?: unknown;
    curso?: unknown;
  } | null;

  if (!emailValido(corpo?.email)) return responde({ erro: "E-mail inválido." }, 400);
  if (typeof corpo?.curso !== "string" || !getCurso(corpo.curso)) {
    return responde({ erro: "Curso não encontrado." }, 400);
  }

  const ok = await matricular({
    email: corpo.email.trim().toLowerCase(),
    nome: typeof corpo.nome === "string" ? corpo.nome.slice(0, 120) : "",
    curso: corpo.curso,
    origem: "manual",
  });
  return ok ? responde({ liberado: true }) : responde({ erro: "Não foi possível gravar." }, 503);
}

export async function DELETE(req: Request) {
  if (!mesmaOrigem(req) || !autenticado(req)) return naoEncontrado();

  const corpo = (await corpoLimitado(req, 1_000)) as { email?: unknown; curso?: unknown } | null;
  if (!emailValido(corpo?.email) || typeof corpo?.curso !== "string") {
    return responde({ erro: "Dados inválidos." }, 400);
  }

  const ok = await cancelarMatricula(corpo.email, corpo.curso);
  return ok ? responde({ cancelado: true }) : responde({ erro: "Não foi possível apagar." }, 503);
}
