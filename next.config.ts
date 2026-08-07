import type { NextConfig } from "next";

/**
 * Política de segurança de conteúdo.
 *
 * O site é estático e não usa nonce (nonce exigiria renderização dinâmica em
 * toda página, o que derrubaria o SSG e os Core Web Vitals). Por isso
 * `script-src` precisa de 'unsafe-inline' — é o custo de manter tudo estático.
 * As demais diretivas continuam valendo e cobrem os vetores mais explorados:
 * clickjacking (frame-ancestors), injeção de <base>, exfiltração por formulário
 * e carregamento de plugins ou de recursos de terceiros não previstos.
 *
 * Terceiros permitidos: mapa do consultório (Google Maps), fotos de perfil de
 * quem avalia no Google e o Google Analytics. Nada além disso.
 */

/**
 * Domínios do Google Analytics.
 *
 * São três porque o GA usa um para servir o script, outro para receber os
 * eventos e um terceiro para o pixel de fallback — liberar só o primeiro faz o
 * script carregar e nenhuma visita ser registrada, falha que aparece no painel
 * como "site sem tráfego" em vez de como erro.
 */
const GA_SCRIPT = "https://www.googletagmanager.com";
const GA_DADOS = "https://*.google-analytics.com https://*.analytics.google.com";

/**
 * ────────────────────────────────────────────────────────────────────
 * A CSP vale por DOCUMENTO, e não por rota — e este site é uma SPA.
 * ────────────────────────────────────────────────────────────────────
 *
 * Este é o erro mais caro que cometi neste projeto, e vale deixar escrito para
 * ninguém repetir.
 *
 * A liberação do Google e do YouTube ficava só nas rotas que precisam dela:
 * `/cadastro`, `/minha-conta`, `/cursos`. Parecia certo — conceder permissão
 * onde há motivo, e não no site inteiro.
 *
 * Só que o Next navega **sem recarregar o documento**. Quem entra pela página
 * de esportes e clica para entrar na conta continua com a CSP da página de
 * esportes — que não libera o Google. O navegador então recusa o script, e a
 * pessoa vê "o botão não carregou" numa página cuja CSP, se você conferir com
 * `curl`, está perfeita.
 *
 * Medido, com as palavras do próprio navegador:
 *
 *   documento aberto direto em /minha-conta      botão desenha
 *   chegando pela pagina de esportes             "Refused to load the script
 *                                                 'accounts.google.com/gsi/client'
 *                                                 because it violates the following
 *                                                 Content Security Policy directive"
 *
 * O mesmo valia para o vídeo das aulas e para as miniaturas: quem entrava pela
 * home e navegava até um curso carregava a CSP da home, sem YouTube.
 *
 * Passei três rodadas culpando bloqueador de anúncios do visitante por causa
 * disso. O sintoma era idêntico, e a CSP servida na URL final estava correta —
 * conferir o cabeçalho da página de destino nunca ia mostrar o problema.
 *
 * **Por isso tudo o que o site usa em qualquer rota alcançável por navegação
 * mora aqui.** Uma exceção sobrevive: `/novidades`, que não é linkada de lugar
 * nenhum e só é alcançada por URL direta — ali a CSP por rota funciona, porque
 * sempre há documento novo.
 */
const GOOGLE_CONTAS = "https://accounts.google.com";
const YOUTUBE = "https://www.youtube-nocookie.com";
const YOUTUBE_CAPAS = "https://i.ytimg.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GA_SCRIPT} ${GOOGLE_CONTAS}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_CONTAS}`,
  `img-src 'self' data: blob: ${YOUTUBE_CAPAS} https://*.googleusercontent.com https://*.ggpht.com https://maps.gstatic.com https://places.googleapis.com ${GA_DADOS}`,
  "font-src 'self' data:",
  `connect-src 'self' ${GOOGLE_CONTAS} ${GA_SCRIPT} ${GA_DADOS}`,
  `frame-src ${YOUTUBE} ${GOOGLE_CONTAS} https://www.google.com https://maps.google.com`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * CSP da página /novidades, que embute o serviço externo Soro.
 *
 * A liberação é deliberadamente limitada a essa rota: as páginas com conteúdo
 * médico continuam aceitando script apenas do próprio domínio. Um terceiro com
 * permissão de executar script consegue ler o DOM da página em que roda — vale
 * conceder isso onde há motivo, não no site inteiro.
 */
const SORO = "https://app.trysoro.com";
/**
 * As imagens de capa da Soro não ficam no domínio dela: ela guarda os arquivos
 * no Supabase e o embed aponta o `<img>` direto para lá. Sem liberar esse
 * domínio, o texto aparece e as capas ficam quebradas — e o navegador só avisa
 * no console, então é o tipo de falha que passa despercebida.
 */
const SORO_IMAGENS = "https://*.supabase.co";
const cspNovidades = csp
  .replace("script-src 'self' 'unsafe-inline'", `script-src 'self' 'unsafe-inline' ${SORO}`)
  .replace("connect-src 'self'", `connect-src 'self' ${SORO}`)
  .replace(
    "img-src 'self' data: blob:",
    `img-src 'self' data: blob: ${SORO} https://*.trysoro.com ${SORO_IMAGENS}`
  )
  .replace("frame-src ", `frame-src ${SORO} `);

/**
 * O botão do Google abre um **popup**, e `Cross-Origin-Opener-Policy:
 * same-origin` quebra popup de outra origem.
 *
 * `same-origin` corta a ligação entre a nossa janela e qualquer janela de
 * outra origem que a gente abra: dentro do popup, `window.opener` vira `null`.
 * O popup do Google depende justamente do `opener` para devolver a credencial
 * quando a pessoa escolhe a conta. Sem ele o popup abre, carrega
 * `accounts.google.com/gsi/transform` e **fica em branco para sempre** — sem
 * mensagem de erro, porque do ponto de vista do navegador nada falhou.
 *
 * `same-origin-allow-popups` mantém a proteção que interessa — outro site
 * continua sem conseguir uma referência à nossa janela — e devolve o `opener`
 * aos popups que **nós** abrimos. É o valor que a própria documentação do
 * Sign in with Google pede.
 *
 * **Vale no site inteiro, e não só nas rotas do botão** — pela mesma razão da
 * CSP acima: este cabeçalho também é por documento. Restrito a três rotas, ele
 * protegeria apenas quem abrisse uma delas direto; quem chegasse navegando
 * carregaria o `same-origin` da página de entrada e veria o popup em branco.
 */

const seguranca = [
  { key: "Content-Security-Policy", value: csp },
  // HSTS: só aceita HTTPS neste domínio pelos próximos 2 anos
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // nenhuma página do site precisa desses sensores
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // não anuncia o framework em toda resposta
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * `experimental.inlineCss` foi TENTADO e REVERTIDO — não repetir.
   *
   * O PageSpeed apontava 190 ms de renderização bloqueada esperando o arquivo
   * de CSS, e embutir parecia a correção óbvia. Medido depois: o celular caiu
   * de 89 para 70. O desktop subiu para 97, o que confirma o diagnóstico em
   * vez de contrariá-lo.
   *
   * Os "13 KB" do relatório eram o tamanho comprimido em transferência; o CSS
   * cru tem 58 KB. Embutido, ele engorda o HTML em ~13,6 KB comprimidos que
   * passam a viajar no caminho crítico de TODA visita, sem cache, porque agora
   * fazem parte do documento. Como arquivo à parte, ele é baixado uma vez e
   * reusado nas páginas seguintes.
   *
   * A troca é banda por ida-e-volta de rede. No desktop, banda sobra e a
   * viagem economizada aparece. No 4G lento é o contrário, e o 4G lento é onde
   * o paciente está.
   */
  async redirects() {
    return [
      { source: "/artigos/:slug", destination: "/blog/:slug", permanent: true },
      /*
        O endereço antigo da página de cannabis medicinal.

        **Sem isto, o trabalho de SEO daquela página ia para o lixo.** Ela está
        indexada em `/medicina-endocanabinoide`, é a mais disputada do site, e
        já foi compartilhada em conversa e em rede social. Trocar o endereço
        sem redirecionar transformaria cada um desses links num 404 e faria o
        Google recomeçar a página do zero.

        `permanent: true` emite 301, que é o que manda o Google **transferir**
        a posição para o endereço novo em vez de tratá-lo como página nova.
      */
      {
        source: "/medicina-endocanabinoide",
        destination: "/cannabis-medicinal",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: seguranca },
      {
        // única rota que libera script de terceiro — vem depois da regra geral
        // para sobrescrever apenas o cabeçalho de CSP
        source: "/novidades",
        headers: [{ key: "Content-Security-Policy", value: cspNovidades }],
      },
      {
        // as rotas de API nunca devem ser cacheadas nem indexadas
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
