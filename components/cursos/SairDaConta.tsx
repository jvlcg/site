"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Sair da conta de aluno.
 *
 * O cookie é `HttpOnly` — o JavaScript da página não consegue apagá-lo, e é
 * assim que tem de ser: cookie de sessão legível por script é cookie que um
 * script injetado consegue roubar. Quem apaga é o servidor, respondendo ao
 * `DELETE` com o mesmo cookie e validade zero.
 *
 * `router.refresh()` depois, e não recarregar a página: o servidor
 * re-renderiza já sem a sessão, e a tela de "entrar" aparece no lugar sem
 * piscar o site inteiro.
 */
export function SairDaConta() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  return (
    <button
      type="button"
      disabled={saindo}
      onClick={async () => {
        setSaindo(true);
        try {
          await fetch("/api/aluno", { method: "DELETE" });
          router.refresh();
        } finally {
          setSaindo(false);
        }
      }}
      className="btn-ghost mt-5 !py-2.5 text-sm"
    >
      {saindo ? "Saindo…" : "Sair desta conta"}
    </button>
  );
}
