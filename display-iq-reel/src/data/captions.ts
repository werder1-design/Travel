import {VOICEOVER_WORDS} from './voiceover-words';

export type KeyTone = 'cyan' | 'amber';
export type CapWord = {text: string; start: number; end: number; tone?: KeyTone};
export type CapChunk = {words: CapWord[]; start: number; end: number};

/** Untertitel-Phrasen (max. 2 Zeilen). Wörter werden der Reihe nach den Voice-over-Timings zugeordnet. */
const CHUNKS: string[] = [
  'Display IQ – Jeder Tisch',
  'wird zur Umsatzquelle.',
  'Dein Servicepersonal kann',
  'nicht überall gleichzeitig sein.',
  'Dein digitales Tischdisplay schon.',
  'Vier Freunde verbringen einen',
  'Abend auf der Bowlingbahn.',
  'Direkt am Tisch entdecken sie',
  'die digitale Speisekarte',
  'und bestellen Getränke und Snacks.',
  'Ganz einfach per Fingertipp.',
  'Ohne Wartezeit.',
  'Während sie bowlen, zeigt das Display',
  'automatisch aktuelle Angebote,',
  'Happy-Hour-Specials und kommende Events.',
  'So entstehen zusätzliche Bestellungen –',
  'ganz nebenbei.',
  'Doch das ist noch nicht alles.',
  'Auch lokale Unternehmen können',
  'auf den Displays werben.',
  'Zum Beispiel die Autowerkstatt nebenan.',
  'So wird aus jedem Tisch',
  'eine zusätzliche Werbefläche',
  'und aus Werbung eine neue Einnahmequelle.',
  'Noch eine Runde Getränke?',
  'Einfach auswählen, bestellen',
  'und weiterspielen.',
  'Weniger Aufwand für dein Personal.',
  'Mehr Bestellungen.',
  'Zusätzliche Werbeeinnahmen.',
  'Display IQ – Mehr Umsatz.',
  'An jedem Tisch.',
];

const KEYWORDS: Record<string, KeyTone> = {
  umsatzquelle: 'amber', umsatz: 'amber', einnahmequelle: 'amber', werbeeinnahmen: 'amber',
  werbung: 'amber', werbefläche: 'amber', werben: 'amber', autowerkstatt: 'amber',
  servicepersonal: 'cyan', tischdisplay: 'cyan', speisekarte: 'cyan', fingertipp: 'cyan',
  wartezeit: 'cyan', angebote: 'cyan', 'happy-hour-specials': 'cyan', events: 'cyan',
  bestellungen: 'cyan', getränke: 'cyan', snacks: 'cyan', weiterspielen: 'cyan',
  lokale: 'cyan', aufwand: 'cyan',
};

const norm = (s: string) => s.toLowerCase().replace(/[.,?!–:]/g, '');

// Mehrfach-Tokens "–" an das vorherige Wort hängen.
const merged: {text: string; start: number; end: number}[] = [];
for (const [text, start, end] of VOICEOVER_WORDS) {
  if (text === '–' && merged.length) {
    merged[merged.length - 1].text += ' –';
  } else {
    merged.push({text, start, end});
  }
}

export const CAPTIONS: CapChunk[] = (() => {
  let wi = 0;
  const chunks: CapChunk[] = [];
  for (const chunk of CHUNKS) {
    const tokens = chunk.split(' ').filter((t) => t !== '–');
    const words: CapWord[] = [];
    for (const tok of tokens) {
      const w = merged[wi++];
      if (!w || norm(w.text.replace(' –', '')) !== norm(tok)) {
        throw new Error(`Untertitel/Voice-over passen nicht zusammen bei "${tok}" (Wort ${wi}: "${w?.text}")`);
      }
      const dash = chunk.includes(`${tok} –`) ? ' –' : '';
      words.push({text: tok + dash, start: w.start, end: w.end, tone: KEYWORDS[norm(tok)]});
    }
    chunks.push({words, start: words[0].start, end: words[words.length - 1].end});
  }
  if (wi !== merged.length) throw new Error(`Nicht alle Voice-over-Wörter in Untertiteln verwendet (${wi}/${merged.length})`);
  // Hold-Zeiten: kurz vor dem ersten Wort ein-, kurz nach dem letzten ausblenden, ohne Überlappung.
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.start = Math.max(0, c.start - 0.05);
    c.end = Math.min(c.end + 0.22, next ? next.words[0].start - 0.03 : c.end + 0.5);
  });
  return chunks;
})();
