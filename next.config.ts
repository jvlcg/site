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

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GA_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.googleusercontent.com https://*.ggpht.com https://maps.gstatic.com https://places.googleapis.com ${GA_DADOS}`,
  "font-src 'self' data:",
  `connect-src 'self' ${GA_SCRIPT} ${GA_DADOS}`,
  "frame-src https://www.google.com https://maps.google.com",
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
 * CSP da página /cadastro, que carrega o botão "Continuar com Google".
 *
 * Liberação restrita a essa rota, pelo mesmo motivo da Soro: um terceiro com
 * permissão de executar script lê o DOM da página em que roda, e as páginas com
 * conteúdo médico não têm por que conceder isso.
 *
 * Aqui a restrição pesa mais que no caso da Soro, e vale dizer por quê: esta é
 * a única página do site onde trafegam CPF, data de nascimento e telefone.
 * O script do Google só é baixado depois que a pessoa aperta o botão — antes
 * disso, nada dele existe na página — mas o cabeçalho precisa permitir de
 * antemão, e é por isso que a permissão fica presa a uma rota só.
 *
 * São quatro diretivas, e faltar qualquer uma quebra de um jeito diferente:
 * o `script-src` serve o `gsi/client`; o `style-src` serve a folha de estilo
 * que ele injeta; o `frame-src` abre o seletor de contas, que é um iframe; e o
 * `connect-src` é por onde o token volta. Sem o `frame-src`, por exemplo, o
 * botão aparece, a pessoa clica e não acontece nada visível.
 */
const GOOGLE_CONTAS = "https://accounts.google.com";
const cspCadastro = csp
  .replace("script-src 'self' 'unsafe-inline'", `script-src 'self' 'unsafe-inline' ${GOOGLE_CONTAS}`)
  .replace("style-src 'self' 'unsafe-inline'", `style-src 'self' 'unsafe-inline' ${GOOGLE_CONTAS}`)
  .replace("connect-src 'self'", `connect-src 'self' ${GOOGLE_CONTAS}`)
  .replace("frame-src ", `frame-src ${GOOGLE_CONTAS} `);

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
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
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
    return [{ source: "/artigos/:slug", destination: "/blog/:slug", permanent: true }];
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
        // idem, para o botão "Continuar com Google" do cadastro
        source: "/cadastro",
        headers: [{ key: "Content-Security-Policy", value: cspCadastro }],
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
