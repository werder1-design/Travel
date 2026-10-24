/**
 * Wortgenaue Timings des ElevenLabs-Voice-overs (Scribe, Sekunden).
 * Format: [Text, Start, Ende]. Quelle: public/audio/vo.mp3
 */
export type RawWord = readonly [text: string, start: number, end: number];

export const VOICEOVER_WORDS: readonly RawWord[] = [
  ['Display', 0, 0.446], ['IQ', 0.48, 0.88], ['–', 1.6, 1.64], ['Jeder', 1.68, 1.92], ['Tisch', 2, 2.32],
  ['wird', 2.4, 2.56], ['zur', 2.64, 2.72], ['Umsatzquelle.', 2.88, 4.04],
  ['Dein', 4.4, 4.56], ['Servicepersonal', 4.64, 5.52], ['kann', 5.6, 5.76], ['nicht', 5.84, 6.08],
  ['überall', 6.16, 6.48], ['gleichzeitig', 6.56, 7.2], ['sein.', 7.28, 7.76],
  ['Dein', 7.92, 8.08], ['digitales', 8.16, 8.72], ['Tischdisplay', 8.8, 9.44], ['schon.', 9.52, 9.92],
  ['Vier', 10.56, 10.72], ['Freunde', 10.8, 11.2], ['verbringen', 11.28, 11.68], ['einen', 11.72, 11.92],
  ['Abend', 12, 12.32], ['auf', 12.4, 12.48], ['der', 12.52, 12.56], ['Bowlingbahn.', 12.64, 13.52],
  ['Direkt', 13.68, 14.08], ['am', 14.12, 14.16], ['Tisch', 14.32, 14.56], ['entdecken', 14.64, 15],
  ['sie', 15.04, 15.2], ['die', 15.28, 15.36], ['digitale', 15.44, 15.92], ['Speisekarte', 16, 16.8],
  ['und', 17.12, 17.2], ['bestellen', 17.28, 17.68], ['Getränke', 17.76, 18.24], ['und', 18.32, 18.4],
  ['Snacks.', 18.48, 19.04], ['Ganz', 19.2, 19.44], ['einfach', 19.52, 19.84], ['per', 20, 20.08],
  ['Fingertipp.', 20.16, 20.88], ['Ohne', 21.04, 21.28], ['Wartezeit.', 21.36, 22.28],
  ['Während', 22.48, 22.8], ['sie', 22.88, 22.96], ['bowlen,', 23.08, 23.547], ['zeigt', 23.653, 23.76],
  ['das', 23.84, 23.92], ['Display', 24.16, 24.4], ['automatisch', 24.48, 25.2], ['aktuelle', 25.28, 25.76],
  ['Angebote,', 25.84, 26.64], ['Happy-Hour-Specials', 26.8, 27.84], ['und', 27.92, 28.08],
  ['kommende', 28.16, 28.48], ['Events.', 28.56, 29.24], ['So', 29.44, 29.6], ['entstehen', 29.68, 30.16],
  ['zusätzliche', 30.2, 30.8], ['Bestellungen', 30.88, 31.44], ['–', 31.68, 31.72], ['ganz', 31.76, 32],
  ['nebenbei.', 32.08, 32.64],
  ['Doch', 33.04, 33.2], ['das', 33.28, 33.52], ['ist', 33.6, 33.68], ['noch', 33.76, 33.84],
  ['nicht', 33.92, 34.08], ['alles.', 34.16, 34.72],
  ['Auch', 34.88, 35.04], ['lokale', 35.16, 35.52], ['Unternehmen', 35.6, 36.08], ['können', 36.16, 36.4],
  ['auf', 36.48, 36.56], ['den', 36.64, 36.72], ['Displays', 36.8, 37.2], ['werben.', 37.28, 37.76],
  ['Zum', 37.92, 38], ['Beispiel', 38.08, 38.48], ['die', 38.56, 38.64], ['Autowerkstatt', 38.72, 39.52],
  ['nebenan.', 39.56, 40.2], ['So', 40.4, 40.56], ['wird', 40.6, 40.8], ['aus', 40.92, 41.04],
  ['jedem', 41.08, 41.36], ['Tisch', 41.44, 41.68], ['eine', 41.76, 42], ['zusätzliche', 42.08, 42.64],
  ['Werbefläche', 42.72, 43.36], ['und', 43.6, 43.76], ['aus', 43.88, 44], ['Werbung', 44.04, 44.48],
  ['eine', 44.64, 44.8], ['neue', 44.88, 45.12], ['Einnahmequelle.', 45.2, 46.2],
  ['Noch', 46.4, 46.56], ['eine', 46.6, 46.72], ['Runde', 46.8, 46.96], ['Getränke?', 47.04, 47.72],
  ['Einfach', 47.92, 48.24], ['auswählen,', 48.32, 48.96], ['bestellen', 49.04, 49.6], ['und', 49.76, 49.92],
  ['weiterspielen.', 50.04, 50.88], ['Weniger', 51.12, 51.52], ['Aufwand', 51.6, 52], ['für', 52.08, 52.16],
  ['dein', 52.24, 52.4], ['Personal.', 52.48, 53.24], ['Mehr', 53.44, 53.6], ['Bestellungen.', 53.72, 54.56],
  ['Zusätzliche', 54.6, 55.28], ['Werbeeinnahmen.', 55.36, 56.56], ['Display', 56.8, 57.04],
  ['IQ', 57.2, 57.68], ['–', 58.08, 58.107], ['Mehr', 58.133, 58.32], ['Umsatz.', 58.4, 59.2],
  ['An', 59.32, 59.44], ['jedem', 59.52, 59.76], ['Tisch.', 59.92, 60.48],
];
