import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/** Identificador do painel da Soro que alimenta esta página. */
const SORO_EMBED_ID = "85ab1693-799e-4f7e-8017-4b1ea52c3567";

export const metadata: Metadata = {
  title: "Novidades do consultório",
  description:
    "Atualizações e publicações recentes do consultório do Dr. José Victor Lisboa Cardoso Gomes — CRM-GO 38508, Goiânia-GO.",
  alternates: { canonical: "/novidades" },
};

/**
 * Página de novidades alimentada por um serviço externo (Soro).
 *
 * O conteúdo é montado no navegador pelo script da Soro, então **não recebe**
 * o tratamento de SEO das outras páginas: sem Schema por publicação, sem
 * entrada individual no sitemap, sem imagem de compartilhamento própria. Para
 * conteúdo que precisa ranquear no Google, use o blog em MDX (`/blog`), onde
 * cada artigo é gerado no servidor com tudo isso.
 *
 * A liberação da Content-Security-Policy para app.trysoro.com está limitada a
 * esta rota em next.config.ts — o restante do site continua aceitando script
 * apenas do próprio domínio.
 */
export default function NovidadesPage() {
  return (
    <>
      <PageHero
        eyebrow="Atualizações"
        title={
          <>
            Novidades do <span className="text-gradient">consultório</span>
          </>
        }
        lede="Publicações e avisos recentes. Para os textos educativos sobre saúde, veja o blog."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Novidades", path: "/novidades" },
        ]}
      />

      <section className="mx-auto mt-16 max-w-4xl px-5 sm:px-8">
        <Reveal>
          {/* alvo onde o script da Soro injeta o conteúdo */}
          <div id="soro-blog" className="min-h-[24rem]" />
        </Reveal>
        <Script
          src={`https://app.trysoro.com/api/embed/${SORO_EMBED_ID}`}
          strategy="afterInteractive"
        />
      </section>

      <section className="mx-auto mt-24 max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Leia também" title="Conteúdo educativo" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/blog", t: "Blog", d: "Textos sobre sono, dor, emagrecimento e telemedicina." },
            { href: "/artigos", t: "Artigos científicos", d: "Produção publicada em periódicos e congressos." },
          ].map((l, i) => (
            <Reveal key={l.href} delay={i * 70}>
              <Link href={l.href} className="holo glass card-hover block rounded-2xl p-6">
                <p className="font-display font-semibold">{l.t}</p>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">{l.d}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title="Quer conversar sobre o seu caso?"
        lede="Conteúdo informativo não substitui avaliação médica. Fale com o consultório e agende sua consulta."
        message="Olá! Vi as novidades no site e gostaria de agendar uma consulta."
      />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Novidades", path: "/novidades" },
        ])}
      />
    </>
  );
}
