/**
 * A tabela de níveis, num arquivo sem nada do Node.
 *
 * Separada de `lib/pontos.ts` por necessidade, não por organização: aquele
 * arquivo importa `node:crypto` para os resumos e a cifra, e um componente do
 * navegador que importasse dele levaria o `node:crypto` junto — o empacotador
 * recusa, e o build quebra.
 *
 * Aqui só há dados e aritmética, então serve aos dois lados: o servidor usa
 * para decidir, a tela usa para mostrar. Uma tabela só, sem cópia para sair do
 * lugar.
 */

export const NIVEIS = [
  {
    nome: "Cadastrado",
    minimo: 0,
    beneficio: "Trechos exclusivos nos artigos e cursos gratuitos com conta",
  },
  { nome: "Bronze", minimo: 60, beneficio: "Material de apoio extra nos cursos" },
  { nome: "Prata", minimo: 150, beneficio: "Um curso pago à sua escolha" },
  { nome: "Ouro", minimo: 350, beneficio: "Acesso a todos os cursos pagos" },
] as const;

export function nivelDe(total: number) {
  /**
   * Percorre de trás para frente e devolve o primeiro que couber. Assim
   * acrescentar um nível novo no fim da lista não exige mexer nesta função.
   */
  const atual = [...NIVEIS].reverse().find((n) => total >= n.minimo) ?? NIVEIS[0];
  const proximo = NIVEIS.find((n) => n.minimo > total);
  return { ...atual, proximo, faltam: proximo ? proximo.minimo - total : 0 };
}
