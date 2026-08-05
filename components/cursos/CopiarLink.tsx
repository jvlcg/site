"use client";

import { useState } from "react";

/**
 * Copiar e compartilhar o link de indicação.
 *
 * O botão de compartilhar só aparece onde `navigator.share` existe — celular,
 * na prática. Num computador ele abriria nada, e botão que não faz nada é
 * pior que botão ausente.
 *
 * A checagem acontece no clique, e não na montagem: consultar a API durante a
 * renderização faria o servidor e o navegador desenharem coisas diferentes, e
 * o React reclama disso com razão.
 */
export function CopiarLink({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const campo = document.createElement("textarea");
      campo.value = link;
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.select();
      document.execCommand("copy");
      campo.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  async function compartilhar() {
    if (typeof navigator.share !== "function") return copiar();
    try {
      await navigator.share({
        title: "Conteúdo de saúde do Dr. José Victor",
        text: "Achei que você ia gostar destas aulas:",
        url: link,
      });
    } catch {
      /* cancelar o compartilhamento não é erro */
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={copiar} className="btn-ghost !py-2 text-sm">
        {copiado ? "Copiado ✓" : "Copiar link"}
      </button>
      <button type="button" onClick={compartilhar} className="btn-primary !py-2 text-sm">
        Compartilhar
      </button>
    </div>
  );
}
