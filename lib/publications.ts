/**
 * Produção científica — extraída do Currículo Lattes
 * (http://lattes.cnpq.br/5293466472803267, atualizado em 31/01/2026).
 *
 * Fonte única para a página de artigos científicos, para as estatísticas da
 * home e para os dados estruturados. Ao atualizar o Lattes, atualize aqui.
 */

export type Publication = {
  title: string;
  /** Periódico, livro ou evento. */
  venue: string;
  year: number;
  /** Detalhe bibliográfico (volume, páginas). */
  details?: string;
  /** Coautores na ordem do Lattes (o médico aparece destacado na interface). */
  authors: string;
  type: "artigo" | "livro" | "capitulo" | "anais" | "apresentacao";
};

export const publications: Publication[] = [
  // ---------- Artigos completos em periódicos ----------
  {
    title:
      "Carpal tunnel syndrome: a systematic review of conservative and surgical treatments on pain and functional recovery",
    venue: "Revista Eletrônica Acervo em Saúde",
    year: 2025,
    details: "v. 25, p. e20245",
    authors:
      "Moura Júnior DR; Gomes JVLC; Castro SP; Moura HSSG; Reis LSSG; Gomes MJ",
    type: "artigo",
  },
  {
    title:
      "Uma revisão sistemática da literatura acerca do perfil farmacológico e papel da ketamina na redução da dor crônica após procedimentos cirúrgicos",
    venue: "Studies in Health Sciences",
    year: 2025,
    details: "v. 6, p. e13223-10",
    authors:
      "Santana AAA; Rosa JGS; Rocha JE; Arraes JFA; Moraes LFM; Tonial IH; Taveira VM; Ataídes JVBQ; Gomes JVLC; Santana NAA",
    type: "artigo",
  },
  {
    title:
      "Uma revisão sistemática da literatura acerca da relação entre anestesia espinhal e parada cardiorrespiratória",
    venue: "Studies in Health Sciences",
    year: 2025,
    details: "v. 6, p. e13225-10",
    authors:
      "Santana AAA; Rosa JGS; Rocha JE; Arraes JFA; Moraes LFM; Paranhos GVAR; Avelar GS; Fonseca ELF; Ataídes JVBQ; Gomes JVLC; Santana NAA",
    type: "artigo",
  },
  {
    title:
      "Anestesia locorregional em pediatria: uma avaliação completa dos riscos e benefícios em procedimentos cirúrgicos ambulatoriais",
    venue: "Studies in Health Sciences",
    year: 2025,
    details: "v. 6, p. e13224-10",
    authors:
      "Santana AAA; Rosa JGS; Rocha JE; Arraes JFA; Moraes LFM; Macêdo JA; Avelar GS; Resende LL; Ataídes JVBQ; Gomes JVLC; Santana NAA",
    type: "artigo",
  },
  {
    title:
      "Approach with ultrasound-guided piriformis blocks for pain relief and confirmation of the clinical diagnosis of deep gluteal pain",
    venue: "Revista Brasileira de Ultrassonografia",
    year: 2021,
    details: "v. 29, p. 46",
    authors:
      "Gomes MJ; Lisboa Cardoso Gomes JV; Simões Gomes de Moura HS; Rodrigues de Moura Júnior D; Saeki de Souza G; de Oliveira Gomes Filho M",
    type: "artigo",
  },
  {
    title:
      "Estudo retrospectivo dos últimos 100 casos de bloqueio ecoguiado lombar para facetas e ramos mediais em uma clínica de referência na cidade de Goiânia-GO",
    venue: "Revista Brasileira de Ultrassonografia (RBUS)",
    year: 2021,
    details: "v. 29, p. 30",
    authors:
      "Gomes JVLC; Gomes MJ; Moura HSSG; Moura Júnior DR; Battaglin LOM; Souza GS; Gomes Filho MO; Silva LC; Soares DS",
    type: "artigo",
  },

  // ---------- Livro ----------
  {
    title: "Trauma, Cirurgia e Medicina Intensiva: Teoria e Prática — Edição I",
    venue: "Livro organizado, 1ª edição",
    year: 2024,
    authors:
      "Monteiro ALG; Gomes JVLC; Castro SP; Esper EA; Amoroso CRMG; Tonial IH; Pires AFRF; Sousa IZ; Pinheiro GN; Rodrigues MC; Magalhães TMA; Dias AMMS; Venancio TA; Mesquita YHVM; Coelho ECF",
    type: "livro",
  },

  // ---------- Capítulo de livro ----------
  {
    title:
      "Impacto da simulação em cirurgia de trauma na formação médica acadêmica e na educação médica continuada: uma análise abrangente",
    venue: "In: A Medicina do Futuro — Uma Revisão Multidisciplinar. Uberlândia: Editora Health",
    year: 2024,
    details: "v. 1, p. 65-76",
    authors:
      "Mesquita Junior MM; Pires AFRF; Monteiro ALG; Gomes JVLC; Amoroso CRMG; Afiune ICP; Franco MFO; Mesquita YHVM",
    type: "capitulo",
  },

  // ---------- Trabalhos completos em anais ----------
  {
    title: "Avaliação e manejo inicial do politraumatizado em acidentes de trânsito",
    venue: "III CONAMEO — Congresso Nacional de Medicina, Enfermagem e Odontologia em Urgência e Emergência",
    year: 2024,
    authors: "Gomes JVLC; Castro SP",
    type: "anais",
  },
  {
    title: "O uso de opioides no controle da dor aguda em pacientes com traumas",
    venue: "III CONAMEO — Congresso Nacional de Medicina, Enfermagem e Odontologia em Urgência e Emergência",
    year: 2024,
    authors: "Amoroso CRMG; Gomes JVLC; Pires AFRF; Monteiro ALG; Sousa IZ; Tonial IH",
    type: "anais",
  },
  {
    title: "Abordagens contemporâneas no manejo de traumas de face: da avaliação inicial à reabilitação avançada",
    venue: "III CONAMEO — Congresso Nacional de Medicina, Enfermagem e Odontologia em Urgência e Emergência",
    year: 2024,
    authors: "Coelho ECF; Mesquita Junior MM; Sena NM; Venancio TA; Gomes JVLC",
    type: "anais",
  },
  {
    title: "Avaliação e manejo de lesões retroperitoneais traumáticas",
    venue: "III CONAMEO — Congresso Nacional de Medicina, Enfermagem e Odontologia em Urgência e Emergência",
    year: 2024,
    authors: "Coelho ECF; Mesquita Junior MM; Sena NM; Venancio TA; Gomes JVLC; Castro SP",
    type: "anais",
  },
  {
    title: "Efeitos da COVID-19 no panorama epidemiológico das emergências por traumas faciais",
    venue: "III CONAMEO — Congresso Nacional de Medicina, Enfermagem e Odontologia em Urgência e Emergência",
    year: 2024,
    authors: "Ramos MM; Gomes JVLC; Afiune ICP; Figueiredo AH; Franco MFO",
    type: "anais",
  },
  {
    title: "Incidência e recorrência do trauma torácico: um estudo revisional",
    venue: "II Congresso Nacional de Trauma e Medicina de Emergência",
    year: 2023,
    authors: "Melo MGZ; Figueiredo CSGM; Paranhos LH; Castro SP; Gomes JVLC",
    type: "anais",
  },
  {
    title: "Craniectomia descompressiva no traumatismo cranioencefálico: uma breve revisão de literatura",
    venue: "II Congresso Nacional de Trauma e Medicina de Emergência",
    year: 2023,
    authors: "Castro SP; Mendonça CC; Nogueira THM; Gomes JVLC; Chaves LP",
    type: "anais",
  },

  // ---------- Apresentações selecionadas ----------
  {
    title: "Lesões musculoesqueléticas em atletas de alto desempenho: diagnóstico e tratamento",
    venue: "Apresentação em congresso",
    year: 2023,
    authors: "Tonial IH; Gomes JVLC; Castro SP; Mendonça CC; e cols.",
    type: "apresentacao",
  },
  {
    title: "Tratamento cirúrgico de fraturas intra-articulares do cotovelo: revisão de literatura e análise de resultados",
    venue: "Apresentação em congresso",
    year: 2023,
    authors: "Souza KP; Castro SP; Tonial IH; Gomes JVLC; e cols.",
    type: "apresentacao",
  },
  {
    title: "Avaliação de segurança e eficácia do uso de opioides para o tratamento da dor aguda em pacientes com lesão traumática",
    venue: "Apresentação em congresso",
    year: 2023,
    authors: "Siqueira LS; Castro SP; Mendonça CC; Gomes JVLC; e cols.",
    type: "apresentacao",
  },
  {
    title: "Trauma ocular em crianças: considerações e manejo cirúrgico",
    venue: "Apresentação em congresso",
    year: 2024,
    authors: "Coelho ECF; Mesquita Junior MM; Sena NM; Venancio TA; Gomes JVLC; Castro SP",
    type: "apresentacao",
  },
];

export const TYPE_LABEL: Record<Publication["type"], string> = {
  artigo: "Artigo em periódico",
  livro: "Livro",
  capitulo: "Capítulo de livro",
  anais: "Trabalho em anais",
  apresentacao: "Apresentação em congresso",
};

/** Contagens reais, usadas nas estatísticas do site. */
export const publicationStats = {
  artigos: publications.filter((p) => p.type === "artigo").length,
  livros: publications.filter((p) => p.type === "livro" || p.type === "capitulo").length,
  /** Total de apresentações em congressos registradas no Lattes. */
  apresentacoes: 13,
};

export function publicationsByType(type: Publication["type"]) {
  return publications.filter((p) => p.type === type).sort((a, b) => b.year - a.year);
}
