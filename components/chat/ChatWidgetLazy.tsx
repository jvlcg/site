"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./ChatWidget").then((m) => m.ChatWidget), {
  ssr: false,
});

/**
 * Adia o assistente até a página estar carregada e a thread ociosa.
 *
 * O widget vive no layout, então ia junto em toda página — e leva consigo o
 * `lib/chat-faq.ts`, que sozinho tem 24 KB de perguntas e respostas. Tudo isso
 * era baixado, analisado e executado na chegada de todo visitante, para ficar
 * parado esperando alguém clicar no botão. É parte do JavaScript não usado que
 * o PageSpeed apontava.
 *
 * Ele aparece um instante depois do resto — o que não custa nada, porque
 * ninguém abre um site para falar com o assistente no primeiro segundo. Já o
 * botão do WhatsApp, que é o caminho de quem chegou decidido, continua no
 * primeiro quadro.
 */
export function ChatWidgetLazy() {
  const [montar, setMontar] = useState(false);

  useEffect(() => {
    let id = 0;
    const agendar = () => {
      const pedir =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      id = pedir(() => setMontar(true), { timeout: 2500 }) as number;
    };

    if (document.readyState === "complete") agendar();
    else window.addEventListener("load", agendar, { once: true });

    return () => {
      if (id) (window.cancelIdleCallback ?? window.clearTimeout)(id);
      window.removeEventListener("load", agendar);
    };
  }, []);

  return montar ? <ChatWidget /> : null;
}
