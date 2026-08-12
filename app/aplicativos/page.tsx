import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import {
  COLECOES,
  ROTULO_PUBLICO,
  aplicativosDa,
  temAplicativos,
  type Aplicativo,
} from "@/content/aplicativos";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Aplicativos",
  description:
    "Aplicativos desenvolvidos pelo Dr. José Victor e indicações para médicos, pacientes e curiosos.",
  alternates: { canonical: "/aplicativos" },
};

/**
 * O cartão de um aplicativo.
 *
 * A ordem dos elementos é deliberada: nome, para quem serve, o que faz, a
 * ressalva, e só então o botão de baixar. Quem chega ao botão já passou pelo
 * aviso — o contrário seria pôr a ressalva depois da decisão.
 */
function Cartao({ app }: { app: Aplicativo }) {
  return (
    <li className="glass flex flex-col rounded-2xl p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="font-display text-[1.05rem] font-semibold">{app.nome}</h3>
        {app.publico && (
          <span className="font-mono-tech rounded-full border hairline px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-faint">
            {ROTULO_PUBLICO[app.publico]}
          </span>
        )}
      </div>

      {(app.categoria || app.preco || app.plataformas?.length) && (
        <p className="font-mono-tech mt-2 text-[0.68rem] uppercase tracking-[0.1em] text-faint">
          {[app.categoria, app.plataformas?.join(" · "), app.preco].filter(Boolean).join("  ·  ")}
        </p>
      )}

      <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">{app.resumo}</p>

      {/*
        Ressalva e vínculo comercial ficam **dentro** do cartão, com contraste
        de leitura, e não como nota de rodapé da página. Aviso que só existe
        longe do que ele qualifica não cumpre a função de avisar.
      */}
      {app.alerta && (
        <p className="mt-4 rounded-xl border hairline p-3 text-[0.8rem] leading-relaxed text-faint">
          {app.alerta}
        </p>
      )}
      {app.vinculo && (
        <p className="mt-2.5 text-[0.76rem] leading-relaxed text-faint">
          <strong className="text-[var(--fg)]">Transparência:</strong> {app.vinculo}
        </p>
      )}

      {app.links && app.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {app.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !py-2 text-[0.82rem]"
            >
              {l.rotulo}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

export default function AplicativosPage() {
  const vazio = !temAplicativos();

  return (
    <>
      <PageHero
        fundo="constelacao"
        eyebrow="Aplicativos"
        title="Aplicativos"
        lede="O que eu desenvolvi, o que eu indico e o que não tem nada a ver com medicina."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Aplicativos", path: "/aplicativos" },
        ]}
      />

      <section className="mx-auto mb-24 max-w-4xl px-5 sm:px-8">
        {/*
          O aviso abre a página, antes de qualquer lista.

          Aplicativo indicado por médico é lido como conselho médico mesmo
          quando a intenção era "achei útil". Dizer isso na entrada custa três
          linhas e evita que alguém troque uma consulta por um aplicativo.
        */}
        <Reveal>
          <p className="rounded-2xl border hairline p-5 text-[0.86rem] leading-relaxed text-muted">
            Esta página é <strong className="text-[var(--fg)]">informativa</strong>. Nenhum
            aplicativo aqui substitui consulta, exame ou orientação individual, e indicar não
            é prescrever — o que serve para uma pessoa pode não servir para outra. Quando
            houver qualquer relação comercial com um aplicativo, isso vem escrito no cartão
            dele. Em emergência, procure atendimento imediato ou ligue 192 (SAMU).
          </p>
        </Reveal>

        {vazio ? (
          <Reveal>
            <div className="glass mt-10 rounded-2xl p-8 text-center">
              <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">
                Em breve
              </p>
              <h2 className="font-display mt-3 text-xl font-semibold">
                O catálogo está sendo montado
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
                Prefiro publicar poucos aplicativos que eu realmente use a encher a página de
                indicações que não conheço a fundo.
              </p>
            </div>
          </Reveal>
        ) : (
          COLECOES.map((colecao) => {
            const apps = aplicativosDa(colecao.id);
            return (
              <Reveal key={colecao.id}>
                <div className="mt-14">
                  <h2 className="font-display text-2xl font-semibold">{colecao.titulo}</h2>
                  <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
                    {colecao.descricao}
                  </p>

                  {apps.length === 0 ? (
                    <p className="mt-5 rounded-2xl border hairline p-5 text-[0.86rem] leading-relaxed text-faint">
                      {colecao.vazio}
                    </p>
                  ) : (
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {apps.map((app) => (
                        <Cartao key={app.slug} app={app} />
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })
        )}
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Aplicativos", path: "/aplicativos" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Aplicativos",
          url: `${site.url}/aplicativos`,
          about: "Aplicativos desenvolvidos e recomendados pelo Dr. José Victor Lisboa Cardoso Gomes.",
          author: { "@id": `${site.url}/#physician` },
        }}
      />
    </>
  );
}
