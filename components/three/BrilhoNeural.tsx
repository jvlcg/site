"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * O brilho (Bloom) da cena neural, isolado num arquivo só.
 *
 * O motivo é peso: `@react-three/postprocessing`, com o `postprocessing` que
 * vem junto, soma **364 KB** — o maior pedaço de JavaScript do site, e a maior
 * fatia do que o PageSpeed contava como "JavaScript não usado".
 *
 * Importado direto na cena, esse peso ia para quem quer que montasse o canvas:
 * celular, tema claro, aparelho fraco. Todos baixavam, analisavam e executavam
 * 364 KB por um efeito que **só é renderizado no desktop em tema escuro**.
 *
 * Aqui os imports são estáticos de propósito: quem faz a divisão é o
 * `next/dynamic` do lado de quem chama, apontando para este arquivo inteiro.
 * A tentativa anterior — `dynamic()` dentro deste componente, com ele
 * importado normalmente — não segurava nada: o empacotador já resolvia a
 * dependência ao montar a cena, e o download acontecia mesmo em tema claro.
 */
export function BrilhoNeural() {
  return (
    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
    </EffectComposer>
  );
}
