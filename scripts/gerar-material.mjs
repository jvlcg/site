/**
 * Gera o PDF do material de apoio a partir de HTML, usando o Chromium.
 *
 * O arquivo fica em `content/materiais/`, **fora de `public/`**, de propósito:
 * qualquer coisa em `public/` tem endereço direto e é baixável por quem
 * souber o caminho — o que tornaria a troca "cadastre-se e receba" uma
 * formalidade. De lá, quem entrega é a rota que confere a conta.
 *
 * Rodar: `node scripts/gerar-material.mjs`
 * Só é preciso rodar de novo quando o conteúdo mudar.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = path.join(RAIZ, "content", "materiais");

const html = readFileSync(path.join(RAIZ, "content", "materiais", "treino-e-alimentacao.html"), "utf8");

await mkdir(SAIDA, { recursive: true });

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const pagina = await navegador.newPage();
await pagina.setContent(html, { waitUntil: "networkidle" });

await pagina.pdf({
  path: path.join(SAIDA, "treino-e-alimentacao.pdf"),
  format: "A4",
  printBackground: true,
  margin: { top: "18mm", bottom: "20mm", left: "16mm", right: "16mm" },
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  /*
    O rodapé com CRM e a numeração vão em todas as páginas. Um PDF circula
    solto — é reenviado, impresso, printado — e cada folha precisa dizer de
    quem é e que não substitui consulta, porque nem sempre a primeira página
    viaja junto.
  */
  footerTemplate: `
    <div style="width:100%;font-family:system-ui,sans-serif;font-size:7.5pt;color:#64748b;padding:0 16mm;display:flex;justify-content:space-between;">
      <span>Dr. José Victor Lisboa Cardoso Gomes · CRM-GO 38508 · material educativo, não substitui consulta</span>
      <span class="pageNumber"></span>/<span class="totalPages"></span>
    </div>`,
});

await navegador.close();
console.log("PDF gerado em content/materiais/treino-e-alimentacao.pdf");
