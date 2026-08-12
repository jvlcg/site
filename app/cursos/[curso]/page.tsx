import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DoacaoPix } from "@/components/cursos/DoacaoPix";
import { Capa } from "@/components/cursos/Capa";
import {
  aulasDo,
  capaDa,
  cursosPublicados,
  dataPorExtenso,
  getCurso,
  naJanelaGratuita,
  textoDoAcesso,
  totalDeAulas,
} from "@/lib/cursos";

/** Mesma razão do catálogo: a janela de lançamento precisa fechar sozinha. */
export const revalidate = 3600;
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site, whatsappDireto } from "@/lib/site-config";

type Props = { params: Promise<{ curso: string }> };

export function generateStaticParams() {
  return cursosPublicados().map((c) => ({ curso: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { curso: slug } = await params;
  const curso = getCurso(slug);
  if (!curso) return {};
  /**
   * Só a capa **local** vira imagem de compartilhamento.
   *
   * A do YouTube funcionaria para o robô do WhatsApp, e não vale o risco: se
   * ela sumir ou mudar, o link quebra num lugar onde ninguém vai perceber —
   * pré-visualização de link não tem quem reclame.
   */
  const primeira = aulasDo(curso)[0];
  const capa = primeira ? capaDa(primeira) : undefined;
  const capaLocal = capa?.startsWith("/") ? capa : undefined;
  return {
    title: curso.titulo,
    description: curso.resumo,
    alternates: { canonical: `/cursos/${slug}` },
    /*
      A capa da primeira aula vira a imagem do link compartilhado.

      Sem ela, um curso mandado no WhatsApp chega como texto puro ou com a
      imagem genérica do site — e link com miniatura é clicado muito mais que
      link sem. Como a imagem agora é servida daqui, ela não depende do YouTube
      estar acessível para o robô que gera a pré-visualização.

      Endereço absoluto porque quem lê isto é outro servidor, e caminho
      relativo não significa nada fora do nosso domínio.
    */
    openGraph: {
      title: curso.titulo,
      description: curso.resumo,
      ...(capaLocal ? { images: [{ url: `${site.url}${capaLocal}`, width: 960, height: 540, alt: curso.titulo }] } : {}),
    },
  };
}

export default async function CursoPage({ params }: Props) {
  const { curso: slug } = await params;
  const curso = getCurso(slug);
  if (!curso) notFound();

  const total = totalDeAulas(curso);
  const primeiraAula = aulasDo(curso)[0];

  return (
    <>
      <PageHero
        fundo="trilha"
        eyebrow={curso.acesso === "pago" ? "Curso" : "Curso gratuito"}
        title={curso.titulo}
        lede={curso.resumo}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Cursos", path: "/cursos" },
          { name: curso.titulo, path: `/cursos/${curso.slug}` },
        ]}
      />

      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="space-y-4 text-[1rem] leading-relaxed text-muted">
              {curso.descricao.map((p, i) => (
                <Reveal key={i} as="p" delay={i * 60}>
                  {p}
                </Reveal>
              ))}
            </div>

            {curso.paraQuem && curso.paraQuem.length > 0 && (
              <Reveal>
                <div className="mt-10">
                  <h2 className="font-display text-lg font-semibold">Para quem é</h2>
                  <ul className="mt-4 space-y-2.5">
                    {curso.paraQuem.map((p) => (
                      <li key={p} className="flex gap-3 text-[0.94rem] leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <div className="mt-12">
              <h2 className="font-display text-lg font-semibold">
                Conteúdo — {total} aula{total === 1 ? "" : "s"}
              </h2>
              <div className="mt-5 space-y-7">
                {curso.modulos.map((m, mi) => (
                  <Reveal key={m.titulo} delay={mi * 50}>
                    <div>
                      <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                        {m.titulo}
                      </p>
                      {m.resumo && (
                        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">{m.resumo}</p>
                      )}
                      <ol className="mt-3 space-y-1.5">
                        {m.aulas.map((a) => (
                          <li key={a.slug}>
                            <Link
                              href={`/cursos/${curso.slug}/${a.slug}`}
                              className="glass card-hover flex items-center gap-3.5 rounded-xl p-2.5 sm:gap-4"
                            >
                              {/*
                                A miniatura na lista, e não só na página da
                                aula. Uma lista de títulos não diz que ali tem
                                vídeo — a imagem diz, e é o que faz alguém
                                clicar. `capaDa` já existia e não estava sendo
                                usada em lugar nenhum.
                              */}
                              <Capa
                                src={capaDa(a)}
                                titulo={a.titulo}
                                className="h-[3.25rem] w-[5.75rem] shrink-0 rounded-lg object-cover sm:h-16 sm:w-28"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="text-[0.94rem]">{a.titulo}</span>
                                {/*
                                  A espera aparece na lista pública para quem
                                  ainda não é aluno — mas como "libera em N
                                  dias", nunca como data. Data exigiria saber
                                  quando essa pessoa se matriculou, e ela ainda
                                  não se matriculou.
                                */}
                                {(a.liberaApos ?? 0) > 0 && (
                                  <span className="ml-2 font-mono-tech text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                                    libera em {a.liberaApos} dia
                                    {a.liberaApos === 1 ? "" : "s"}
                                  </span>
                                )}
                              </span>
                              {a.duracao && (
                                <span className="shrink-0 font-mono-tech text-[0.68rem] text-faint">
                                  {a.duracao}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {curso.acesso === "pago" ? (
              <Reveal>
                <div className="glass rounded-2xl p-6">
                  <p className="font-mono-tech text-[0.66rem] uppercase tracking-[0.16em] text-faint">
                    {naJanelaGratuita(curso) ? "Lançamento" : "Acesso ao curso"}
                  </p>

                  {naJanelaGratuita(curso) ? (
                    <>
                      <p className="font-display mt-2 text-3xl font-semibold text-[var(--accent)]">
                        Gratuito
                      </p>
                      <p className="mt-1 text-[0.86rem] text-faint">
                        até {dataPorExtenso(curso.gratuitoAte!)}
                        {curso.preco !== undefined && (
                          <>
                            {" · depois "}
                            <span className="line-through">
                              R$ {curso.preco.toFixed(2).replace(".", ",")}
                            </span>
                          </>
                        )}
                      </p>
                      {/*
                        A frase que faz a promoção valer a pena para quem entra:
                        entrar agora não é acesso temporário, é ficar com o
                        curso. Sem dizer isso, "grátis até dia 30" se lê como
                        "você perde no dia 30".
                      */}
                      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
                        Entre com sua conta e o curso é seu — quem se matricula
                        durante o lançamento{" "}
                        <strong className="text-[var(--fg)]">
                          continua com acesso depois que a promoção acabar
                        </strong>
                        .
                      </p>
                    </>
                  ) : (
                    <>
                      {curso.preco !== undefined && (
                        <p className="font-display mt-2 text-3xl font-semibold">
                          R$ {curso.preco.toFixed(2).replace(".", ",")}
                        </p>
                      )}
                      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
                        Pagamento por PIX. Depois de confirmado, o acesso é
                        liberado para o e-mail que você usar para entrar.
                      </p>
                    </>
                  )}

                  <p className="font-mono-tech mt-4 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
                    {textoDoAcesso(curso)}
                  </p>
                  {naJanelaGratuita(curso) && primeiraAula ? (
                    /*
                      Durante o lançamento não há nada a negociar: a pessoa
                      entra com a conta e assiste. Mandá-la ao WhatsApp para
                      pedir algo que é de graça criaria uma fila para nada — e
                      cada passo a mais é gente que desiste no meio.
                    */
                    <Link
                      href={`/cursos/${curso.slug}/${primeiraAula.slug}`}
                      className="btn-primary mt-5 w-full justify-center"
                    >
                      Começar agora <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <a
                      /*
                        Vai direto para o WhatsApp dos cursos, sem passar pela
                        ponte `/agendar`.

                        A ponte existe para medir agendamento, e dispara a
                        conversão do Google Ads ao ser aberta. Interesse em
                        curso não é agendamento: contá-lo ali inflaria o número
                        que mede o retorno dos anúncios de consulta, e a
                        campanha passaria a ser otimizada em cima de um sinal
                        falso.
                      */
                      href={whatsappDireto(
                        "cursos",
                        `Olá! Tenho interesse no curso "${curso.titulo}".`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-5 w-full justify-center"
                    >
                      Quero este curso <span aria-hidden="true">→</span>
                    </a>
                  )}
                  <p className="mt-4 text-[0.76rem] leading-relaxed text-faint">
                    Direito de arrependimento em <strong>7 dias</strong>,
                    conforme o art. 49 do Código de Defesa do Consumidor — vale
                    mesmo se você já tiver assistido. Basta pedir por{" "}
                    {site.email}. Veja os{" "}
                    <Link href="/termos-dos-cursos" className="underline underline-offset-2">
                      termos de uso
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <DoacaoPix referencia={`CURSO${curso.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18)}`} />
              </Reveal>
            )}
          </aside>
        </div>

        <p className="mt-16 mb-24 border-t hairline pt-8 text-[0.82rem] leading-relaxed text-faint">
          Conteúdo educativo, sem relação médico-paciente. Não substitui
          consulta, não prescreve tratamento e não avalia caso individual.
          Responsabilidade de {site.name}, {site.crm}.
        </p>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: curso.titulo,
            description: curso.resumo,
            url: `${site.url}/cursos/${curso.slug}`,
            inLanguage: "pt-BR",
            provider: { "@id": `${site.url}/#physician` },
            /**
             * `isAccessibleForFree` e a oferta refletem o acesso real. Declarar
             * gratuito um curso pago é motivo de penalidade do Google, e o
             * contrário esconde do resultado de busca a informação que mais
             * interessa a quem procura conteúdo aberto.
             */
            isAccessibleForFree: curso.acesso !== "pago",
            ...(curso.acesso === "pago" && curso.preco !== undefined
              ? {
                  offers: {
                    "@type": "Offer",
                    price: curso.preco.toFixed(2),
                    priceCurrency: "BRL",
                    category: "Paid",
                  },
                }
              : {}),
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: curso.cargaHoraria,
            },
          },
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Cursos", path: "/cursos" },
            { name: curso.titulo, path: `/cursos/${curso.slug}` },
          ]),
        ]}
      />
    </>
  );
}
