"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Resgatar um curso pago com o nível conquistado.
 *
 * Aparece só quando o resgate está ligado **e** a pessoa tem nível para isso —
 * quem decide as duas coisas é o servidor. Um botão que aparece e recusa é
 * pior que botão nenhum: promete e nega no mesmo gesto.
 *
 * A confirmação existe porque o nível Prata dá **um** resgate. Clicar sem
 * querer no curso errado gastaria o direito inteiro, e não haveria como
 * desfazer sem eu mexer no banco à mão.
 */
export function Resgatar({
  cursos,
  restantes,
}: {
  cursos: { slug: string; titulo: string }[];
  restantes: number | "todos";
}) {
  const router = useRouter();
  const [escolhido, setEscolhido] = useState(cursos[0]?.slug ?? "");
  const [estado, setEstado] = useState<"parado" | "enviando">("parado");
  const [erro, setErro] = useState("");

  if (cursos.length === 0) return null;

  const titulo = cursos.find((c) => c.slug === escolhido)?.titulo ?? "";

  return (
    <div className="mt-7 border-t hairline pt-6">
      <p className="font-display text-[0.95rem] font-semibold">
        {restantes === "todos"
          ? "Você tem acesso a todos os cursos pagos"
          : "Você pode resgatar um curso"}
      </p>
      <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
        {restantes === "todos"
          ? "Escolha qual quer liberar agora — pode voltar depois e liberar os outros."
          : "Escolha com calma: o nível Prata dá um resgate. O Ouro libera todos."}
      </p>

      <select
        value={escolhido}
        onChange={(e) => setEscolhido(e.target.value)}
        className="glass mt-3 w-full rounded-2xl px-4 py-3 text-[0.92rem] outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] focus:ring-2 focus:ring-[var(--accent)]"
      >
        {cursos.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.titulo}
          </option>
        ))}
      </select>

      {erro && <p className="mt-3 text-[0.84rem] text-red-400">{erro}</p>}

      <button
        type="button"
        disabled={estado === "enviando" || !escolhido}
        onClick={async () => {
          if (!confirm(`Resgatar "${titulo}"?${restantes === "todos" ? "" : " Você tem apenas um resgate."}`)) return;
          setEstado("enviando");
          setErro("");
          try {
            const r = await fetch("/api/resgate", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ curso: escolhido }),
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return setErro(d.erro ?? "Não foi possível resgatar.");
            router.refresh();
          } catch {
            setErro("Sem conexão com o servidor.");
          } finally {
            setEstado("parado");
          }
        }}
        className="btn-primary mt-4 !py-2.5 text-sm"
      >
        {estado === "enviando" ? "Liberando…" : "Resgatar este curso"}
      </button>
    </div>
  );
}
