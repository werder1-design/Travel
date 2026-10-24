#!/usr/bin/env node
/**
 * Erzeugt das Voice-over neu über die ElevenLabs-API (inkl. Wort-Timestamps).
 *   ELEVENLABS_API_KEY=... node scripts/generate-voiceover.mjs
 * Das vorliegende Voice-over wurde mit Stimme "Henri – Professional German Voice"
 * (voice_id PgDR8pfZXGiB1HsizOuW, Modell eleven_v4) erzeugt.
 * Hinweis: Dieses Skript wurde nicht gegen die API getestet; das Voice-over im Projekt stammt aus dem
 * ElevenLabs-Connector. Nach Neugenerierung müssen src/data/voiceover-words.ts (Timings) und ggf. die
 * Cues in src/data/interactions.ts, src/data/sfx.ts und src/DisplayIQ.tsx angepasst werden.
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error('ELEVENLABS_API_KEY fehlt');
const VOICE = process.env.ELEVENLABS_VOICE_ID ?? 'PgDR8pfZXGiB1HsizOuW';
const MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_v4';

const text = `Display IQ – Jeder Tisch wird zur Umsatzquelle.

Dein Servicepersonal kann nicht überall gleichzeitig sein. Dein digitales Tischdisplay schon.

Vier Freunde verbringen einen Abend auf der Bowlingbahn. Direkt am Tisch entdecken sie die digitale Speisekarte und bestellen Getränke und Snacks. Ganz einfach per Fingertipp. Ohne Wartezeit.

Während sie bowlen, zeigt das Display automatisch aktuelle Angebote, Happy-Hour-Specials und kommende Events. So entstehen zusätzliche Bestellungen – ganz nebenbei.

Doch das ist noch nicht alles.

Auch lokale Unternehmen können auf den Displays werben. Zum Beispiel die Autowerkstatt nebenan.

So wird aus jedem Tisch eine zusätzliche Werbefläche und aus Werbung eine neue Einnahmequelle.

Noch eine Runde Getränke? Einfach auswählen, bestellen und weiterspielen.

Weniger Aufwand für dein Personal. Mehr Bestellungen. Zusätzliche Werbeeinnahmen.

Display IQ – Mehr Umsatz. An jedem Tisch.`;

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: MODEL, language_code: 'de'}),
});
if (!res.ok) throw new Error(`ElevenLabs: ${res.status} ${await res.text()}`);
const json = await res.json();
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(out, {recursive: true});
writeFileSync(join(out, 'vo_raw.mp3'), Buffer.from(json.audio_base64, 'base64'));
writeFileSync(join(out, 'vo_alignment.json'), JSON.stringify(json.alignment, null, 2));
console.log('Gespeichert: vo_raw.mp3 + vo_alignment.json. Danach normalisieren:');
console.log('ffmpeg -i public/audio/vo_raw.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 1 -b:a 192k public/audio/vo.mp3');
