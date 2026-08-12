import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Check-up e acompanhamento — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Clínica médica",
    titulo: "Check-up e acompanhamento",
    linha: "Avaliação completa, prevenção e um médico de referência ao longo do tempo",
  });
}
