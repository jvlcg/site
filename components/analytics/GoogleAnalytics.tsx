import Script from "next/script";
import { site } from "@/lib/site-config";

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
export function GoogleAnalytics() {
  const id = site.googleAnalyticsId;
  if (!id || process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;

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
