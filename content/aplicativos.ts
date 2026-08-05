/**
 * Catálogo de aplicativos.
 *
 * Três coleções, e a separação entre elas não é estética — é o que protege
 * quem lê e quem assina embaixo:
 *
 *   `autoral`      — feitos pelo Dr. José Victor.
 *   `recomendado`  — feitos por terceiros, indicados por ele.
 *   `diversos`     — fora do tema, sem relação com saúde.
 *
 * ────────────────────────────────────────────────────────────────────
 * COMO ACRESCENTAR UM APLICATIVO
 * ────────────────────────────────────────────────────────────────────
 *
 * 1. Copie um bloco abaixo e cole na coleção certa.
 * 2. Preencha. Só `slug`, `nome`, `coleção`, `resumo` e `publicado` são
 *    obrigatórios — o resto aparece se existir.
 * 3. Vire `publicado: true` e peça o commit.
 *
 * ────────────────────────────────────────────────────────────────────
 * O QUE NÃO ESCREVER AQUI
 * ────────────────────────────────────────────────────────────────────
 *
 * Aplicativo indicado por médico é lido como conselho médico, mesmo quando a
 * intenção era só "achei útil". Por isso:
 *
 * - **Nada de promessa de resultado.** "Ajuda a organizar os horários" pode;
 *   "melhora a adesão ao tratamento" é afirmação clínica sem estudo atrás.
 * - **Nada que substitua avaliação.** App que mede pressão, conta calorias ou
 *   sugere diagnóstico entra só com a ressalva escrita, no campo `alerta`.
 * - **Sem patrocínio disfarçado.** Se houver qualquer relação comercial com o
 *   aplicativo, o campo `vinculo` é obrigatório e aparece no cartão. Publicidade
 *   de terceiro sem identificação é infração de publicidade médica, e é também
 *   a coisa que mais rápido queima a confiança de quem lê.
 * - **`publico` diz para quem é.** Um app de prescrição não deve ser oferecido
 *   ao paciente como se fosse para ele.
 */

export type Publico = "medicos" | "pacientes" | "todos";
export type Colecao = "autoral" | "recomendado" | "diversos";

export type Aplicativo = {
  /** Identificador curto. Só minúsculas, números e hífen. */
  slug: string;
  nome: string;
  colecao: Colecao;
  /** Uma ou duas frases sobre o que ele faz. Sem promessa de resultado. */
  resumo: string;
  /** Para quem serve. Aparece como etiqueta no cartão. */
  publico?: Publico;
  /** Categoria livre: "Agenda", "Cálculo", "Leitura", "Estudo". */
  categoria?: string;
  /** Onde baixar ou usar. Sem link, o cartão aparece sem botão. */
  links?: { rotulo: string; url: string }[];
  /** Plataformas: "iPhone", "Android", "Navegador". */
  plataformas?: string[];
  /** "Gratuito", "Gratuito com plano pago", "Pago". */
  preco?: string;
  /**
   * Relação comercial com o aplicativo, se houver — patrocínio, afiliação,
   * sociedade. Aparece em destaque no cartão. Ausente = nenhuma.
   */
  vinculo?: string;
  /**
   * Ressalva que precisa ser lida junto do aplicativo. Aparece dentro do
   * cartão, e não em letra miúda no rodapé.
   */
  alerta?: string;
  /** Enquanto `false`, não aparece em lugar nenhum. */
  publicado: boolean;
};

export const APLICATIVOS: Aplicativo[] = [
  // ────────────────────────────────────────────────────────────────
  // MODELO — copie, cole acima e troque o conteúdo.
  //
  // {
  //   slug: "nome-do-app",
  //   nome: "Nome do App",
  //   colecao: "recomendado",        // "autoral" | "recomendado" | "diversos"
  //   resumo: "O que ele faz, em uma frase.",
  //   publico: "pacientes",          // "medicos" | "pacientes" | "todos"
  //   categoria: "Agenda",
  //   plataformas: ["iPhone", "Android"],
  //   preco: "Gratuito",
  //   links: [{ rotulo: "App Store", url: "https://..." }],
  //   alerta: "Não substitui avaliação médica.",
  //   vinculo: "Sem relação comercial.",
  //   publicado: false,
  // },
  // ────────────────────────────────────────────────────────────────
];

export const COLECOES: {
  id: Colecao;
  titulo: string;
  descricao: string;
  vazio: string;
}[] = [
  {
    id: "autoral",
    titulo: "Feitos por mim",
    descricao:
      "Aplicativos que eu mesmo desenvolvi. Cada um nasceu de um problema que encontrei na prática — minha ou de quem atendo.",
    vazio: "Ainda estou finalizando o primeiro. Em breve aparece aqui.",
  },
  {
    id: "recomendado",
    titulo: "Recomendados",
    descricao:
      "Aplicativos de terceiros que uso ou indico, separados por quem se beneficia deles. Recomendação não é prescrição: nenhum substitui avaliação médica, e a escolha final é sempre sua.",
    vazio: "A lista está sendo montada com calma — prefiro indicar o que uso.",
  },
  {
    id: "diversos",
    titulo: "Fora do tema",
    descricao:
      "Coisas que não têm nada a ver com medicina e que valem a pena mesmo assim. Leitura, música, produtividade, curiosidade.",
    vazio: "Em breve.",
  },
];

export const aplicativosDa = (colecao: Colecao) =>
  APLICATIVOS.filter((a) => a.publicado && a.colecao === colecao);

export const temAplicativos = () => APLICATIVOS.some((a) => a.publicado);

export const ROTULO_PUBLICO: Record<Publico, string> = {
  medicos: "Para médicos",
  pacientes: "Para pacientes",
  todos: "Para qualquer pessoa",
};
