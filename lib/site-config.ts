export const site = {
  /** Domínio definitivo entra via env quando for registrado. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://drjosevictor.vercel.app",
  name: "Dr. José Victor Lisboa Cardoso Gomes",
  shortName: "Dr. José Victor",
  crm: "CRM-GO 38508",
  tagline: "Medicina de precisão, do consultório à telemedicina",
  description:
    "Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508) — clínica médica, medicina endocanabinoide e medicina esportiva em Goiânia-GO, com atendimento presencial e por telemedicina.",
  email: "jvlcg.work@gmail.com",
  /** Número em formato internacional, sem "+" — definir NEXT_PUBLIC_WHATSAPP no deploy. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5562000000000",
  whatsappMessage:
    "Olá! Encontrei o site do Dr. José Victor e gostaria de agendar uma consulta.",
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
  ],
} as const;

export function whatsappLink(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
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
