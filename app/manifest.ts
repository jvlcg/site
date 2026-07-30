import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.crm}`,
    short_name: site.brand,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e12",
    theme_color: "#0a0e12",
    lang: "pt-BR",
    categories: ["medical", "health"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
