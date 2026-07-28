export const site = {
  /** Domínio definitivo entra via env quando for registrado. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjosevictor.med.br",
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
  /** Avaliações reais no Google (link do perfil). Nota/total não confirmados → não inventar. */
  googleReviewsUrl: "https://share.google/gQUcqa2bAMSpjK55U",
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
    street: "Rua 94, Setor Sul",
    city: "Goiânia",
    state: "GO",
    zip: "74080-100",
    country: "BR",
    mapsUrl: "https://maps.google.com/?q=Cl%C3%ADnica+Fisiogyn+Rua+94+Setor+Sul+Goi%C3%A2nia",
  },
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
  { href: "/artigos", label: "Artigos" },
  { href: "/contato", label: "Contato" },
] as const;
