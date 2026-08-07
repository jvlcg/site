import { site } from "./site-config";

/** JSON-LD builders — Schema.org para motores de busca e LLMs. */

/** Telefone principal (WhatsApp particular) em E.164. */
const telephone = `+${site.whatsapp}`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.clinic}, ${site.address.street}`,
  addressLocality: site.address.city,
  addressRegion: site.address.stateName,
  postalCode: site.address.zip,
  addressCountry: site.address.country,
};

export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${site.url}/#physician`,
    name: site.name,
    alternateName: site.shortName,
    identifier: site.crm,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/dr-jose-victor-jaleco.jpg`,
    /**
     * `image` é a foto do médico; `logo` é a marca. O Google usa cada uma em
     * lugar diferente — a foto ilustra o resultado, a marca aparece no painel
     * de conhecimento — e quem declara só `image` fica sem marca nenhuma.
     * PNG quadrado e opaco de propósito: o resultado de busca é renderizado
     * sobre fundo branco, onde SVG com traço claro some.
     */
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo-512.png`,
      width: 512,
      height: 512,
    },
    email: site.email,
    telephone,
    priceRange: "$$$",
    /**
     * NÃO declaramos `medicalSpecialty`: anunciar especialidade exige Registro
     * de Qualificação de Especialista (RQE) no CFM. As áreas abaixo são temas
     * de atuação/conhecimento, não títulos de especialista.
     */
    knowsAbout: [
      "Cannabis medicinal",
      "Sistema endocanabinoide",
      "Clínica médica",
      "Check-up e medicina preventiva",
      "Medicina esportiva",
      "Dor crônica",
      "Insônia",
      "Ansiedade",
      "Emagrecimento",
      "Telemedicina",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pontifícia Universidade Católica de Goiás",
      sameAs: "https://www.pucgoias.edu.br/",
    },
    worksFor: { "@id": `${site.url}/#clinic` },
    address: postalAddress,
    areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "Consulta médica presencial",
        procedureType: "https://schema.org/NoninvasiveProcedure",
      },
      {
        "@type": "MedicalProcedure",
        name: "Teleconsulta (telemedicina)",
        procedureType: "https://schema.org/NoninvasiveProcedure",
      },
    ],
    sameAs: [...site.sameAs],
  };
}

/** MedicalClinic + LocalBusiness — pilar do SEO local (Google Maps/Business). */
export function medicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${site.url}/#clinic`,
    name: `${site.shortName} — ${site.address.clinic}`,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/dr-jose-victor-jaleco.jpg`,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo-512.png`,
      width: 512,
      height: 512,
    },
    telephone,
    email: site.email,
    priceRange: "$$$",
    currenciesAccepted: "BRL",
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: site.address.mapsUrl,
    areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    availableService: [
      { "@type": "MedicalProcedure", name: "Cannabis medicinal" },
      { "@type": "MedicalProcedure", name: "Clínica médica e check-up" },
      { "@type": "MedicalProcedure", name: "Medicina esportiva" },
      { "@type": "MedicalProcedure", name: "Telemedicina" },
    ],
    openingHoursSpecification: site.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    physician: { "@id": `${site.url}/#physician` },
    sameAs: [...site.sameAs, site.googleReviewsUrl],
  };
}

/** Service por página de atuação (rich result de serviço). */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: opts.name,
    description: opts.description,
    url: `${site.url}${opts.path}`,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    provider: { "@id": `${site.url}/#physician` },
    availableService: { "@id": `${site.url}/#clinic` },
    areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "pt-BR",
    publisher: { "@id": `${site.url}/#physician` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function medicalWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: opts.title,
    description: opts.description,
    url: `${site.url}${opts.path}`,
    reviewedBy: { "@id": `${site.url}/#physician` },
    lastReviewed: new Date().toISOString().split("T")[0],
    isPartOf: { "@id": `${site.url}/#website` },
    /** Autoria e data explícitas ajudam sistemas de IA a citar com atribuição. */
    author: { "@id": `${site.url}/#physician` },
    publisher: { "@id": `${site.url}/#physician` },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "pt-BR",
    citation: `${site.name} (${site.crm}). ${opts.title}. ${site.url}${opts.path}`,
    license: `${site.url}/politica-de-privacidade`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  date: string;
  modified?: string;
  /** O artigo tem algum bloco `<SoParaAlunos>`? */
  temTrechoRestrito?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalScholarlyArticle",
    headline: opts.title,
    description: opts.description,
    url: `${site.url}/blog/${opts.slug}`,
    datePublished: opts.date,
    dateModified: opts.modified ?? opts.date,
    inLanguage: "pt-BR",
    author: { "@id": `${site.url}/#physician` },
    publisher: { "@id": `${site.url}/#physician` },
    mainEntityOfPage: `${site.url}/blog/${opts.slug}`,
    /**
     * Amostragem flexível: o artigo é gratuito, e só um trecho é restrito.
     *
     * `isAccessibleForFree: true` no artigo inteiro é o que diz ao Google que
     * ele continua sendo conteúdo aberto — declarar `false` aqui faria o
     * artigo inteiro ser tratado como fechado, e ele perderia posição por um
     * fechamento que não existe.
     *
     * O `hasPart` marca **só o pedaço** restrito, pelo seletor CSS. É assim
     * que jornais publicam matéria com paywall parcial sem serem punidos por
     * mostrar ao rastreador algo diferente do que o leitor vê.
     */
    ...(opts.temTrechoRestrito
      ? {
          isAccessibleForFree: true,
          hasPart: {
            "@type": "WebPageElement",
            isAccessibleForFree: false,
            cssSelector: ".trecho-restrito",
          },
        }
      : { isAccessibleForFree: true }),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
