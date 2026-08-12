import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "A mesma consulta, sem a viagem — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Telemedicina",
    titulo: "A mesma consulta, sem a viagem",
    linha: "Atendimento por vídeo para todo o Brasil, dentro da regulamentação vigente",
  });
}
