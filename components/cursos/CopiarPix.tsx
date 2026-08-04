"use client";

import { useState } from "react";

/**
 * Botão de "copia e cola" do PIX.
 *
 * O único pedaço da doação que precisa de JavaScript, e por um motivo só: a
 * área de transferência do navegador não é alcançável sem ele. Todo o resto —
 * o QR, a chave, o texto — está no HTML e funciona com o script desligado.
 */
export function CopiarPix({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      /**
       * `clipboard` falha em contexto não seguro e em alguns navegadores
       * antigos. O caminho de baixo é feio mas funciona em todos: um campo
       * fora da tela, selecionado e copiado pelo comando antigo.
       */
      const campo = document.createElement("textarea");
      campo.value = codigo;
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

  return (
    <button type="button" onClick={copiar} className="btn-ghost mt-3 !py-2 text-sm">
      {copiado ? "Copiado ✓" : "Copiar código PIX"}
    </button>
  );
}
