import { site } from "@/lib/site-config";
import { Reveal } from "./Reveal";

/**
 * Prova social compatível com o CFM: leva às avaliações no próprio Google
 * (conteúdo de terceiros, publicado organicamente), sem reproduzir
 * depoimentos como publicidade. A nota numérica só deve ser exibida quando
 * confirmada — por isso não há número fabricado aqui.
 */
export function GoogleRating({ className = "" }: { className?: string }) {
  return (
    <Reveal className={className}>
      <a
        href={site.googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="glass card-hover group flex flex-wrap items-center justify-between gap-5 rounded-3xl p-6 sm:p-7"
      >
        <div className="flex items-center gap-4">
          <span className="glass flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
            {/* G do Google (monocromático para sobriedade) */}
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M12 11v2.8h4.6c-.2 1.2-1.5 3.6-4.6 3.6a5.4 5.4 0 0 1 0-10.8c1.7 0 2.8.7 3.4 1.3l2.3-2.2A8 8 0 1 0 12 20c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.2H12z" />
            </svg>
          </span>
          <div>
            {/*
              Sem as cinco estrelas que ficavam aqui.

              Eram decorativas e `aria-hidden`, mas quem olha não lê o código:
              lê "cinco estrelas". Era uma nota **afirmada sem existir** — o
              perfil pode ter 4,6, pode ter 3,8, e nem esse número foi
              confirmado ainda.

              Duas coisas erradas de uma vez: dizer um número que ninguém
              apurou, e publicar avaliação de paciente como peça do próprio
              site, que é o que as normas de publicidade médica vedam. O link
              para o perfil do Google continua — lá o conteúdo é de terceiro,
              publicado fora daqui, e não passa por edição do consultório.
            */}
            <p className="font-display font-semibold">Avaliações no Google</p>
            <p className="mt-0.5 text-sm text-muted">
              Leia a experiência de pacientes reais no perfil verificado do consultório.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
          Ver no Google
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            ↗
          </span>
        </span>
      </a>
    </Reveal>
  );
}
