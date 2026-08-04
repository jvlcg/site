import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { POEMAS_COM_ANALISE } from "@/content/poemas";
import { galleryImageUrls } from "@/lib/gallery";
import { site } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/sobre",
    "/medicina-endocanabinoide",
    "/clinica-medica",
    "/medicina-esportiva",
    "/telemedicina",
    "/consultorio",
    "/blog",
    "/artigos",
    "/contato",
    "/perguntas-frequentes",
    "/cadastro",
    "/poemas",
    "/mapa-do-site",
    "/politica-de-privacidade",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
    ...(path === "/consultorio" ? { images: galleryImageUrls() } : {}),
  }));

  const articleRoutes = getAllArticles().map((a) => ({
    url: `${site.url}/blog/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
    images: [`${site.url}/blog/${a.slug}/opengraph-image`],
  }));

  /**
   * Prioridade baixa de propósito. Os poemas são conteúdo pessoal e não
   * disputam nada com as páginas de atendimento — declarar isso evita que o
   * rastreador gaste orçamento neles antes das páginas que importam para
   * quem procura consultório.
   */
  const poemaRoutes = POEMAS_COM_ANALISE.map((p) => ({
    url: `${site.url}/poemas/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...articleRoutes, ...poemaRoutes];
}
