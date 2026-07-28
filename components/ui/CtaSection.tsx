import Link from "next/link";
import { whatsappLink } from "@/lib/site-config";
import { Reveal } from "./Reveal";

type Props = {
  title?: string;
  lede?: string;
  message?: string;
};

export function CtaSection({
  title = "Agende sua consulta",
  lede = "Atendimento presencial em Goiânia-GO ou por telemedicina para todo o Brasil. O primeiro contato é feito diretamente pelo WhatsApp.",
  message,
}: Props) {
  return (
    <section className="relative mx-auto mt-28 max-w-7xl px-5 sm:px-8">
      <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="mesh-bg" />
        <div className="relative">
          <Reveal
            as="h2"
            className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {title}
          </Reveal>
          <Reveal as="p" delay={100} className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {lede}
          </Reveal>
          <Reveal delay={200} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappLink("particular", message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Agendar pelo WhatsApp
              <span aria-hidden="true">→</span>
            </a>
            <Link href="/contato" className="btn-ghost">
              Informações de contato
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
