import { CURSOS, type Aula, type Curso, type Modulo } from "@/content/cursos";

/**
 * Regras de acesso aos cursos.
 *
 * Todo o poder de decisão sobre quem vê o quê está neste arquivo, e é de
 * propósito: espalhar essa lógica pelas páginas é como um conteúdo pago acaba
 * aberto por engano numa rota que alguém esqueceu de proteger.
 *
 * As páginas perguntam, este arquivo responde. E ele responde do lado do
 * servidor — nada aqui roda no navegador, então nenhuma verificação pode ser
 * contornada pelo visitante.
 */

export type { Aula, Curso, Modulo };

/** Só os cursos publicados. Não publicado não existe: nem no catálogo, nem por URL. */
export const cursosPublicados = () => CURSOS.filter((c) => c.publicado);

export function getCurso(slug: string): Curso | undefined {
  return cursosPublicados().find((c) => c.slug === slug);
}

/** Todas as aulas do curso em ordem, achatando os módulos. */
export function aulasDo(curso: Curso): Aula[] {
  return curso.modulos.flatMap((m) => m.aulas);
}

export function getAula(curso: Curso, slug: string): Aula | undefined {
  return aulasDo(curso).find((a) => a.slug === slug);
}

/** Aula anterior e seguinte, para a navegação no fim do player. */
export function vizinhas(curso: Curso, slug: string) {
  const todas = aulasDo(curso);
  const i = todas.findIndex((a) => a.slug === slug);
  return { anterior: todas[i - 1], proxima: todas[i + 1] };
}

export const totalDeAulas = (curso: Curso) => aulasDo(curso).length;

// ─────────────────────────────────────────────────────────── acesso

/** Por que a aula está trancada, quando está. */
export type Bloqueio =
  | { tipo: "liberado" }
  /** Precisa entrar com a conta. */
  | { tipo: "precisaEntrar" }
  /** Entrou, mas não tem a matrícula deste curso. */
  | { tipo: "precisaMatricula" }
  /** Tem tudo, mas a aula ainda não abriu. */
  | { tipo: "aguardaLiberacao"; dias: number; abreEm: Date };

export type Aluno = { email: string; nome: string } | null;
/** Data em que a matrícula foi criada, ou `null` se não houver matrícula. */
export type Matricula = { criadoEm: string } | null;

/**
 * Decide se esta pessoa pode ver esta aula, agora.
 *
 * A ordem das perguntas importa e não é acidental: primeiro o que é do curso
 * (é livre?), depois o que é da pessoa (entrou? tem matrícula?), e só por
 * último o que é do tempo (a aula já abriu?). Perguntar do tempo antes da
 * matrícula diria a um desconhecido em quantos dias uma aula abre — informação
 * de aluno, dada a quem não é.
 */
export function podeVer(
  curso: Curso,
  aula: Aula,
  aluno: Aluno,
  matricula: Matricula
): Bloqueio {
  if (curso.acesso === "livre") return { tipo: "liberado" };

  if (!aluno) return { tipo: "precisaEntrar" };

  /**
   * Curso `cadastro` é de graça: entrar já basta, e a matrícula é criada no
   * momento em que a pessoa entra. Se por algum motivo ela não existir ainda,
   * tratamos como recém-criada — negar acesso a conteúdo gratuito por causa de
   * um registro que deveria ter sido gravado sozinho seria punir a pessoa por
   * uma falha nossa.
   */
  const inscricao =
    matricula ?? (curso.acesso === "cadastro" ? { criadoEm: new Date().toISOString() } : null);

  if (!inscricao) return { tipo: "precisaMatricula" };

  const espera = aula.liberaApos ?? 0;
  if (espera > 0) {
    const abreEm = new Date(inscricao.criadoEm);
    abreEm.setDate(abreEm.getDate() + espera);
    if (abreEm > new Date()) {
      const dias = Math.ceil((abreEm.getTime() - Date.now()) / 86_400_000);
      return { tipo: "aguardaLiberacao", dias, abreEm };
    }
  }

  return { tipo: "liberado" };
}

/**
 * Uma aula livre pode ser indexada pelo Google; as outras, não.
 *
 * Não é só etiqueta de SEO: página de curso pago que entra no índice vira
 * reclamação de quem clica no resultado e encontra uma porta fechada.
 */
export const aulaIndexavel = (curso: Curso) => curso.acesso === "livre";
