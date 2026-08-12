import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Falar com o consultório — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Contato",
    titulo: "Falar com o consultório",
    linha: "WhatsApp, endereço e horários",
  });
}
