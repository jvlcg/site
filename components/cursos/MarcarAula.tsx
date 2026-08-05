"use client";

import { useEffect, useState } from "react";

/**
 * Botão de "assisti esta aula".
 *
 * ## Por que é a pessoa quem marca, e não o player
 *
 * Detectar automaticamente exigiria acompanhar o tempo de reprodução dentro do
 * vídeo — o que significa o site sabendo quanto tempo cada pessoa passou em
 * cada aula. É mais dado do que o necessário para uma barra de progresso, e é
 * dado de comportamento de alguém que veio buscar conteúdo de saúde.
 *
 * Um botão resolve o mesmo problema guardando uma linha: assistiu ou não.
 *
 * ## O estado carrega depois
 *
 * A página da aula já é dinâmica (lê o cookie para decidir o acesso), mas o
 * progresso vem numa chamada à parte para não somar uma leitura de banco ao
 * tempo até o vídeo aparecer. Quem chega quer assistir; a marca pode esperar
 * meio segundo.
 */
export function MarcarAula({ curso, aula }: { curso: string; aula: string }) {
  const [marcada, setMarcada] = useState<boolean | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [concluiu, setConcluiu] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/progresso?curso=${encodeURIComponent(curso)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && setMarcada(Array.isArray(d?.aulas) && d.aulas.includes(aula)))
      .catch(() => vivo && setMarcada(false));
    return () => {
      vivo = false;
    };
  }, [curso, aula]);

  /** Deslogado ou sem banco: o botão não aparece, em vez de aparecer quebrado. */
  if (marcada === null) return <div className="mt-6 h-11" aria-hidden="true" />;

  if (marcada) {
    return (
      <p className="font-mono-tech mt-6 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--accent)]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Aula assistida
        {concluiu && <span className="text-muted"> · curso concluído, +40 pontos</span>}
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={salvando}
      onClick={async () => {
        setSalvando(true);
        try {
          const r = await fetch("/api/progresso", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ curso, aula }),
          });
          if (!r.ok) return;
          const d = await r.json().catch(() => ({}));
          setMarcada(true);
          if (d?.concluidoEm) setConcluiu(true);
        } finally {
          setSalvando(false);
        }
      }}
      className="btn-ghost mt-6 !py-2.5 text-sm"
    >
      {salvando ? "Marcando…" : "Marcar como assistida"}
    </button>
  );
}
