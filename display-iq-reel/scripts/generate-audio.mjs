#!/usr/bin/env node
/**
 * Erzeugt Musikbett (elektronisch, 120 BPM, dezent) und Soundeffekte (Touch, Bestätigung,
 * Übergänge, Strike, Münzen) rein per Synthese – keine Fremdsamples, keine Lizenzfragen.
 * Ausgabe: public/audio/music.mp3 und public/audio/sfx/*.wav
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(join(root, 'sfx'), {recursive: true});

// deterministischer Zufall
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;

const buf = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];

function writeWav(path, [L, R]) {
  let peak = 0;
  for (let i = 0; i < L.length; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0 ? 0.9 / peak : 1;
  const data = Buffer.alloc(L.length * 4);
  for (let i = 0; i < L.length; i++) {
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * g * 32767))), i * 4);
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * g * 32767))), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(path, Buffer.concat([h, data]));
}

const add = (b, t0, fn, dur, pan = 0, gain = 1) => {
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  const l = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
  const r = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < n; i++) {
    const idx = i0 + i;
    if (idx < 0 || idx >= b[0].length) continue;
    const v = fn(i / SR);
    b[0][idx] += v * l;
    b[1][idx] += v * r;
  }
};

// ---- Bausteine ----
const svf = () => {
  let lp = 0, bp = 0;
  return (x, f, q) => {
    const fc = 2 * Math.sin((Math.PI * Math.min(f, SR * 0.45)) / SR);
    lp += fc * bp;
    const hp = x - lp - q * bp;
    bp += fc * hp;
    return {lp, bp, hp};
  };
};
const bell = (f, t, dec, partials = [[1, 1], [2.76, 0.45], [5.4, 0.22], [8.93, 0.1]]) =>
  partials.reduce((s, [m, a]) => s + a * Math.sin(TAU * f * m * t) * Math.exp(-t * dec * (0.6 + m * 0.25)), 0);

// ---- SFX ----
const sfx = {};
sfx.tap = (() => {
  const b = buf(0.25);
  const f = svf();
  add(b, 0, (t) => Math.sin(TAU * (900 + 900 * Math.exp(-t * 90)) * t) * Math.exp(-t * 55) * 0.8 + f(noise(), 6000, 0.5).hp * Math.exp(-t * 300) * 0.5 + Math.sin(TAU * 190 * t) * Math.exp(-t * 40) * 0.5, 0.25);
  return b;
})();
sfx.pop = (() => {
  const b = buf(0.3);
  add(b, 0, (t) => Math.sin(TAU * (380 + 700 * (1 - Math.exp(-t * 40))) * t) * Math.exp(-t * 28) * 0.9 + Math.sin(TAU * 1500 * t) * Math.exp(-t * 80) * 0.25, 0.3);
  return b;
})();
const whoosh = (dur, lo, hi, peak = 0.5) => {
  const b = buf(dur);
  const fl = svf(), fr = svf();
  for (let i = 0; i < b[0].length; i++) {
    const t = i / SR / dur;
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(t, 1 / (peak * 2 + 0.2)))), 1.6);
    const fc = lo * Math.pow(hi / lo, Math.sin(Math.PI * t * 0.5 + 0.0001) ** 1.2);
    b[0][i] = fl(noise(), fc, 0.35).bp * env * 1.6;
    b[1][i] = fr(noise(), fc * 1.04, 0.35).bp * env * 1.6;
  }
  return b;
};
sfx.whoosh = whoosh(0.7, 260, 5200, 0.43);
sfx.swipe = whoosh(0.45, 700, 3600, 0.4);
sfx.confirm = (() => {
  const b = buf(1.1);
  add(b, 0, (t) => bell(1046.5, t, 5) * 0.7, 1.1, -0.1);
  add(b, 0.11, (t) => bell(1568, t, 4.5) * 0.7, 0.99, 0.1);
  add(b, 0.22, (t) => bell(2093, t, 4) * 0.45, 0.88, 0);
  return b;
})();
sfx.coin = (() => {
  const b = buf(1.0);
  add(b, 0, (t) => bell(1976, t, 9, [[1, 1], [2.01, 0.6], [3.02, 0.3]]) * 0.8, 1.0, -0.2);
  add(b, 0.085, (t) => bell(2637, t, 7, [[1, 1], [2.01, 0.6], [3.02, 0.3]]) * 0.9, 0.9, 0.2);
  const f = svf();
  add(b, 0.08, (t) => f(noise(), 9000, 0.4).hp * Math.exp(-t * 18) * 0.18, 0.5);
  return b;
})();
sfx.crash = (() => {
  const b = buf(1.6);
  const f = svf();
  add(b, 0, (t) => f(noise(), 9000 * Math.exp(-t * 3.2) + 400, 0.5).lp * Math.exp(-t * 2.8) * 1.1 + Math.sin(TAU * (45 + 80 * Math.exp(-t * 22)) * t) * Math.exp(-t * 7) * 1.2, 1.6);
  for (let k = 0; k < 14; k++) {
    const t0 = 0.03 + rnd() * 0.75;
    const ff = svf();
    const fc = 1100 + rnd() * 1800;
    add(b, t0, (t) => ff(noise(), fc, 0.25).bp * Math.exp(-t * 60) * (0.5 + rnd() * 0.4), 0.14, rnd() * 1.6 - 0.8);
  }
  return b;
})();
sfx.hit = (() => {
  const b = buf(2.4);
  add(b, 0, (t) => Math.sin(TAU * (38 + 60 * Math.exp(-t * 8)) * t) * Math.exp(-t * 2.2) * 1.2, 2.4);
  const f = svf();
  add(b, 0, (t) => f(noise(), 700 + 5000 * Math.exp(-t * 4), 0.6).hp * Math.exp(-t * 7) * 0.5, 1.2);
  [[220, 0], [329.63, 0], [440, 0.02], [659.25, 0.04], [987.77, 0.06]].forEach(([fq, dl], i) =>
    add(b, dl, (t) => bell(fq, t, 1.3, [[1, 1], [2.0, 0.3], [3.0, 0.12]]) * 0.32, 2.3, (i % 2 ? 0.3 : -0.3)));
  return b;
})();
sfx.shimmer = (() => {
  const b = buf(1.6);
  [659.25, 987.77, 1318.5, 1661.2, 1975.5, 2637].forEach((fq, i) =>
    add(b, i * 0.075, (t) => bell(fq, t, 4.2, [[1, 1], [2.0, 0.25]]) * 0.5, 1.2, (i % 2 ? 0.4 : -0.4)));
  const f = svf();
  add(b, 0, (t) => f(noise(), 6000 + 3000 * t, 0.5).hp * Math.sin(Math.PI * Math.min(1, t / 0.9)) * 0.14, 1.4);
  return b;
})();
for (const [name, b] of Object.entries(sfx)) writeWav(join(root, 'sfx', `${name}.wav`), b);

// ---- Musik ----
const DUR = 62.5;
const BPM = 120;
const BEAT = 60 / BPM;
const m = buf(DUR);
const chords = [
  {root: 110.0, notes: [220.0, 261.63, 329.63], arp: [329.63, 440.0, 523.25, 659.25]},        // Am
  {root: 87.31, notes: [174.61, 220.0, 261.63], arp: [261.63, 349.23, 440.0, 523.25]},         // F
  {root: 130.81, notes: [261.63, 329.63, 392.0], arp: [392.0, 523.25, 659.25, 783.99]},        // C
  {root: 98.0, notes: [196.0, 246.94, 293.66], arp: [293.66, 392.0, 493.88, 587.33]},          // G
];
const chordAt = (t) => chords[Math.floor(t / (BEAT * 4)) % 4];
const inRange = (t, a, b) => t >= a && t < b;
const kickOn = (t) => (inRange(t, 0, 33) || inRange(t, 35.0, 56.5)) ? (t < 2 ? 0.55 : 0.85) : 0;
const hatOn = (t) => (inRange(t, 0, 33.0) || inRange(t, 34.4, 56.5) ? 0.5 : 0);
const clapOn = (t) => (inRange(t, 10.2, 33) || inRange(t, 35, 56.5) ? 0.5 : 0);
const bassOn = (t) => (inRange(t, 6, 33) || inRange(t, 35, 56.5) ? 0.8 : 0);
const arpOn = (t) => (inRange(t, 12, 33) ? 0.28 : inRange(t, 34.4, 56.5) ? 0.42 : 0);
const padLevel = (t) => (t < 56.5 ? 0.55 + 0.25 * Math.min(1, Math.max(0, (t - 44) / 6)) : 0.6 * Math.max(0, 1 - (t - 56.5) / 6));

// Kicks (merken für Sidechain)
const kicks = [];
for (let b = 0; b * BEAT < DUR; b++) {
  const t = b * BEAT;
  const g = kickOn(t);
  if (g > 0) {
    kicks.push(t);
    add(m, t, (x) => Math.sin(TAU * (48 + 110 * Math.exp(-x * 38)) * x) * Math.exp(-x * 9) * g, 0.4, 0);
  }
}
// Hi-Hats (Off-Beat) + Claps
for (let b = 0; b * BEAT * 0.5 < DUR; b++) {
  const t = b * BEAT * 0.5;
  const off = b % 2 === 1;
  const hg = hatOn(t);
  if (hg > 0) {
    const f = svf();
    add(m, t, (x) => f(noise(), 8500, 0.5).hp * Math.exp(-x * (off ? 38 : 70)) * hg * (off ? 0.5 : 0.22), 0.12, off ? 0.25 : -0.25);
  }
  const cg = clapOn(t);
  if (cg > 0 && b % 4 === 2) {
    const f = svf();
    add(m, t, (x) => f(noise(), 1700, 0.8).bp * Math.exp(-x * 22) * cg * 0.9, 0.25, 0);
  }
}
const duck = (t) => {
  let d = 0;
  for (let i = kicks.length - 1; i >= 0; i--) {
    if (kicks[i] <= t) { d = t - kicks[i]; break; }
  }
  return 1 - 0.55 * Math.exp(-d / 0.11);
};
// Bass (8tel, Off-Beat-Pumpen)
for (let b = 0; b * BEAT * 0.5 < DUR; b++) {
  const t = b * BEAT * 0.5;
  const g = bassOn(t);
  if (g > 0 && b % 2 === 1) {
    const fq = chordAt(t).root;
    const f = svf();
    add(m, t, (x) => {
      const ph = (x * fq) % 1;
      const saw = 2 * ph - 1;
      return (f(saw, 420 + 380 * Math.exp(-x * 14), 0.6).lp * 0.8 + Math.sin(TAU * fq * x) * 0.7) * Math.exp(-x * 5.5) * g * duck(t + x);
    }, BEAT * 0.5, -0.05);
  }
}
// Pads (Sägezähne, zwei verstimmte Stimmen je Seite, LFO-Filter)
{
  const pad = buf(DUR);
  for (let bar = 0; bar * BEAT * 4 < DUR; bar++) {
    const t0 = bar * BEAT * 4;
    const ch = chords[bar % 4];
    const lv = padLevel(t0);
    if (lv <= 0) continue;
    ch.notes.forEach((fq) => {
      [[-1, 0.997], [1, 1.003]].forEach(([pan, det]) => {
        add(pad, t0 - 0.05, (x) => {
          const env = Math.min(1, x / 0.5) * Math.min(1, Math.max(0, (BEAT * 4 + 0.6 - x) / 0.6));
          return (2 * ((x * fq * det) % 1) - 1) * env * 0.11 * lv;
        }, BEAT * 4 + 0.7, pan * 0.7);
      });
    });
  }
  const fl = svf(), fr = svf();
  for (let i = 0; i < pad[0].length; i++) {
    const t = i / SR;
    const cut = 700 + 500 * Math.sin(t * 0.8) + (t > 44 && t < 56.5 ? (t - 44) * 80 : 0);
    const d = duck(t);
    m[0][i] += fl(pad[0][i], cut, 0.9).lp * d * 1.4;
    m[1][i] += fr(pad[1][i], cut, 0.9).lp * d * 1.4;
  }
}
// Arpeggio (8tel, Dreieck + Echo)
{
  const arp = buf(DUR);
  const pat = [0, 2, 1, 3, 2, 1, 3, 2];
  for (let b = 0; b * BEAT * 0.5 < DUR; b++) {
    const t = b * BEAT * 0.5;
    const g = arpOn(t);
    if (g <= 0) continue;
    const fq = chordAt(t).arp[pat[b % 8]];
    add(arp, t, (x) => {
      const tri = 2 * Math.abs(2 * ((x * fq) % 1) - 1) - 1;
      return (tri * 0.7 + Math.sin(TAU * fq * 2 * x) * 0.15) * Math.exp(-x * 11) * g * 0.5;
    }, 0.4, (b % 2 ? 0.35 : -0.35));
  }
  const dl = Math.floor(BEAT * 0.75 * SR);
  for (let i = 0; i < arp[0].length; i++) {
    const e0 = i >= dl ? arp[1][i - dl] * 0.38 : 0;
    const e1 = i >= dl ? arp[0][i - dl] * 0.38 : 0;
    arp[0][i] += e0;
    arp[1][i] += e1;
    m[0][i] += arp[0][i] * duck(i / SR);
    m[1][i] += arp[1][i] * duck(i / SR);
  }
}
// Riser in den Break (Doch das ist noch nicht alles) und ins Finale
const riser = (t0, dur) => {
  const f = svf();
  add(m, t0, (x) => f(noise(), 500 + 7000 * (x / dur) ** 2, 0.5).hp * (x / dur) ** 2 * 0.22, dur, 0);
};
riser(31.2, 1.8);
riser(54.7, 1.8);
// Fade-out + Soft-Clip
for (let i = 0; i < m[0].length; i++) {
  const t = i / SR;
  const fade = t > DUR - 2.5 ? Math.max(0, (DUR - t) / 2.5) : 1;
  m[0][i] = Math.tanh(m[0][i] * 0.9) * fade;
  m[1][i] = Math.tanh(m[1][i] * 0.9) * fade;
}
const wavPath = join(root, 'music.wav');
writeWav(wavPath, m);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wavPath, '-b:a', '192k', join(root, 'music.mp3')]);
execFileSync('rm', ['-f', wavPath]);
console.log('Audio erzeugt:', root);
