import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Medicina fora do consultório — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Projetos voluntários",
    titulo: "Medicina fora do consultório",
    linha: "Ações e projetos sociais de que o Dr. José Victor participa",
  });
}
