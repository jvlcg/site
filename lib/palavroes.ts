/**
 * Filtro de palavras proibidas nos comentários.
 *
 * ## A armadilha que todo filtro ingênuo cai
 *
 * Procurar o palavrão como pedaço de texto bloqueia palavra inocente. Em
 * português isso é especialmente grave porque vários termos ofensivos são
 * curtos e aparecem dentro de palavras comuns:
 *
 *   "cu"     está dentro de CUidado, CUrso, aCUpuntura, esCUta
 *   "puta"   está dentro de disPUTAda, rePUTAção, amPUTAção
 *   "bosta"  está dentro de… nada, mas "boto" e "aposta" enganam variações
 *
 * Num site de médico o estrago é concreto: bloquear a palavra "cuidado" ou
 * "escuta" num comentário sobre consulta é pior do que deixar passar um
 * palavrão, porque a pessoa não entende o que houve e vai embora.
 *
 * Por isso o casamento é por **palavra inteira**, com fronteira nos dois
 * lados. É o mesmo problema que ficou conhecido como "Scunthorpe", pela
 * cidade inglesa cujo nome era barrado por filtros de e-mail.
 *
 * ## A outra metade: quem quer passar, disfarça
 *
 * Quem xinga de propósito escreve `p0rr@`, `mérda`, `caraaaalho`. Um filtro
 * que só olha a forma exata pega o distraído e deixa passar o mal-intencionado
 * — exatamente ao contrário do que se quer.
 *
 * Então o texto é **normalizado** antes da comparação: acento fora, letra
 * repetida reduzida, e os disfarces mais comuns de teclado desfeitos
 * (`@`→a, `0`→o, `1`→i, `$`→s, `3`→e, `4`→a). A normalização vale só para a
 * verificação; o texto guardado é o que a pessoa escreveu.
 *
 * ## O que é bloqueado e o que só é sinalizado
 *
 * Duas listas, e a diferença importa:
 *
 * - **`OFENSAS`** — xingamento e ataque pessoal. Recusa na hora, com uma
 *   mensagem que explica o motivo. Não vai para a fila: nem vale o tempo de
 *   leitura de quem modera.
 * - **`SUSPEITAS`** — o que costuma ser spam ou pedido de conduta médica em
 *   público. Não recusa: passa para a fila **marcado**, para quem modera
 *   olhar primeiro. Recusar seria pior — muita pergunta legítima de paciente
 *   cai aqui, e a pessoa merece resposta, não porta fechada.
 *
 * A lista fica curta de propósito. Lista gigante de palavrão vira armadilha de
 * falso positivo, e nenhuma lista impede quem está determinado — o que impede
 * é a moderação, que já existe.
 */

/** Xingamento e ataque. Recusado na entrada. */
const OFENSAS = [
  "porra", "caralho", "merda", "bosta", "cacete", "buceta", "cu", "cuzao", "cuzão",
  "puta", "putaria", "puto", "viado", "veado", "bicha", "corno", "otario", "otário",
  "idiota", "imbecil", "retardado", "retardada", "burro", "burra", "babaca",
  "arrombado", "arrombada", "desgracado", "desgraçado", "vagabundo", "vagabunda",
  "filho da puta", "vai se foder", "foda-se", "fodase", "escroto", "escrota",
  "macaco", "macaca", "preto imundo", "viadinho", "traveco",
  "charlatao", "charlatão", "picareta", "vigarista", "safado", "safada",
];

/** Sinal de spam ou de pedido de conduta em público. Só marca. */
const SUSPEITAS = [
  "comprar", "vendo", "venda", "promocao", "promoção", "desconto", "frete",
  "whatsapp", "zap", "telegram", "clique aqui", "ganhe", "renda extra",
  "receita", "prescreve", "prescrever", "me passa", "qual dose", "quantos mg",
  "posso tomar", "pode tomar", "indica algum", "manda o contato",
];

/** Tira acento, reduz letra repetida e desfaz os disfarces de teclado. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[@4]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[$5]/g, "s")
    .replace(/[7]/g, "t")
    /*
      Três ou mais letras iguais viram uma só: "caraaaalho" → "caralho".

      Três, e não duas, porque o português tem "rr", "ss", "cc" legítimos —
      reduzir a partir de duas transformaria "carro" em "caro" e "assunto" em
      "asunto", e a comparação passaria a errar para os dois lados.
    */
    .replace(/(.)\1{2,}/g, "$1")
    // qualquer coisa que não seja letra ou espaço vira espaço
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Casa a expressão como palavra inteira dentro do texto normalizado. */
function contem(normalizado: string, termo: string): boolean {
  const alvo = normalizar(termo);
  if (!alvo) return false;
  const escapado = alvo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // `\b` não funciona bem com expressões de várias palavras; o cerco por
  // espaço nas duas pontas resolve os dois casos com a mesma regra
  return new RegExp(`(^|\\s)${escapado}(\\s|$)`).test(normalizado);
}

export type Veredito =
  | { permitido: true; suspeito: boolean }
  | { permitido: false; motivo: string };

/**
 * Analisa um comentário.
 *
 * A mensagem de recusa **não repete a palavra encontrada**. Devolver "a
 * palavra X é proibida" ensina a contornar o filtro e, pior, exibe o
 * palavrão na tela de quem só quer comentar.
 */
export function analisar(texto: string): Veredito {
  const n = normalizar(texto);

  if (OFENSAS.some((termo) => contem(n, termo))) {
    return {
      permitido: false,
      motivo:
        "Seu comentário tem uma expressão que não cabe aqui. Reescreva sem ofensa e ele será lido normalmente — crítica é bem-vinda, xingamento não.",
    };
  }

  return { permitido: true, suspeito: SUSPEITAS.some((termo) => contem(n, termo)) };
}
