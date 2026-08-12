import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Voltar a treinar com segurança — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Medicina esportiva",
    titulo: "Voltar a treinar com segurança",
    linha: "Avaliação funcional, manejo de dor e retorno ao esporte com base em evidências",
  });
}
