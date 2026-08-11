import crypto from "crypto";
import { comandoRedis, paresDeHash, redisConfigurado } from "./redis";

/**
 * Reações e comentários dos posts do blog.
 *
 * ## Quem pode reagir e comentar
 *
 * Aluno cadastrado **ou** visitante. Exigir cadastro para dar um joinha é
 * pedir mais do que o gesto vale — e o gesto é justamente o sinal barato de
 * que o texto serviu.
 *
 * A diferença entre os dois está no nome que aparece, não no direito de
 * participar: quem entrou pela conta assina com o nome do cadastro; quem está
 * de passagem escolhe como quer assinar, ou fica anônimo.
 *
 * ## Por que o comentário passa por aprovação
 *
 * **Este é o site de um médico, e isso muda tudo.** Três riscos que não
 * existem num blog comum:
 *
 * 1. **Dado de saúde exposto pelo próprio dono.** A pessoa escreve "tenho tal
 *    doença, uso tal remédio, meu caso é assim" num campo público. Ela pode
 *    até ter o direito de fazer isso, mas quem hospeda passa a tratar dado
 *    sensível a céu aberto — e sob a LGPD dado de saúde é categoria especial.
 * 2. **Terceiro dando conduta.** Alguém responde "toma isso que resolve" sob
 *    um texto assinado por médico. Para quem lê, aquilo vira recomendação
 *    médica com o aval do consultório.
 * 3. **Responsabilidade do canal.** Pela Resolução CFM 2.336/2023, o conteúdo
 *    do canal profissional é responsabilidade do médico — inclusive o que
 *    terceiros escrevem nele.
 *
 * Por isso o comentário nasce **pendente** e só aparece depois de aprovado. É
 * o mesmo que fazem os grandes portais de saúde, e é o que permite ter
 * comentário sem transformar o site num consultório aberto.
 *
 * A reação (joinha) não passa por aprovação: número não afirma nada.
 *
 * ## O que é guardado
 *
 * Do votante, só um identificador. **Nunca o e-mail em claro** — pelo mesmo
 * motivo já documentado em `lib/aluno.ts`: nome de campo em Redis aparece
 * inteiro para quem listar as chaves, incluindo o provedor. O resumo permite
 * saber se *esta* pessoa já votou, sem permitir montar a lista de quem leu o
 * quê.
 */

export type Voto = 1 | -1;

export type Comentario = {
  id: string;
  /** Como a pessoa assina. Vazio quando escolheu ficar anônima. */
  nome: string;
  texto: string;
  /** ISO. */
  criadoEm: string;
  /** `true` quando quem escreveu estava com a conta aberta. */
  aluno: boolean;
  /**
   * Marcado pelo filtro como possível spam ou pedido de conduta em público.
   *
   * Não impede a publicação — serve para quem modera olhar primeiro. Ver
   * `lib/palavroes.ts`: recusar tudo o que cai aqui fecharia a porta para
   * pergunta legítima de paciente, que é a maioria.
   */
  suspeito?: boolean;
};

export type Contagem = { positivos: number; negativos: number };

export const interacoesConfiguradas = redisConfigurado;

/** Limites — generosos para quem quer escrever, apertados contra abuso. */
export const LIMITE_TEXTO = 1200;
export const LIMITE_NOME = 60;

const chaveVotos = (slug: string) => `post:${slug}:votos`;
const chaveComentarios = (slug: string) => `post:${slug}:comentarios`;
const chavePendentes = (slug: string) => `post:${slug}:comentarios:pendentes`;

/**
 * O identificador de quem reage, sempre como resumo.
 *
 * Recebe o e-mail (aluno) ou o identificador aleatório do visitante, e devolve
 * sempre um hash. Assim as duas origens ocupam o mesmo espaço de nomes e
 * nenhuma das duas fica legível no banco.
 */
export function identidade(bruto: string): string {
  return crypto.createHash("sha256").update(bruto.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/** Conta os votos de um post. */
export async function contarVotos(slug: string): Promise<Contagem> {
  const bruto = await comandoRedis<Record<string, string> | string[]>("HGETALL", chaveVotos(slug));
  if (!bruto) return { positivos: 0, negativos: 0 };
  let positivos = 0;
  let negativos = 0;
  for (const [, valor] of paresDeHash(bruto)) {
    if (valor === "1") positivos += 1;
    else if (valor === "-1") negativos += 1;
  }
  return { positivos, negativos };
}

/** O voto desta pessoa neste post, se houver. */
export async function votoDe(slug: string, quem: string): Promise<Voto | null> {
  const v = await comandoRedis<string>("HGET", chaveVotos(slug), quem);
  return v === "1" ? 1 : v === "-1" ? -1 : null;
}

/**
 * Registra o voto. Votar de novo no mesmo sentido **desfaz** o voto.
 *
 * É o comportamento que as pessoas já esperam de qualquer botão de joinha, e
 * evita o beco sem saída de quem clicou por engano e não encontra como
 * cancelar.
 */
export async function votar(slug: string, quem: string, voto: Voto): Promise<Contagem> {
  const atual = await votoDe(slug, quem);
  if (atual === voto) await comandoRedis("HDEL", chaveVotos(slug), quem);
  else await comandoRedis("HSET", chaveVotos(slug), quem, String(voto));
  return contarVotos(slug);
}

/** Os comentários já aprovados, do mais recente para o mais antigo. */
export async function listarComentarios(slug: string): Promise<Comentario[]> {
  const bruto = await comandoRedis<string[]>("LRANGE", chaveComentarios(slug), 0, 199);
  if (!Array.isArray(bruto)) return [];
  return bruto.flatMap((linha) => {
    try {
      return [JSON.parse(linha) as Comentario];
    } catch {
      // uma entrada corrompida não pode derrubar a lista inteira
      return [];
    }
  });
}

/** Os comentários à espera de aprovação. */
export async function listarPendentes(slug: string): Promise<Comentario[]> {
  const bruto = await comandoRedis<string[]>("LRANGE", chavePendentes(slug), 0, 199);
  if (!Array.isArray(bruto)) return [];
  return bruto.flatMap((linha) => {
    try {
      return [JSON.parse(linha) as Comentario];
    } catch {
      return [];
    }
  });
}

/**
 * Guarda um comentário novo — sempre na fila de pendentes.
 *
 * Devolve `null` quando o texto não sobrevive à limpeza (só espaço, ou vazio
 * depois de tirar o que não é texto).
 */
export async function comentar(
  slug: string,
  entrada: { nome: string; texto: string; aluno: boolean; suspeito?: boolean }
): Promise<Comentario | null> {
  const texto = limpar(entrada.texto).slice(0, LIMITE_TEXTO);
  if (!texto) return null;

  const comentario: Comentario = {
    id: crypto.randomUUID(),
    nome: limpar(entrada.nome).slice(0, LIMITE_NOME),
    texto,
    criadoEm: new Date().toISOString(),
    aluno: entrada.aluno,
    ...(entrada.suspeito ? { suspeito: true } : {}),
  };
  await comandoRedis("LPUSH", chavePendentes(slug), JSON.stringify(comentario));
  return comentario;
}

/** Aprova um pendente: sai da fila e entra na lista pública. */
export async function aprovar(slug: string, id: string): Promise<boolean> {
  const pendentes = await listarPendentes(slug);
  const alvo = pendentes.find((c) => c.id === id);
  if (!alvo) return false;
  const linha = JSON.stringify(alvo);
  await comandoRedis("LREM", chavePendentes(slug), 0, linha);
  await comandoRedis("LPUSH", chaveComentarios(slug), linha);
  return true;
}

/** Recusa um pendente, ou remove um já publicado. */
export async function remover(slug: string, id: string): Promise<boolean> {
  for (const chave of [chavePendentes(slug), chaveComentarios(slug)]) {
    const bruto = await comandoRedis<string[]>("LRANGE", chave, 0, 199);
    if (!Array.isArray(bruto)) continue;
    for (const linha of bruto) {
      try {
        if ((JSON.parse(linha) as Comentario).id === id) {
          await comandoRedis("LREM", chave, 0, linha);
          return true;
        }
      } catch {
        /* entrada corrompida: ignora */
      }
    }
  }
  return false;
}

/**
 * Limpeza do que vem do formulário.
 *
 * Tira caracteres de controle e normaliza quebras de linha e espaços. **Não**
 * escapa HTML: quem exibe é o React, que já escapa por padrão, e escapar duas
 * vezes faria a pessoa ver `&amp;` no próprio comentário.
 *
 * O corte de linhas em branco seguidas existe contra o comentário que ocupa a
 * tela inteira com espaço vazio — abuso barato de fazer e chato de moderar.
 */
function limpar(v: unknown): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/\r\n?/g, "\n")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{3,}/g, "  ")
    .trim();
}
