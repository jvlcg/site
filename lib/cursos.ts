import { CURSOS, type Aula, type Curso, type Modulo } from "@/content/cursos";
import { CAPAS_LOCAIS } from "@/content/capas-locais";

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

// ─────────────────────────────────────────────────────────── tempo

/**
 * Uma data escrita como "2026-09-30" vale até o fim daquele dia.
 *
 * `new Date("2026-09-30")` é meia-noite **em UTC**, o que no Brasil é 21h do
 * dia 29. Uma promoção "até 30 de setembro" acabaria três horas antes do dia
 * 30 começar — e o erro só apareceria na virada, com a pessoa reclamando de
 * ter perdido um prazo que ainda não tinha vencido.
 */
function fimDoDia(data: string): Date {
  const [ano, mes, dia] = data.split("-").map(Number);
  // -03:00 é o fuso de Goiânia; o site é para pacientes daqui.
  return new Date(Date.UTC(ano, mes - 1, dia, 23 + 3, 59, 59));
}

/** A janela de lançamento gratuito ainda está aberta? */
export function naJanelaGratuita(curso: Curso, agora = new Date()): boolean {
  return !!curso.gratuitoAte && fimDoDia(curso.gratuitoAte) >= agora;
}

/**
 * O nível de acesso que vale **agora**, considerando a janela de lançamento.
 *
 * Durante a janela, um curso pago se comporta como `cadastro`: de graça, mas
 * com conta. A conta não é obstáculo — é o que cria a matrícula, e é a
 * matrícula que faz quem entrou de graça continuar tendo acesso depois que a
 * janela fecha.
 */
export function acessoAgora(curso: Curso, agora = new Date()): Curso["acesso"] {
  if (curso.acesso === "livre") return "livre";
  return naJanelaGratuita(curso, agora) ? "cadastro" : curso.acesso;
}

/** Quando o acesso deste aluno termina. `null` = vitalício. */
export function fimDoAcesso(curso: Curso, matricula: { criadoEm: string }): Date | null {
  if (!curso.acessoPor) return null;
  const fim = new Date(matricula.criadoEm);
  fim.setDate(fim.getDate() + curso.acessoPor);
  return fim;
}

/** "acesso vitalício" ou "acesso por 12 meses" — o texto que vai na página. */
export function textoDoAcesso(curso: Curso): string {
  if (!curso.acessoPor) return "Acesso vitalício";
  const meses = Math.round(curso.acessoPor / 30);
  if (curso.acessoPor >= 365 && curso.acessoPor % 365 === 0) {
    const anos = curso.acessoPor / 365;
    return `Acesso por ${anos} ano${anos === 1 ? "" : "s"}`;
  }
  return meses >= 1
    ? `Acesso por ${meses} ${meses === 1 ? "mês" : "meses"}`
    : `Acesso por ${curso.acessoPor} dias`;
}

/** "30 de setembro" — para dizer até quando a promoção vale. */
export const dataPorExtenso = (data: string) =>
  fimDoDia(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

// ─────────────────────────────────────────────────────────── acesso

/** Por que a aula está trancada, quando está. */
export type Bloqueio =
  | { tipo: "liberado" }
  /** Precisa entrar com a conta. */
  | { tipo: "precisaEntrar" }
  /** Entrou, mas não tem a matrícula deste curso. */
  | { tipo: "precisaMatricula" }
  /** Tem tudo, mas a aula ainda não abriu. */
  | { tipo: "aguardaLiberacao"; dias: number; abreEm: Date }
  /** Teve acesso, e o prazo acabou. */
  | { tipo: "expirado"; expirouEm: Date };

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
  /**
   * O nível considerado é o de agora, não o do arquivo: um curso pago dentro
   * da janela de lançamento vale como gratuito com conta.
   */
  const nivel = acessoAgora(curso);

  if (nivel === "livre") return { tipo: "liberado" };

  if (!aluno) return { tipo: "precisaEntrar" };

  /**
   * Curso `cadastro` é de graça: entrar já basta, e a matrícula é criada no
   * momento em que a pessoa entra. Se por algum motivo ela não existir ainda,
   * tratamos como recém-criada — negar acesso a conteúdo gratuito por causa de
   * um registro que deveria ter sido gravado sozinho seria punir a pessoa por
   * uma falha nossa.
   */
  const inscricao =
    matricula ?? (nivel === "cadastro" ? { criadoEm: new Date().toISOString() } : null);

  if (!inscricao) return { tipo: "precisaMatricula" };

  /**
   * O prazo é conferido antes da liberação gradual, e não depois.
   *
   * Quem teve o acesso encerrado não deve receber "esta aula abre em 5 dias":
   * é informação de aluno ativo, e prometeria uma abertura que não vai
   * acontecer.
   */
  const fim = fimDoAcesso(curso, inscricao);
  if (fim && fim < new Date()) return { tipo: "expirado", expirouEm: fim };

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

// ─────────────────────────────────────────────── dados de vídeo

/**
 * Converte "12 min" ou "1 h 20 min" no formato que o Google entende: `PT12M`,
 * `PT1H20M`.
 *
 * O campo `duracao` é texto livre porque é ele que aparece na tela, e "12 min"
 * se lê melhor que "PT12M". O Google, porém, só aceita a norma ISO 8601 — daí
 * a tradução. Texto que não casa devolve `undefined`, e a duração some do dado
 * estruturado em vez de entrar errada.
 */
export function duracaoISO(texto?: string): string | undefined {
  if (!texto) return undefined;
  const horas = texto.match(/(\d+)\s*h/i)?.[1];
  const minutos = texto.match(/(\d+)\s*m/i)?.[1];
  if (!horas && !minutos) return undefined;
  return `PT${horas ? `${horas}H` : ""}${minutos ? `${minutos}M` : ""}`;
}

/**
 * Endereço da capa da aula.
 *
 * Ordem: a capa própria, se houver; senão a que o site guarda em `public/capas`;
 * e o YouTube só como último recurso.
 *
 * **A do próprio site vem antes de propósito.** Apontar para `i.ytimg.com`
 * funciona para a maioria e falha calado para uma parte que não é pequena:
 * bloqueador de anúncios, extensão de privacidade e DNS filtrado barram aquele
 * domínio junto com o resto do Google, e quem tem qualquer um dos três via um
 * retângulo vazio no lugar do convite para assistir.
 *
 * Servida daqui, a imagem não tem terceiro envolvido — não há o que bloquear. E
 * some uma requisição ao Google em toda visita ao catálogo, o que combina com o
 * resto: aqui o YouTube só entra depois que a pessoa clica em assistir.
 *
 * As imagens são geradas por `scripts/baixar-capas.mjs` e versionadas junto do
 * código. O caminho é montado pelo identificador do vídeo, então publicar uma
 * aula nova é rodar o script e fazer o commit da imagem.
 */
export function capaDa(aula: Aula): string | undefined {
  if (aula.capa) return aula.capa;
  if (aula.video.tipo !== "youtube") return undefined;
  return CAPAS_LOCAIS.has(aula.video.id)
    ? `/capas/${aula.video.id}.webp`
    : `https://i.ytimg.com/vi/${aula.video.id}/hqdefault.jpg`;
}

/**
 * Uma aula livre pode ser indexada pelo Google; as outras, não.
 *
 * Não é só etiqueta de SEO: página de curso pago que entra no índice vira
 * reclamação de quem clica no resultado e encontra uma porta fechada.
 */
export const aulaIndexavel = (curso: Curso) => curso.acesso === "livre";
