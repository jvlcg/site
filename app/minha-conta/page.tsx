import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { EntrarAluno } from "@/components/cursos/EntrarAluno";
import { SairDaConta } from "@/components/cursos/SairDaConta";
import { MeusPontos } from "@/components/cursos/MeusPontos";
import { alunoAtual, buscarMatricula, matriculasConfiguradas } from "@/lib/aluno";
import {
  acessoAgora,
  aulasDo,
  cursosPublicados,
  fimDoAcesso,
  textoDoAcesso,
} from "@/lib/cursos";
import { contaDe, pontosConfigurados } from "@/lib/pontos";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Seus cursos e o acesso à área de aluno.",
  alternates: { canonical: "/minha-conta" },
  /**
   * Página de sessão, não de conteúdo. O que ela mostra depende de quem está
   * logado — para o Google seria sempre uma tela de login vazia, e mandar
   * alguém da busca para cá é levá-lo a lugar nenhum.
   */
  robots: { index: false, follow: false },
};

export default async function MinhaContaPage() {
  const aluno = await alunoAtual();

  if (!aluno) {
    return (
      <>
        <PageHero
          eyebrow="Conta"
          title="Entrar"
          lede="A conta serve para os cursos: guarda seu nome e e-mail, e nada mais."
          breadcrumbs={[
            { name: "Início", path: "/" },
            { name: "Minha conta", path: "/minha-conta" },
          ]}
        />
        <section className="mx-auto mb-24 max-w-2xl px-5 sm:px-8">
          <Reveal>
            <EntrarAluno curso="" motivo="Entre com sua conta do Google" />
          </Reveal>
          <p className="mt-8 text-[0.86rem] leading-relaxed text-faint">
            Ainda não tem cursos para acessar?{" "}
            <Link href="/cursos" className="text-[var(--accent)] underline underline-offset-4">
              Veja o que já está disponível
            </Link>
            {" "}— parte do conteúdo é aberta e não exige conta nenhuma.
          </p>
        </section>
      </>
    );
  }

  /**
   * Percorre os cursos publicados e pergunta, um a um, se esta pessoa tem
   * acesso. É pouco elegante e é o certo: a alternativa seria listar as
   * matrículas do banco, e aí um curso despublicado continuaria aparecendo na
   * conta de quem se matriculou — prometendo um conteúdo que não existe mais.
   */
  const cursos = cursosPublicados();
  const meus = [];
  for (const curso of cursos) {
    const nivel = acessoAgora(curso);
    if (nivel === "livre") continue;
    const matricula = matriculasConfiguradas()
      ? await buscarMatricula(aluno.email, curso.slug)
      : null;
    if (!matricula) continue;
    const fim = fimDoAcesso(curso, matricula);
    meus.push({ curso, matricula, fim, vencido: !!fim && fim < new Date() });
  }

  const abertos = cursos.filter((c) => acessoAgora(c) === "livre");

  /**
   * A conta de pontos nasce aqui, na primeira visita — não no login.
   *
   * É a primeira tela em que ela pode ser vista, e criar registro para quem
   * entrou uma vez e nunca voltou seria encher o banco de contas mortas.
   */
  const pontos = pontosConfigurados() ? await contaDe(aluno.email, aluno.nome) : null;

  return (
    <>
      <PageHero
        eyebrow="Conta"
        title={<>Olá, {aluno.nome.split(" ")[0] || "tudo bem"}</>}
        lede={`Você entrou como ${aluno.email}.`}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Minha conta", path: "/minha-conta" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        {pontos && (
          <div className="mb-12">
            <MeusPontos conta={pontos} />
          </div>
        )}

        <h2 className="font-display text-xl font-semibold">Seus cursos</h2>

        {meus.length === 0 ? (
          <Reveal>
            <div className="glass mt-5 rounded-2xl p-6">
              <p className="leading-relaxed text-muted">
                Você ainda não tem nenhum curso liberado nesta conta. Se já
                pagou por algum, o acesso é liberado para o e-mail informado no
                pagamento — se foi outro, entre com ele.
              </p>
              <Link href="/cursos" className="btn-primary mt-5 !py-2.5 text-sm">
                Ver os cursos <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-5 space-y-3">
            {meus.map(({ curso, matricula, fim, vencido }, i) => {
              const total = aulasDo(curso).length;
              return (
                <Reveal key={curso.slug} delay={i * 60}>
                  <Link
                    href={`/cursos/${curso.slug}`}
                    className="glass card-hover block rounded-2xl p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-display font-semibold">{curso.titulo}</p>
                      <span
                        className={`font-mono-tech text-[0.64rem] uppercase tracking-[0.16em] ${
                          vencido ? "text-red-400" : "text-[var(--accent)]"
                        }`}
                      >
                        {vencido ? "acesso vencido" : "liberado"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.86rem] text-muted">{curso.resumo}</p>
                    <p className="font-mono-tech mt-3 text-[0.66rem] uppercase tracking-[0.14em] text-faint">
                      {total} aula{total === 1 ? "" : "s"} ·{" "}
                      {fim
                        ? `${vencido ? "venceu" : "vence"} em ${fim.toLocaleDateString("pt-BR")}`
                        : textoDoAcesso(curso).toLowerCase()}
                      {" · desde "}
                      {new Date(matricula.criadoEm).toLocaleDateString("pt-BR")}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {abertos.length > 0 && (
          <>
            <h2 className="font-display mt-14 text-xl font-semibold">
              Abertos a qualquer pessoa
            </h2>
            <p className="mt-1.5 text-[0.88rem] text-muted">
              Estes não precisam de conta — estão aqui só para você não perdê-los
              de vista.
            </p>
            <div className="mt-5 space-y-3">
              {abertos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cursos/${c.slug}`}
                  className="glass card-hover block rounded-2xl p-5"
                >
                  <p className="font-display font-semibold">{c.titulo}</p>
                  <p className="mt-1.5 text-[0.86rem] text-muted">{c.resumo}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-14 rounded-2xl border hairline p-6">
          <h2 className="font-display text-base font-semibold">Sobre esta conta</h2>
          <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted">
            Ela guarda apenas <strong className="text-[var(--fg)]">seu nome e
            e-mail</strong>, e a data em que cada curso foi liberado. Não guarda
            senha, não registra o que você assistiu e{" "}
            <strong className="text-[var(--fg)]">não dá acesso a nenhum dado
            clínico</strong> — conta de aluno e cadastro de paciente são coisas
            separadas no site.
          </p>
          <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted">
            Para apagar sua conta, escreva para {site.email}. Detalhes na{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-4">
              política de privacidade
            </Link>{" "}
            e nos{" "}
            <Link href="/termos-dos-cursos" className="underline underline-offset-4">
              termos dos cursos
            </Link>
            .
          </p>
          <SairDaConta />
        </div>
      </section>

      <div className="mb-24" />
    </>
  );
}
