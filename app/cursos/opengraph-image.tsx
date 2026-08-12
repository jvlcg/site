import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Aulas em vídeo, abertas — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Cursos",
    titulo: "Aulas em vídeo, abertas",
    linha: "Conteúdo educativo gratuito, sem cadastro",
  });
}
