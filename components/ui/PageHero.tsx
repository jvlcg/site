import Link from "next/link";
import { Reveal } from "./Reveal";
import { ThreeScene } from "@/components/three/ThreeScene";
import { variacaoDoFundo, desenhoDoFundo, type Fundo } from "@/lib/fundos";

type Crumb = { name: string; path: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  scene?: "particles" | "network" | "wave" | "none";
  /**
   * A animação do fundo desta página.
   *
   * Vinte e uma variações, uma por assunto — ver o bloco "UM FUNDO POR PÁGINA"
   * em globals.css, onde cada movimento está justificado pelo tema da página.
   *
   * A lista mora em `lib/fundos.ts` porque duas coisas a usam: este herói e o
   * `FundoDaPagina`, das páginas de herói próprio. Escrita nos dois lugares,
   * ela divergiria.
   *
   * É prop e não dedução a partir da rota de propósito: `PageHero` roda no
   * servidor e não conhece o caminho. Descobrir isso exigiria um componente
   * de cliente só para ler o `usePathname` — JavaScript novo em todas as
   * páginas para escolher um `keyframes`, o que é caro demais pelo que
   * entrega. Passar explicitamente custa uma palavra por página.
   */
  fundo?: Fundo;
  /**
   * O `slug`, quando muitas páginas dividem o mesmo `fundo`.
   *
   * Só faz sentido nas rotas dinâmicas — hoje, a de curso. Nas páginas fixas o
   * fundo já é único, e semear não teria o que desempatar. Ver
   * `variacaoDoFundo` em `lib/fundos.ts`.
   */
  semente?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
};

/**
 * Hero padrão das páginas internas.
 *
 * Vinte e uma páginas passam por aqui, o que faz deste arquivo o único lugar
 * onde uma mudança visual alcança o site inteiro de uma vez. É por isso que a
 * camada "Apple" mora aqui e não em cada página.
 *
 * O que ele monta, de trás para frente:
 *
 *   aurora        três degradês em velocidades diferentes → profundidade
 *   camada-fundo  paralaxe por rolagem, em CSS puro, sem ouvinte de scroll
 *   cena 3D       só onde foi pedida (ver a nota sobre custo, abaixo)
 *   scrim         garante o contraste do texto sobre tudo isso
 *   heroi-recua   ao rolar, o título encolhe, desfoca e some — o gesto da Apple
 *
 * **A cena WebGL continua sendo exceção, e de propósito.** Medido no
 * `ThreeScene`: com ela, o bloqueio da thread principal vai de 163 ms para
 * 12.518 ms. A profundidade aqui vem de `transform` e degradê, que a GPU
 * compõe sem passar pela thread principal — mesmo efeito percebido, sem a
 * conta.
 */
export function PageHero({ eyebrow, title, lede, scene = "none", fundo, semente, breadcrumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 sm:pb-32">
      <div className="camada-fundo absolute inset-0">
        <div
          className="aurora"
          data-fundo={fundo}
          data-desenho={semente ? desenhoDoFundo(semente) : undefined}
          style={semente ? variacaoDoFundo(semente) : undefined}
        />
        <div className="mesh-bg" />
      </div>
      {scene !== "none" && (
        <>
          <ThreeScene kind={scene} className="absolute inset-0 opacity-60" />
          <div className="scrim" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
              {breadcrumbs.map((item, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <li key={item.path} className="flex items-center gap-2">
                    {last ? (
                      <span aria-current="page" className="text-[var(--accent)]">
                        {item.name}
                      </span>
                    ) : (
                      <>
                        <Link href={item.path} className="transition-colors hover:text-[var(--fg)]">
                          {item.name}
                        </Link>
                        <span aria-hidden="true" className="opacity-50">
                          /
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        {/*
          `heroi-recua` envolve o bloco inteiro para que título, linha de apoio
          e botões recuem juntos, como uma peça só. Separados, cada um sairia
          no seu tempo e o efeito viraria bagunça em vez de movimento de câmera.
        */}
        <div className="heroi-recua max-w-3xl">
          <Reveal imediato as="p" className="eyebrow mb-5">
            {eyebrow}
          </Reveal>
          {/*
            Um degrau maior em cada faixa, e com espacejamento negativo maior
            (`display-apple`). Título grande com espacejamento normal é o que
            mais denuncia um site amador: o espaço entre letras foi desenhado
            para o corpo do texto e cresce junto com a fonte se ninguém segurar.
          */}
          <Reveal
            imediato
            as="h1"
            delay={70}
            className="display-apple text-[2.6rem] sm:text-6xl lg:text-7xl"
          >
            {title}
          </Reveal>
          <Reveal
            imediato
            as="p"
            delay={150}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {lede}
          </Reveal>
          {children && <Reveal imediato delay={230} className="mt-10">{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}
