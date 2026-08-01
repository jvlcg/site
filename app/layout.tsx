import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { GyroPrompt } from "@/components/three/GyroPrompt";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { ChatWidget } from "@/components/chat/ChatWidget";
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
    default: `${site.shortName} — Medicina Endocanabinoide e Clínica Médica em Goiânia`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "medicina endocanabinoide Goiânia",
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
    title: `${site.shortName} — Medicina Endocanabinoide e Clínica Médica`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — Medicina Endocanabinoide e Clínica Médica`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
          <MotionProvider>
            <CursorGlow />
            <Header />
            <main id="conteudo">{children}</main>
            <Footer />
            <WhatsAppFab />
            <ChatWidget />
            <GyroPrompt />
          </MotionProvider>
        </ThemeProvider>
        <JsonLd data={[physicianSchema(), medicalClinicSchema(), websiteSchema()]} />
        {/*
          Métricas de audiência da Vercel: sem cookies e sem identificar o
          visitante — só contagem agregada de páginas vistas. A escolha importa
          num site médico: nada aqui rastreia indivíduo nem cria perfil.

          O script é servido pelo próprio domínio (/_vercel/insights/), então
          passa na Content-Security-Policy sem precisar liberar terceiros.
        */}
        <Analytics />
      </body>
    </html>
  );
}
