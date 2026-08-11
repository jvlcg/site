import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { CtaSection } from "@/components/ui/CtaSection";
import { EcgDivider } from "@/components/ui/EcgDivider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Parallax } from "@/components/ui/Parallax";
import { galleryPhotos, clinicPhotos, galleryImageUrls } from "@/lib/gallery";
import { site, whatsappLink } from "@/lib/site-config";
import { JsonLd, breadcrumbSchema, medicalWebPageSchema } from "@/lib/schema";
import { FaixaFoto } from "@/components/ui/FaixaFoto";

export const metadata: Metadata = {
  title: "Consultório em Goiânia — Setor Sul | Estrutura e localização",
  description:
    "Conheça o consultório do Dr. José Victor (CRM-GO 38508) na Clínica Fisiogyn, Rua 94, Setor Sul, Goiânia: fotos da estrutura, localização no mapa e como chegar. Atendimento particular e por telemedicina.",
  alternates: { canonical: "/consultorio" },
  openGraph: {
    title: "Consultório em Goiânia — Setor Sul | Dr. José Victor",
    description:
      "Fotos da estrutura, localização no mapa e como chegar ao consultório na Rua 94, Setor Sul, Goiânia.",
    images: [{ url: "/images/clinica/fachada.jpg", width: 1600, height: 1067, alt: clinicPhotos[0].alt }],
  },
};

const comodidades = [
  { title: "Fácil acesso", text: "Setor Sul, região central de Goiânia, com estacionamento nas proximidades." },
  { title: "Ambiente climatizado", text: "Recepção e consultórios confortáveis, pensados para uma espera tranquila." },
  { title: "Apoio diagnóstico", text: "A clínica dispõe de estrutura de exames de imagem no mesmo endereço." },
  { title: "Horário reservado", text: "Agenda organizada para que a sua consulta tenha o tempo que ela precisa." },
];

const mapEmbed = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&output=embed`;

export default function ConsultorioPage() {
  return (
    <>
      <PageHero
        fundo="respiro"
        eyebrow="Unidade presencial"
        title={
          <>
            O consultório em <span className="text-gradient">Goiânia</span>
          </>
        }
        lede="Atendimento presencial na Clínica Fisiogyn, na Rua 94, Setor Sul — estrutura completa, ambiente tranquilo e uma consulta com o tempo que a sua saúde merece."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Consultório", path: "/consultorio" },
        ]}
      >
        <MagneticButton>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Agendar consulta presencial
            <span aria-hidden="true">→</span>
          </a>
        </MagneticButton>
      </PageHero>

      {/* Fachada em destaque — reconhecimento do local */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="glass overflow-hidden rounded-[2rem] p-2">
          <div className="relative overflow-hidden rounded-[1.6rem]">
            <Parallax speed={0.1}>
              <Image
                src={clinicPhotos[0].src}
                alt={clinicPhotos[0].alt}
                width={clinicPhotos[0].width}
                height={clinicPhotos[0].height}
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="w-full scale-[1.06] object-cover"
              />
            </Parallax>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 sm:p-8">
              <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-accent-400)]">
                Clínica Fisiogyn
              </p>
              <p className="font-display mt-1 text-lg font-semibold text-white sm:text-xl">
                {site.address.street} · {site.address.city}-{site.address.state}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Comodidades */}
      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {comodidades.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 70} className="holo glass card-hover rounded-2xl p-6">
              <h2 className="font-display text-base font-semibold tracking-tight">{c.title}</h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <EcgDivider />

      {/* Galeria intercalada */}
      <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Galeria"
          title={
            <>
              Conheça o espaço <span className="text-gradient">antes de chegar</span>
            </>
          }
          lede="Fotos reais da estrutura onde você será atendido, intercaladas com o dia a dia do consultório. Toque em qualquer imagem para ampliar."
        />
        <div className="mt-12">
          <PhotoGallery photos={galleryPhotos} />
        </div>
      </section>

      {/* Localização */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Como chegar"
              title="Localização"
              lede="Estamos no Setor Sul, uma das regiões mais centrais de Goiânia — com acesso rápido a partir da Praça Cívica, do Setor Oeste e da Av. 85."
            />
            <address className="mt-8 space-y-2 not-italic leading-relaxed text-muted">
              <p className="font-display text-lg font-semibold text-[var(--fg)]">
                {site.address.clinic}
              </p>
              <p>{site.address.street}</p>
              <p>
                {site.address.city} – {site.address.stateName}
              </p>
              <p>CEP {site.address.zip}</p>
            </address>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar minha consulta
                  <span aria-hidden="true">→</span>
                </a>
              </MagneticButton>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Traçar rota ↗
              </a>
            </div>
          </div>

          <Reveal delay={100} className="glass overflow-hidden rounded-3xl p-2">
            <iframe
              title={`Mapa da localização do consultório na ${site.address.clinic}, ${site.address.street}, ${site.address.city}`}
              src={mapEmbed}
              className="h-[440px] w-full rounded-[1.35rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <FaixaFoto
        src="/images/dr-jose-victor-perfil.jpg"
        alt="Dr. José Victor Lisboa Cardoso Gomes"
        legenda="Clínica Fisiogyn, Setor Sul — estrutura de diagnóstico no mesmo endereço da consulta."
        altura="media"
      />

      <CtaSection
        title="Prefere ser atendido presencialmente?"
        lede="Escolha o melhor horário e venha nos visitar no Setor Sul. Se preferir, também atendo por telemedicina para todo o Brasil."
        message="Olá! Vi as fotos do consultório no site e gostaria de agendar uma consulta presencial em Goiânia."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Consultório", path: "/consultorio" },
          ]),
          medicalWebPageSchema({
            title: "Consultório em Goiânia — Setor Sul",
            description: metadata.description as string,
            path: "/consultorio",
          }),
          {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: `Estrutura do consultório do ${site.shortName} em ${site.address.city}`,
            about: { "@id": `${site.url}/#clinic` },
            image: galleryImageUrls(),
          },
          {
            "@context": "https://schema.org",
            "@type": "Place",
            name: `${site.address.clinic} — consultório do ${site.shortName}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address.street,
              addressLocality: site.address.city,
              addressRegion: site.address.stateName,
              postalCode: site.address.zip,
              addressCountry: site.address.country,
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: site.geo.lat,
              longitude: site.geo.lng,
            },
            hasMap: site.address.mapsUrl,
            photo: galleryImageUrls().slice(0, 6),
          },
        ]}
      />
    </>
  );
}
