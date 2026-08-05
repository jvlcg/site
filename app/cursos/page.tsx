import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import type { Curso } from "@/content/cursos";
import {
  cursosPublicados,
  dataPorExtenso,
  naJanelaGratuita,
  textoDoAcesso,
  totalDeAulas,
} from "@/lib/cursos";

/**
 * O catálogo se regenera de hora em hora.
 *
 * Sem isso, uma janela de lançamento que fechasse às 23h59 continuaria
 * anunciando "grátis" até alguém fazer uma publicação nova — e o site estaria
 * oferecendo de graça algo que já voltou a ser pago. Uma hora de atraso é
 * aceitável; uma semana não é.
 */
export const revalidate = 3600;
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cursos e aulas em vídeo",
  description:
    "Aulas em vídeo sobre saúde, em linguagem sem jargão, com o Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508). Conteúdo gratuito aberto e cursos completos.",
  alternates: { canonical: "/cursos" },
};

const DESTAQUE = "text-[var(--accent)] border-[color-mix(in_oklab,var(--accent)_45%,transparent)]";
const DISCRETO = "text-faint border-[color-mix(in_oklab,var(--fg)_18%,transparent)]";

/**
 * O selo do cartão diz a coisa mais decisiva sobre o curso.
 *
 * A janela de lançamento vem antes de tudo, e com a data: "Grátis até 30 de
 * setembro" é o que faz alguém clicar hoje em vez de amanhã, e omitir a data
 * transformaria uma informação em pressão vazia.
 */
function selo(curso: Curso) {
  if (naJanelaGratuita(curso)) {
    return { texto: `Grátis até ${dataPorExtenso(curso.gratuitoAte!)}`, classe: DESTAQUE };
  }
  if (curso.acesso === "livre") return { texto: "Gratuito", classe: DESTAQUE };
  if (curso.acesso === "cadastro") return { texto: "Gratuito · com conta", classe: DESTAQUE };
  return { texto: "Curso completo", classe: DISCRETO };
}

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
              const marca = selo(c);
              return (
                <Reveal key={c.slug} delay={(i % 3) * 70}>
                  <Link
                    href={`/cursos/${c.slug}`}
                    className="glass card-hover flex h-full flex-col rounded-2xl p-6"
                  >
                    <span
                      className={`font-mono-tech w-fit rounded-full border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] ${marca.classe}`}
                    >
                      {marca.texto}
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
                      {/*
                        A duração do acesso aparece já no cartão, antes de
                        qualquer clique. Vender acesso limitado sem dizer que é
                        limitado é problema de Código de Defesa do Consumidor.
                      */}
                      {c.acesso === "pago" ? ` · ${textoDoAcesso(c).toLowerCase()}` : ""}
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
