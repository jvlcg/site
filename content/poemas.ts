/**
 * Os poemas.
 *
 * Ficam aqui, num arquivo só, e não em MDX como os artigos — poema não tem
 * subtítulo, lista nem link; tem verso e silêncio entre versos. O que ele
 * precisa é que a quebra de linha seja respeitada exatamente como foi escrita,
 * e isso um campo de texto simples entrega melhor que qualquer marcação.
 *
 * COMO ADICIONAR UM POEMA
 *
 * Copie um bloco abaixo, cole no começo da lista e troque o conteúdo. A ordem
 * do arquivo é a ordem da página: o primeiro aqui aparece primeiro no site.
 *
 * O texto vai entre crases (`), e não entre aspas. Com crases você pode
 * apertar Enter à vontade dentro do poema, e cada quebra chega ao site como
 * quebra de verso. Com aspas, não funciona.
 *
 * O `slug` é o endereço do poema no site: só letras minúsculas, números e
 * hífen. Sem acento e sem espaço.
 */

export type Poema = {
  /** Endereço na URL: /poemas/<slug> */
  slug: string;
  titulo: string;
  /** Ano ou data, como você quiser mostrar. Opcional. */
  data?: string;
  /** O poema. As quebras de linha são preservadas como estão escritas. */
  texto: string;
};

export const POEMAS: Poema[] = [
  // ─────────────────────────────────────────────────────────────────
  // MODELO — copie daqui para baixo, cole acima e troque o conteúdo.
  //
  // {
  //   slug: "nome-do-poema",
  //   titulo: "Nome do poema",
  //   data: "2024",
  //   texto: `primeiro verso
  // segundo verso
  //
  // depois de uma linha em branco, nova estrofe`,
  // },
  // ─────────────────────────────────────────────────────────────────
];
