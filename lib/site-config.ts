export const site = {
  /**
   * Domínio registrado do consultório.
   *
   * A barra final é removida porque todo o resto do site monta endereços como
   * `${site.url}/caminho`. Uma barra sobrando na variável de ambiente geraria
   * `https://dominio.com.br//caminho` no sitemap, no robots.txt e no llms.txt —
   * apontando o Google para URLs que não existem.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjvlcg.com.br").replace(/\/+$/, ""),
  name: "Dr. José Victor Lisboa Cardoso Gomes",
  shortName: "Dr. José Victor",
  brand: "Dr.JV",
  crm: "CRM-GO 38508",
  tagline: "Medicina de precisão, do consultório à telemedicina",
  description:
    "Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508) — clínica médica, medicina endocanabinoide e medicina esportiva em Goiânia-GO, com atendimento presencial e por telemedicina.",
  email: "jvlcg.work@gmail.com",
  instagram: "https://instagram.com/dr.josevlcg",
  instagramHandle: "@dr.josevlcg",
  /** Avaliações reais no Google (link do perfil compartilhado pelo médico). */
  googleReviewsUrl: "https://share.google/D00DatArA69xbY1ho",
  /** Place ID do perfil do Dr. José Victor no Google (público, não é segredo). */
  googlePlaceId: "ChIJl84fCu3xXpMR_l6BFBpBuhc",
  /**
   * WhatsApp em formato internacional (sem "+"). O consultório é focado em
   * atendimento PARTICULAR (Dr. José Victor). Planos de saúde são atendidos
   * pela secretária e ficam como opção secundária/discreta no site.
   */
  whatsapp: {
    particular: process.env.NEXT_PUBLIC_WHATSAPP ?? "5562999758034",
    planos: process.env.NEXT_PUBLIC_WHATSAPP_PLANOS ?? "5562999961365",
  },
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

type WhatsAppKind = "particular" | "planos";

export function whatsappLink(
  kind: WhatsAppKind = "particular",
  message?: string
): string {
  const number = site.whatsapp[kind];
  const text =
    message ??
    (kind === "planos" ? site.whatsappMessagePlanos : site.whatsappMessage);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const navLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/medicina-endocanabinoide", label: "Medicina Endocanabinoide" },
  { href: "/clinica-medica", label: "Clínica Médica" },
  { href: "/medicina-esportiva", label: "Medicina Esportiva" },
  { href: "/telemedicina", label: "Telemedicina" },
  { href: "/consultorio", label: "Consultório em Goiânia" },
  { href: "/blog", label: "Blog" },
  { href: "/novidades", label: "Novidades" },
  { href: "/artigos", label: "Artigos científicos" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/contato", label: "Contato" },
] as const;
