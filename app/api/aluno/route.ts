import {
  CABECALHOS_API,
  corpoLimitado,
  excedeuLimite,
  excedeuTetoGlobal,
  identifica,
  mesmaOrigem,
} from "@/lib/api-guard";
import {
  alunoAtual,
  criarSessao,
  matricular,
  matriculasConfiguradas,
  opcoesCookie,
  sessaoConfigurada,
} from "@/lib/aluno";
import { acessoAgora, getCurso } from "@/lib/cursos";
import { verificarIdentidade } from "@/lib/google-identidade";

/**
 * Entrada e saída do aluno.
 *
 * A identidade vem do Google, verificada no servidor pelo mesmo código que o
 * cadastro usa. Não existe senha aqui, e isso é uma escolha, não uma economia:
 * senha que o site guarda é senha que o site pode vazar, e um consultório não
 * tem por que assumir essa responsabilidade para dar acesso a videoaula.
 */

const responde = (corpo: unknown, status = 200, cabecalhos?: HeadersInit) =>
  Response.json(corpo, { status, headers: { ...CABECALHOS_API, ...cabecalhos } });

/**
 * Quem está logado agora.
 *
 * Devolve `{ aluno: null }` quando não há ninguém — e não 401. Não estar
 * logado é a resposta normal para a maioria das visitas, não um erro: é o
 * cabeçalho perguntando se deve mostrar "Entrar" ou o nome da pessoa.
 *
 * Só nome e e-mail saem daqui, que é tudo o que a sessão guarda. Não há como
 * esta rota vazar dado clínico porque a sessão de aluno não alcança nenhum.
 */
export async function GET() {
  const aluno = await alunoAtual();
  return responde({ aluno });
}

export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  if (!sessaoConfigurada()) return responde({ erro: "entrada indisponivel" }, 503);
  if (excedeuTetoGlobal()) return responde({ erro: "indisponivel" }, 503);

  const quem = identifica(req);
  if (excedeuLimite(`aluno:${quem}`, 10, 60_000)) {
    return responde({ erro: "Muitas tentativas. Tente novamente daqui a pouco." }, 429);
  }

  const corpo = (await corpoLimitado(req, 6_000)) as { credencial?: unknown; curso?: unknown };
  const identidade = await verificarIdentidade(corpo?.credencial);
  if (!identidade) return responde({ erro: "Não foi possível confirmar sua conta." }, 401);

  const valor = criarSessao(identidade);
  if (!valor) return responde({ erro: "entrada indisponivel" }, 503);

  /**
   * Curso gratuito com cadastro matricula na hora da entrada.
   *
   * É o que dá à liberação gradual uma data de início. Falhar aqui não impede
   * a entrada: a pessoa fica logada, e `podeVer` trata matrícula ausente em
   * curso gratuito como recém-criada.
   */
  const slug = typeof corpo?.curso === "string" ? corpo.curso : null;
  if (slug && matriculasConfiguradas()) {
    const curso = getCurso(slug);
    /**
     * `acessoAgora` e não `curso.acesso`: durante a janela de lançamento, um
     * curso pago vale como gratuito com conta, e é **aqui** que a matrícula do
     * lançamento é criada.
     *
     * É a linha que cumpre a promessa da promoção. Quem entra hoje, de graça,
     * fica com um registro de matrícula que não vence quando a janela fecha —
     * e `podeVer`, daí em diante, olha para a matrícula, não para a data.
     */
    if (curso && acessoAgora(curso) === "cadastro") {
      await matricular({ ...identidade, curso: slug, origem: "cadastro" });
    }
  }

  const resposta = responde({ entrou: true, nome: identidade.nome });
  resposta.headers.append(
    "Set-Cookie",
    [
      `${opcoesCookie.name}=${valor}`,
      `Path=${opcoesCookie.path}`,
      `Max-Age=${opcoesCookie.maxAge}`,
      `SameSite=Lax`,
      "HttpOnly",
      ...(opcoesCookie.secure ? ["Secure"] : []),
    ].join("; ")
  );
  return resposta;
}

/** Sair. Apaga o cookie zerando a validade. */
export async function DELETE(req: Request) {
  if (!mesmaOrigem(req)) return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  const resposta = responde({ saiu: true });
  resposta.headers.append(
    "Set-Cookie",
    `${opcoesCookie.name}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly${opcoesCookie.secure ? "; Secure" : ""}`
  );
  return resposta;
}
