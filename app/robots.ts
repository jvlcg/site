import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/ nunca deve ser rastreado: não é conteúdo e só existe para o site.
        // /agendar é passagem para o WhatsApp, não página — quem chegasse ali
        // pela busca veria só um redirecionamento.
        disallow: ["/api/", "/agendar", "/politica-de-privacidade"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
