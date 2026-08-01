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
 * Terceiros permitidos: mapa do consultório (Google Maps) e fotos de perfil de
 * quem avalia no Google. Nada além disso.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleusercontent.com https://*.ggpht.com https://maps.gstatic.com https://places.googleapis.com",
  "font-src 'self' data:",
  "connect-src 'self'",
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
const cspNovidades = csp
  .replace("script-src 'self' 'unsafe-inline'", `script-src 'self' 'unsafe-inline' ${SORO}`)
  .replace("connect-src 'self'", `connect-src 'self' ${SORO}`)
  .replace("img-src 'self' data: blob:", `img-src 'self' data: blob: ${SORO} https://*.trysoro.com`)
  .replace("frame-src ", `frame-src ${SORO} `);

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
