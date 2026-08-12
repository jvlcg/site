import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Clínica Fisiogyn, Setor Sul — Dr. José Victor";
export const size = TAMANHO_OG;
export const contentType = "image/png";

/* Ver `lib/og.tsx`: uma imagem por página, gerada do mesmo dado do site. */
export default function Og() {
  return imagemOg({
    eyebrow: "Consultório",
    titulo: "Clínica Fisiogyn, Setor Sul",
    linha: "Rua 94, Goiânia-GO — estrutura de diagnóstico no mesmo endereço da consulta",
  });
}
