import { CABECALHOS_API, corpoLimitado, mesmaOrigem } from "@/lib/api-guard";
import { alunoAtual } from "@/lib/aluno";
import { aulasDo, getAula, getCurso } from "@/lib/cursos";
import { lerProgresso, marcarAula, pontosConfigurados } from "@/lib/pontos";

/**
 * Marca uma aula como assistida.
 *
 * Quem decide o que conta é o servidor: a rota confere que o curso existe, que
 * a aula pertence a ele e que quem pede está logado. Aceitar o slug que chega
 * sem conferir permitiria marcar aulas inventadas — e o ponto de conclusão é
 * lançado quando a contagem bate o total, então aulas fantasma virariam pontos.
 */

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

export async function GET(req: Request) {
  const aluno = await alunoAtual();
  if (!aluno || !pontosConfigurados()) return responde({ aulas: [] });

  const curso = new URL(req.url).searchParams.get("curso");
  if (!curso || !getCurso(curso)) return responde({ aulas: [] });

  return responde(await lerProgresso(aluno.email, curso));
}

export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return new Response("Not Found", { status: 404, headers: CABECALHOS_API });

  const aluno = await alunoAtual();
  if (!aluno) return responde({ erro: "entre para marcar aulas" }, 401);
  if (!pontosConfigurados()) return responde({ erro: "indisponivel" }, 503);

  const corpo = (await corpoLimitado(req, 500)) as { curso?: unknown; aula?: unknown } | null;
  if (typeof corpo?.curso !== "string" || typeof corpo?.aula !== "string") {
    return responde({ erro: "dados invalidos" }, 400);
  }

  const curso = getCurso(corpo.curso);
  if (!curso) return responde({ erro: "curso nao encontrado" }, 404);
  if (!getAula(curso, corpo.aula)) return responde({ erro: "aula nao encontrada" }, 404);

  const progresso = await marcarAula(
    aluno.email,
    curso.slug,
    corpo.aula,
    aulasDo(curso).length,
    curso.titulo,
    aluno.nome
  );
  return progresso ? responde(progresso) : responde({ erro: "nao foi possivel gravar" }, 503);
}
