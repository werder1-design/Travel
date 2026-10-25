import {buildCaptions, KeyTone} from '../data/captions';
import {SfxCue} from '../data/sfx';
import {VO3_WORDS} from './words';
import {S6, T3} from './timeline';

const CHUNKS3: string[] = [
  'Morgens Kaffee.', 'Mittags Lunch.', 'Abends Cocktails.',
  'Warum zeigt dein Restaurant', 'eigentlich den ganzen Tag', 'dieselbe Werbung?',
  'Mit Display IQ passt sich', 'deine Tischwerbung automatisch', 'der Tageszeit an.',
  'Um neun Uhr erscheint', 'dein Frühstücksangebot.', 'Mittags bewirbst du', 'dein Lunch-Special.',
  "Nachmittags gibt's", 'Kaffee und Kuchen.', 'Und abends?', 'Happy Hour!',
  'Alles einmal planen.', 'Danach wechseln deine Angebote', 'automatisch – auf allen Displays,', 'in allen deinen Restaurants.',
  'Kein Neudrucken.', 'Kein Austauschen.', 'Kein zusätzlicher Aufwand.',
  'Display IQ.', 'Die richtige Werbung.', 'Zur richtigen Zeit.', 'Direkt am Tisch.',
];
const KW3: Record<string, KeyTone> = {
  morgens: 'amber', kaffee: 'amber', mittags: 'amber', lunch: 'amber', abends: 'amber', cocktails: 'amber',
  werbung: 'cyan', tischwerbung: 'cyan', automatisch: 'cyan', tageszeit: 'cyan', frühstücksangebot: 'amber',
  'lunch-special': 'amber', kuchen: 'amber', happy: 'amber', hour: 'amber', planen: 'cyan', angebote: 'cyan',
  displays: 'cyan', restaurants: 'cyan', neudrucken: 'cyan', austauschen: 'cyan', aufwand: 'cyan', richtige: 'amber', zeit: 'amber',
  tisch: 'cyan',
};
export const CAPTIONS3 = buildCaptions(VO3_WORDS, CHUNKS3, KW3);

const L = {tap: 0.25, whoosh: 0.7, confirm: 1.1, pop: 0.3, crash: 1.6, coin: 1.0, swipe: 0.45, hit: 2.4, shimmer: 1.6} as const;
const cue = (name: SfxCue['name'], at: number, vol: number): SfxCue => ({name, at, vol, len: L[name]});
const ticks = (from: number, to: number, step: number, vol: number) => {
  const out: SfxCue[] = [];
  for (let t = from; t < to; t += step) out.push(cue('tap', t, vol));
  return out;
};

export const SFX3: SfxCue[] = [
  cue('whoosh', 0.02, 0.5),
  // Uhr im Zeitraffer
  ...ticks(0.15, T3.warum - 0.2, 0.17, 0.22),
  cue('pop', T3.morgens, 0.5), cue('pop', T3.mittags1, 0.5), cue('pop', T3.abends1, 0.55), cue('shimmer', T3.abends1 + 0.1, 0.4),
  cue('whoosh', T3.warum - 0.3, 0.4), cue('pop', T3.warum + 0.5, 0.45),
  cue('pop', T3.mit + 0.3, 0.5), ...ticks(T3.mit + 0.45, T3.neun, 0.14, 0.2), cue('shimmer', T3.neun - 0.3, 0.5),
  // Tageszeiten
  cue('pop', T3.neun + 0.15, 0.55), cue('swipe', T3.neun + 0.2, 0.4), cue('pop', T3.neun + 2.3, 0.4),
  cue('shimmer', T3.mittags2 - 0.05, 0.55), cue('swipe', T3.mittags2 + 0.5, 0.4), cue('pop', T3.mittags2 + 0.3, 0.5), cue('pop', T3.mittags2 + 2.9, 0.35),
  cue('shimmer', T3.nachmittags - 0.05, 0.55), cue('swipe', T3.nachmittags + 0.5, 0.4), cue('pop', T3.nachmittags + 0.3, 0.5),
  cue('shimmer', T3.abends2 - 0.05, 0.6), cue('swipe', T3.abends2 + 0.5, 0.4), cue('pop', T3.abends2 + 0.3, 0.55), cue('crash', T3.happy, 0.35),
  // Zeitplan
  cue('whoosh', S6.zoomOut, 0.5), cue('pop', S6.zoomOut + 0.9, 0.5), cue('pop', S6.hubIn, 0.4),
  cue('tap', S6.click, 0.8), cue('confirm', S6.click + 0.4, 0.7), cue('shimmer', S6.publish, 0.6),
  ...[0, 1, 2, 3].map((i) => cue('swipe', S6.publish + i * 0.95, 0.3)),
  cue('whoosh', S6.back, 0.5),
  // Schluss
  cue('pop', T3.kein, 0.5), cue('pop', T3.austauschen, 0.5), cue('pop', T3.aufwand, 0.5),
  ...ticks(T3.kein, T3.display2 - 0.3, 0.16, 0.16),
  cue('whoosh', T3.display2 - 0.4, 0.5), cue('hit', T3.display2 - 0.05, 0.75),
  cue('pop', T3.richtige, 0.45), cue('pop', T3.zeit, 0.45), cue('pop', T3.tisch, 0.45), cue('shimmer', T3.tisch, 0.4),
];
