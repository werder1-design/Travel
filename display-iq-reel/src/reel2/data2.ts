import {buildCaptions, KeyTone} from '../data/captions';
import {VO2_WORDS} from './words';
import {SfxCue} from '../data/sfx';
import {TL} from './RestaurantWorld';

export const REEL2_DURATION_SEC = 60.5;

const CHUNKS2: string[] = [
  'Kennst du diese Plastikaufsteller', 'auf Restauranttischen?', 'Neue Angebote?', 'Neu ausdrucken.', 'Austauschen.',
  'Und das an jedem einzelnen Tisch.', 'Das geht smarter.', 'Mit Display IQ werden aus', 'langweiligen Plastikkarten',
  'intelligente digitale Tischdisplays.', 'Bewirb deine aktuellen Rabatte,', 'Tagesangebote oder kommenden Events.',
  'Und ändere alles in Sekunden.', 'Deine Gäste können währenddessen', 'ganz bequem ihr Smartphone',
  'direkt am Display aufladen.', 'Und das Beste?', 'Du steuerst alle Displays zentral.', 'Egal ob zehn Tische',
  'oder zwanzig Restaurants.', 'Ein Dashboard.', 'Volle Kontrolle.', 'Aber damit nicht genug.', 'Warum nicht zusätzlich',
  'Geld verdienen?', 'Zeig zwischendurch Werbung', 'für das Theater nebenan', 'und erschließe dir eine völlig',
  'neue Einnahmequelle.', 'Keine Druckkosten für', 'ständig wechselnde Angebote.', 'Kein mühsames Austauschen.',
  'Dafür mehr Möglichkeiten', 'und neue Umsätze.', 'Display IQ.', 'Mach mehr aus jedem Tisch.',
];
const KW2: Record<string, KeyTone> = {
  plastikaufsteller: 'cyan', ausdrucken: 'cyan', austauschen: 'cyan', smarter: 'cyan', tischdisplays: 'cyan',
  rabatte: 'amber', tagesangebote: 'cyan', events: 'cyan', sekunden: 'cyan', smartphone: 'cyan', aufladen: 'cyan',
  zentral: 'cyan', dashboard: 'cyan', kontrolle: 'cyan', theater: 'amber', geld: 'amber', verdienen: 'amber',
  einnahmequelle: 'amber', umsätze: 'amber', druckkosten: 'amber', möglichkeiten: 'cyan', tisch: 'cyan',
};
export const CAPTIONS2 = buildCaptions(VO2_WORDS, CHUNKS2, KW2);

const c = (name: SfxCue['name'], at: number, vol: number, len: number): SfxCue => ({name, at, vol, len});
const L = {tap: 0.25, whoosh: 0.7, confirm: 1.1, pop: 0.3, crash: 1.6, coin: 1.0, swipe: 0.45, hit: 2.4, shimmer: 1.6} as const;
const cue = (name: SfxCue['name'], at: number, vol: number) => c(name, at, vol, L[name]);

export const SFX2: SfxCue[] = [
  // Kamera / Übergänge
  cue('whoosh', 0.1, 0.5), cue('whoosh', 9.9, 0.5), cue('whoosh', 12.5, 0.45), cue('whoosh', 16.6, 0.45), cue('whoosh', 23.5, 0.45),
  cue('whoosh', 29.7, 0.5), cue('whoosh', 37.9, 0.55), cue('whoosh', 46.3, 0.5), cue('whoosh', 53.9, 0.5),
  // Headlines
  cue('pop', 3.3, 0.5), cue('pop', 9.5, 0.55), cue('pop', 13.6, 0.5), cue('pop', 21.6, 0.5), cue('pop', 24.6, 0.5),
  cue('pop', 32.3, 0.5), cue('pop', 36.3, 0.4), cue('pop', 41.3, 0.5), cue('pop', 44.3, 0.5),
  cue('pop', 46.7, 0.5), cue('pop', 49.6, 0.5), cue('pop', 51.4, 0.5),
  // Drucker + Austausch
  cue('swipe', 3.4, 0.35), cue('swipe', 3.75, 0.35), cue('swipe', 4.1, 0.35), cue('swipe', 4.45, 0.35),
  ...[5.5, 6.4, 7.3, 8.2, 8.9, 9.6].map((t) => cue('pop', t, 0.35)),
  // Verwandlung + Welle
  cue('shimmer', TL.transform - 0.15, 0.7), cue('confirm', TL.transform + 0.3, 0.5),
  ...[0.5, 1.0, 1.5, 2.0, 2.5].map((d) => cue('pop', TL.transform + d, 0.25)),
  // Slides
  cue('swipe', 17.2, 0.4), cue('swipe', 19.3, 0.4), cue('swipe', 20.4, 0.4), cue('swipe', 22.0, 0.4), cue('confirm', 23.1, 0.5),
  // Smartphone laden
  cue('tap', TL.phone + 0.2, 0.7), cue('confirm', TL.phone + 0.6, 0.6), cue('coin', TL.phone + 2.4, 0.3),
  // Dashboard
  cue('pop', 29.9, 0.5), cue('tap', 35.45, 0.75), cue('confirm', 35.95, 0.7), cue('shimmer', 35.9, 0.5),
  // Theater
  cue('shimmer', TL.theaterOn, 0.6), cue('swipe', 42.0, 0.4), cue('coin', 44.3, 0.55), cue('coin', 44.9, 0.5), cue('coin', 45.5, 0.45),
  // Finale
  cue('shimmer', 47.3, 0.45), cue('hit', 54.8, 0.75), cue('pop', 56.1, 0.45), cue('pop', 58.3, 0.45),
];
