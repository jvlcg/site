"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site-config";
import { EVENTO, escolhaGuardada, type Escolha } from "@/components/ui/ConsentimentoCookies";

/**
 * Google Analytics 4.
 *
 * Três decisões que separam isto de colar o trecho que o Google entrega:
 *
 * 1. **`next/script` com `lazyOnload`.** O trecho do Google usa `async` puro,
 *    que compete com o carregamento da página. Aqui o script só entra depois
 *    que tudo terminou de carregar — medição não vale um LCP pior, e Core Web
 *    Vitals é fator de ranqueamento.
 *
 *    Era `afterInteractive`, que já ajudava mas ainda entrava cedo demais: o
 *    Lighthouse media 181 KiB do gtag, 73 deles sem uso, e mais de 120 ms de
 *    thread principal disputando espaço com a hidratação. Com `lazyOnload` a
 *    contagem continua idêntica — o `dataLayer` guarda os eventos e o gtag os
 *    processa quando chega.
 *
 * 2. **Só em produção.** Cada deploy de preview da Vercel e cada `npm run dev`
 *    mandaria visita para o mesmo painel. Em pouco tempo o número de sessões
 *    passaria a contar mais o próprio trabalho do que os pacientes — e uma
 *    métrica que mistura as duas coisas é pior que métrica nenhuma, porque
 *    parece confiável.
 *
 * 3. **`anonymize_ip`.** O GA4 já trunca o IP por padrão; declarar deixa
 *    explícito para quem for auditar o tratamento de dados, e não custa nada.
 *
 * O ID de medição é público — aparece no código-fonte de qualquer site que use
 * GA. Não é credencial e não precisa ficar em variável secreta.
 */
/**
 * O gtag entra no primeiro sinal de vida do visitante — rolagem, toque,
 * clique ou tecla — ou, na falta de qualquer um, seis segundos depois.
 *
 * Mesmo em `lazyOnload` ele ainda aparecia como 147 ms de tarefa longa na
 * janela que o Lighthouse mede, e eram esses 147 ms que seguravam o tempo de
 * bloqueio acima do limite. Amarrado à interação, ele sai dessa janela sem
 * deixar de medir: quem rola, toca ou clica é contado como sempre.
 *
 * Os seis segundos são o seguro para quem abre a página e só lê, sem encostar
 * em nada — essa visita continua aparecendo no relatório.
 */
function useEntrada() {
  const caminho = usePathname();
  const [liberado, setLiberado] = useState(false);

  /**
   * Na ponte do agendamento o gtag entra na hora, sem esperar gesto.
   *
   * `/agendar` redireciona para o WhatsApp em menos de um segundo — não há
   * tempo para a pessoa mexer em nada, e é justamente ali que a conversão do
   * Google Ads precisa ser disparada. Esperar interação nessa página seria
   * garantir que a conversão nunca fosse contada.
   *
   * Não custa desempenho: a página é `noindex`, tem uma âncora e nada mais, e
   * não é ela que o PageSpeed mede.
   */
  const naPonte = caminho === "/agendar";

  useEffect(() => {
    if (liberado) return;
    if (naPonte) {
      setLiberado(true);
      return;
    }
    const sinais = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const soltar = () => setLiberado(true);
    sinais.forEach((s) => addEventListener(s, soltar, { once: true, passive: true }));
    const relogio = setTimeout(soltar, 6000);
    return () => {
      sinais.forEach((s) => removeEventListener(s, soltar));
      clearTimeout(relogio);
    };
  }, [liberado, naPonte]);

  return liberado;
}

/**
 * O consentimento da pessoa, acompanhado ao vivo.
 *
 * O `useState` inicial é `null` de propósito, mesmo quando já existe escolha
 * guardada: ler `localStorage` durante a renderização quebraria a hidratação,
 * porque o servidor não tem como saber o que o navegador guardou. A leitura
 * acontece no efeito, um instante depois — e esse instante não custa medição
 * nenhuma, já que o gtag só sobe depois do primeiro gesto de qualquer forma.
 *
 * O ouvinte do evento é o que faz o Analytics subir **na mesma visita** em que
 * a pessoa clica em "Aceitar". Sem ele, quem aceitasse e fechasse a página não
 * seria contado — teria clicado para nada.
 */
function useConsentimento(): Escolha | null {
  const [escolha, setEscolha] = useState<Escolha | null>(null);

  useEffect(() => {
    setEscolha(escolhaGuardada());
    const aoMudar = (e: Event) => setEscolha((e as CustomEvent<Escolha>).detail);
    window.addEventListener(EVENTO, aoMudar);
    return () => window.removeEventListener(EVENTO, aoMudar);
  }, []);

  return escolha;
}

export function GoogleAnalytics() {
  const id = site.googleAnalyticsId;
  const liberado = useEntrada();
  const consentimento = useConsentimento();
  /*
    Sem "sim" explícito, o script não entra — nem com gesto, nem depois dos
    seis segundos. É a diferença entre pedir permissão e avisar depois de ter
    feito.
  */
  if (consentimento !== "aceito") return null;
  if (!id || !liberado || process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="lazyOnload"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
