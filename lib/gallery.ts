import { site } from "./site-config";

export type Photo = {
  src: string;
  alt: string;
  /** Legenda exibida sobre a foto (curta). */
  caption: string;
  width: number;
  height: number;
  kind: "clinica" | "medico";
};

/**
 * Catálogo central de imagens. Concentrar aqui garante textos alternativos
 * descritivos e consistentes (bons para SEO de imagem e acessibilidade),
 * além de permitir alternar as fotos ao longo do site a partir de um só lugar.
 */

const L = "Goiânia";

export const clinicPhotos: Photo[] = [
  {
    src: "/images/clinica/fachada.jpg",
    alt: `Fachada da Clínica Fisiogyn, onde o ${site.shortName} atende, na Rua 94, Setor Sul, ${L}`,
    caption: "Fachada · Rua 94, Setor Sul",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/recepcao.jpg",
    alt: `Recepção da clínica onde o ${site.shortName} realiza consultas em ${L}`,
    caption: "Recepção",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/sala-espera.jpg",
    alt: `Sala de espera climatizada do consultório médico no Setor Sul, ${L}`,
    caption: "Sala de espera",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/consultorio-porta.jpg",
    alt: `Entrada do consultório onde são realizadas as consultas de clínica médica em ${L}`,
    caption: "Consultório",
    width: 1600,
    height: 2400,
    kind: "clinica",
  },
  {
    src: "/images/clinica/corredor.jpg",
    alt: `Corredor interno da clínica de atendimento médico no Setor Sul, ${L}`,
    caption: "Ambiente interno",
    width: 1600,
    height: 2400,
    kind: "clinica",
  },
  {
    src: "/images/clinica/recepcao-2.jpg",
    alt: `Área de recepção e atendimento da clínica em ${L}`,
    caption: "Atendimento",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/sala-atendimento.jpg",
    alt: `Sala de atendimento equipada e climatizada da clínica em ${L}`,
    caption: "Sala de atendimento",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/estrutura-diagnostico.jpg",
    alt: `Estrutura de apoio diagnóstico disponível na Clínica Fisiogyn, ${L}`,
    caption: "Estrutura de apoio diagnóstico da clínica",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/detalhe-ambiente.jpg",
    alt: `Detalhe da decoração do ambiente de atendimento médico em ${L}`,
    caption: "Detalhe do ambiente",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
  {
    src: "/images/clinica/sala-exame.jpg",
    alt: `Sala de exames da clínica onde o ${site.shortName} atende em ${L}`,
    caption: "Sala de exames",
    width: 1600,
    height: 1067,
    kind: "clinica",
  },
];

export const doctorPhotos: Photo[] = [
  {
    src: "/images/dr-jaleco-classico.jpg",
    alt: `${site.name}, médico ${site.crm}, de jaleco no consultório em ${L}`,
    caption: `${site.shortName} · ${site.crm}`,
    width: 1300,
    height: 1950,
    kind: "medico",
  },
  {
    src: "/images/dr-jaleco-braco.jpg",
    alt: `${site.name} sorrindo, com o jaleco médico no braço`,
    caption: "Atendimento humanizado",
    width: 1300,
    height: 1950,
    kind: "medico",
  },
  {
    src: "/images/dr-poltrona-autoridade.jpg",
    alt: `${site.name} sentado, em traje social — clínica médica e cannabis medicinal em ${L}`,
    caption: "Consultas aprofundadas",
    width: 1300,
    height: 1950,
    kind: "medico",
  },
  {
    src: "/images/dr-terno-azul.jpg",
    alt: `${site.name}, médico em ${L}, atendimento presencial e por telemedicina`,
    caption: "Presencial e telemedicina",
    width: 1300,
    height: 1950,
    kind: "medico",
  },
];

/**
 * Galeria intercalada: fotos da unidade e do médico se alternam, para que o
 * paciente veja ambos ao longo da navegação.
 */
export const galleryPhotos: Photo[] = (() => {
  const mix: Photo[] = [];
  const maxLen = Math.max(clinicPhotos.length, doctorPhotos.length);
  let d = 0;
  for (let i = 0; i < maxLen; i++) {
    if (clinicPhotos[i]) mix.push(clinicPhotos[i]);
    // insere um retrato a cada 3 fotos da clínica
    if (i > 0 && i % 3 === 0 && doctorPhotos[d]) mix.push(doctorPhotos[d++]);
  }
  while (doctorPhotos[d]) mix.push(doctorPhotos[d++]);
  return mix;
})();

/** URLs absolutas — usadas no sitemap de imagens e no Schema. */
export function galleryImageUrls(): string[] {
  return galleryPhotos.map((p) => `${site.url}${p.src}`);
}
