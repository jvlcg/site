import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { FormularioCadastro } from "@/components/ui/FormularioCadastro";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Cadastro de pacientes — canal digital direto",
  description:
    "Cadastre-se para ter um canal digital direto com o consultório do Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508), com acompanhamento entre consultas e prioridade no retorno.",
  alternates: { canonical: "/cadastro" },
};

const VANTAGENS = [
  {
    titulo: "Canal digital direto",
    texto:
      "Seu contato fica registrado no consultório, sem passar por triagem a cada mensagem. Quem responde é quem te atende.",
  },
  {
    titulo: "Acompanhamento entre consultas",
    texto:
      "Dúvidas de conduta já orientada, ajustes combinados e retorno de exames não precisam esperar a próxima consulta.",
  },
  {
    titulo: "Prioridade no retorno",
    texto:
      "Pedidos de agenda de quem já está cadastrado entram primeiro na fila, porque os dados já estão conferidos.",
  },
  {
    titulo: "Avisos que importam",
    texto:
      "Mudança de horário, período de ausência e abertura de agenda chegam a você antes de irem ao site.",
  },
];

export default function CadastroPage() {
  return (
    <>
      <PageHero
        eyebrow="Cadastro"
        title={
          <>
            Um canal <span className="text-gradient">direto</span> com o consultório
          </>
        }
        lede="O cadastro organiza o seu atendimento antes mesmo da primeira consulta: seus dados ficam conferidos, o contato fica registrado e o retorno deixa de depender de triagem."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Cadastro", path: "/cadastro" },
        ]}
      />

      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {VANTAGENS.map((v, i) => (
            <Reveal key={v.titulo} delay={(i % 2) * 70}>
              <div className="glass card-hover h-full rounded-2xl p-6">
                <p className="font-display font-semibold">{v.titulo}</p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{v.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-5 sm:px-8">
        <Reveal>
          <FormularioCadastro />
        </Reveal>
      </section>

      <section className="mx-auto mt-14 mb-24 max-w-3xl px-5 sm:px-8">
        <div className="rounded-2xl border hairline p-6">
          <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.14em] text-faint">
            Importante
          </p>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
            O cadastro <strong className="text-[var(--fg)]">não é agendamento e não é
            atendimento médico</strong>. Ele organiza o seu contato com o consultório. Consultas
            continuam sendo marcadas pelo WhatsApp, e nenhuma orientação clínica é dada fora de
            consulta.
          </p>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
            Em caso de emergência, procure atendimento imediato ou ligue para o{" "}
            <strong className="text-[var(--fg)]">192 (SAMU)</strong>. Se estiver em sofrimento
            emocional, o <strong className="text-[var(--fg)]">188 (CVV)</strong> atende 24 horas,
            de graça.
          </p>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Cadastro", path: "/cadastro" },
        ])}
      />
    </>
  );
}
