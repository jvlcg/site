import { variacaoDoFundo, type Fundo } from "@/lib/fundos";

/**
 * A camada de fundo animada, para as páginas que não usam o `PageHero`.
 *
 * ## Por que existe
 *
 * O fundo por página nasceu dentro do `PageHero`, e por isso alcançava só as
 * páginas que passam por ele. Ficaram de fora justamente as mais numerosas —
 * artigo, poema, curso e aula —, além do cadastro e do mapa do site. Somando,
 * eram mais de cinquenta endereços sem fundo nenhum enquanto catorze tinham.
 *
 * Este componente é a mesma camada, avulsa, para ser posta à mão onde o herói
 * é próprio.
 *
 * ## Onde colocar
 *
 * Como primeiro filho de um elemento `relative` que ocupe o topo da página, e
 * antes do conteúdo. A camada é ancorada no topo do pai: sem um pai
 * posicionado ela se prende ao primeiro ancestral que houver, e sobe para o
 * lugar errado.
 *
 * ## Por que altura fixa, e não `inset-0`
 *
 * Os pais aqui são longos — um artigo real mede mais de seis mil pixels. Um
 * fundo esticado por tudo isso deixa de ser o mesmo efeito das outras páginas
 * e vira um verde chapado sob o texto inteiro. A justificativa completa, com
 * as medidas, está em `.camada-fundo-topo` no `globals.css`.
 */
export function FundoDaPagina({
  fundo,
  /**
   * O `slug` da página, quando muitas páginas dividem o mesmo `fundo`.
   *
   * Dezesseis artigos usam `leitura`, vinte poemas usam `verso`, dezoito aulas
   * usam `foco`. Sem a semente, quem lê dois artigos seguidos vê o mesmo fundo
   * duas vezes — que é a queixa que originou tudo isto. Ver
   * `variacaoDoFundo` em `lib/fundos.ts`.
   */
  semente,
}: {
  fundo: Fundo;
  semente?: string;
}) {
  return (
    <div
      className="camada-fundo camada-fundo-topo absolute inset-x-0 top-0"
      aria-hidden="true"
    >
      <div
        className="aurora"
        data-fundo={fundo}
        style={semente ? variacaoDoFundo(semente) : undefined}
      />
      <div className="mesh-bg" />
    </div>
  );
}
