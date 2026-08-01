import type { Metadata } from "next";
import { CancelarAvisos } from "@/components/ui/CancelarAvisos";

export const metadata: Metadata = {
  title: "Cancelar avisos por e-mail",
  robots: { index: false, follow: false },
};

/**
 * Página do link que vai no rodapé de cada aviso.
 *
 * O cancelamento é feito com um clique aqui, e não automaticamente ao abrir a
 * página: robô de antivírus e pré-visualizador de e-mail costumam abrir todos
 * os links da mensagem, e isso descadastraria quem nunca pediu.
 */
export default async function CancelarAvisosPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; a?: string }>;
}) {
  const { e = "", a = "" } = await searchParams;

  return (
    <section className="mx-auto min-h-[70vh] max-w-xl px-5 pt-36 pb-24 sm:px-8">
      <CancelarAvisos email={e} assinatura={a} />
    </section>
  );
}
