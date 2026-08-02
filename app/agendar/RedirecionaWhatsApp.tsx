"use client";

import { useEffect, useState } from "react";

/**
 * Só o redirecionamento e o texto que o acompanha. O link em si é renderizado
 * pelo servidor, na página — este componente adianta o que a âncora já faz,
 * nunca a substitui.
 */
export function RedirecionaWhatsApp({ destino }: { destino: string }) {
  const [demorou, setDemorou] = useState(false);

  useEffect(() => {
    /**
     * `replace` e não `assign`: quem voltar do WhatsApp deve cair na página
     * de onde saiu, não nesta. Do contrário o botão "voltar" reabriria o
     * WhatsApp num laço.
     */
    window.location.replace(destino);

    // Se em três segundos nada aconteceu, o navegador barrou algo — então o
    // botão manual deixa de ser discreto e passa a ser a instrução principal.
    const t = setTimeout(() => setDemorou(true), 3000);
    return () => clearTimeout(t);
  }, [destino]);

  return (
    <>
      <p className="font-display text-xl font-semibold" role="status">
        {demorou ? "Quase lá" : "Abrindo o WhatsApp…"}
      </p>
      <p className="mt-3 text-muted">
        {demorou
          ? "O redirecionamento não abriu sozinho. Toque no botão abaixo para falar com o consultório."
          : "Você está sendo levado para a conversa com o consultório."}
      </p>
    </>
  );
}
