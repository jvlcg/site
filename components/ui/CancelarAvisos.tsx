"use client";

import Link from "next/link";
import { useState } from "react";

export function CancelarAvisos({ email, assinatura }: { email: string; assinatura: string }) {
  const [estado, setEstado] = useState<"pergunta" | "enviando" | "pronto" | "erro">(
    email && assinatura ? "pergunta" : "erro"
  );

  async function cancelar() {
    setEstado("enviando");
    const r = await fetch("/api/avisos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, assinatura }),
    }).catch(() => null);
    setEstado(r?.ok ? "pronto" : "erro");
  }

  if (estado === "pronto") {
    return (
      <div className="holo glass rounded-3xl p-8 text-center">
        <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          Pronto
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          Você não receberá mais estes avisos
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Seu e-mail saiu da lista agora. Seu cadastro no consultório continua igual — isso
          aqui era só o aviso de conteúdo novo.
        </p>
        <Link href="/" className="btn-ghost mt-7 inline-flex">
          Voltar ao site
        </Link>
      </div>
    );
  }

  if (estado === "erro") {
    return (
      <div className="holo glass rounded-3xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Link inválido</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Este endereço não confere. Use o link do rodapé do e-mail mais recente, ou escreva
          para o consultório pedindo a remoção.
        </p>
        <Link href="/contato" className="btn-ghost mt-7 inline-flex">
          Falar com o consultório
        </Link>
      </div>
    );
  }

  return (
    <div className="holo glass rounded-3xl p-8 text-center">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Parar de receber os avisos?
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        Você deixará de receber e-mails sobre artigos e comunicados. Seu cadastro no
        consultório <strong className="text-[var(--fg)]">não é afetado</strong>.
      </p>
      <button
        type="button"
        onClick={cancelar}
        disabled={estado === "enviando"}
        className="btn-primary mt-7"
      >
        {estado === "enviando" ? "Cancelando…" : "Sim, cancelar"}
      </button>
      <p className="mt-4">
        <Link href="/" className="text-[0.86rem] text-muted underline underline-offset-4">
          Mudei de ideia
        </Link>
      </p>
    </div>
  );
}
