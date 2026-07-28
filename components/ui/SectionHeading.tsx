import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, lede, align = "left" }: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal as="p" className={`eyebrow mb-4 ${align === "center" ? "justify-center" : ""}`}>
          {eyebrow}
        </Reveal>
      )}
      <Reveal
        as="h2"
        delay={60}
        className="font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </Reveal>
      {lede && (
        <Reveal as="p" delay={140} className="mt-5 text-lg leading-relaxed text-muted">
          {lede}
        </Reveal>
      )}
    </div>
  );
}
