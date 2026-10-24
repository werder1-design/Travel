import {Easing, interpolate} from 'remotion';
import {FPS} from './theme';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.33, 0, 0.2, 1);

/** Fortschritt 0→1 zwischen start und start+dur (Sekunden), absolut zur Videozeit. */
export const prog = (
  frame: number,
  startSec: number,
  durSec: number,
  easing: (t: number) => number = OUT,
) =>
  interpolate(frame, [startSec * FPS, (startSec + durSec) * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Sichtbarkeit mit Ein-/Ausblendung (Sekunden). */
export const window = (
  frame: number,
  inSec: number,
  outSec: number,
  fadeIn = 0.15,
  fadeOut = 0.15,
) => Math.min(prog(frame, inSec, fadeIn, SOFT), 1 - prog(frame, outSec - fadeOut, fadeOut, SOFT));

/** Federnder Pop 0→1 (leichtes Overshoot). */
export const pop = (frame: number, startSec: number, damping = 13, stiffness = 170) => {
  const f = frame - startSec * FPS;
  if (f < 0) return 0;
  // Kleine, eigene Feder – unabhängig von remotion/spring, damit sie überall (auch im Screen) gleich wirkt.
  const w = Math.sqrt(stiffness);
  const z = damping / (2 * w);
  const t = f / FPS;
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w * t) * (1 + w * t);
};

/** Deterministischer Pseudo-Zufall (damit Frames reproduzierbar bleiben). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
