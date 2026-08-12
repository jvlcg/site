import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Ciência, critério e acompanhamento — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Cannabis medicinal",
    titulo: "Ciência, critério e acompanhamento",
    linha: "Indicação individualizada, prescrição dentro das normas da Anvisa e do CFM",
  });
}
