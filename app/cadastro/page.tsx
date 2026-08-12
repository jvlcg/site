import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { FormularioCadastro } from "@/components/ui/FormularioCadastro";
import { Estetoscopio } from "@/components/ui/Estetoscopio";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Cadastro de pacientes",
  description:
    "Um canal digital direto com o consultório, com acompanhamento entre consultas, aviso de novos conteúdos e prioridade no retorno. Cadastro gratuito.",
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
        fundo="acolhe"
        semente="/cadastro"
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

      {/*
        O Estetô recebe quem ele mesmo convidou.
        Quem chega aqui pelo balão do canto da tela foi trazido por ele; sumir
        na hora de preencher o formulário quebraria a conversa no meio. E para
        quem chega pelo menu, sem tê-lo visto, ele funciona como o que é: uma
        pessoa recebendo na porta em vez de um formulário em branco.
      */}
      <section className="mx-auto mt-16 max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-4 rounded-2xl border hairline p-5 sm:gap-5 sm:p-6">
            <span aria-hidden="true" className="shrink-0">
              <Estetoscopio humor="aceno" tamanho={62} />
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold">Que bom que você veio!</p>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">
                Sou o Estetô. É só preencher aqui embaixo — leva menos de um minuto, e
                seus dados vão direto para o consultório.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-6 max-w-3xl px-5 sm:px-8">
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
