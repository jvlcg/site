import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { POEMAS_COM_ANALISE } from "@/content/poemas";
import { aulasDo, cursosPublicados } from "@/lib/cursos";
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
    "/cursos",
    "/voluntariado",
    "/poemas",
    "/mapa-do-site",
    /*
      Fora daqui de propósito, e não por esquecimento: a política de
      privacidade e os termos dos cursos são `noindex`. Listar no sitemap uma
      página marcada como "não indexe" manda dois sinais contrários ao mesmo
      rastreador — ele obedece ao `noindex`, mas gasta orçamento de rastreio
      voltando numa página que nunca vai indexar. Os dois documentos continuam
      alcançáveis pelo rodapé e pelo mapa do site, que é o que importa para
      quem precisa lê-los.

      - /politica-de-privacidade
      - /termos-dos-cursos
    */
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

  /**
   * Só os cursos publicados, e dentro deles só as aulas livres.
   *
   * Aula que exige conta no sitemap seria convidar o Google a indexar uma
   * porta fechada — e mandar quem clicar no resultado para uma tela de login
   * em vez do conteúdo que o resultado prometia.
   */
  const cursoRoutes = cursosPublicados().flatMap((c) => [
    {
      url: `${site.url}/cursos/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...(c.acesso === "livre"
      ? aulasDo(c).map((a) => ({
          url: `${site.url}/cursos/${c.slug}/${a.slug}`,
          lastModified: new Date(),
          changeFrequency: "yearly" as const,
          priority: 0.5,
        }))
      : []),
  ]);

  return [...staticRoutes, ...articleRoutes, ...cursoRoutes, ...poemaRoutes];
}
