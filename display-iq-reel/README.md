# Display IQ – Instagram-Reel (Remotion)

Animierter Produktfilm für **Display IQ**: 9:16, 1080×1920, 30 FPS, H.264, deutsches Voice-over (ElevenLabs),
animierte Untertitel, Musikbett und Soundeffekte. Länge **62 s** (Sprechzeit 60,5 s – das Voice-over wurde
nicht beschleunigt; die Szenenlängen folgen dem tatsächlichen Sprechtext).

**Optik:** isometrisches Diorama der Bowlinghalle von oben (warmes Licht, sechs Holzbahnen mit Anzeigetafeln, Tische mit Sitzbank direkt am Bahnende zum Sitzen & Spielen; Nacht, Stadt, Straße, Nachbar-Werkstatt),
Headlines in *Anton* links oben, Untertitel mit goldenen *Playfair-Display*-Kursiv-Akzenten, Umsatz-Zähler
oben rechts, Display als Popup. Das Gerät ist dem Produktfoto nachempfunden (8"-Hochkant-Display auf Schrägfuß).

## Befehle

```bash
cd display-iq-reel
npm install
npm run studio                              # Remotion Studio (Live-Vorschau, Scrubbing)
npm run render                              # Reel 1: rendert + Audio-Feinschliff → export/display-iq-reel.mp4
npm run render:plastic                      # Reel 2 („Schluss mit Plastikaufstellern“) → export/plastic-reel.mp4
npm run render:day                          # Reel 3 („Ein Tag. Vier Angebote.“) → export/day-reel.mp4
node scripts/stills.mjs 8.6 19 31.6         # Einzelbilder (Sekunden) → out/stills/*.png
node scripts/stills.mjs 0 --id=IsoPreview --name=iso '--props={"t":5,"cam":{"gx":10,"gy":11,"gz":1,"zoom":1.3}}'
node scripts/generate-audio.mjs             # Musik (Reel 1 + 2) + SFX neu synthetisieren (Argument: reel1 | reel2)
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

---

# Reel 2 – „Schluss mit Plastikaufstellern“ (`PlasticReel`)

9:16, 1080×1920, 30 FPS, **60,5 s** (Sprechzeit 58,0 s, unbeschleunigt; Stimme Henri, ElevenLabs `eleven_v4`, „IQ“ per IPA-Hilfe englisch).
Isometrisches Restaurant-Diorama (Tische mit transparenten Acryl-L-Aufstellern → schwarze Display-IQ-Geräte, Welle durchs Restaurant),
Stadt mit 20 Restaurants + Dashboard, Theater nebenan als Werbepartner, Finale mit großem Gerät im Vordergrund.

| Pfad | Inhalt |
| --- | --- |
| `src/reel2/Reel2.tsx` | Haupt-Composition: Kamera-Keyframes, Popups, Headlines, Audio |
| `src/reel2/RestaurantWorld.tsx` | Restaurant, Stadtblöcke, Gäste/Personal, Druck- und Tauschablauf, Transformationswelle, Hub-/Werbe-Datenlinien (`TL` = Zeitplan) |
| `src/reel2/props2.tsx` | Acryl-Aufsteller, Display-Gerät, Verwandlung, Drucker, Papierstapel, Theater, Mini-Restaurants, Datenlinien |
| `src/reel2/Screens2.tsx`, `Extras2.tsx` | Display-Inhalte (Happy Hour 20→30 %, Pasta, Live-Musik, Theater), Ladeanzeige am Smartphone, Dashboard, Einnahmegrafik |
| `src/reel2/words.ts`, `data2.ts` | Wortzeiten (ElevenLabs Scribe), Untertitel, SFX-Cues |

## Hinweise zu Reel 2

- **Technik:** wie Reel 1 mit der eigenen isometrischen **SVG-Engine** (React/Remotion), nicht mit React Three Fiber / Three.js – bewusst, damit der Stil mit dem freigegebenen Reel 1 identisch bleibt. Alle Bewegungen (Kamera, Personen, Geräte, Verwandlung) sind echt animiert.
- **Laden:** Das Smartphone lädt **per Kabel** am Anschluss am Gerätefuß (kein kabelloses Laden dargestellt).
- Zahlen im Dashboard (20 Standorte, 186 Displays) und in der Einnahmegrafik (+1.840 € pro Monat) sind **Platzhalter**.
- Musik/SFX synthetisiert (`scripts/generate-audio.mjs reel2`, `public/audio/music2.mp3`).

---

# Reel 3 – „Ein Tag. Vier Angebote.“ (`DayReel`)

9:16, 1080×1920, 30 FPS, deutsches Voice-over (Henri, ElevenLabs, „IQ“ englisch). Ein einziges isometrisches Restaurant durchläuft im Zeitraffer einen ganzen Tag:
Uhr oben rechts, Tageslicht/Sonnenschächte/goldene Stunde/Neon-Abend, Gäste und Speisen wechseln, das Tischdisplay (und ein großes schwebendes Abbild) zeigt je Tageszeit Frühstück → Lunch → Kaffee & Kuchen → Happy Hour.
Die Kamera bleibt auf dem Tisch mit dem Hero-Display; nur in der Zeitplan-Szene fährt sie auf die Stadt (Dashboard „Zeitplan aktivieren“, 20 Standorte synchron).

| Pfad | Inhalt |
| --- | --- |
| `src/reel3/Reel3.tsx` | Haupt-Composition (Kamera, Popup, Uhr, Headlines, Endcard mit echtem Logo) |
| `src/reel3/timeline.ts` | **Alle Zeitpunkte hängen an Wortzeiten** (`T3`), dazu Uhrzeit-Funktion `hourAt(t)`, Tageslicht/Neon/Sonne |
| `src/reel3/DayWorld.tsx` | Restaurant im Tageslauf: Himmel, Fenster, Lichtschächte, Neon, Gäste/Speisen je Tageszeit, Kellner mit Pasta, hereinkommende Gäste, Stadt + Standort-Sync |
| `src/reel3/props3.tsx`, `Screens3.tsx`, `Extras3.tsx` | Tischdeko, Display-Inhalte, Uhr, Tagesplan-Dashboard |
| `src/reel3/words.ts`, `data3.ts` | Wortzeiten (ElevenLabs Scribe), Untertitel, SFX |
| `public/brand/logo.jpg` | Display-IQ-Logo (vom Kunden geliefert) |

**Neues Voice-over einspielen:** `public/audio/vo3.mp3` ersetzen → Scribe-Zeiten in `src/reel3/words.ts` eintragen (Format `[Text, Start, Ende]`, „/aɪ ˈkjuː/“ zu „IQ“ zusammenfassen) → `node scripts/generate-audio.mjs reel3` → `npm run render:day`.

## Hinweise zu Reel 3

- **Technik:** wieder die eigene isometrische SVG-Engine (React/Remotion) statt React Three Fiber/Three.js, damit der Look zu Reel 1/2 passt.
- **Produktfunktion:** Die zeitgesteuerte Ausspielung („Zeitplan aktivieren“) ist wie im Briefing dargestellt – **vor Veröffentlichung prüfen, ob Display IQ diese Funktion tatsächlich anbietet**. Uhrzeiten, Preise (9,90 € / 12,90 € / 7,90 € / 2 für 1) und „20 Standorte“ sind illustrative Platzhalter.
- Musik und SFX sind synthetisiert (`scripts/generate-audio.mjs reel3`).

- **Stand:** `public/audio/vo3.mp3` ist aktuell eine **stumme Platzhalter-Datei** (ElevenLabs-Rate-Limit), `music3.mp3` basiert auf geschätzten Wortzeiten. `export/day-reel-vorschau-ohne-sprecher.mp4` ist nur eine Bild-Vorschau. Nach dem Einspielen des echten Voice-overs (siehe oben) neu erzeugen.
