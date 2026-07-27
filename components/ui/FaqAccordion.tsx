import { Reveal } from "./Reveal";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y hairline overflow-hidden rounded-2xl border hairline">
      {items.map((item, i) => (
        <Reveal key={i} delay={i * 60}>
          <details className="group" name="faq">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-[1.02rem] font-medium transition-colors hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-light transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-6 pb-6 leading-relaxed text-muted">{item.answer}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
