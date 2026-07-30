import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { GoogleRating } from "@/components/ui/GoogleRating";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato e agendamento — consultório em Goiânia",
  description:
    "Agende sua consulta com o Dr. José Victor (CRM-GO 38508): Clínica Fisiogyn, Setor Sul, Goiânia-GO, ou telemedicina para todo o Brasil. Atendimento via WhatsApp.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Vamos <span className="text-gradient">começar?</span>
          </>
        }
        lede="O agendamento é feito diretamente pelo WhatsApp — resposta humana, sem robôs de triagem intermináveis."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Contato", path: "/contato" },
        ]}
      >
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Agendar pelo WhatsApp
          <span aria-hidden="true">→</span>
        </a>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="glass card-hover rounded-3xl p-8">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Consultório presencial
            </h2>
            <address className="mt-4 space-y-1 not-italic leading-relaxed text-muted">
              <p className="font-medium text-[var(--fg)]">{site.address.clinic}</p>
              <p>{site.address.street}</p>
              <p>
                {site.address.city} – {site.address.state}
              </p>
              <p>CEP {site.address.zip}</p>
            </address>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
            >
              Abrir no Google Maps ↗
            </a>
          </Reveal>

          <Reveal delay={90} className="glass card-hover rounded-3xl p-8">
            <h2 className="font-display text-lg font-semibold tracking-tight">Telemedicina</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Consultas por vídeo para todo o Brasil, com link seguro enviado após o
              agendamento e documentos assinados digitalmente.
            </p>
            <a
              href="/telemedicina"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
            >
              Como funciona →
            </a>
          </Reveal>

          <Reveal delay={180} className="glass card-hover rounded-3xl p-8">
            <h2 className="font-display text-lg font-semibold tracking-tight">Canais</h2>
            <ul className="mt-4 space-y-3 leading-relaxed text-muted">
              <li>
                <span className="font-mono-tech block text-xs uppercase tracking-[0.16em] text-faint">
                  WhatsApp · Particular
                </span>
                <a
                  href={whatsappLink("particular")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  Agendar com o Dr. José Victor
                </a>
              </li>
              <li>
                <span className="font-mono-tech block text-xs uppercase tracking-[0.16em] text-faint">
                  Instagram
                </span>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  {site.instagramHandle}
                </a>
              </li>
              <li>
                <span className="font-mono-tech block text-xs uppercase tracking-[0.16em] text-faint">
                  E-mail
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  {site.email}
                </a>
              </li>
              <li className="border-t hairline pt-3">
                <span className="font-mono-tech block text-xs uppercase tracking-[0.16em] text-faint">
                  Planos de saúde
                </span>
                <a
                  href={whatsappLink("planos")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                >
                  Atendimento por convênio — falar com a secretaria
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <GoogleRating className="mt-6" />

        <Reveal delay={120} className="glass mt-6 overflow-hidden rounded-3xl">
          <iframe
            title={`Mapa da localização do consultório na ${site.address.clinic}, ${site.address.street}, ${site.address.city}`}
            src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&output=embed`}
            className="h-[380px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Contato", path: "/contato" },
        ])}
      />
    </>
  );
}
