import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { cursosPublicados, totalDeAulas } from "@/lib/cursos";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cursos e aulas em vídeo",
  description:
    "Aulas em vídeo sobre saúde, em linguagem sem jargão, com o Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508). Conteúdo gratuito aberto e cursos completos.",
  alternates: { canonical: "/cursos" },
};

const SELO = {
  livre: { texto: "Gratuito", classe: "text-[var(--accent)] border-[color-mix(in_oklab,var(--accent)_45%,transparent)]" },
  cadastro: { texto: "Gratuito · com conta", classe: "text-[var(--accent)] border-[color-mix(in_oklab,var(--accent)_45%,transparent)]" },
  pago: { texto: "Curso completo", classe: "text-faint border-[color-mix(in_oklab,var(--fg)_18%,transparent)]" },
} as const;

export default function CursosPage() {
  const cursos = cursosPublicados();

  return (
    <>
      <PageHero
        eyebrow="Aulas"
        title={
          <>
            <span className="text-gradient">Cursos</span> e aulas em vídeo
          </>
        }
        lede="Conteúdo educativo em vídeo, em linguagem sem jargão. As aulas gratuitas são abertas a qualquer pessoa, sem cadastro."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Cursos", path: "/cursos" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        {cursos.length === 0 ? (
          /*
            Catálogo vazio não é erro nem 404: a página existe, está anunciada
            no menu, e o primeiro curso entra sem nenhuma mudança de código.
            Dizer "ainda não" é mais honesto que sumir com a página.
          */
          <Reveal>
            <div className="glass rounded-2xl p-8 text-center sm:p-10">
              <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">
                Em breve
              </p>
              <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                As primeiras aulas estão sendo gravadas
              </h2>
              <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted">
                Quem se cadastrar é avisado quando a primeira turma abrir — pelo
                aparelho ou por e-mail, como preferir.
              </p>
              <Link href="/cadastro" className="btn-primary mt-7 inline-flex">
                Quero ser avisado <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((c, i) => {
              const selo = SELO[c.acesso];
              return (
                <Reveal key={c.slug} delay={(i % 3) * 70}>
                  <Link
                    href={`/cursos/${c.slug}`}
                    className="glass card-hover flex h-full flex-col rounded-2xl p-6"
                  >
                    <span
                      className={`font-mono-tech w-fit rounded-full border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] ${selo.classe}`}
                    >
                      {selo.texto}
                    </span>
                    <h2 className="font-display mt-4 text-lg font-semibold leading-snug">
                      {c.titulo}
                    </h2>
                    <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-muted">
                      {c.resumo}
                    </p>
                    <p className="mt-4 font-mono-tech text-[0.68rem] uppercase tracking-[0.14em] text-faint">
                      {totalDeAulas(c)} aula{totalDeAulas(c) === 1 ? "" : "s"}
                      {c.cargaHoraria ? ` · ${c.cargaHoraria}` : ""}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        <p className="mt-16 mb-24 border-t hairline pt-8 text-[0.82rem] leading-relaxed text-faint">
          As aulas são <strong className="text-[var(--fg)]">conteúdo educativo</strong> e
          não substituem consulta médica. Nenhuma delas estabelece relação
          médico-paciente, prescreve tratamento ou avalia caso individual. Em
          emergência, procure atendimento imediato ou ligue 192 (SAMU).
          Conteúdo de responsabilidade de {site.name}, {site.crm}.{" "}
          <Link href="/termos-dos-cursos" className="underline underline-offset-4">
            Termos de uso dos cursos
          </Link>
          .
        </p>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Cursos", path: "/cursos" },
        ])}
      />
    </>
  );
}
