import { CABECALHOS_API, corpoLimitado, mesmaOrigem } from "@/lib/api-guard";
import { COOKIE, areaConfigurada, bilheteValido, lerCookie } from "@/lib/area-restrita";
import { EVENTOS, lancar, listarContas, pontosConfigurados, type TipoEvento } from "@/lib/pontos";

/**
 * Pontos — ver as contas e lançar reconhecimento. Só o Dr. José Victor.
 *
 * Mesma autenticação da área restrita, pelo mesmo motivo das matrículas: uma
 * segunda senha seria mais uma para gerenciar e mais uma para vazar,
 * protegendo dados menos sensíveis do que aquela já protege.
 *
 * A sessão de **aluno** não vale nada aqui. Se valesse, qualquer pessoa com
 * conta poderia lançar pontos para si mesma — que é o jeito mais óbvio de
 * quebrar um sistema de recompensa.
 */

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

const naoEncontrado = () => new Response("Not Found", { status: 404, headers: CABECALHOS_API });

const autenticado = (req: Request) => areaConfigurada() && bilheteValido(lerCookie(req, COOKIE));

const emailValido = (e: unknown): e is string =>
  typeof e === "string" && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e.trim()) && e.length < 160;

export async function GET(req: Request) {
  if (!autenticado(req)) return naoEncontrado();
  if (!pontosConfigurados()) return responde({ erro: "banco indisponivel" }, 503);
  return responde({ contas: await listarContas() });
}

/**
 * Lança um evento à mão.
 *
 * Só `reconhecimento` é aceito daqui. Os outros eventos têm origem própria e
 * automática — deixar a rota lançar `indicacaoConfirmada`, por exemplo,
 * contornaria as três travas anti-fraude que existem justamente para
 * controlá-lo.
 */
export async function POST(req: Request) {
  if (!mesmaOrigem(req) || !autenticado(req)) return naoEncontrado();
  if (!pontosConfigurados()) return responde({ erro: "banco indisponivel" }, 503);

  const corpo = (await corpoLimitado(req, 1_000)) as {
    email?: unknown;
    tipo?: unknown;
    nota?: unknown;
  } | null;

  if (!emailValido(corpo?.email)) return responde({ erro: "E-mail inválido." }, 400);

  const tipo = corpo?.tipo as TipoEvento;
  if (tipo !== "reconhecimento" || !(tipo in EVENTOS)) {
    return responde({ erro: "Só é possível lançar reconhecimento por aqui." }, 400);
  }

  const conta = await lancar(
    corpo.email.trim().toLowerCase(),
    tipo,
    typeof corpo.nota === "string" ? corpo.nota.slice(0, 80) : undefined
  );
  return conta ? responde({ conta }) : responde({ erro: "Não foi possível gravar." }, 503);
}
