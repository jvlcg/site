import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconCls = "h-7 w-7";

const tiles = [
  {
    title: "Prontuário estruturado e seguro",
    text: "Sua história clínica organizada em dados rastreáveis, protegidos por sigilo médico e boas práticas de segurança da informação.",
    className: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    big: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
        <circle cx="12" cy="12" r="9" opacity="0" />
      </svg>
    ),
  },
  {
    title: "Prescrição digital ICP-Brasil",
    text: "Receitas e laudos assinados digitalmente, válidos em todo o país.",
    className: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M4 20s2-6 8-6 8 6 8 6" opacity="0.4" />
        <path d="M6 14c3-6 9-9 13-8-1 4-4 10-10 11" />
        <circle cx="15" cy="7" r="1.4" />
      </svg>
    ),
  },
  {
    title: "Decisões guiadas por evidência",
    text: "Condutas fundamentadas em diretrizes e literatura científica atual.",
    className: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M12 3v4M12 7a5 5 0 0 1 5 5c0 3-2 4-2 6H9c0-2-2-3-2-6a5 5 0 0 1 5-5z" />
        <path d="M9.5 20h5" />
      </svg>
    ),
  },
  {
    title: "Telemedicina para todo o Brasil",
    text: "Consulta por vídeo com a mesma profundidade da presencial, onde você estiver.",
    className: "sm:col-span-2 lg:col-span-2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <rect x="2.5" y="5" width="14" height="12" rx="2" />
        <path d="M16.5 9l5-3v12l-5-3" />
      </svg>
    ),
  },
];

export function BentoTech() {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
      <SectionHeading
        eyebrow="Tecnologia a serviço do cuidado"
        title={
          <>
            Medicina moderna, <span className="text-gradient">do diagnóstico ao acompanhamento</span>
          </>
        }
        lede="Ferramentas digitais não substituem a relação médico-paciente — elas a tornam mais precisa, segura e contínua."
      />

      <div className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <Reveal
            key={t.title}
            delay={(i % 4) * 80}
            className={`holo glass card-hover flex flex-col rounded-3xl p-7 ${t.className}`}
          >
            <span className="glass flex h-14 w-14 items-center justify-center rounded-2xl p-3 text-[var(--accent)]">
              {t.icon}
            </span>
            <h3 className={`font-display mt-6 font-semibold tracking-tight ${t.big ? "text-2xl" : "text-lg"}`}>
              {t.title}
            </h3>
            <p className={`mt-3 flex-1 leading-relaxed text-muted ${t.big ? "text-base" : "text-[0.92rem]"}`}>
              {t.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
