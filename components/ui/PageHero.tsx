import { Reveal } from "./Reveal";
import { ThreeScene } from "@/components/three/ThreeScene";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  scene?: "particles" | "network" | "wave" | "none";
  children?: React.ReactNode;
};

/** Hero padrão das páginas internas, com cena 3D opcional ao fundo. */
export function PageHero({ eyebrow, title, lede, scene = "none", children }: Props) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
      <div className="mesh-bg" />
      {scene !== "none" && (
        <ThreeScene kind={scene} className="absolute inset-0 opacity-70" />
      )}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal as="p" className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {eyebrow}
          </Reveal>
          <Reveal
            as="h1"
            delay={70}
            className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </Reveal>
          <Reveal as="p" delay={150} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {lede}
          </Reveal>
          {children && <Reveal delay={230} className="mt-9">{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}
