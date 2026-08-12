import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Formação, pesquisa e método — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Sobre o médico",
    titulo: "Formação, pesquisa e método",
    linha: "PUC-GO Magna Cum Laude · publicações em dor e intervenção guiada por imagem",
  });
}
