// ── Sound Manager — Web Audio API ──────────────────────────────

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.5;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  
  _play(frequency, duration, type = 'sine', volume = null) {
    if (this.muted || !this.ctx) return;
    
    const vol = volume !== null ? volume : this.volume;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }
  
  _playChord(frequencies, duration, type = 'sine') {
    for (const f of frequencies) {
      this._play(f, duration, type, this.volume * 0.2);
    }
  }
  
  move() {
    this._play(600, 0.08, 'sine');
    setTimeout(() => this._play(800, 0.06, 'sine'), 30);
  }
  
  capture() {
    this._play(300, 0.15, 'square');
    setTimeout(() => this._play(200, 0.1, 'square'), 50);
  }
  
  check() {
    this._play(900, 0.12, 'sawtooth');
    setTimeout(() => this._play(1100, 0.1, 'sawtooth'), 80);
  }
  
  castle() {
    this._play(500, 0.1, 'sine');
    setTimeout(() => this._play(600, 0.1, 'sine'), 60);
    setTimeout(() => this._play(700, 0.08, 'sine'), 120);
  }
  
  gameOver() {
    this._playChord([262, 330, 392], 0.5, 'sine');
    setTimeout(() => this._playChord([349, 440, 523], 0.8, 'sine'), 400);
  }
  
  illegal() {
    this._play(150, 0.15, 'square');
  }
  
  promote() {
    this._play(523, 0.1, 'sine');
    setTimeout(() => this._play(659, 0.1, 'sine'), 80);
    setTimeout(() => this._play(784, 0.15, 'sine'), 160);
  }
  
  tick() {
    this._play(1200, 0.02, 'sine', 0.1);
  }
  
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
  
  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
  }
}
