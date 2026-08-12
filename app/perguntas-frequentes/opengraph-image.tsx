import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Dúvidas respondidas — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Perguntas frequentes",
    titulo: "Dúvidas respondidas",
    linha: "O que costuma ser perguntado antes da primeira consulta",
  });
}
