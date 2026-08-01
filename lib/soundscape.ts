/**
 * Som da interface — 100% sintetizado no navegador, nenhum arquivo baixado.
 *
 * São só os retornos sonoros de quem clica: link, botão e, com destaque, o
 * agendamento. Não há música de fundo (foi retirada a pedido).
 *
 * Por que sintetizar em vez de tocar arquivos de áudio:
 *
 * - **Direitos autorais.** Efeito de banco de som exige licença comercial, e num
 *   site que leva nome e CRM de médico o uso indevido é risco jurídico real. O
 *   que é gerado aqui é original por construção: não existe gravação por trás,
 *   são osciladores tocando notas calculadas na hora.
 * - **Peso.** Nada é baixado: este arquivo tem poucos KB e não faz nenhuma
 *   requisição.
 * - **Segurança.** Nenhum domínio novo precisa ser liberado na
 *   Content-Security-Policy.
 */

export type Efeito = "clique" | "botao" | "agendar" | "ligar" | "desligar";

/** Arpejo de Ré maior que confirma o agendamento. */
const ARPEJO_AGENDAR = [587.33, 739.99, 880.0, 1174.66]; // D5 F#5 A5 D6

export class Soundscape {
  private ctx: AudioContext | null = null;
  private mestre: GainNode | null = null;
  private envioReverb: GainNode | null = null;

  /**
   * Cria o contexto de áudio. Como todo som daqui nasce de um clique, o
   * contexto sempre é criado dentro de um gesto do visitante — que é a única
   * situação em que o navegador libera áudio.
   */
  private preparar(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    try {
      const ctx = new AudioContext();
      const mestre = ctx.createGain();
      mestre.gain.value = 0.9;
      mestre.connect(ctx.destination);

      // Reverb curto: é ele que dá a sensação de "sala", em vez de bipe seco.
      const reverb = ctx.createConvolver();
      reverb.buffer = this.impulso(ctx, 2.4, 2.6);
      const envio = ctx.createGain();
      envio.gain.value = 0.34;
      envio.connect(reverb);
      reverb.connect(mestre);

      this.ctx = ctx;
      this.mestre = mestre;
      this.envioReverb = envio;
      return ctx;
    } catch {
      return null; // navegador sem Web Audio: o site funciona igual, sem som
    }
  }

  /**
   * Resposta de impulso gerada por ruído com queda exponencial — é o jeito
   * clássico de fabricar um reverb sem carregar amostra de sala real.
   */
  private impulso(ctx: AudioContext, segundos: number, decaimento: number) {
    const taxa = ctx.sampleRate;
    const total = Math.floor(taxa * segundos);
    const buffer = ctx.createBuffer(2, total, taxa);
    for (let canal = 0; canal < 2; canal++) {
      const dados = buffer.getChannelData(canal);
      for (let i = 0; i < total; i++) {
        dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / total, decaimento);
      }
    }
    return buffer;
  }

  /** Liga uma nota ao alto-falante e, em paralelo, ao reverb. */
  private saida(no: AudioNode, envio = 1) {
    if (!this.mestre || !this.envioReverb || !this.ctx) return;
    no.connect(this.mestre);
    if (envio > 0) {
      const g = this.ctx.createGain();
      g.gain.value = envio;
      no.connect(g).connect(this.envioReverb);
    }
  }

  /**
   * Uma nota de sino: além da fundamental, um harmônico agudo e discreto que
   * decai mais rápido. É esse harmônico que faz o ouvido reconhecer "sino" em
   * vez de "bipe".
   */
  private sino(freq: number, quando: number, volume: number, duracao: number, envio = 1) {
    const ctx = this.ctx;
    if (!ctx) return;
    const mistura = ctx.createGain();
    mistura.gain.value = 1;
    this.saida(mistura, envio);

    const parciais: [number, number, number][] = [
      // [multiplicador da frequência, volume relativo, fator de duração]
      [1, 1, 1],
      [2.01, 0.32, 0.6],
      [3.02, 0.12, 0.35],
    ];

    for (const [mult, vol, dur] of parciais) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      const pico = volume * vol;
      const fim = quando + duracao * dur;
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(pico, quando + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, fim);
      osc.connect(g).connect(mistura);
      osc.start(quando);
      osc.stop(fim + 0.05);
    }
  }

  /** Toca um dos efeitos da interface. */
  efeito(tipo: Efeito) {
    const ctx = this.preparar();
    if (!ctx) return;
    const agora = ctx.currentTime;

    switch (tipo) {
      // Link comum: presença mínima, só o toque de confirmação.
      case "clique":
        this.sino(1174.66, agora, 0.075, 0.18, 0.5);
        break;

      // Botão principal: mais corpo, duas notas quase simultâneas.
      case "botao":
        this.sino(587.33, agora, 0.075, 0.34);
        this.sino(880.0, agora + 0.012, 0.05, 0.28);
        break;

      /**
       * Agendamento — o som mais importante do site. Arpejo maior ascendente
       * com cauda de reverb: subir a escala é lido pelo ouvido como algo que
       * deu certo, e é exatamente a sensação certa no momento em que a pessoa
       * decide marcar a consulta.
       */
      case "agendar":
        ARPEJO_AGENDAR.forEach((f, i) => {
          this.sino(f, agora + i * 0.075, i === ARPEJO_AGENDAR.length - 1 ? 0.13 : 0.09, 1.2, 1.4);
        });
        // oitava grave sustentando o acorde, para dar peso ao final
        this.sino(293.66, agora + 0.04, 0.06, 1.4, 0.8);
        break;

      case "ligar":
        this.sino(587.33, agora, 0.07, 0.5);
        this.sino(880.0, agora + 0.09, 0.07, 0.7);
        break;

      case "desligar":
        this.sino(880.0, agora, 0.055, 0.4);
        this.sino(587.33, agora + 0.09, 0.055, 0.6);
        break;
    }
  }

  destruir() {
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
