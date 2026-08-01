/**
 * Deixa o Node importar os módulos `lib/*.ts` do site do mesmo jeito que o
 * Next.js importa: escrevendo `./site-config`, sem a extensão.
 *
 * O Node já sabe ler TypeScript sozinho (remove os tipos), mas exige o caminho
 * exato do arquivo. Este gancho tenta `.ts` — e depois `.tsx` e `/index.ts` —
 * quando o caminho sem extensão não existe. Sem isto, os scripts teriam de
 * duplicar dados que já estão no código do site, que é exatamente o que
 * queremos evitar.
 *
 * Uso:
 *   node --import ./scripts/resolver-ts.mjs scripts/algum-script.mjs
 */

import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const TENTATIVAS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

registerHooks({
  resolve(especificador, contexto, seguinte) {
    if (especificador.startsWith(".") && !/\.[a-z]+$/i.test(especificador)) {
      const base = new URL(especificador, contexto.parentURL);
      for (const sufixo of TENTATIVAS) {
        const candidato = new URL(base.href + sufixo);
        if (existsSync(fileURLToPath(candidato))) {
          return { url: candidato.href, shortCircuit: true };
        }
      }
    }
    return seguinte(especificador, contexto);
  },
});
