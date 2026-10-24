import {MENU1_TAPS, MENU2_TAPS, HAPPY_TAP_AT} from './interactions';

export type SfxCue = {name: 'tap' | 'whoosh' | 'confirm' | 'pop' | 'crash' | 'coin' | 'swipe' | 'hit' | 'shimmer'; at: number; vol: number; len: number};

const LEN = {tap: 0.25, whoosh: 0.7, confirm: 1.1, pop: 0.3, crash: 1.6, coin: 1.0, swipe: 0.45, hit: 2.4, shimmer: 1.6} as const;
const cue = (name: SfxCue['name'], at: number, vol: number): SfxCue => ({name, at, vol, len: LEN[name]});

/** Alle Soundeffekte, zentral und auf Voice-over/Animationen abgestimmt. */
export const SFX_CUES: SfxCue[] = [
  // Schnitt-Wischer (leicht vor dem Schnitt, damit der Peak auf den Schnitt fällt)
  ...[4.2, 7.7, 22.4, 24.2, 33.0, 46.4, 50.3, 56.5].map((c) => cue('whoosh', c - 0.3, 0.55)),
  cue('whoosh', 50.75, 0.45),
  // Strikes
  cue('crash', 2.9, 0.7),
  cue('crash', 23.55, 0.7),
  cue('crash', 51.55, 0.45),
  // Headlines
  cue('pop', 8.0, 0.5), cue('pop', 19.3, 0.5), cue('pop', 29.6, 0.5), cue('pop', 43.6, 0.5),
  cue('pop', 0.2, 0.4),
  // Touch-Interaktionen
  ...MENU1_TAPS.map((t) => cue('tap', t.at, 0.7)),
  cue('tap', HAPPY_TAP_AT, 0.7),
  ...MENU2_TAPS.map((t) => cue('tap', t.at, 0.7)),
  // Bestätigungen
  cue('confirm', 20.5, 0.65),
  cue('confirm', HAPPY_TAP_AT + 0.28, 0.55),
  cue('confirm', 49.63, 0.65),
  // Screen-Wechsel
  cue('swipe', 14.45, 0.4), cue('swipe', 25.3, 0.4), cue('swipe', 28.1, 0.4), cue('swipe', 29.8, 0.4),
  cue('swipe', 33.6, 0.4), cue('swipe', 38.1, 0.4),
  // Umsatz / Münzen
  cue('coin', 30.95, 0.5), cue('coin', 43.5, 0.5), cue('coin', 44.0, 0.4),
  // Finale
  cue('shimmer', 51.0, 0.5),
  cue('pop', 51.15, 0.4), cue('pop', 53.4, 0.4), cue('pop', 54.6, 0.4),
  cue('hit', 56.7, 0.7),
  cue('pop', 60.0, 0.45),
];
