# Display IQ – Instagram-Reel (Remotion)

Animierter Produktfilm für **Display IQ**: 9:16, 1080×1920, 30 FPS, H.264, deutsches Voice-over (ElevenLabs),
animierte Untertitel, Musikbett und Soundeffekte. Länge **62 s** (Sprechzeit 60,5 s – das Voice-over wurde
nicht beschleunigt; die Szenenlängen folgen dem tatsächlichen Sprechtext).

**Optik:** isometrisches Diorama der Bowlinghalle von oben (Nacht, Stadt, Straße, Nachbar-Werkstatt),
Headlines in *Anton* links oben, Untertitel mit goldenen *Playfair-Display*-Kursiv-Akzenten, Umsatz-Zähler
oben rechts, Display als Popup. Das Gerät ist dem Produktfoto nachempfunden (8"-Hochkant-Display auf Schrägfuß).

## Befehle

```bash
cd display-iq-reel
npm install
npm run studio                              # Remotion Studio (Live-Vorschau, Scrubbing)
npm run render                              # rendert + Audio-Feinschliff → export/display-iq-reel.mp4
node scripts/stills.mjs 8.6 19 31.6         # Einzelbilder (Sekunden) → out/stills/*.png
node scripts/stills.mjs 0 --id=IsoPreview --name=iso '--props={"t":5,"cam":{"gx":10,"gy":11,"gz":1,"zoom":1.3}}'
node scripts/generate-audio.mjs             # Musik + SFX neu synthetisieren
ELEVENLABS_API_KEY=… node scripts/generate-voiceover.mjs   # Voice-over neu erzeugen (ungetestet)
```

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/DisplayIQ.tsx` | Haupt-Composition: Kamerafahrt (Keyframes), Popups, Headlines, Zähler, Audio |
| `src/iso/` | Isometrie-Engine (SVG) und Diorama: `iso.tsx` (Projektion, Boxen, Wand-/Boden-Aufkleber), `props.tsx` (Möbel, Bäume, Autos, Pins), `World.tsx` (Halle, Bahnen, Lounge, Bar, Werkstatt, Straße, animierte Gäste/Kellner/Strikes/Bon) |
| `src/components/Device.tsx` | Hochkant-Tischdisplay (CSS-3D mit Tiefe) + Popup-Animation aus der Miniatur auf dem Tisch |
| `src/screens/*` | Display-Oberflächen (580×960): Speisekarte mit Touch-Logik, Happy Hour, Event, „Auto Service Müller“, Partner, Willkommen |
| `src/data/voiceover-words.ts` | Wortgenaue Timings des Voice-overs (ElevenLabs Scribe) |
| `src/data/captions.ts` | Untertitel-Phrasen, werden automatisch den Wortzeiten zugeordnet (Build bricht bei Abweichung ab) |
| `src/data/interactions.ts`, `src/data/sfx.ts` | Tap-Zeitpunkte und alle Soundeffekt-Cues, an das Voice-over gekoppelt |
| `public/audio/` | `vo.mp3` (ElevenLabs, normalisiert), `music.mp3`, `sfx/*.wav` |
| `public/fonts/` | Anton, Playfair Display Bold Italic (lokal, via `@fontsource`) |

## Szenenablauf (Sekunden, an Sprechtext ausgerichtet)

1. **Hook 0–10,2** – Überblick über die Halle, Strike, „JEDER TISCH WIRD ZUR UMSATZQUELLE.“ → gestresster Kellner, wartende Gäste → Zoom aufs Tischdisplay, „MEHR UMSATZ. WENIGER WARTEZEIT.“
2. **Bestellung 10,2–22,4** – vier Freunde, Display-Popup, Touch-Bestellung, Bon fliegt zur Bar, Zähler startet, „BESTELLEN. OHNE WARTEN.“
3. **Specials 22,4–33,0** – Strike-Zwischenschnitt, Happy Hour „2 FÜR 1“, „FRIDAY NIGHT BOWLING“, Gast tippt das Angebot, Zähler steigt, „MEHR VERKÄUFE. AUTOMATISCH.“
4. **Werbeeinnahmen 33,0–46,4** – lokale Partner, Schwenk zur Werkstatt „AUTO SERVICE MÜLLER“, Rückfahrt auf alle Tische mit Anzeigen, Euro-Münzen, „NEUE EINNAHMEN DURCH WERBUNG.“
5. **Abschluss 46,4–62** – Nachbestellung, Strike („weiterspielen“), Produkt-Shot mit den drei Vorteilen (in Sprechreihenfolge), Endcard `DISPLAY IQ · Mehr Umsatz. An jedem Tisch. · display-iq.de`

## Hinweise

- Zahlen im Zähler (22,30 €, +17,00 €, 1.200 €) sind **illustrative Platzhalter** – vor Veröffentlichung ersetzen (`src/DisplayIQ.tsx`, `<Counter …>`).
- Events/Uhrzeiten auf den Displays („Fr · 20:00 Uhr · Live-DJ“, „17–19 Uhr“) sind Beispieltexte.
- Musik und SFX sind per Code synthetisiert (`scripts/generate-audio.mjs`) – keine Fremdsamples/Lizenzen.
- Schrift der Oberflächen: **Inter** (systemweit installiert; sonst `@remotion/google-fonts/Inter` einbinden).
- Instagram-Safe-Zone: Headlines/Zähler ab y ≈ 270, Untertitel enden bei y 1470 (≈ 450 px Abstand unten) und bleiben links (x < 940), damit die Reel-Buttons rechts nichts verdecken.
