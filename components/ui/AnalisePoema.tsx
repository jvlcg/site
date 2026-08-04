import Link from "next/link";

type Props = {
  slug: string;
  titulo: string;
  paragrafos: string[];
};

/**
 * A leitura crítica que abre embaixo do poema, na listagem.
 *
 * É um `<details>` nativo, e não um acordeão em React, por três motivos que
 * pesam juntos: abre e fecha sem JavaScript nenhum (portanto funciona antes da
 * hidratação e para quem bloqueia scripts), o navegador já entrega a
 * semântica de "botão que revela conteúdo" para leitores de tela, e o Ctrl+F
 * do navegador encontra o texto mesmo com o bloco fechado — o Chrome abre o
 * `<details>` sozinho ao achar o termo dentro.
 *
 * O conteúdo fica no HTML mesmo fechado. Isso é de propósito: quem chega pelo
 * Google numa busca por um verso precisa que o texto esteja lá para ser
 * indexado.
 */
export function AnalisePoema({ slug, titulo, paragrafos }: Props) {
  if (paragrafos.length === 0) return null;

  return (
    <details className="group mt-7">
      <summary
        className="glass inline-flex cursor-pointer list-none items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors marker:content-none hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden"
        aria-label={`Ler a análise de ${titulo}`}
      >
        {/*
          Uma seta só, girando. Dois ícones trocados por CSS piscariam no
          instante da troca; um único glifo com `rotate` transiciona limpo.
        */}
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-90"
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="group-open:hidden">Ler a análise</span>
        <span className="hidden group-open:inline">Fechar a análise</span>
      </summary>

      <div className="mt-5 border-l-2 border-[color-mix(in_oklab,var(--accent)_45%,transparent)] pl-5 sm:pl-6">
        <p className="font-mono-tech text-[0.66rem] uppercase tracking-[0.16em] text-faint">
          Análise literária
        </p>
        <div className="mt-4 space-y-4 text-[0.95rem] leading-[1.75] text-muted">
          {paragrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link
          href={`/poemas/${slug}`}
          className="mt-5 inline-block text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
        >
          Abrir a página do poema →
        </Link>
      </div>
    </details>
  );
}
