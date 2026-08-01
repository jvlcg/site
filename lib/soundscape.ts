/**
 * Som do site — 100% sintetizado no navegador, nenhum arquivo baixado.
 *
 * Por que sintetizar em vez de tocar um MP3:
 *
 * - **Direitos autorais.** Trilha de banco de música exige licença comercial, e
 *   num site que leva nome e CRM de médico o uso indevido é risco jurídico
 *   real. O que é gerado aqui é original por construção: não existe gravação
 *   por trás, são osciladores tocando notas calculadas na hora.
 * - **Peso.** Uma faixa ambiente de 3 minutos custaria alguns megabytes e
 *   competiria com o carregamento da página. Este arquivo tem poucos KB e não
 *   baixa nada.
 * - **Segurança.** Nenhum domínio novo precisa ser liberado na
 *   Content-Security-Policy.
 *
 * A música nunca se repete: as notas são sorteadas dentro de uma escala
 * pentatônica, que não tem intervalos tensos — é por isso que soa calma em
 * qualquer combinação. É o mesmo princípio da música de espera de consultório.
 */

export type Efeito = "clique" | "botao" | "agendar" | "ligar" | "desligar";

/** Ré maior pentatônica em três oitavas — nenhuma combinação soa dissonante. */
const NOTAS = [
  146.83, 164.81, 185.0, 220.0, 246.94, // D3 E3 F#3 A3 B3
  293.66, 329.63, 369.99, 440.0, 493.88, // D4 E4 F#4 A4 B4
  587.33, 659.25, 739.99, 880.0, // D5 E5 F#5 A5
];

/** Arpejo de Ré maior que confirma o agendamento. */
const ARPEJO_AGENDAR = [587.33, 739.99, 880.0, 1174.66]; // D5 F#5 A5 D6

const sortear = <T,>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];

export class Soundscape {
  private ctx: AudioContext | null = null;
  private mestre: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private envioReverb: GainNode | null = null;
  private musica: GainNode | null = null;
  private drone: { osc: OscillatorNode[]; ganho: GainNode } | null = null;
  private proximaNota: ReturnType<typeof setTimeout> | null = null;
  private tocandoMusica = false;

  /**
   * Cria o contexto de áudio. Só pode ser chamado a partir de um clique: o
   * navegador recusa áudio iniciado sem interação do visitante.
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
      this.reverb = reverb;
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

  /** A música está tocando neste momento? */
  get musicaAtiva() {
    return this.tocandoMusica;
  }

  /**
   * Pede ao navegador que libere o áudio e espera a resposta.
   *
   * Só faz sentido chamar de dentro de um gesto do visitante (clique, toque,
   * rolagem, tecla) — é a única situação em que o navegador aceita. `resume()`
   * é assíncrono: sem esperar por ele, o estado ainda aparece como suspenso no
   * instante seguinte à chamada e a música não começaria.
   */
  async destravar(): Promise<boolean> {
    const ctx = this.preparar();
    if (!ctx) return false;
    if (ctx.state === "running") return true;
    try {
      await ctx.resume();
    } catch {
      /* ainda bloqueado — tentamos de novo no próximo gesto */
    }
    // o `as` é necessário: para o TypeScript o estado continua sendo o de antes
    // do `await`, porque ele não sabe que `resume()` muda essa propriedade
    return (ctx.state as AudioContextState) === "running";
  }

  /**
   * Começa a música ambiente, com entrada suave de alguns segundos — nada
   * entra de repente no ouvido de quem abriu a página.
   *
   * Devolve `false` quando o navegador ainda não liberou o áudio (nenhuma
   * interação até agora); nesse caso quem chamou deve esperar o primeiro
   * gesto do visitante e tentar de novo.
   */
  iniciarMusica(): boolean {
    const ctx = this.preparar();
    if (!ctx || !this.mestre) return false;
    if (this.tocandoMusica) return true;
    // contexto suspenso = o navegador está segurando o áudio até a interação
    if (ctx.state !== "running") return false;
    this.tocandoMusica = true;

    const musica = ctx.createGain();
    musica.gain.setValueAtTime(0.0001, ctx.currentTime);
    // A música fica deliberadamente abaixo dos efeitos: medindo a saída real,
    // com ela em volume cheio o clique de um link comum quase sumia dentro do
    // acorde. Ambiente é fundo; o retorno do que a pessoa clicou vem na frente.
    musica.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + 6);
    musica.connect(this.mestre);
    if (this.envioReverb) musica.connect(this.envioReverb);
    this.musica = musica;

    // Base grave contínua: é o que dá a sensação de ambiente, e não de
    // notas soltas. Duas ondas levemente desafinadas entre si batem devagar
    // uma contra a outra e criam um movimento lento e natural.
    const ganhoDrone = ctx.createGain();
    ganhoDrone.gain.value = 0.03;
    const filtro = ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 420;
    ganhoDrone.connect(filtro).connect(musica);

    const osciladores = [73.42, 73.75, 110.0].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(ganhoDrone);
      o.start();
      return o;
    });
    this.drone = { osc: osciladores, ganho: ganhoDrone };

    this.agendarNota();
    return true;
  }

  /**
   * Sorteia a próxima nota e agenda a seguinte. As notas nunca se repetem na
   * mesma ordem: a escala pentatônica garante que qualquer sequência soe bem,
   * então não é preciso uma melodia escrita.
   */
  private agendarNota() {
    const ctx = this.ctx;
    if (!ctx || !this.musica || !this.tocandoMusica) return;

    const freq = sortear(NOTAS);
    const agora = ctx.currentTime;

    this.notaLonga(freq, agora, 0.05);
    // de vez em quando, uma segunda voz uma oitava acima adensa o acorde
    if (Math.random() < 0.35) this.notaLonga(freq * 2, agora + 0.4 + Math.random(), 0.028);

    const intervalo = 3200 + Math.random() * 4200; // 3,2 s a 7,4 s
    this.proximaNota = setTimeout(() => this.agendarNota(), intervalo);
  }

  /**
   * Nota de pad: ataque de segundos e queda longa. É o ataque lento que separa
   * "música ambiente" de "alguém tocando um instrumento".
   */
  private notaLonga(freq: number, quando: number, volume: number) {
    const ctx = this.ctx;
    if (!ctx || !this.musica) return;

    const g = ctx.createGain();
    const filtro = ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = Math.min(freq * 6, 2600);
    filtro.Q.value = 0.4;
    g.connect(filtro).connect(this.musica);

    const ataque = 2.2 + Math.random() * 1.6;
    const total = ataque + 4.5 + Math.random() * 3;
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(volume, quando + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + total);

    // duas ondas com afinação levemente diferente: o batimento entre elas é o
    // que dá calor ao som, em vez do timbre "elétrico" de um oscilador só
    for (const [tipo, desafinacao, vol] of [
      ["sine", 0, 1],
      ["triangle", 3.5, 0.42],
    ] as [OscillatorType, number, number][]) {
      const osc = ctx.createOscillator();
      const vg = ctx.createGain();
      vg.gain.value = vol;
      osc.type = tipo;
      osc.frequency.value = freq;
      osc.detune.value = desafinacao;
      osc.connect(vg).connect(g);
      osc.start(quando);
      osc.stop(quando + total + 0.2);
    }
  }

  /** Para a música com saída suave, sem corte seco. */
  pararMusica() {
    if (!this.tocandoMusica || !this.ctx) return;
    this.tocandoMusica = false;
    if (this.proximaNota) clearTimeout(this.proximaNota);
    this.proximaNota = null;

    const ctx = this.ctx;
    const musica = this.musica;
    const drone = this.drone;
    this.musica = null;
    this.drone = null;

    if (musica) {
      musica.gain.cancelScheduledValues(ctx.currentTime);
      musica.gain.setValueAtTime(Math.max(musica.gain.value, 0.0001), ctx.currentTime);
      musica.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      setTimeout(() => musica.disconnect(), 3000);
    }
    if (drone) {
      drone.ganho.gain.cancelScheduledValues(ctx.currentTime);
      drone.ganho.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      setTimeout(() => drone.osc.forEach((o) => o.stop()), 3000);
    }
  }

  /** Silencia sem desligar — usado quando a aba sai de foco (poupa bateria). */
  pausar() {
    if (this.ctx && this.ctx.state === "running") void this.ctx.suspend();
  }

  retomar() {
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  destruir() {
    this.pararMusica();
    setTimeout(() => void this.ctx?.close().catch(() => {}), 3200);
  }
}
