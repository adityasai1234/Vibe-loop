import { PRESETS, EQ_BANDS } from "./eqPresets";

export class AudioEngine {
  private ctx = new AudioContext();
  private current?: HTMLAudioElement;
  private next?: HTMLAudioElement;
  private gainCurr = this.ctx.createGain();
  private gainNext = this.ctx.createGain();
  public crossfadeSec = 2;

  /* EQ nodes — 6-band peaking filters */
  public bands = EQ_BANDS.map(freq => {
    const f = this.ctx.createBiquadFilter();
    f.type = "peaking";
    f.frequency.value = freq;
    f.Q.value = 1;
    f.gain.value = 0;
    return f;
  });

  constructor() {
    /* destination chain: bands → gainCurr */
    const chain = [...this.bands, this.gainCurr, this.ctx.destination];
    chain.reduce((a, b) => (a.connect(b), b));
    this.gainNext.connect(this.ctx.destination);
  }

  async play(url: string) {
    // 1️⃣ first play
    if (!this.current) {
      this.current = new Audio(url);
      this.ctx.createMediaElementSource(this.current).connect(this.bands[0]);
      await this.current.play();
      return;
    }

    // 2️⃣ cross-fade setup
    this.next = new Audio(url);
    this.ctx
      .createMediaElementSource(this.next)
      .connect(this.gainNext);
    this.gainNext.gain.value = 0;
    await this.next.play();

    // 3️⃣ ramp gains
    const t0 = this.ctx.currentTime;
    this.gainCurr.gain.linearRampToValueAtTime(0, t0 + this.crossfadeSec);
    this.gainNext.gain.linearRampToValueAtTime(1, t0 + this.crossfadeSec);

    // 4️⃣ swap refs
    setTimeout(() => {
      this.current?.pause();
      this.current = this.next!;
      this.gainCurr = this.gainNext;
      this.next = undefined;
      this.gainNext = this.ctx.createGain();
    }, this.crossfadeSec * 1000);
  }

  applyEqPreset(name: keyof typeof PRESETS) {
    PRESETS[name].forEach((gain, i) => (this.bands[i].gain.value = gain));
  }
}