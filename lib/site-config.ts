export const site = {
  /**
   * Domínio registrado do consultório.
   *
   * A barra final é removida porque todo o resto do site monta endereços como
   * `${site.url}/caminho`. Uma barra sobrando na variável de ambiente geraria
   * `https://dominio.com.br//caminho` no sitemap, no robots.txt e no llms.txt —
   * apontando o Google para URLs que não existem.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjosevictor.com").replace(/\/+$/, ""),
  name: "Dr. José Victor Lisboa Cardoso Gomes",
  shortName: "Dr. José Victor",
  brand: "Dr.JV",
  crm: "CRM-GO 38508",
  tagline: "Medicina de precisão, do consultório à telemedicina",
  description:
    "Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508) — clínica médica, medicina endocanabinoide e medicina esportiva em Goiânia-GO, com atendimento presencial e por telemedicina.",
  email: "jvlcg.work@gmail.com",
  /**
   * Chave PIX das doações do conteúdo gratuito.
   *
   * Não é segredo: chave PIX serve justamente para ser divulgada, e ela só
   * permite **enviar** dinheiro para a conta, nunca retirar.
   */
  pixChave: "jvlcg.work@gmail.com",
  /**
   * Nome que aparece no aplicativo de quem vai doar.
   *
   * O padrão do Banco Central corta em 25 caracteres, e o nome completo tem
   * mais que isso — abreviado aqui, e não deixado para o corte automático,
   * porque "JOSE VICTOR LISBOA CARDOS" na tela do banco de outra pessoa parece
   * erro do site.
   */
  pixNome: "Jose Victor L C Gomes",
  instagram: "https://instagram.com/dr.josevlcg",
  instagramHandle: "@dr.josevlcg",
  /** Avaliações reais no Google (link do perfil compartilhado pelo médico). */
  googleReviewsUrl: "https://share.google/D00DatArA69xbY1ho",
  /** Place ID do perfil do Dr. José Victor no Google (público, não é segredo). */
  googlePlaceId: "ChIJl84fCu3xXpMR_l6BFBpBuhc",
  /**
   * ID de medição do Google Analytics 4. Também é público — aparece no
   * código-fonte de qualquer site que use GA.
   */
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-5E4R1QLD2V",
  /**
   * ID do cliente OAuth, usado no botão "Continuar com Google" do cadastro.
   *
   * Também público, e por construção: ele viaja dentro do JavaScript que todo
   * visitante baixa, e o Google conta com isso — a proteção não está em
   * escondê-lo, e sim na lista de origens autorizadas do console, que só
   * aceita `drjosevictor.com`.
   *
   * O `client_secret` do mesmo cliente é outra história e **não existe neste
   * projeto**. Ele só serviria ao fluxo de acesso continuado à conta do
   * visitante, que o site não faz. Ver `lib/google-identidade.ts`.
   */
  googleClientId:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
    "148201884967-0s8mrmv85h0cssrsum36d68mofp9asps.apps.googleusercontent.com",
  /**
   * WhatsApp em formato internacional (sem "+").
   *
   * **Número único, o da secretaria.** Antes havia dois — o pessoal do médico
   * para atendimento particular e o da secretaria para convênios. Todo contato
   * do site passa a cair na secretaria, particular ou convênio.
   *
   * O número pessoal saiu do repositório inteiro, e não só dos botões: um
   * telefone que aparece no código-fonte de um site público está publicado,
   * ainda que nenhuma página o exiba.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5562999961365",
  whatsappMessage:
    "Olá! Encontrei o site do Dr. José Victor e gostaria de agendar uma consulta particular.",
  whatsappMessagePlanos:
    "Olá! Gostaria de informações sobre atendimento por plano de saúde com o Dr. José Victor.",
  address: {
    clinic: "Clínica Fisiogyn",
    street: "Rua 94, nº 408, Setor Sul",
    streetShort: "Rua 94, 408",
    neighborhood: "Setor Sul",
    city: "Goiânia",
    state: "GO",
    stateName: "Goiás",
    zip: "74080-100",
    country: "BR",
    /** Link de rota para o ponto exato (confirmado via Google Places). */
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=-16.6829899,-49.2529214&destination_place_id=ChIJl84fCu3xXpMR_l6BFBpBuhc",
  },
  /** Coordenadas exatas do consultório (Google Places, confirmadas). */
  geo: { lat: -16.6829899, lng: -49.2529214 },
  /** Abrangência para SEO local + telemedicina nacional. */
  areaServed: ["Goiânia", "Aparecida de Goiânia", "Goiás", "Brasil"],
  /** Horários — placeholder editável (o usuário optou por não exibir publicamente). */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
  ],
  sameAs: [
    "http://lattes.cnpq.br/5293466472803267",
    "https://orcid.org/0000-0003-2242-2469",
    "https://instagram.com/dr.josevlcg",
  ],
} as const;

/**
 * O número é um só. Isto seleciona a **mensagem** já preenchida, para que a
 * secretária saiba de onde a pessoa veio antes de responder.
 */
type WhatsAppKind = "particular" | "planos";

/**
 * O endereço real do WhatsApp. Usado pela página `/agendar`, que é quem de
 * fato leva a pessoa para lá.
 */
export function whatsappDireto(
  kind: WhatsAppKind = "particular",
  message?: string
): string {
  const number = site.whatsapp;
  const text =
    message ??
    (kind === "planos" ? site.whatsappMessagePlanos : site.whatsappMessage);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * O que os botões do site apontam: `/agendar`, que redireciona para o
 * WhatsApp.
 *
 * A volta extra existe por uma razão só, e ela é medição. Um link para
 * `wa.me` sai do site sem deixar rastro: não há como saber quantas pessoas
 * clicaram em "Agendar", de qual página vieram, nem se o anúncio que trouxe
 * a visita gerou contato. Sem uma URL própria, o Google Ads não tem o que
 * contar como conversão — e campanha sem conversão medida é dinheiro gasto
 * às cegas.
 *
 * O custo é um instante de carregamento antes de o WhatsApp abrir. A página
 * é estática e minúscula, e o redirecionamento dispara assim que ela monta.
 * Quem tiver JavaScript desligado vê um botão e segue no mesmo clique.
 */
export function whatsappLink(
  kind: WhatsAppKind = "particular",
  message?: string
): string {
  const busca = new URLSearchParams({ via: kind });
  if (message) busca.set("msg", message);
  return `/agendar?${busca.toString()}`;
}

export const navLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/medicina-endocanabinoide", label: "Medicina Endocanabinoide" },
  { href: "/clinica-medica", label: "Clínica Médica" },
  { href: "/medicina-esportiva", label: "Medicina Esportiva" },
  { href: "/telemedicina", label: "Telemedicina" },
  { href: "/consultorio", label: "Consultório em Goiânia" },
  { href: "/cursos", label: "Cursos" },
  { href: "/blog", label: "Blog" },
  { href: "/artigos", label: "Artigos científicos" },
  { href: "/voluntariado", label: "Projetos voluntários" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/contato", label: "Contato" },
] as const;
