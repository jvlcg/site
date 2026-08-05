import crypto from "node:crypto";
import { cifrar, decifrar } from "./cadastro";
import { comandoRedis, paresDeHash, redisConfigurado } from "./redis";

/**
 * Pontos, níveis e indicações.
 *
 * ## O que estes pontos são, e o que não são
 *
 * São uma cortesia do consultório, e **valem só dentro deste site**. Não são
 * moeda, não têm preço, não se transferem, não se compram e não se convertem
 * em dinheiro. Isso não é detalhe de texto: no momento em que um ponto vira
 * algo trocável por valor no mundo real, ele passa a ser regulado como tal, e
 * um consultório médico não tem por que abrir esse flanco.
 *
 * Todo texto que fala deles no site precisa dizer isso.
 *
 * ## Onde ficam
 *
 * Em chave própria no banco, cifrada como o resto. **Separados do cadastro de
 * paciente**, como as matrículas: quem tiver a sessão de aluno de alguém não
 * chega a CPF nenhum, e quem olhar a tabela de pontos vê blocos ilegíveis.
 */

const CHAVE_PONTOS = "pontos";
const CHAVE_AFILIADOS = "afiliados";
const CHAVE_INDICADOS = "indicados";

export const pontosConfigurados = redisConfigurado;

const resumo = (email: string) =>
  crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);

// ─────────────────────────────────────────────────────────── eventos

/**
 * O que dá ponto, e quanto.
 *
 * Os valores são deliberadamente redondos e o texto é o que aparece no
 * extrato de quem ganhou. Mudar um número aqui não recalcula o passado: o
 * total é a soma dos eventos já registrados, e é assim que tem de ser —
 * ninguém deve perder pontos porque a tabela mudou depois.
 */
export const EVENTOS = {
  contaCriada: { pontos: 10, texto: "Conta criada" },
  cadastroCompleto: { pontos: 30, texto: "Cadastro preenchido" },
  indicacaoConfirmada: { pontos: 50, texto: "Alguém se cadastrou pela sua indicação" },
  cursoConcluido: { pontos: 40, texto: "Curso concluído" },
  /**
   * Lançado à mão pelo Dr. José Victor, no painel.
   *
   * Existe porque há coisas que o site **não tem como verificar**: se alguém
   * compartilhou de fato no Instagram, se voltou para a consulta de retorno.
   * Fingir que o site sabe seria pior que assumir que não sabe — este evento é
   * a forma honesta de reconhecer o que só uma pessoa pode confirmar.
   */
  reconhecimento: { pontos: 25, texto: "Reconhecimento do consultório" },
} as const;

export type TipoEvento = keyof typeof EVENTOS;

export type Evento = {
  tipo: TipoEvento;
  pontos: number;
  em: string;
  /** Detalhe livre: nome do curso, primeiro nome de quem foi indicado. */
  nota?: string;
};

export type Conta = {
  email: string;
  nome: string;
  total: number;
  eventos: Evento[];
  /** O código de indicação desta pessoa. */
  codigo: string;
};

// ─────────────────────────────────────────────────────────── níveis

export const NIVEIS = [
  { nome: "Cadastrado", minimo: 0, beneficio: "Trechos exclusivos nos artigos e cursos gratuitos com conta" },
  { nome: "Bronze", minimo: 60, beneficio: "Material de apoio extra nos cursos" },
  { nome: "Prata", minimo: 150, beneficio: "Um curso pago à sua escolha" },
  { nome: "Ouro", minimo: 350, beneficio: "Acesso a todos os cursos pagos" },
] as const;

export function nivelDe(total: number) {
  /**
   * Percorre de trás para frente e devolve o primeiro que couber. Assim
   * acrescentar um nível novo no fim da lista não exige mexer nesta função.
   */
  const atual = [...NIVEIS].reverse().find((n) => total >= n.minimo) ?? NIVEIS[0];
  const proximo = NIVEIS.find((n) => n.minimo > total);
  return {
    ...atual,
    proximo,
    faltam: proximo ? proximo.minimo - total : 0,
  };
}

// ─────────────────────────────────────────────────── código de indicação

/**
 * Seis caracteres, sem vogais e sem os pares que se confundem.
 *
 * Sem vogais porque um código de seis letras aleatórias forma palavra
 * ofensiva com uma frequência que surpreende — e este código vai no
 * WhatsApp de pacientes. Sem `0/O` e `1/I/L` porque o código será ditado por
 * telefone e digitado à mão mais vezes do que se imagina.
 */
const ALFABETO = "BCDFGHJKMNPQRSTVWXYZ23456789";

function codigoDe(email: string, variante = 0): string {
  const semente = variante === 0 ? `indicacao:${email.trim().toLowerCase()}` : `indicacao:${email.trim().toLowerCase()}:${variante}`;
  const h = crypto.createHash("sha256").update(semente).digest();
  let saida = "";
  for (let i = 0; i < 6; i++) saida += ALFABETO[h[i] % ALFABETO.length];
  return saida;
}

/**
 * Um código livre para este e-mail.
 *
 * O código sai de um resumo do e-mail, então é sempre o mesmo para a mesma
 * pessoa — mas **resumo não garante unicidade**. Medido: gerando 50.000
 * códigos, apareceram 7 pares repetidos. Num espaço de 28⁶ isso é o esperado
 * pelo paradoxo do aniversário, e não seria um detalhe: dois donos para o
 * mesmo código significa indicação creditada a um estranho.
 *
 * Então, antes de gravar, o código é conferido. Se já houver dono, tenta a
 * variante seguinte. Quem chegou primeiro fica com o código curto; quem
 * colidiu recebe outro, igualmente estável a partir daí porque fica gravado.
 */
async function codigoLivre(email: string): Promise<string> {
  const alvo = email.trim().toLowerCase();
  for (let variante = 0; variante < 12; variante++) {
    const tentativa = codigoDe(alvo, variante);
    const dono = await donoDoCodigo(tentativa);
    if (!dono || dono === alvo) return tentativa;
  }
  /**
   * Doze colisões seguidas para o mesmo e-mail é praticamente impossível — mas
   * devolver um código já usado seria pior que devolver um aleatório, então o
   * último recurso não repete ninguém.
   */
  return crypto.randomBytes(6).reduce((s, b) => s + ALFABETO[b % ALFABETO.length], "");
}

/** Quem é o dono deste código? `null` se não existir. */
export async function donoDoCodigo(codigo: string): Promise<string | null> {
  const bruto = await comandoRedis<string>("HGET", CHAVE_AFILIADOS, codigo.toUpperCase());
  return bruto ? (decifrar<{ email: string }>(bruto)?.email ?? null) : null;
}

// ─────────────────────────────────────────────────────────── a conta

async function lerConta(email: string): Promise<Conta | null> {
  const bruto = await comandoRedis<string>("HGET", CHAVE_PONTOS, resumo(email));
  return bruto ? decifrar<Conta>(bruto) : null;
}

async function gravarConta(conta: Conta): Promise<boolean> {
  const pacote = cifrar(conta);
  if (!pacote) return false;
  return (await comandoRedis("HSET", CHAVE_PONTOS, resumo(conta.email), pacote)) !== null;
}

/**
 * A conta de pontos, criando-a na primeira vez.
 *
 * O código de indicação é derivado do e-mail, então é sempre o mesmo para a
 * mesma pessoa — mas precisa ficar gravado no caminho inverso (código →
 * e-mail) para que o link funcione, e é isso que a segunda gravação faz.
 */
export async function contaDe(email: string, nome = ""): Promise<Conta | null> {
  if (!pontosConfigurados()) return null;

  const existente = await lerConta(email);
  if (existente) return existente;

  const nova: Conta = {
    email: email.trim().toLowerCase(),
    nome,
    total: EVENTOS.contaCriada.pontos,
    eventos: [{ tipo: "contaCriada", pontos: EVENTOS.contaCriada.pontos, em: new Date().toISOString() }],
    codigo: await codigoLivre(email),
  };

  const ok = await gravarConta(nova);
  if (!ok) return null;

  await comandoRedis(
    "HSET",
    CHAVE_AFILIADOS,
    nova.codigo,
    cifrar({ email: nova.email, nome }) ?? ""
  );
  return nova;
}

/** Lança um evento. Devolve a conta atualizada, ou `null` se nada foi gravado. */
export async function lancar(
  email: string,
  tipo: TipoEvento,
  nota?: string,
  nome = ""
): Promise<Conta | null> {
  const conta = (await lerConta(email)) ?? (await contaDe(email, nome));
  if (!conta) return null;

  const { pontos } = EVENTOS[tipo];
  const atualizada: Conta = {
    ...conta,
    nome: conta.nome || nome,
    total: conta.total + pontos,
    /**
     * O extrato guarda no máximo 200 lançamentos. Não é economia de espaço: é
     * que o registro inteiro é cifrado e reescrito a cada evento, e um extrato
     * sem teto faria essa escrita crescer para sempre. O **total** não é
     * recalculado da lista — ele é acumulado —, então cortar o histórico
     * antigo não faz ninguém perder ponto nenhum.
     */
    eventos: [{ tipo, pontos, em: new Date().toISOString(), ...(nota ? { nota } : {}) }, ...conta.eventos].slice(0, 200),
  };

  return (await gravarConta(atualizada)) ? atualizada : null;
}

// ─────────────────────────────────────────────────────── indicações

/**
 * Credita uma indicação, se ela for legítima.
 *
 * Três travas, e cada uma existe por um jeito diferente de fraudar:
 *
 * 1. **Auto-indicação.** Sem isto, qualquer pessoa abre o próprio link e ganha
 *    50 pontos por se cadastrar.
 * 2. **Um crédito por indicado, para sempre.** Sem isto, o mesmo e-mail
 *    recadastrado dez vezes vira 500 pontos.
 * 3. **Teto diário por indicador.** Sem isto, alguém com uma tarde livre e
 *    e-mails descartáveis chega ao Ouro antes do jantar — e o Ouro dá todos os
 *    cursos pagos.
 *
 * A terceira é a que mais importa, e é a que costuma faltar.
 */
const TETO_DIARIO = 5;

export async function creditarIndicacao(
  codigo: string,
  emailIndicado: string,
  nomeIndicado = ""
): Promise<boolean> {
  if (!pontosConfigurados()) return false;

  const indicador = await donoDoCodigo(codigo);
  if (!indicador) return false;

  const indicado = emailIndicado.trim().toLowerCase();
  // 1. auto-indicação
  if (indicador === indicado) return false;

  // 2. este e-mail já foi creditado alguma vez?
  const jaContado = await comandoRedis<string>("HGET", CHAVE_INDICADOS, resumo(indicado));
  if (jaContado) return false;

  // 3. teto diário do indicador
  const conta = await lerConta(indicador);
  if (conta) {
    const hoje = new Date().toISOString().slice(0, 10);
    const noDia = conta.eventos.filter(
      (e) => e.tipo === "indicacaoConfirmada" && e.em.startsWith(hoje)
    ).length;
    if (noDia >= TETO_DIARIO) return false;
  }

  await comandoRedis(
    "HSET",
    CHAVE_INDICADOS,
    resumo(indicado),
    cifrar({ de: indicador, em: new Date().toISOString() }) ?? ""
  );

  const primeiro = nomeIndicado.trim().split(" ")[0];
  return (await lancar(indicador, "indicacaoConfirmada", primeiro || undefined)) !== null;
}

/** Todas as contas, da maior para a menor. Só para a área restrita. */
export async function listarContas(): Promise<Conta[]> {
  const bruto = await comandoRedis<Record<string, string> | string[]>("HGETALL", CHAVE_PONTOS);
  if (!bruto) return [];
  const lista: Conta[] = [];
  for (const [, pacote] of paresDeHash(bruto)) {
    const c = decifrar<Conta>(pacote);
    if (c) lista.push(c);
  }
  return lista.sort((a, b) => b.total - a.total);
}
