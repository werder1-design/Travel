#!/usr/bin/env node
// Notfall-Schätzung der Wortzeiten (Silbengewichtung), falls Scribe nicht verfügbar ist. Ausgabe: src/reel3/words.ts
import {writeFileSync} from 'node:fs';
const SENT = [
  'Morgens Kaffee.', 'Mittags Lunch.', 'Abends Cocktails.',
  'Warum zeigt dein Restaurant eigentlich den ganzen Tag dieselbe Werbung?',
  'Mit Display IQ passt sich deine Tischwerbung automatisch der Tageszeit an.',
  'Um neun Uhr erscheint dein Frühstücksangebot.', 'Mittags bewirbst du dein Lunch-Special.', "Nachmittags gibt's Kaffee und Kuchen.", 'Und abends?', 'Happy Hour!',
  'Alles einmal planen.', 'Danach wechseln deine Angebote automatisch – auf allen Displays, in allen deinen Restaurants.',
  'Kein Neudrucken.', 'Kein Austauschen.', 'Kein zusätzlicher Aufwand.',
  'Display IQ.', 'Die richtige Werbung.', 'Zur richtigen Zeit.', 'Direkt am Tisch.',
];
const syl = (w) => Math.max(1, (w.toLowerCase().match(/[aeiouäöüy]+/g) ?? ['a']).length) + (w === 'IQ' ? 1 : 0);
let t = 0.1;
const out = [];
for (const s of SENT) {
  const ws = s.split(' ').filter((w) => w !== '–');
  for (const w of ws) {
    const d = 0.1 + syl(w) * 0.135;
    out.push([w, +t.toFixed(2), +(t + d - 0.04).toFixed(2)]);
    t += d + 0.04;
  }
  t += s.endsWith('?') ? 0.45 : 0.32;
}
const rows = out.map(([w, a, b]) => `['${w.replace(/'/g, "\\'")}', ${a}, ${b}]`);
const lines = [];
for (let i = 0; i < rows.length; i += 4) lines.push('  ' + rows.slice(i, i + 4).join(', ') + ',');
writeFileSync('src/reel3/words.ts', `/** Wortzeiten Reel 3 – GESCHÄTZT (Silbengewichtung), bis ElevenLabs Scribe die echten Zeiten liefert. [Text, Start, Ende] in Sekunden. */
export type RawWord = readonly [text: string, start: number, end: number];
export const VO3_WORDS: readonly RawWord[] = [
${lines.join('\n')}
];
`);
console.log('Wörter:', out.length, 'Ende', t.toFixed(1));
