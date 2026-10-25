/** Wortzeiten Reel 3 – GESCHÄTZT (Silbengewichtung), bis ElevenLabs Scribe die echten Zeiten liefert. [Text, Start, Ende] in Sekunden. */
export type RawWord = readonly [text: string, start: number, end: number];
export const VO3_WORDS: readonly RawWord[] = [
  ['Morgens', 0.1, 0.43], ['Kaffee.', 0.51, 0.84], ['Mittags', 1.24, 1.57], ['Lunch.', 1.65, 1.84],
  ['Abends', 2.24, 2.57], ['Cocktails.', 2.65, 2.98], ['Warum', 3.38, 3.71], ['zeigt', 3.79, 3.99],
  ['dein', 4.07, 4.27], ['Restaurant', 4.35, 4.81], ['eigentlich', 4.89, 5.36], ['den', 5.44, 5.63],
  ['ganzen', 5.71, 6.04], ['Tag', 6.12, 6.32], ['dieselbe', 6.4, 6.86], ['Werbung?', 6.94, 7.27],
  ['Mit', 7.8, 8], ['Display', 8.08, 8.41], ['IQ', 8.49, 8.82], ['passt', 8.9, 9.09],
  ['sich', 9.17, 9.37], ['deine', 9.45, 9.78], ['Tischwerbung', 9.86, 10.32], ['automatisch', 10.4, 11],
  ['der', 11.08, 11.28], ['Tageszeit', 11.36, 11.82], ['an.', 11.9, 12.1], ['Um', 12.5, 12.69],
  ['neun', 12.77, 12.97], ['Uhr', 13.05, 13.24], ['erscheint', 13.32, 13.65], ['dein', 13.73, 13.93],
  ['Frühstücksangebot.', 14.01, 14.74], ['Mittags', 15.14, 15.47], ['bewirbst', 15.55, 15.88], ['du', 15.96, 16.16],
  ['dein', 16.24, 16.43], ['Lunch-Special.', 16.51, 16.98], ['Nachmittags', 17.38, 17.84], ['gibt\'s', 17.92, 18.12],
  ['Kaffee', 18.2, 18.53], ['und', 18.61, 18.8], ['Kuchen.', 18.88, 19.21], ['Und', 19.61, 19.81],
  ['abends?', 19.89, 20.22], ['Happy', 20.75, 21.08], ['Hour!', 21.16, 21.35], ['Alles', 21.75, 22.08],
  ['einmal', 22.16, 22.49], ['planen.', 22.57, 22.9], ['Danach', 23.3, 23.63], ['wechseln', 23.71, 24.04],
  ['deine', 24.12, 24.45], ['Angebote', 24.53, 25.13], ['automatisch', 25.21, 25.81], ['auf', 25.89, 26.09],
  ['allen', 26.16, 26.5], ['Displays,', 26.57, 26.91], ['in', 26.98, 27.18], ['allen', 27.26, 27.59],
  ['deinen', 27.67, 28], ['Restaurants.', 28.08, 28.54], ['Kein', 28.95, 29.14], ['Neudrucken.', 29.22, 29.68],
  ['Kein', 30.09, 30.28], ['Austauschen.', 30.36, 30.82], ['Kein', 31.23, 31.42], ['zusätzlicher', 31.5, 32.1],
  ['Aufwand.', 32.18, 32.51], ['Display', 32.91, 33.24], ['IQ.', 33.32, 33.51], ['Die', 33.91, 34.11],
  ['richtige', 34.19, 34.65], ['Werbung.', 34.73, 35.06], ['Zur', 35.46, 35.66], ['richtigen', 35.74, 36.2],
  ['Zeit.', 36.28, 36.48], ['Direkt', 36.88, 37.21], ['am', 37.29, 37.48], ['Tisch.', 37.56, 37.76],
];
