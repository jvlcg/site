import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PLANEJADOS, REALIZADOS, type Acao } from "@/content/voluntariado";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projetos voluntários",
  description:
    "Trabalho voluntário do Dr. José Victor: internato na rede pública, campanha de vacinação contra a COVID-19, extensão universitária e projetos novos.",
  alternates: { canonical: "/voluntariado" },
};

function Cartao({ acao, futuro = false }: { acao: Acao; futuro?: boolean }) {
  return (
    <article id={acao.slug} className="glass card-hover h-full scroll-mt-28 rounded-2xl p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        {futuro ? (
          /*
            O selo de "em breve" é o que separa intenção de realização.
            Sem ele a lista inteira se lê como coisa feita, e anunciar como
            existente um projeto que ainda não começou é propaganda — o oposto
            do que esta página deveria ser.
          */
          <span className="font-mono-tech rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--accent)]">
            Em breve
          </span>
        ) : (
          acao.periodo && (
            <span className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
              {acao.periodo}
            </span>
          )
        )}
      </div>
      <h3 className="font-display mt-3 text-lg font-semibold leading-snug">{acao.titulo}</h3>
      {acao.local && <p className="mt-1.5 text-[0.82rem] text-faint">{acao.local}</p>}
      <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{acao.texto}</p>
    </article>
  );
}

export default function VoluntariadoPage() {
  return (
    <>
      <PageHero
        fundo="semear"
        eyebrow="Comunidade"
        title={
          <>
            Projetos <span className="text-gradient">voluntários</span>
          </>
        }
        lede="Registro do trabalho comunitário já realizado e das iniciativas em preparação. Esta página é atualizada conforme cada projeto avança."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Voluntariado", path: "/voluntariado" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Histórico"
          title="O que já foi feito"
          lede="Atividades concluídas, com período e local. Cada item descreve a atividade — não quem a realizou."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {REALIZADOS.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 2) * 70}>
              <Cartao acao={a} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Em preparação"
          title="O que vem a seguir"
          lede="Iniciativas ainda em planejamento. Nenhuma delas começou — quando começar, o projeto sai desta lista e passa para o histórico acima, com data."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANEJADOS.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 70}>
              <Cartao acao={a} futuro />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="glass mt-10 rounded-2xl p-6 sm:p-7">
            <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
              Quer participar ou propor uma ação?
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Instituições, associações de bairro e coletivos que queiram propor uma
              parceria podem escrever para{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-[var(--accent)] underline underline-offset-4"
              >
                {site.email}
              </a>
              . Propostas de ação comunitária têm prioridade de resposta.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 mb-24 max-w-6xl px-5 sm:px-8">
        <p className="border-t hairline pt-8 text-[0.82rem] leading-relaxed text-faint">
          Esta página registra atividades de caráter social e educativo de {site.name} (
          {site.crm}). Não é publicidade de serviço médico, não descreve resultados de
          tratamento e não substitui consulta.{" "}
          <Link href="/sobre" className="underline underline-offset-4">
            Formação e produção científica
          </Link>{" "}
          ficam na página Sobre.
        </p>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Voluntariado", path: "/voluntariado" },
        ])}
      />
    </>
  );
}
