import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
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

  return [...staticRoutes, ...articleRoutes];
}
