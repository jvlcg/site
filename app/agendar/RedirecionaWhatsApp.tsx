"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (
      comando: string,
      evento: string,
      parametros?: Record<string, unknown>
    ) => void;
  }
}

/** Nome da ação de conversão criada no Google Ads. */
const CONVERSAO = "ads_conversion_Reservar_hor_rio_1";

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
    const sair = () => window.location.replace(destino);

    /**
     * A conversão do Google Ads é avisada antes de sair — mas com trava de
     * tempo.
     *
     * O padrão que o Google entrega usa `event_callback` para navegar só
     * depois que o evento foi enviado. Sozinho, isso é uma aposta: se o gtag
     * não carregou, se um bloqueador o barrou ou se a rede está ruim, o
     * callback nunca vem e a pessoa fica presa numa tela de "abrindo o
     * WhatsApp" que não abre nada.
     *
     * Então: dispara, e sai no que vier primeiro — o callback ou 1,2 s. A
     * medição é importante; chegar ao WhatsApp é mais.
     *
     * `enviado` existe porque as duas rotas podem se cruzar, e navegar duas
     * vezes atrapalha o histórico do navegador.
     */
    let enviado = false;
    const irEmbora = () => {
      if (enviado) return;
      enviado = true;
      sair();
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", CONVERSAO, {
        event_callback: irEmbora,
        event_timeout: 1200,
      });
      setTimeout(irEmbora, 1200);
    } else {
      sair();
    }

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
