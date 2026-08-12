import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Saúde explicada sem jargão — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Artigos",
    titulo: "Saúde explicada sem jargão",
    linha: "Textos com base em evidência, escritos por médico",
  });
}
