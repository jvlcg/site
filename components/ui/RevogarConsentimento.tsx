"use client";

import { useCallback, useEffect, useState } from "react";
import { EVENTO, escolhaGuardada, type Escolha } from "./ConsentimentoCookies";

/**
 * Link no rodapé para rever a escolha sobre medição de audiência.
 *
 * Existe porque **consentimento sem caminho de volta não é consentimento**. A
 * LGPD garante a revogação a qualquer momento, e um aviso que aparece uma vez
 * e nunca mais deixa a pessoa presa a um clique dado com pressa.
 *
 * O rótulo diz a escolha atual em vez de um genérico "preferências de
 * cookies": quem lê "Medição: ativada" descobre o estado sem clicar, e quem
 * quer trocar já sabe o que vai acontecer.
 *
 * Enquanto ninguém respondeu, o link não aparece — o aviso ainda está na tela,
 * e oferecer dois caminhos para a mesma decisão ao mesmo tempo só confunde.
 */
export function RevogarConsentimento() {
  const [escolha, setEscolha] = useState<Escolha | null>(null);

  useEffect(() => {
    setEscolha(escolhaGuardada());
    const aoMudar = (e: Event) => setEscolha((e as CustomEvent<Escolha>).detail);
    window.addEventListener(EVENTO, aoMudar);
    return () => window.removeEventListener(EVENTO, aoMudar);
  }, []);

  const alternar = useCallback(() => {
    const nova: Escolha = escolha === "aceito" ? "recusado" : "aceito";
    try {
      localStorage.setItem("consentimento-medicao", nova);
    } catch {
      /* sem armazenamento, vale só nesta página */
    }
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: nova }));
    /*
      Recarrega ao DESLIGAR, e só nesse caso.

      Ligar não precisa: o componente do Analytics escuta o evento e sobe o
      script na hora. Desligar precisa, porque o gtag já carregado não sai da
      memória por mudança de estado do React — sem a recarga, a pessoa clicaria
      em "desativar" e continuaria sendo medida até fechar a aba, o que
      transformaria o botão numa mentira.
    */
    if (nova === "recusado") window.location.reload();
  }, [escolha]);

  if (escolha === null) return null;

  return (
    <button
      type="button"
      onClick={alternar}
      className="text-left underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
    >
      Medição de audiência: {escolha === "aceito" ? "ativada" : "desativada"}
    </button>
  );
}
