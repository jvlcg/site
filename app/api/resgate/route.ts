import { CABECALHOS_API, corpoLimitado, mesmaOrigem } from "@/lib/api-guard";
import { alunoAtual, buscarMatricula, matricular, matriculasConfiguradas } from "@/lib/aluno";
import { acessoAgora, getCurso } from "@/lib/cursos";
import { contaDe, podeResgatar, registrarResgate, resgateAtivo } from "@/lib/pontos";

/**
 * Resgate de curso pago como recompensa.
 *
 * **Desligado até `RESGATE_ATIVO=1` existir na Vercel.** Não é interruptor
 * técnico: curso dado como prêmio tem tratamento contábil próprio, e ligar
 * antes de o contador dizer como declarar cria passivo retroativo — o tipo de
 * coisa que só aparece na fiscalização, com multa.
 *
 * Com o resgate desligado, a rota responde 503 e a tela do aluno nem mostra o
 * botão. Ligar depois não exige mexer em código.
 *
 * ## O que a rota confere, e por quê
 *
 * Tudo do lado do servidor, e nesta ordem:
 *
 * 1. **Está ligado?** Senão, nada acontece.
 * 2. **Quem é?** Sessão de aluno válida.
 * 3. **O curso existe e é pago?** Resgatar curso aberto não faz sentido, e
 *    aceitar o pedido gastaria o direito da pessoa por nada.
 * 4. **Já tem esse curso?** Idem — não se gasta um resgate no que já se tem.
 * 5. **O nível permite?** Prata dá um; Ouro dá todos. A contagem sai do
 *    extrato, e não de um contador à parte que poderia divergir dele.
 *
 * O registro do resgate vem **antes** da matrícula de propósito. Se a ordem
 * fosse a inversa e a segunda gravação falhasse, a pessoa ficaria com o curso
 * e com o direito ainda por usar — e o erro seria a favor de quem pediu, o que
 * torna o problema invisível até virar hábito.
 */

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  if (!resgateAtivo()) return responde({ erro: "resgate indisponivel" }, 503);
  if (!matriculasConfiguradas()) return responde({ erro: "indisponivel" }, 503);

  const aluno = await alunoAtual();
  if (!aluno) return responde({ erro: "entre para resgatar" }, 401);

  const corpo = (await corpoLimitado(req, 500)) as { curso?: unknown } | null;
  if (typeof corpo?.curso !== "string") return responde({ erro: "dados invalidos" }, 400);

  const curso = getCurso(corpo.curso);
  if (!curso) return responde({ erro: "curso nao encontrado" }, 404);
  if (acessoAgora(curso) !== "pago") {
    return responde({ erro: "Este curso não é pago — não há o que resgatar." }, 400);
  }

  const jaTem = await buscarMatricula(aluno.email, curso.slug);
  if (jaTem) return responde({ erro: "Você já tem acesso a este curso." }, 400);

  const conta = await contaDe(aluno.email, aluno.nome);
  if (!conta) return responde({ erro: "indisponivel" }, 503);

  const elegivel = await podeResgatar(aluno.email, conta.total);
  if (!elegivel.pode) {
    const motivos = {
      desligado: "O resgate ainda não está disponível.",
      nivel: "Você ainda não chegou ao nível que permite resgatar.",
      jaResgatou: "Você já usou seu resgate. O nível Ouro libera todos os cursos.",
    };
    return responde({ erro: motivos[elegivel.motivo] }, 403);
  }

  await registrarResgate(aluno.email, curso.slug, aluno.nome);

  const ok = await matricular({
    email: aluno.email,
    nome: aluno.nome,
    curso: curso.slug,
    /**
     * `manual` e não uma origem nova.
     *
     * `Matricula["origem"]` tem três valores, e acrescentar um quarto obrigaria
     * a mexer no painel, no tipo e nos rótulos por uma distinção que já está
     * registrada onde importa: o extrato de pontos, com "Resgate: <curso>".
     */
    origem: "manual",
  });

  return ok
    ? responde({ resgatado: true, curso: curso.slug })
    : responde({ erro: "Não foi possível liberar agora." }, 503);
}
