import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Catálogo comentado — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Aplicativos",
    titulo: "Catálogo comentado",
    linha: "Aplicativos autorais e recomendações para médicos e pacientes",
  });
}
