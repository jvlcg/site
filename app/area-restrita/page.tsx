import type { Metadata } from "next";
import { PainelRestrito } from "@/components/ui/PainelRestrito";

/**
 * Área restrita do Dr. José Victor.
 *
 * `noindex, nofollow` e sem link nenhum apontando para cá: quem não sabe o
 * endereço não chega. Isso não é a segurança — a segurança é a senha e o
 * cookie assinado na API —, é só uma camada a menos de exposição.
 */
export const metadata: Metadata = {
  title: "Área restrita",
  robots: { index: false, follow: false, nocache: true },
};

export default function AreaRestritaPage() {
  return (
    <section className="mx-auto min-h-screen max-w-5xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent)]">
        Acesso restrito
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Cadastros de pacientes
      </h1>
      <div className="mt-8">
        <PainelRestrito />
      </div>
    </section>
  );
}
