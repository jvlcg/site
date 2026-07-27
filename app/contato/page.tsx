import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
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
                <span className="block text-xs uppercase tracking-[0.16em] text-faint">
                  WhatsApp (agendamento)
                </span>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  Iniciar conversa
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.16em] text-faint">
                  E-mail
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.16em] text-faint">
                  Registro profissional
                </span>
                <span className="font-medium text-[var(--fg)]">{site.crm}</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="glass mt-6 overflow-hidden rounded-3xl">
          <iframe
            title="Mapa — Clínica Fisiogyn, Setor Sul, Goiânia"
            src="https://www.google.com/maps?q=Cl%C3%ADnica+Fisiogyn,+Rua+94,+Setor+Sul,+Goi%C3%A2nia+-+GO&output=embed"
            className="h-[380px] w-full border-0 grayscale-[0.4] contrast-[1.05]"
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
