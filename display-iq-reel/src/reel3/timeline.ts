import {VO3_WORDS} from './words';
import {IN_OUT, clamp01, lerp} from '../ease';
const h2 = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Hex-Mischung (liefert wieder Hex, damit sich Mischungen verschachteln lassen). */
export const mixh = (a: string, b: string, t: number) => {
  const A = h2(a);
  const B = h2(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp01(t)).toString(16).padStart(2, '0')).join('');
};

/**
 * Zeitplan Reel 3 – alle Szenenwechsel hängen an Wortzeiten des Voice-overs (words.ts),
 * damit ein neues Voice-over nur die Wortliste austauschen muss.
 */
const norm = (s: string) => s.toLowerCase().replace(/[.,?!–:]/g, '');
const find = (text: string, nth = 0) => {
  let n = 0;
  for (const w of VO3_WORDS) {
    if (norm(w[0]) === text) {
      if (n === nth) return {s: w[1], e: w[2]};
      n++;
    }
  }
  throw new Error(`Wort nicht gefunden: ${text} #${nth}`);
};
const last = VO3_WORDS[VO3_WORDS.length - 1];

export const T3 = {
  morgens: find('morgens').s,
  mittags1: find('mittags', 0).s,
  abends1: find('abends', 0).s,
  warum: find('warum').s,
  mit: find('mit').s,
  neun: find('neun').s,
  mittags2: find('mittags', 1).s,
  nachmittags: find('nachmittags').s,
  abends2: find('abends', 1).s,
  happy: find('happy').s,
  alles: find('alles').s,
  danach: find('danach').s,
  restaurants: find('restaurants').s,
  kein: find('kein', 0).s,
  austauschen: find('kein', 1).s,
  aufwand: find('kein', 2).s,
  display2: find('display', 1).s,
  richtige: find('richtige').s,
  zeit: find('zeit').s,
  tisch: find('tisch').s,
  end: last[2],
};
/** Gesamtlänge: Voice-over-Ende + Halten der Endcard. */
export const REEL3_DURATION_SEC = Math.ceil((T3.end + 1.6) * 10) / 10;

// ---------- Tageszeit ----------
export const SLOT_H = {morning: 9, lunch: 12.5, cake: 15.5, evening: 19} as const;
/** Zeiger-/Lichtzeit (Stunden, darf >24 laufen). */
export const hourAt = (t: number): number => {
  const k: [number, number][] = [
    [0, 5.4], [T3.morgens + 0.15, 7.0], [T3.mittags1 + 0.15, 12.5], [T3.abends1 + 0.2, 19.0],
    [T3.mit + 0.35, 19.0], [T3.neun + 0.1, 57.0],
    [T3.mittags2 - 0.1, 57.0], [T3.mittags2 + 0.85, 60.5],
    [T3.nachmittags - 0.1, 60.5], [T3.nachmittags + 0.85, 63.5],
    [T3.abends2 - 0.1, 63.5], [T3.abends2 + 0.85, 67.0],
  ];
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, h0] = k[i];
    const [t1, h1] = k[i + 1];
    if (t <= t1) {
      const u = clamp01((t - t0) / Math.max(1e-6, t1 - t0));
      // lange Sprünge (Zeitraffer) weich beschleunigen, kurze Stufen linear-weich
      return lerp(h0, h1, h1 === h0 ? 0 : IN_OUT(u));
    }
  }
  // Nach „Happy Hour“: Uhr steht auf 19:00 (Zeitplan-Szene), zum Schluss läuft ein kurzer Rückblick-Zeitraffer
  const base = 67.0;
  const rs = T3.kein;
  const re = T3.display2 - 0.2;
  if (t > rs && t < re) return base + IN_OUT(clamp01((t - rs) / (re - rs))) * 24;
  return t >= re ? base + 24 : base;
};
export const h24 = (h: number) => ((h % 24) + 24) % 24;

export type SlotId = 'B' | 'L' | 'C' | 'E';
/** Welcher Tagesabschnitt gilt – inkl. Startstunde (für das Aufpoppen der Gegenstände). */
export const slotOf = (h: number): {id: SlotId; start: number} => {
  const x = h24(h);
  if (x >= 6 && x < 10.5) return {id: 'B', start: 6};
  if (x >= 10.5 && x < 14.5) return {id: 'L', start: 10.5};
  if (x >= 14.5 && x < 18) return {id: 'C', start: 14.5};
  if (x >= 18) return {id: 'E', start: 18};
  return {id: 'E', start: -6};
};
export const settle = (h: number) => {
  const s = slotOf(h);
  return clamp01((h24(h) - s.start) / 0.5);
};

const sm = (a: number, b: number, x: number) => {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};
/** 0 = Nacht, 1 = voller Tag. */
export const daylight = (h: number) => {
  const x = h24(h);
  return sm(5.6, 8.0, x) * (1 - sm(16.4, 19.6, x));
};
/** Goldene Stunde (Morgen/Abend) 0…1. */
export const warmth = (h: number) => {
  const x = h24(h);
  return Math.max(sm(5.8, 7.0, x) * (1 - sm(7.6, 9.2, x)), sm(15.0, 16.8, x) * (1 - sm(18.2, 19.8, x))) * 0.9;
};
/** Neonlicht der Abendlocation. */
export const neon = (h: number) => {
  const x = h24(h);
  return sm(17.6, 19.0, x) * (1 - sm(23.0, 24.0, x)) + (1 - sm(0, 1.0, x)) * (x < 1 ? 1 : 0);
};
/** Sonnenstand: links (Morgen) bzw. rechts (Nachmittag) durch die Fenster; len = Schattenlänge. */
export const sunShafts = (h: number) => {
  const x = h24(h);
  const morning = sm(6.2, 7.6, x) * (1 - sm(11.2, 12.4, x));
  const afternoon = sm(13.4, 14.8, x) * (1 - sm(18.0, 19.0, x));
  const lenM = lerp(7.5, 2.2, clamp01((x - 6.5) / 5));
  const lenA = lerp(2.4, 8.5, clamp01((x - 13.5) / 5));
  return {morning, afternoon, lenM, lenA};
};

export const skyColors = (h: number) => {
  const d = daylight(h);
  const w = warmth(h);
  let top = mixh('#0a1030', '#4f9be0', d);
  let bot = mixh('#14264e', '#bfe0fa', d);
  top = mixh(top, '#e07a4a', w * 0.55);
  bot = mixh(bot, '#ffc688', w * 0.8);
  return {top, bot};
};

export const clockLabel = (h: number) => {
  const x = h24(h);
  const hh = Math.floor(x);
  const mm = Math.floor((x - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

/** Zeitplan-Szene (Dashboard): Hub erscheint bei „Alles einmal planen“, Klick kurz vor „Danach wechseln …“. */
export const S6 = {
  zoomOut: T3.alles - 0.5,
  hubIn: T3.alles + 0.6,
  click: T3.danach + 0.2,
  publish: T3.danach + 0.75,
  back: T3.kein - 0.6,
};
export const SLOT_COLORS = ['#ffb627', '#ff6a3d', '#ff8ac0', '#ff2e93'] as const;
