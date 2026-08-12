import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { ExtrasAdiados } from "@/components/layout/ExtrasAdiados";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConsentimentoCookies } from "@/components/ui/ConsentimentoCookies";
import { JsonLd, physicianSchema, websiteSchema, medicalClinicSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-tech",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} — Cannabis Medicinal e Clínica Médica em Goiânia`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "cannabis medicinal Goiânia",
    "clínica médica Goiânia",
    "médico particular Goiânia",
    "telemedicina",
    "check-up executivo",
    "medicina esportiva",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.shortName,
    title: `${site.shortName} — Cannabis Medicinal e Clínica Médica`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — Cannabis Medicinal e Clínica Médica`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  /**
   * Verificação de propriedade no Google Search Console pelo método "tag HTML",
   * que dispensa mexer em DNS: basta colar o código em
   * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION na Vercel e refazer o deploy.
   *
   * Sem a variável, nenhuma tag é emitida.
   */
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "geo.region": "BR-GO",
    "geo.placename": "Goiânia",
    "geo.position": `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e12" },
    { media: "(prefers-color-scheme: light)", color: "#f8faf9" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          <SoundProvider>
            <MotionProvider>
              <Header />
              <main id="conteudo">{children}</main>
              <Footer />
              <WhatsAppFab />
              <ChatWidgetLazy />
              <ExtrasAdiados />
            </MotionProvider>
          </SoundProvider>
        </ThemeProvider>
        <JsonLd data={[physicianSchema(), medicalClinicSchema(), websiteSchema()]} />
        {/*
          Métricas de audiência da Vercel: sem cookies e sem identificar o
          visitante — só contagem agregada de páginas vistas.

          O script é servido pelo próprio domínio (/_vercel/insights/), então
          passa na Content-Security-Policy sem precisar liberar terceiros.
        */}
        <Analytics />
        {/*
          Core Web Vitals medidos em visitantes reais — não em laboratório.
          Vale mais aqui do que num site comum: as cenas 3D podem pesar em
          celular modesto, e é esta medição que mostra se isso acontece de
          verdade com quem acessa. Também é fator de ranqueamento no Google.
        */}
        <SpeedInsights />
        {/*
          Google Analytics 4. Diferente dos dois acima, este usa cookie e
          identifica o visitante entre sessões — por isso está declarado na
          Política de Privacidade, com o caminho para recusar. Só carrega em
          produção (ver o componente).
        */}
        <GoogleAnalytics />
        <ConsentimentoCookies />
      </body>
    </html>
  );
}
