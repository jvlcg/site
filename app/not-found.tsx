import Link from "next/link";
import { PAGINAS_FIXAS } from "@/content/paginas";

/**
 * A página de endereço não encontrado.
 *
 * ## O que ela era
 *
 * Um "404", uma frase e um botão para o início. Num site de setenta e sete
 * endereços, isso devolve a pessoa ao ponto de partida e a faz recomeçar a
 * procura — quando quem chega aqui quase sempre sabe o que queria: seguiu um
 * link antigo, digitou errado, ou veio de uma busca que apontava para um
 * endereço que mudou de nome.
 *
 * ## O que ela faz agora
 *
 * Oferece as saídas que resolvem cada um desses casos: a busca (para quem
 * sabe o assunto), os destinos mais procurados (para quem quer marcar
 * consulta) e o mapa (para quem quer ver tudo).
 *
 * Sem adivinhação a partir da URL, de propósito: um palpite errado no lugar
 * mais visível da página faz a pessoa clicar, esperar e cair em outro lugar
 * errado — pior do que não sugerir nada.
 */
export const metadata = {
  title: "Página não encontrada",
  /*
    O 404 não pode entrar no índice. Sem isto, cada endereço quebrado que o
    Google encontra vira mais uma página "sem conteúdo" no relatório — e o
    site já tem páginas demais nessa fila.
  */
  robots: { index: false, follow: true },
};

/** Os quatro destinos que resolvem a maioria das visitas perdidas. */
const ATALHOS = ["/contato", "/cannabis-medicinal", "/blog", "/consultorio"]
  .map((href) => PAGINAS_FIXAS.find((p) => p.href === href))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36">
      <div className="mesh-bg" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <p className="font-display text-6xl font-semibold text-gradient">404</p>
        <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight">
          Esta página não existe
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          O endereço pode ter mudado de nome ou sido digitado com um caractere a
          mais. O conteúdo do site continua todo no ar — abaixo estão as formas
          de chegar até ele.
        </p>

        <Link
          href="/busca"
          className="glass mt-8 flex items-center gap-3 rounded-2xl px-5 py-4 transition-colors hover:text-[var(--accent)]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 shrink-0 fill-none stroke-current stroke-2 text-faint"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <span>
            <span className="font-medium">Buscar por assunto</span>
            <span className="mt-0.5 block text-sm text-muted">
              Insônia, canabidiol, telemedicina, check-up…
            </span>
          </span>
        </Link>

        <h2 className="font-display mt-12 text-lg font-semibold tracking-tight">
          Ou vá direto para
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ATALHOS.map((p) => (
            <Link key={p.href} href={p.href} className="glass card-hover rounded-2xl p-5">
              <p className="font-display font-semibold leading-snug">{p.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.desc}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-faint">
          Prefere ver tudo?{" "}
          <Link href="/mapa-do-site" className="text-[var(--accent)] underline underline-offset-4">
            Mapa do site
          </Link>{" "}
          — todas as páginas em uma lista.
        </p>
      </div>
    </section>
  );
}
