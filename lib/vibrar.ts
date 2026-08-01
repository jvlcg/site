/**
 * Retorno tátil (vibração) nos toques importantes.
 *
 * Só faz sentido em aparelho que se segura na mão. Computador e TV não têm
 * motor de vibração — a checagem por ponteiro grosso (`pointer: coarse`) separa
 * dedo de mouse e controle remoto, e é mais confiável do que tentar adivinhar
 * pelo modelo do aparelho.
 *
 * `navigator.vibrate` não existe no iPhone: a Apple nunca implementou a API no
 * Safari. Não há erro nem alternativa — o iPhone simplesmente não vibra por
 * página web, e o site funciona igual sem isso.
 */

/** Padrões em milissegundos. Um número = um pulso; lista = pulso, pausa, pulso. */
export const PADROES = {
  /** Agendamento: dois toques, para ter peso de confirmação. */
  agendar: [14, 45, 22],
  /** Item de menu: um toque curto, quase imperceptível. */
  menu: 10,
} as const;

export function podeVibrar(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function" &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function vibrar(padrao: number | readonly number[]): void {
  if (!podeVibrar()) return;
  try {
    navigator.vibrate(padrao as number | number[]);
  } catch {
    /* alguns navegadores recusam sem interação recente — não é problema */
  }
}
