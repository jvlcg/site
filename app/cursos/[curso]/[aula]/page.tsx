import type { Metadata } from "next";
import { FundoDaPagina } from "@/components/ui/FundoDaPagina";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { DoacaoPix } from "@/components/cursos/DoacaoPix";
import { EntrarAluno } from "@/components/cursos/EntrarAluno";
import { Player } from "@/components/cursos/Player";
import { Capa } from "@/components/cursos/Capa";
import { MarcarAula } from "@/components/cursos/MarcarAula";
import { alunoAtual, buscarMatricula, matriculasConfiguradas } from "@/lib/aluno";
import {
  aulaIndexavel,
  aulasDo,
  capaDa,
  duracaoISO,
  getAula,
  getCurso,
  podeVer,
  textoDoAcesso,
  vizinhas,
} from "@/lib/cursos";
import { JsonLd } from "@/lib/schema";
import { site, whatsappDireto } from "@/lib/site-config";

type Props = { params: Promise<{ curso: string; aula: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { curso: cs, aula: as } = await params;
  const curso = getCurso(cs);
  const aula = curso && getAula(curso, as);
  if (!curso || !aula) return {};

  const indexavel = aulaIndexavel(curso);
  /* Ver a nota na página do curso: só a capa servida daqui. */
  const capa = capaDa(aula);
  const capaLocal = capa?.startsWith("/") ? capa : undefined;
  return {
    title: `${aula.titulo} — ${curso.titulo}`,
    description: aula.resumo ?? curso.resumo,
    alternates: { canonical: `/cursos/${curso.slug}/${aula.slug}` },
    /*
      A miniatura do próprio vídeo no link compartilhado — é a aula que costuma
      ser mandada no WhatsApp, mais que a página do curso.
    */
    openGraph: {
      title: aula.titulo,
      description: aula.resumo ?? curso.resumo,
      ...(capaLocal
        ? { images: [{ url: `${site.url}${capaLocal}`, width: 960, height: 540, alt: aula.titulo }] }
        : {}),
    },
    /**
     * Aula que exige conta não entra no índice do Google.
     *
     * Não é zelo de SEO: é evitar que alguém clique num resultado de busca e
     * caia numa porta fechada. O Google também penaliza esse padrão, mas a
     * razão principal é a pessoa do outro lado.
     */
    ...(indexavel ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function AulaPage({ params }: Props) {
  const { curso: cs, aula: as } = await params;
  const curso = getCurso(cs);
  const aula = curso && getAula(curso, as);
  if (!curso || !aula) notFound();

  /**
   * Curso livre nunca toca no cookie nem no banco.
   *
   * Além de ser mais rápido, é o que permite ao Next gerar essas páginas
   * estaticamente: qualquer leitura de cookie tornaria a rota dinâmica, e a
   * aula aberta perderia o cache e a indexação que a tornam útil.
   */
  const livre = curso.acesso === "livre";
  const aluno = livre ? null : await alunoAtual();
  const matricula =
    aluno && matriculasConfiguradas() ? await buscarMatricula(aluno.email, curso.slug) : null;

  const acesso = podeVer(curso, aula, aluno, matricula);
  const { anterior, proxima } = vizinhas(curso, aula.slug);
  const todasAsAulas = aulasDo(curso);

  return (
    <article className="relative overflow-hidden pt-28 pb-24 sm:pt-32">
        <FundoDaPagina fundo="foco" />
      <div className="mesh-bg opacity-40" />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <nav aria-label="Trilha de navegação" className="mb-6">
          <ol className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] uppercase tracking-[0.14em] text-faint">
            <li className="flex items-center gap-2">
              <Link href="/cursos" className="transition-colors hover:text-[var(--fg)]">
                Cursos
              </Link>
              <span aria-hidden="true" className="opacity-50">/</span>
            </li>
            <li className="flex items-center gap-2">
              <Link href={`/cursos/${curso.slug}`} className="transition-colors hover:text-[var(--fg)]">
                {curso.titulo}
              </Link>
              <span aria-hidden="true" className="opacity-50">/</span>
            </li>
            <li>
              <span aria-current="page" className="text-[var(--accent)]">{aula.titulo}</span>
            </li>
          </ol>
        </nav>

        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {aula.titulo}
        </h1>
        {aula.duracao && (
          <p className="font-mono-tech mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
            {aula.duracao}
          </p>
        )}

        <div className="mt-7">
          {acesso.tipo === "liberado" ? (
            <Player video={aula.video} titulo={aula.titulo} capa={aula.capa} />
          ) : acesso.tipo === "aguardaLiberacao" ? (
            <div className="glass flex aspect-video w-full items-center justify-center rounded-2xl p-8 text-center">
              <div>
                <p className="font-mono-tech text-[0.66rem] uppercase tracking-[0.16em] text-[var(--accent)]">
                  Abre em {acesso.dias} dia{acesso.dias === 1 ? "" : "s"}
                </p>
                <h2 className="font-display mt-3 text-xl font-semibold">
                  Esta aula ainda não abriu
                </h2>
                <p className="mx-auto mt-2.5 max-w-sm text-[0.9rem] leading-relaxed text-muted">
                  O curso libera o conteúdo aos poucos, para dar tempo de
                  praticar o que veio antes. Ela abre em{" "}
                  {acesso.abreEm.toLocaleDateString("pt-BR")}.
                </p>
              </div>
            </div>
          ) : acesso.tipo === "expirado" ? (
            <div className="glass rounded-2xl p-6 sm:p-7">
              <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                Acesso encerrado
              </p>
              <h2 className="font-display mt-2.5 text-xl font-semibold">
                Seu prazo de acesso terminou
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
                Este curso dá {textoDoAcesso(curso).toLowerCase()}, e o seu venceu
                em {acesso.expirouEm.toLocaleDateString("pt-BR")}. Dá para
                renovar — é só falar com o consultório.
              </p>
              <a
                href={whatsappDireto(
                  "cursos",
                  `Olá! Meu acesso ao curso "${curso.titulo}" venceu e gostaria de renovar.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 !py-2.5 text-sm"
              >
                Renovar acesso
              </a>
            </div>
          ) : acesso.tipo === "precisaEntrar" ? (
            <EntrarAluno curso={curso.slug} motivo="Entre para assistir" />
          ) : (
            <div className="glass rounded-2xl p-6 sm:p-7">
              <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                Acesso não liberado
              </p>
              <h2 className="font-display mt-2.5 text-xl font-semibold">
                Este curso ainda não está liberado para a sua conta
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
                Você entrou como <strong className="text-[var(--fg)]">{aluno?.email}</strong>.
                Se já pagou, o acesso é liberado para o e-mail informado no
                pagamento — se foi outro, entre com ele.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/cursos/${curso.slug}`} className="btn-ghost !py-2.5 text-sm">
                  Ver como participar
                </Link>
                {/*
                  Quem chega a esta tela já pagou e não está conseguindo
                  assistir — quase sempre porque entrou com um e-mail diferente
                  do que informou na compra. É o pior momento para oferecer só
                  um link de volta: aqui a pessoa precisa falar com alguém.
                */}
                <a
                  href={whatsappDireto(
                    "cursos",
                    `Olá! Paguei o curso "${curso.titulo}" e não estou conseguindo acessar. Entrei com o e-mail ${aluno?.email ?? ""}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2.5 text-sm"
                >
                  Falar sobre o acesso
                </a>
              </div>
            </div>
          )}
        </div>

        {aula.resumo && (
          <p className="mt-7 text-[0.98rem] leading-relaxed text-muted">{aula.resumo}</p>
        )}

        {/*
          Só faz sentido em curso com matrícula: sem conta não há onde guardar
          o progresso, e o botão apareceria prometendo algo que não acontece.
        */}
        {acesso.tipo === "liberado" && !livre && (
          <MarcarAula curso={curso.slug} aula={aula.slug} />
        )}

        {acesso.tipo === "liberado" && aula.anexos && aula.anexos.length > 0 && (
          <div className="mt-8">
            <h2 className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
              Material de apoio
            </h2>
            <ul className="mt-3 space-y-2">
              {aula.anexos.map((a) => (
                <li key={a.url}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.92rem] text-[var(--accent)] underline underline-offset-4"
                  >
                    {a.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(anterior || proxima) && (
          <nav aria-label="Outras aulas" className="mt-12 grid gap-4 border-t hairline pt-8 sm:grid-cols-2">
            {anterior ? (
              <Link href={`/cursos/${curso.slug}/${anterior.slug}`} className="glass card-hover flex items-center gap-3.5 rounded-2xl p-3.5">
                <Capa
                  src={capaDa(anterior)}
                  titulo={anterior.titulo}
                  className="h-14 w-24 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="font-mono-tech block text-[0.62rem] uppercase tracking-[0.16em] text-faint">Anterior</span>
                  <span className="font-display mt-1 block font-semibold leading-snug">{anterior.titulo}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {proxima && (
              <Link href={`/cursos/${curso.slug}/${proxima.slug}`} className="glass card-hover flex items-center gap-3.5 rounded-2xl p-3.5 sm:flex-row-reverse sm:text-right">
                <Capa
                  src={capaDa(proxima)}
                  titulo={proxima.titulo}
                  className="h-14 w-24 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="font-mono-tech block text-[0.62rem] uppercase tracking-[0.16em] text-faint">Próxima</span>
                  <span className="font-display mt-1 block font-semibold leading-snug">{proxima.titulo}</span>
                </span>
              </Link>
            )}
          </nav>
        )}

        {/*
          A lista completa do curso, com a aula atual marcada.

          "Anterior" e "próxima" bastam para quem segue a ordem e não servem
          para mais nada: quem quer pular para a quarta aula, ou só ver o que
          vem pela frente, precisava voltar à página do curso. Numa série em
          vídeo isso é o mínimo — é a barra lateral que todo player de curso
          tem, e a falta dela era boa parte do "está muito simples".

          Só aparece com três aulas ou mais. Com duas, os cartões de anterior e
          próxima já mostram o curso inteiro, e repetir vira ruído.
        */}
        {/*
          A lista completa some quando o curso é grande — e isso saiu de uma
          medição, não de gosto.

          Com 18 aulas, cada página de aula trazia os 18 títulos. Somados ao
          menu e ao rodapé, que já se repetem, o resultado foi que **duas aulas
          quaisquer tinham 0 ou 1 palavra diferente entre si**: páginas
          praticamente idênticas, distintas apenas pelo vídeo embutido.

          O Search Console reagiu como era de esperar: 15 páginas em "detectada,
          mas não indexada", nunca rastreadas. O Google achou dezoito páginas
          iguais e decidiu não gastar rastreio nelas.

          Até 8 aulas a lista continua: ali ela ajuda a navegar e ainda sobra
          diferença entre as páginas. Acima disso, os cartões de anterior e
          próxima — que mudam a cada aula — mais o link para o curso dão o mesmo
          serviço sem transformar toda aula numa cópia da vizinha.

          Isto reduz a duplicação; **não resolve o problema de fundo**, que é
          cada aula não ter um texto próprio. Enquanto não houver resumo por
          aula, a página continua sendo um título e um vídeo.
        */}
        {todasAsAulas.length > 2 && todasAsAulas.length <= 8 && (
          <nav aria-label="Aulas deste curso" className="mt-12 border-t hairline pt-8">
            <h2 className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
              As {todasAsAulas.length} aulas de {curso.titulo}
            </h2>
            <ol className="mt-4 space-y-1.5">
              {todasAsAulas.map((a, i) => {
                const atual = a.slug === aula.slug;
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/cursos/${curso.slug}/${a.slug}`}
                      aria-current={atual ? "page" : undefined}
                      className={`flex items-center gap-3.5 rounded-xl p-2.5 transition-colors ${
                        atual
                          ? "glass ring-1 ring-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
                          : "glass card-hover"
                      }`}
                    >
                      <span className="font-mono-tech w-5 shrink-0 text-center text-[0.7rem] text-faint">
                        {i + 1}
                      </span>
                      <Capa
                        src={capaDa(a)}
                        titulo={a.titulo}
                        className="h-[3.25rem] w-[5.75rem] shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[0.92rem] leading-snug ${atual ? "font-semibold text-[var(--accent)]" : ""}`}
                        >
                          {a.titulo}
                        </span>
                        {atual && (
                          <span className="font-mono-tech mt-1 block text-[0.6rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                            Você está aqui
                          </span>
                        )}
                      </span>
                      {a.duracao && (
                        <span className="shrink-0 font-mono-tech text-[0.68rem] text-faint">{a.duracao}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {livre && (
          <Reveal>
            <div className="mt-12">
              <DoacaoPix
                referencia={`AULA${curso.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18)}`}
              />
            </div>
          </Reveal>
        )}

        <p className="mt-12 rounded-2xl border hairline p-5 text-[0.8rem] leading-relaxed text-faint">
          Conteúdo educativo de {site.name} ({site.crm}). Não substitui consulta
          médica, não estabelece relação médico-paciente e não avalia caso
          individual. Em emergência, procure atendimento imediato ou ligue 192
          (SAMU).
        </p>
      </div>

      {/*
        Dados estruturados de vídeo — só na aula aberta, e só quando há data de
        publicação.

        As duas condições existem pelo mesmo motivo. Declarar `VideoObject` numa
        aula que exige conta faria o Google mostrar a miniatura no resultado de
        busca e mandar quem clicasse para uma tela de login: promessa quebrada,
        e é assim que se perde posição. E `uploadDate` é campo obrigatório —
        sem ele o Google descarta o bloco inteiro, então emitir incompleto é
        gastar bytes por nada.
      */}
      {aulaIndexavel(curso) && aula.publicadaEm && capaDa(aula) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: aula.titulo,
            description: aula.resumo ?? curso.resumo,
            thumbnailUrl: [capaDa(aula)],
            uploadDate: aula.publicadaEm,
            duration: duracaoISO(aula.duracao),
            embedUrl:
              aula.video.tipo === "youtube"
                ? `https://www.youtube-nocookie.com/embed/${aula.video.id}`
                : undefined,
            url: `${site.url}/cursos/${curso.slug}/${aula.slug}`,
            inLanguage: "pt-BR",
            isFamilyFriendly: true,
            /** Aberta de verdade: sem login, sem cadastro, sem pagamento. */
            isAccessibleForFree: true,
            publisher: { "@id": `${site.url}/#physician` },
            /** A aula pertence ao curso — é o que liga os dois no índice. */
            partOfSeries: {
              "@type": "CreativeWorkSeries",
              name: curso.titulo,
              url: `${site.url}/cursos/${curso.slug}`,
            },
          }}
        />
      )}
    </article>
  );
}
