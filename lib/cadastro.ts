import crypto from "node:crypto";
import { comandoRedis, paresDeHash, redisConfigurado } from "./redis";

/**
 * Cadastro de pacientes — validação, criptografia e armazenamento.
 *
 * Aqui trafega o dado mais sensível do site inteiro: nome completo, CPF, data
 * de nascimento, telefone e e-mail. Duas defesas, e as duas importam:
 *
 * 1. **Nada é gravado em texto claro.** Cada ficha é cifrada com AES-256-GCM
 *    antes de sair daqui. Quem abrir o banco de dados — inclusive o próprio
 *    provedor — vê blocos ilegíveis. A chave mora só nas variáveis de
 *    ambiente, e sem ela nem o site consegue ler o que gravou.
 * 2. **GCM não só embaralha, autentica.** Se alguém alterar um byte do
 *    registro, a decifragem falha em vez de devolver dado adulterado.
 *
 * Só a data de criação fica fora da cifra, porque é o que permite ordenar a
 * lista sem ter de decifrar tudo — e ela não diz nada sobre ninguém.
 */

const CHAVE_REDIS = "cadastros";

export type Ficha = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  cidade: string;
  origem: string;
  /** Observação livre, opcional. */
  observacao?: string;
  /**
   * O e-mail foi confirmado pelo Google, e não só digitado.
   *
   * Só fica `true` quando o servidor verificou a assinatura do token de
   * identidade **e** o endereço bate com o que veio no formulário. Ausente
   * significa "não sabemos", nunca "é falso": todo cadastro anterior a este
   * campo, e todo cadastro preenchido à mão, chega sem ele.
   */
  emailVerificado?: boolean;
};

export type FichaGravada = Ficha & { id: string; criadoEm: string };

// ----------------------------------------------------------------- validação

const soDigitos = (s: string) => s.replace(/\D/g, "");

/**
 * Confere os dois dígitos verificadores do CPF.
 *
 * Não prova que o CPF existe — prova que não é um número digitado errado, que é
 * o erro que realmente acontece num formulário.
 */
export function cpfValido(entrada: string): boolean {
  const cpf = soDigitos(entrada);
  if (cpf.length !== 11) return false;
  // 111.111.111-11 e afins passam na conta, mas nunca são CPF de verdade
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  for (const [ate, posicao] of [
    [9, 10],
    [10, 11],
  ] as const) {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(cpf[i]) * (posicao - i);
    const resto = (soma * 10) % 11 % 10;
    if (resto !== Number(cpf[ate])) return false;
  }
  return true;
}

export const formatarCpf = (cpf: string) =>
  soDigitos(cpf).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e.trim());

/** Aceita fixo (10) e celular (11), com ou sem máscara. */
const telefoneValido = (t: string) => [10, 11].includes(soDigitos(t).length);

/** Entre 14 e 110 anos: o consultório atende a partir dos 14. */
function nascimentoValido(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const d = new Date(data + "T12:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const anos = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  return anos >= 14 && anos <= 110;
}

const texto = (v: unknown, min: number, max: number): string | null => {
  if (typeof v !== "string") return null;
  const limpo = v.trim().replace(/\s+/g, " ");
  return limpo.length >= min && limpo.length <= max ? limpo : null;
};

/**
 * Valida a ficha inteira e devolve os erros por campo, para o formulário poder
 * apontar exatamente o que corrigir.
 */
export function validarFicha(dados: unknown): { ficha: Ficha } | { erros: Record<string, string> } {
  const erros: Record<string, string> = {};
  const d = (dados ?? {}) as Record<string, unknown>;

  const nome = texto(d.nome, 5, 120);
  if (!nome || !nome.includes(" ")) erros.nome = "Informe o nome completo.";

  const email = texto(d.email, 5, 160);
  if (!email || !emailValido(email)) erros.email = "E-mail inválido.";

  const telefone = texto(d.telefone, 8, 30);
  if (!telefone || !telefoneValido(telefone)) erros.telefone = "Telefone com DDD, por favor.";

  const cpf = texto(d.cpf, 11, 20);
  if (!cpf || !cpfValido(cpf)) erros.cpf = "CPF inválido.";

  const nascimento = texto(d.nascimento, 10, 10);
  if (!nascimento || !nascimentoValido(nascimento)) erros.nascimento = "Data de nascimento inválida.";

  const cidade = texto(d.cidade, 2, 80);
  if (!cidade) erros.cidade = "Informe sua cidade.";

  const origem = texto(d.origem, 2, 120);
  if (!origem) erros.origem = "Conte como chegou até aqui.";

  const observacao = d.observacao === undefined || d.observacao === "" ? undefined : texto(d.observacao, 0, 500);
  if (observacao === null) erros.observacao = "Observação muito longa.";

  if (d.consentimento !== true) erros.consentimento = "É preciso concordar para enviar.";

  if (Object.keys(erros).length > 0) return { erros };

  return {
    ficha: {
      nome: nome!,
      email: email!.toLowerCase(),
      telefone: soDigitos(telefone!),
      cpf: soDigitos(cpf!),
      nascimento: nascimento!,
      cidade: cidade!,
      origem: origem!,
      ...(observacao ? { observacao } : {}),
    },
  };
}

// -------------------------------------------------------------- criptografia

function chave(): Buffer | null {
  const bruta = process.env.CADASTRO_CHAVE;
  if (!bruta) return null;
  // aceita hex (64 caracteres) ou base64; qualquer outro formato vira hash,
  // para uma chave curta demais não virar uma chave fraca em silêncio
  if (/^[0-9a-f]{64}$/i.test(bruta)) return Buffer.from(bruta, "hex");
  const b64 = Buffer.from(bruta, "base64");
  if (b64.length === 32) return b64;
  return crypto.createHash("sha256").update(bruta).digest();
}

export const cadastroConfigurado = () => chave() !== null;

export function cifrar(dados: unknown): string | null {
  const k = chave();
  if (!k) return null;
  const iv = crypto.randomBytes(12);
  const cifra = crypto.createCipheriv("aes-256-gcm", k, iv);
  const corpo = Buffer.concat([cifra.update(JSON.stringify(dados), "utf8"), cifra.final()]);
  return [iv.toString("base64"), cifra.getAuthTag().toString("base64"), corpo.toString("base64")].join(".");
}

export function decifrar<T>(pacote: string): T | null {
  const k = chave();
  if (!k) return null;
  try {
    const [iv, tag, corpo] = pacote.split(".");
    const decifra = crypto.createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64"));
    decifra.setAuthTag(Buffer.from(tag, "base64"));
    const texto = Buffer.concat([
      decifra.update(Buffer.from(corpo, "base64")),
      decifra.final(),
    ]).toString("utf8");
    return JSON.parse(texto) as T;
  } catch {
    // chave errada ou registro adulterado — em nenhum dos casos devolvemos algo
    return null;
  }
}

// ------------------------------------------------------------ armazenamento

export const armazenamentoConfigurado = redisConfigurado;

/** Grava a ficha cifrada. O campo é a data seguida de um sufixo aleatório: ordena sozinho e não colide. */
export async function gravarFicha(ficha: Ficha): Promise<boolean> {
  const criadoEm = new Date().toISOString();
  const id = `${criadoEm}#${crypto.randomBytes(4).toString("hex")}`;
  const pacote = cifrar({ ...ficha, criadoEm });
  if (!pacote) return false;
  return (await comandoRedis("HSET", CHAVE_REDIS, id, pacote)) !== null;
}

/** Todas as fichas, decifradas e da mais recente para a mais antiga. */
export async function lerFichas(): Promise<FichaGravada[]> {
  const bruto = await comandoRedis<Record<string, string> | string[]>("HGETALL", CHAVE_REDIS);
  if (!bruto) return [];

  const pares = paresDeHash(bruto);

  const fichas: FichaGravada[] = [];
  for (const [id, pacote] of pares) {
    const ficha = decifrar<Ficha & { criadoEm: string }>(pacote);
    if (ficha) fichas.push({ ...ficha, id });
  }
  return fichas.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export async function apagarFicha(id: string): Promise<boolean> {
  return (await comandoRedis("HDEL", CHAVE_REDIS, id)) !== null;
}

export async function contarFichas(): Promise<number> {
  return (await comandoRedis<number>("HLEN", CHAVE_REDIS)) ?? 0;
}
