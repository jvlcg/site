import { GoogleRating } from "./GoogleRating";

/**
 * O bloco de avaliações do Google.
 *
 * ## Por que ele não reproduz mais as avaliações
 *
 * Até aqui, com a chave da Places API configurada, este componente publicava
 * na home: a nota do perfil em estrelas, o total de avaliações, **o texto de
 * até seis avaliações com o nome de quem escreveu**, e um `aggregateRating`
 * no Schema — que é o que faz o Google exibir estrelas no resultado da busca.
 *
 * Medido em produção antes da mudança: `ratingValue: 5`, `reviewCount: 28`,
 * sessenta caracteres de estrela no HTML e três textos de pacientes visíveis
 * na primeira dobra.
 *
 * Reproduzir avaliação de paciente como peça do próprio site é o que as normas
 * de publicidade médica vedam. Não é detalhe de redação: a diferença entre
 * **apontar** para um perfil público de terceiro e **republicar** o depoimento
 * dentro da peça publicitária é exatamente onde a regra corta. O FAQ deste
 * mesmo site já explicava isso ao paciente enquanto a home fazia o contrário.
 *
 * ## O que ficou
 *
 * O convite para ler as avaliações no Google. Lá o conteúdo é de terceiro,
 * publicado fora daqui, sem edição do consultório — e, como o próprio FAQ
 * argumenta, mais difícil de manipular justamente por isso.
 *
 * ## Se um dia for reativado
 *
 * Isto aqui é o lugar. `lib/google-reviews.ts` continua no repositório e
 * funcionando; o que saiu foi a **renderização pública**. Antes de religar,
 * vale a confirmação do CRM-GO — há leitura de que dado agregado de plataforma
 * independente não equivale a depoimento, e essa é uma decisão médica, não de
 * código.
 *
 * Nota: sem a chamada a `getGoogleReviews()`, a Places API deixa de ser
 * consultada a cada renderização. A chave pode ser removida do ambiente se
 * nada mais a usar.
 */
export function GoogleReviews({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-4xl px-5 sm:px-8 ${className}`}>
      <GoogleRating />
    </div>
  );
}
