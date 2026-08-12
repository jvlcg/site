/**
 * Os fundos animados, um por tipo de página.
 *
 * O tipo mora aqui, e não dentro do `PageHero`, porque duas coisas passaram a
 * usá-lo: o herói padrão e o `FundoDaPagina`, que serve às páginas de herói
 * próprio. Repetir a lista nos dois lugares garantiria que um dia elas
 * divergissem.
 *
 * ## Por que vinte e um, e não onze
 *
 * A primeira versão tinha onze — uma por página do menu. Faltavam as páginas
 * mais numerosas do site: artigo, poema, curso e aula. Somando, mais de
 * cinquenta endereços sem fundo enquanto catorze tinham.
 *
 * E quatro se repetiam: cannabis usava o mesmo da home, aplicativos o mesmo de
 * cursos, voluntariado o mesmo de contato, e a produção científica o mesmo do
 * blog. "Um por página" com repetição não é um por página.
 *
 * Cada movimento foi escolhido pelo assunto — a justificativa de cada um está
 * no bloco de `@keyframes` em `globals.css`, junto do código que o desenha.
 */
export type Fundo =
  | "espiral"
  | "orbita"
  | "mare"
  | "pulso"
  | "varredura"
  | "respiro"
  | "deriva"
  | "ondulacao"
  | "pendulo"
  | "cintila"
  | "convergencia"
  | "germina"
  | "constelacao"
  | "semear"
  | "acolhe"
  | "trilha"
  | "foco"
  | "leitura"
  | "verso"
  | "malha"
  | "acervo";
