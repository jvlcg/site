import Link from "next/link";
import { Reveal } from "./Reveal";
import { ThreeScene } from "@/components/three/ThreeScene";

type Crumb = { name: string; path: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  scene?: "particles" | "network" | "wave" | "none";
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
};

/** Hero padrão das páginas internas, com cena 3D opcional ao fundo. */
export function PageHero({ eyebrow, title, lede, scene = "none", breadcrumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
      <div className="mesh-bg" />
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
        <div className="max-w-3xl">
          <Reveal imediato as="p" className="eyebrow mb-5">
            {eyebrow}
          </Reveal>
          <Reveal
            imediato
            as="h1"
            delay={70}
            className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </Reveal>
          <Reveal imediato as="p" delay={150} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {lede}
          </Reveal>
          {children && <Reveal imediato delay={230} className="mt-9">{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}
