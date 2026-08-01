import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getAllArticles } from "@/lib/articles";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mapa do site",
  description:
    "Todas as páginas do site do Dr. José Victor (CRM-GO 38508): áreas de atuação, consultório em Goiânia, telemedicina, blog e contato.",
  alternates: { canonical: "/mapa-do-site" },
};

const grupos = [
  {
    titulo: "Atendimento",
    links: [
      { href: "/clinica-medica", label: "Clínica Médica e Check-up", desc: "Consultas aprofundadas, prevenção e acompanhamento contínuo." },
      { href: "/medicina-endocanabinoide", label: "Medicina Endocanabinoide", desc: "Avaliação criteriosa, prescrição regulamentada e laudo para cultivo." },
      { href: "/medicina-esportiva", label: "Medicina Esportiva e Performance", desc: "Manejo de dor, retorno ao esporte e saúde de quem treina." },
      { href: "/telemedicina", label: "Telemedicina", desc: "Consulta por vídeo para todo o Brasil, com prescrição digital." },
    ],
  },
  {
    titulo: "O consultório",
    links: [
      { href: "/consultorio", label: "Consultório em Goiânia", desc: "Fotos da estrutura, localização no mapa e como chegar." },
      { href: "/sobre", label: "Sobre o médico", desc: "Formação, trajetória de pesquisa e publicações científicas." },
      { href: "/contato", label: "Contato e agendamento", desc: "Canais de atendimento, endereço e mapa." },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes", desc: "Respostas sobre consultas, valores, convênios e telemedicina." },
      { href: "/novidades", label: "Novidades", desc: "Atualizações e avisos recentes do consultório." },
    ],
  },
  {
    titulo: "Conteúdo",
    links: [
      { href: "/blog", label: "Blog — educação em saúde", desc: "Textos educativos para pacientes." },
      { href: "/artigos", label: "Artigos científicos", desc: "Produção científica publicada em periódicos e congressos." },
    ],
  },
  {
    titulo: "Institucional",
    links: [
      { href: "/politica-de-privacidade", label: "Política de Privacidade", desc: "Tratamento de dados conforme a LGPD." },
    ],
  },
];

export default function MapaDoSitePage() {
  const artigos = getAllArticles();

  return (
    <>
      <PageHero
        eyebrow="Navegação"
        title={
          <>
            Mapa do <span className="text-gradient">site</span>
          </>
        }
        lede="Todas as páginas em um só lugar — para você (e para os buscadores) encontrarem rapidamente o que procuram."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Mapa do site", path: "/mapa-do-site" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {grupos.map((g, gi) => (
            <Reveal key={g.titulo} delay={(gi % 2) * 80} className="glass rounded-3xl p-7">
              <h2 className="font-display text-lg font-semibold tracking-tight">{g.titulo}</h2>
              <ul className="mt-5 space-y-4">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                    >
                      {l.label}
                    </Link>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{l.desc}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="glass mt-8 rounded-3xl p-7">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Artigos publicados
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {artigos.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="font-medium text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  {a.title}
                </Link>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{a.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-8 text-center text-sm text-faint">
          <p>
            Versão para buscadores:{" "}
            <a href="/sitemap.xml" className="underline underline-offset-4 hover:text-[var(--accent)]">
              sitemap.xml
            </a>{" "}
            ·{" "}
            <a href="/robots.txt" className="underline underline-offset-4 hover:text-[var(--accent)]">
              robots.txt
            </a>{" "}
            ·{" "}
            <a href="/llms.txt" className="underline underline-offset-4 hover:text-[var(--accent)]">
              llms.txt
            </a>
          </p>
        </Reveal>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Mapa do site", path: "/mapa-do-site" },
        ])}
      />
    </>
  );
}
