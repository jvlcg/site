import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden">
      <div className="mesh-bg" />
      <div className="relative mx-auto max-w-xl px-5 text-center sm:px-8">
        <p className="font-display text-6xl font-semibold text-gradient">404</p>
        <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight">
          Página não encontrada
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          O endereço que você procurou não existe ou foi movido.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
