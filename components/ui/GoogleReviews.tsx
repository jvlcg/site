import { getGoogleReviews } from "@/lib/google-reviews";
import { site } from "@/lib/site-config";
import { GoogleRating } from "./GoogleRating";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { JsonLd } from "@/lib/schema";

function Stars({ n }: { n: number }) {
  return (
    <span className="text-[var(--accent)]" aria-label={`${n} de 5 estrelas`}>
      {"★".repeat(Math.round(n))}
      <span className="text-faint">{"★".repeat(5 - Math.round(n))}</span>
    </span>
  );
}

const GoogleG = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M12 11v2.8h4.6c-.2 1.2-1.5 3.6-4.6 3.6a5.4 5.4 0 0 1 0-10.8c1.7 0 2.8.7 3.4 1.3l2.3-2.2A8 8 0 1 0 12 20c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.2H12z" />
  </svg>
);

/**
 * Bloco de avaliações. Se houver chave da Places API configurada, mostra as
 * avaliações reais do Google AO VIVO (nota, total, comentários) + botões para
 * ver todas e deixar a sua. Sem chave, usa o fallback (botão para o Google).
 */
export async function GoogleReviews({ className = "" }: { className?: string }) {
  const data = await getGoogleReviews();

  if (!data) {
    // Fallback compatível com CFM até a API ser configurada.
    return (
      <div className={`mx-auto max-w-4xl px-5 sm:px-8 ${className}`}>
        <GoogleRating />
      </div>
    );
  }

  return (
    <section className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Avaliações no Google"
          title="A experiência de quem já foi atendido"
          lede="Avaliações públicas de pacientes, direto do perfil do consultório no Google — atualizadas automaticamente."
        />
        <Reveal className="glass flex items-center gap-4 rounded-2xl px-6 py-4">
          <span className="text-[var(--accent)]">{GoogleG}</span>
          <div>
            <p className="font-display text-2xl font-semibold">
              {data.rating.toFixed(1).replace(".", ",")}{" "}
              <Stars n={data.rating} />
            </p>
            <p className="text-xs text-faint">{data.total} avaliações no Google</p>
          </div>
        </Reveal>
      </div>

      {data.reviews.length > 0 && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.slice(0, 6).map((r, i) => (
            <Reveal key={i} delay={(i % 3) * 80} className="glass card-hover flex h-full flex-col rounded-3xl p-7">
              <div className="flex items-center gap-3">
                {r.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="glass flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-semibold">
                    {r.author.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium">{r.author}</p>
                  <p className="text-xs text-faint">{r.relativeTime}</p>
                </div>
              </div>
              <div className="mt-4">
                <Stars n={r.rating} />
              </div>
              <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-muted line-clamp-6">
                {r.text}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-[0.7rem] text-faint">
                <span className="text-[var(--accent)]">{GoogleG}</span> via Google
              </p>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="mt-10 flex flex-wrap gap-4">
        <a
          href={data.writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Deixar minha avaliação
          <span aria-hidden="true">→</span>
        </a>
        <a
          href={data.mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Ver todas no Google ↗
        </a>
      </Reveal>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": `${site.url}/#clinic`,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: data.rating,
            reviewCount: data.total,
            bestRating: 5,
          },
        }}
      />
    </section>
  );
}
