import { readFile } from "node:fs/promises";
import path from "node:path";
import { alunoAtual } from "@/lib/aluno";
import { lancarUmaVez, pontosConfigurados } from "@/lib/pontos";

/**
 * Entrega dos materiais de apoio, só para quem tem conta.
 *
 * O PDF mora em `content/materiais/`, **fora de `public/`**. Qualquer arquivo
 * em `public/` tem endereço direto e é baixável por quem souber o caminho — o
 * que faria a troca "cadastre-se e receba" ser só uma formalidade, e uma
 * formalidade que a primeira pessoa a compartilhar o link derruba.
 *
 * Daqui, quem entrega é esta rota, e ela confere a conta antes.
 */

/**
 * Lista fechada, e é ela que impede o ataque mais óbvio contra rotas assim.
 *
 * Sem ela, um pedido como `/api/material/..%2F..%2F.env` faria o servidor ler
 * um arquivo que não devia. Aceitando **apenas** chaves conhecidas, o nome que
 * chega da URL nunca vira caminho — ele só serve para encontrar a entrada
 * nesta tabela.
 */
const MATERIAIS = {
  "treino-e-alimentacao": {
    arquivo: "treino-e-alimentacao.pdf",
    nome: "Treino e alimentacao - Dr Jose Victor.pdf",
  },
} as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const material = MATERIAIS[slug as keyof typeof MATERIAIS];
  if (!material) return new Response("Not Found", { status: 404 });

  const aluno = await alunoAtual();
  if (!aluno) {
    /**
     * 302 para a conta, e não 401.
     *
     * Quem chega aqui clicou em "baixar" — não está consumindo uma API. Um
     * código de erro deixaria a pessoa numa página em branco; o
     * redirecionamento a leva para onde ela resolve o problema.
     */
    return Response.redirect(new URL("/minha-conta", _req.url), 302);
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(
      path.join(process.cwd(), "content", "materiais", material.arquivo)
    );
  } catch {
    return new Response("Material indisponível", { status: 503 });
  }

  /**
   * Baixar dá ponto — **uma vez por material**.
   *
   * `lancarUmaVez` e não `lancar`: sem isso, baixar dez vezes daria dez vezes
   * os pontos, e o botão está a um clique de distância. Qualquer evento que a
   * pessoa possa repetir à vontade precisa dessa trava.
   *
   * Roda solto, sem `await`: o download não pode esperar o banco de pontos, e
   * uma falha ali não pode impedir alguém de receber o material. Se o registro
   * falhar, a pessoa fica com o PDF e sem o ponto — que é a troca certa.
   */
  if (pontosConfigurados()) {
    void lancarUmaVez(aluno.email, "reconhecimento", `Baixou: ${slug}`, aluno.nome).catch(() => {});
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${material.nome}"`,
      /** Nunca cacheado por intermediário: a resposta depende de quem pediu. */
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
