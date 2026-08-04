/**
 * BR Code do PIX — o texto por trás do QR e do "copia e cola".
 *
 * O PIX não precisa de API, de conta de gateway nem de cadastro em lugar
 * nenhum para receber: o QR é um texto formatado que qualquer aplicativo de
 * banco sabe ler, e ele é montado aqui, no build, sem chamar ninguém. Isso
 * significa que a doação funciona mesmo se todo serviço externo cair, e que
 * nenhum intermediário fica sabendo quem doou nem quanto.
 *
 * O formato é o EMV®QRCPS-MPM, o mesmo padrão dos QRs de cartão, adotado pelo
 * Banco Central. Cada campo é `ID + tamanho em 2 dígitos + valor`, aninhado, e
 * o último campo é um CRC do texto inteiro.
 */

/** Um campo do EMV: identificador, tamanho com dois dígitos, conteúdo. */
const campo = (id: string, valor: string) =>
  `${id}${String(valor.length).padStart(2, "0")}${valor}`;

/**
 * CRC16/CCITT-FALSE — polinômio 0x1021, valor inicial 0xFFFF.
 *
 * É o fecho obrigatório do BR Code, e o motivo de um QR de PIX inteiro ser
 * recusado pelo banco quando alguém edita um caractere no meio: o resto do
 * texto deixa de bater com este número.
 */
function crc16(texto: string): string {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Nome e cidade têm limite de tamanho no padrão e não aceitam acento — o
 * aplicativo do banco mostra o que vier aqui, e caractere fora da tabela vira
 * símbolo estranho na tela de quem vai pagar.
 */
const limpar = (s: string, max: number) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, max)
    .toUpperCase();

export type DadosPix = {
  /** A chave PIX: e-mail, CPF, telefone ou chave aleatória. */
  chave: string;
  /** Nome de quem recebe, como aparece no aplicativo. Até 25 caracteres. */
  nome: string;
  /** Cidade de quem recebe. Até 15 caracteres. */
  cidade: string;
  /**
   * Valor em reais. Omitido faz um QR de valor livre — quem paga digita
   * quanto quer, que é o que uma doação pede.
   */
  valor?: number;
  /**
   * Identificador da transação, até 25 caracteres sem espaço. Aparece no
   * extrato e é o que permite saber a que se refere cada entrada.
   */
  referencia?: string;
};

/** Monta o BR Code completo, pronto para virar QR e para o "copia e cola". */
export function brCode({ chave, nome, cidade, valor, referencia }: DadosPix): string {
  const conta =
    campo("00", "br.gov.bcb.pix") + campo("01", chave.trim());

  const partes = [
    campo("00", "01"),
    // "12" marca o QR como de uso único. Só entra quando há valor fixo: um QR
    // de doação é reutilizável por natureza, e marcá-lo como único faria alguns
    // aplicativos recusarem a segunda leitura.
    ...(valor !== undefined ? [campo("01", "12")] : []),
    campo("26", conta),
    campo("52", "0000"),
    campo("53", "986"),
    ...(valor !== undefined ? [campo("54", valor.toFixed(2))] : []),
    campo("58", "BR"),
    campo("59", limpar(nome, 25)),
    campo("60", limpar(cidade, 15)),
    // "***" é o coringa do padrão para "sem identificador"
    campo("62", campo("05", referencia ? limpar(referencia, 25).replace(/\s/g, "") : "***")),
  ].join("");

  // O CRC é calculado sobre o texto já contendo "6304" — o padrão manda
  // incluir o cabeçalho do próprio campo no cálculo.
  const comCabecalho = `${partes}6304`;
  return `${comCabecalho}${crc16(comCabecalho)}`;
}
