# Display IQ – Instagram-Reel (Remotion)

Animierter Produktfilm für **Display IQ**: 9:16, 1080×1920, 30 FPS, H.264, deutsches Voice-over (ElevenLabs),
animierte Untertitel, Musikbett und Soundeffekte. Länge **62 s** (Sprechzeit 60,5 s – das Voice-over wurde
nicht beschleunigt; die Szenenlängen folgen dem tatsächlichen Sprechtext).

## Befehle

```bash
cd display-iq-reel
npm install
npm run studio            # Remotion Studio (Live-Vorschau, Scrubbing)
npm run render            # → out/display-iq-reel.mp4 (H.264, CRF 18, AAC)
node scripts/stills.mjs 8.6 19 31.6   # Einzelbilder (Sekunden) → out/stills/*.png
node scripts/generate-audio.mjs       # Musik + SFX neu synthetisieren
ELEVENLABS_API_KEY=… node scripts/generate-voiceover.mjs   # Voice-over neu erzeugen (ungetestet)
```

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/DisplayIQ.tsx` | Haupt-Composition: Schnitte, Headlines, Umsatzkarten, Audio |
| `src/data/voiceover-words.ts` | Wortgenaue Timings des Voice-overs (ElevenLabs Scribe) |
| `src/data/captions.ts` | Untertitel-Phrasen, werden automatisch den Wortzeiten zugeordnet (Build bricht bei Abweichung ab) |
| `src/data/interactions.ts`, `src/data/sfx.ts` | Tap-Zeitpunkte und alle Soundeffekt-Cues, an das Voice-over gekoppelt |
| `src/camera.ts`, `src/camPath.ts` | Gemeinsames Kameramodell (SVG-Projektion **und** CSS-3D) + Keyframe-Kamerafahrten |
| `src/components/TableDisplay.tsx` | Wiederverwendbare Display-Hardware (flach, leicht angewinkelt, Glow) |
| `src/screens/*` | Display-Oberflächen: Speisekarte mit Touch-Logik, Happy Hour, Event, Anzeige „Auto Service Müller“, Partner-Übersicht, Willkommen |
| `src/components/Alley.tsx` | Perspektivisch projizierte Neon-Bowlinghalle inkl. Ball, Pins, Strike |
| `src/components/Lounge.tsx`, `Grid.tsx`, `Crowd.tsx`, `Finale.tsx` | Szenenwelten: Lounge mit vier Freunden, Tisch-Raster (Pull-back), gestresster Kellner, Produkt-Shot + Endcard |
| `public/audio/` | `vo.mp3` (ElevenLabs, normalisiert), `music.mp3`, `sfx/*.wav` |

## Szenenablauf (Sekunden, an Sprechtext ausgerichtet)

1. **Hook 0–10,2** – Kamerafahrt durch die Bowlinghalle, Strike → gestresster Kellner & wartende Gäste → Zoom aufs Display, „MEHR UMSATZ. WENIGER WARTEZEIT.“
2. **Bestellung 10,2–22,4** – vier Freunde am Tisch, Kamera fährt aufs Display, Touch-Bestellung, „BESTELLEN. OHNE WARTEN.“
3. **Specials 22,4–33,0** – Strike-Cutaway, Display wechselt in den Werbemodus (Happy Hour 2 für 1, Friday Night Bowling), Gast tippt Angebot, Umsatzgrafik, „MEHR VERKÄUFE. AUTOMATISCH.“
4. **Werbeeinnahmen 33,0–46,4** – lokale Partner, „AUTO SERVICE MÜLLER“, Pull-back auf viele Tische, Euro-Münzen, „NEUE EINNAHMEN DURCH WERBUNG.“
5. **Abschluss 46,4–62** – letzte Bestellung, Produkt-Shot mit den drei Vorteilen (in Sprechreihenfolge), Endcard `DISPLAY IQ · Mehr Umsatz. An jedem Tisch. · display-iq.de`

## Hinweise

- Zahlen in den Umsatzkarten (+248 €, +1.200 €) sind **illustrative Platzhalter** – vor Veröffentlichung durch echte Werte ersetzen oder entfernen (`src/DisplayIQ.tsx`).
- Events/Uhrzeiten auf den Displays („Fr · 20:00 Uhr · Live-DJ“, „17–19 Uhr“) sind Beispieltexte.
- Musik und SFX sind per Code synthetisiert (`scripts/generate-audio.mjs`) – keine Fremdsamples/Lizenzen.
- Schrift: **Inter** (systemweit installiert; für andere Umgebungen `@remotion/google-fonts/Inter` einbinden).
- Instagram-Safe-Zone: Headlines liegen bei y 300–520, Display im Bereich y 560–1250, Untertitel enden bei y 1470 (≈ 450 px Abstand zum unteren Rand).
