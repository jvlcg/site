import type { Metadata } from "next";
import Link from "next/link";
import { site, whatsappDireto } from "@/lib/site-config";
import { RedirecionaWhatsApp } from "./RedirecionaWhatsApp";

/**
 * Ponte entre o site e o WhatsApp.
 *
 * Todo botão de agendamento passa por aqui antes de sair para o WhatsApp. É
 * o que dá ao contato um endereço próprio — e sem endereço próprio não há o
 * que medir: nem quantas pessoas clicam em "Agendar", nem de qual página
 * vieram, nem se o anúncio pago virou conversa.
 *
 * `noindex` porque não é conteúdo: é passagem. Ninguém deve chegar aqui pela
 * busca, e a página também fica fora do sitemap.
 */
export const metadata: Metadata = {
  title: "Abrindo o WhatsApp…",
  description: "Redirecionando para o WhatsApp do consultório.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site.url}/contato` },
};

/**
 * O endereço é montado no servidor, e não no navegador, para que a âncora
 * exista no HTML entregue. Lendo os parâmetros no cliente — com
 * `useSearchParams` — o Next empurra a subárvore inteira para depois da
 * hidratação, e a página chegaria sem link nenhum: quem estivesse com o
 * script bloqueado, ou o pegasse falhando, ficaria olhando "Abrindo o
 * WhatsApp…" para sempre. Aqui o clique funciona antes de qualquer
 * JavaScript rodar; o script só adianta o que a âncora já faz.
 */
export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ via?: string; msg?: string }>;
}) {
  const { via, msg } = await searchParams;
  const destino = whatsappDireto(via === "planos" ? "planos" : "particular", msg);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <RedirecionaWhatsApp destino={destino} />

      <a href={destino} className="btn-primary mt-7" rel="noopener">
        Abrir o WhatsApp
      </a>

      <p className="mt-8 text-sm text-faint">
        Prefere outro caminho?{" "}
        <Link href="/contato" className="underline underline-offset-4">
          Ver todas as formas de contato
        </Link>
      </p>

      <p className="mt-10 text-xs text-faint">
        {site.name} — {site.crm}
      </p>
    </section>
  );
}
