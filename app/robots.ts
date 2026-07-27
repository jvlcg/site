import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/politica-de-privacidade" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
