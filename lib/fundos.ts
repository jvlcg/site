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

/**
 * A variação de um fundo dentro da própria família.
 *
 * ## O problema que isto resolve
 *
 * Vinte e um movimentos cobrem vinte e um *tipos* de página — mas quatro
 * desses tipos têm muitos endereços cada. Os dezesseis artigos usavam todos
 * `leitura`; os vinte poemas, todos `verso`; as dezoito aulas, todas `foco`.
 * Somando, cinquenta e seis páginas repartidas em quatro movimentos.
 *
 * Do lado de fora isso é exatamente a queixa que originou o trabalho: quem lê
 * dois artigos seguidos vê o mesmo fundo duas vezes.
 *
 * ## Por que parâmetros, e não cinquenta e seis `@keyframes`
 *
 * Escrever um movimento à mão por endereço só faz sentido quando o movimento
 * diz algo sobre o assunto da página — foi assim que os vinte e um nasceram, e
 * cada um tem a justificativa escrita ao lado. Cinquenta e seis a mais seriam
 * inventados, indistinguíveis entre si, e uma pessoa teria de manter todos.
 *
 * O que muda aqui é o que se percebe sem nomear: de que lado o degradê anda,
 * onde as manchas nascem, quanto tempo o ciclo leva e em que ponto do ciclo a
 * página abre. A família continua reconhecível — artigo lê na horizontal,
 * poema balança na vertical —, e nenhum artigo abre igual a outro.
 *
 * Tudo sai como propriedade personalizada de CSS, então o custo é o mesmo de
 * antes: a animação continua sendo `transform` composto pela GPU, e os
 * degradês, pintados uma vez.
 *
 * A semente é o `slug`, e não um sorteio: o mesmo endereço precisa produzir o
 * mesmo fundo em toda visita e em toda build, senão o servidor e o navegador
 * discordariam na hidratação.
 */
export type VariacaoDeFundo = Record<`--${string}`, string>;

/** FNV-1a e xorshift — pequeno, estável e sem dependência. */
function embaralhar(semente: string) {
  let h = 2166136261;
  for (let i = 0; i < semente.length; i++) {
    h ^= semente.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

export function variacaoDoFundo(semente: string): VariacaoDeFundo {
  const sorte = embaralhar(semente);
  const entre = (min: number, max: number) => min + sorte() * (max - min);

  const duracao = Math.round(entre(12, 27));

  return {
    "--fundo-dur": `${duracao}s`,
    /*
      Atraso negativo: a animação já começa adiantada, em vez de esperar. Sem
      isto todo artigo abriria no mesmo quadro do ciclo, que é justamente o
      instante que a pessoa vê ao chegar — o resto do movimento ela nunca
      compara.
    */
    "--fundo-fase": `-${Math.round(entre(0, duracao))}s`,
    /* espelha a camada inteira: inverte o sentido do movimento e a composição */
    "--fundo-espelho": sorte() < 0.5 ? "-1" : "1",
    /* onde nasce cada uma das três manchas, dentro de faixas que preservam o equilíbrio */
    "--fundo-g1x": `${Math.round(entre(8, 34))}%`,
    "--fundo-g1y": `${Math.round(entre(18, 46))}%`,
    "--fundo-g2x": `${Math.round(entre(62, 88))}%`,
    "--fundo-g2y": `${Math.round(entre(10, 38))}%`,
    "--fundo-g3x": `${Math.round(entre(44, 76))}%`,
    "--fundo-g3y": `${Math.round(entre(62, 88))}%`,
  };
}
