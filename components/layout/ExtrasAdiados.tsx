"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Os enfeites e atalhos que o layout carregava junto com a página.
 *
 * Nenhum deles serve a quem acabou de chegar: o halo do cursor é decoração, o
 * pedido de giroscópio só aparece em iPhone depois de a cena 3D existir, o
 * atalho do cadastro é para quem já leu alguma coisa, e o Estetô só fala
 * quatro segundos depois. Mesmo assim, todos hidratavam no primeiro instante
 * — cada um com seus efeitos, ouvintes e primeira renderização — competindo
 * com o texto que a pessoa veio ler.
 *
 * Agora entram depois do carregamento, com a thread ociosa. Fica de fora o que
 * é caminho de quem chegou decidido: o botão do WhatsApp e o cabeçalho seguem
 * no primeiro quadro.
 */

const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow").then((m) => m.CursorGlow), {
  ssr: false,
});
const GyroPrompt = dynamic(() => import("@/components/three/GyroPrompt").then((m) => m.GyroPrompt), {
  ssr: false,
});
const CadastroFab = dynamic(() => import("./CadastroFab").then((m) => m.CadastroFab), {
  ssr: false,
});
const Mascotes = dynamic(() => import("@/components/ui/Mascotes").then((m) => m.Mascotes), {
  ssr: false,
});

export function ExtrasAdiados() {
  const [pronto, setPronto] = useState(false);
  /**
   * O halo do cursor não faz sentido em tela de toque — não há cursor para
   * seguir. Ele já se desliga sozinho lá dentro, mas checar aqui evita baixar
   * e executar o componente no aparelho onde ele nunca vai fazer nada.
   */
  const [temCursor, setTemCursor] = useState(false);

  useEffect(() => {
    setTemCursor(window.matchMedia("(pointer: fine)").matches);

    let id = 0;
    const agendar = () => {
      const pedir =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 250));
      id = pedir(() => setPronto(true), { timeout: 2000 }) as number;
    };

    if (document.readyState === "complete") agendar();
    else window.addEventListener("load", agendar, { once: true });

    return () => {
      if (id) (window.cancelIdleCallback ?? window.clearTimeout)(id);
      window.removeEventListener("load", agendar);
    };
  }, []);

  if (!pronto) return null;

  return (
    <>
      {temCursor && <CursorGlow />}
      <CadastroFab />
      <Mascotes />
      <GyroPrompt />
    </>
  );
}
