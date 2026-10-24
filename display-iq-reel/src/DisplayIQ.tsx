import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS} from './theme';
import {prog, SOFT} from './ease';
import {focus, keyIso} from './camPath';
import {IsoWorld, TABLES, worldToScreen} from './iso/World';
import {Fonts} from './components/Fonts';
import {DevicePopup} from './components/Device';
import {TouchLayer} from './components/TouchHand';
import {Headline} from './components/Headline';
import {Counter} from './components/Counter';
import {EuroBurst} from './components/Money';
import {BrandChip, StrikeText, Vignette, Whip} from './components/Overlays';
import {EndCard, PRODUCT_IN, PRODUCT_OUT, ProductShot} from './components/Finale';
import {Subtitles} from './components/Subtitles';
import {MENU1_TAPS, MENU2_TAPS, HAPPY_TAP_AT} from './data/interactions';
import {MenuScreen, menuTarget} from './screens/MenuScreen';
import {AdScreen, EventScreen, HappyHourScreen, HAPPY_CTA, PartnersScreen, ScreenSwitch, WelcomeScreen} from './screens/PromoScreens';
import {AudioTracks} from './AudioTracks';

/** Schnitt-Zeitpunkte (s) – jeweils mit Neon-Wisch überdeckt. */
export const CUTS = [4.2, 22.4, 24.2, 46.4, 50.3, 56.5];

const T1 = TABLES[0];
const F = focus;
const CAM_KEYS = [
  [0.0, F(11, 7.5, 0.8, 0.66, 540, 1000)],
  [1.9, F(8.0, 5.6, 0.6, 0.9, 540, 960)],
  [2.9, F(5.6, 4.6, 0.5, 1.05, 540, 900)],
  [4.15, F(5.6, 4.6, 0.5, 1.12, 540, 900)],
  [4.22, F(10.8, 11.8, 0.9, 1.1, 540, 900)],
  [7.6, F(10.4, 11.4, 0.9, 1.3, 540, 900)],
  [8.8, F(T1.x, T1.y, 0.9, 2.7, 540, 880)],
  [9.9, F(T1.x, T1.y, 0.9, 1.5, 770, 900)],
  [20.4, F(T1.x, T1.y, 0.9, 1.56, 770, 900)],
  [22.2, F(2.2, 11.5, 1.2, 1.5, 720, 900)],
  [22.39, F(2.2, 11.5, 1.2, 1.5, 720, 900)],
  [22.41, F(5.2, 3.4, 0.5, 1.35, 540, 900)],
  [24.19, F(4.6, 3.4, 0.5, 1.5, 540, 900)],
  [24.21, F(T1.x, T1.y, 0.9, 1.5, 770, 900)],
  [33.0, F(T1.x, T1.y, 0.9, 1.62, 770, 900)],
  [34.3, F(T1.x, T1.y, 0.9, 1.25, 700, 900)],
  [37.9, F(36.5, 6.5, 1.2, 0.86, 790, 900)],
  [40.4, F(36.5, 6.5, 1.2, 0.95, 790, 900)],
  [43.4, F(13, 8, 1.0, 0.6, 540, 1010)],
  [46.38, F(13, 8, 1.0, 0.66, 540, 1010)],
  [46.42, F(T1.x, T1.y, 0.9, 1.5, 770, 900)],
  [50.28, F(T1.x, T1.y, 0.9, 1.56, 770, 900)],
  [50.32, F(5.8, 6.3, 0.5, 1.3, 540, 900)],
  [51.0, F(5.0, 6.3, 0.5, 1.4, 540, 900)],
  [51.2, F(9, 5.5, 0.8, 1.0, 540, 940)],
  [56.5, F(9, 5.5, 0.8, 0.8, 540, 940)],
] as const;

const SPLIT = (t: number, a: number, b: number) => t >= a && t < b;

export const DisplayIQ: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = keyIso(t, CAM_KEYS);
  const tiny = worldToScreen(T1.x, T1.y, 1.3, cam);

  const handMenu1 = MENU1_TAPS.map((x) => ({...menuTarget(x.id), at: x.at}));
  const handMenu2 = MENU2_TAPS.map((x) => ({...menuTarget(x.id), at: x.at}));
  const handHappy = [{...HAPPY_CTA, at: HAPPY_TAP_AT}];

  const productT = prog(frame, PRODUCT_IN, 0.8, SOFT);
  const bgDim = SPLIT(t, PRODUCT_IN - 0.1, PRODUCT_OUT) ? 0.45 * productT : 0;
  const bgBlur = SPLIT(t, PRODUCT_IN - 0.1, PRODUCT_OUT) ? 6 * productT : 0;

  // Münzen aus den Tischen im Überblick
  const overviewCam = keyIso(44.5, CAM_KEYS);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Fonts />
      {t < PRODUCT_OUT + 0.1 && <IsoWorld t={t} cam={cam} dim={bgDim} blur={bgBlur} />}
      <Vignette />

      {/* Verbindungsstrahl Tisch → Popup */}
      {[[8.8, 22.2], [24.35, 40.4], [46.55, 50.2]].map(([a, b], i) => {
        if (t < a || t > b + 0.4) return null;
        const k = Math.min(prog(frame, a, 0.65), 1 - prog(frame, b, 0.42));
        if (tiny.x < -200 || tiny.x > 1300) return null;
        return (
          <svg key={i} width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
            <defs>
              <linearGradient id={`beam${i}`} x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#2dd4ff" stopOpacity="0" />
                <stop offset="1" stopColor="#2dd4ff" stopOpacity="0.38" />
              </linearGradient>
            </defs>
            <polygon points={`${tiny.x - 6},${tiny.y - 10} ${tiny.x + 6},${tiny.y + 10} 520,1000 520,620`} fill={`url(#beam${i})`} opacity={k * 0.55} />
          </svg>
        );
      })}

      {/* Display-Popups */}
      <DevicePopup frame={frame} inAt={8.8} outAt={22.2} origin={tiny} overlay={<TouchLayer taps={handMenu1} sec={t} />}>
        <ScreenSwitch sec={t} items={[
          {from: 0, render: (s) => <WelcomeScreen sec={s} appearAt={8.8} />},
          {from: 14.45, render: (s) => <MenuScreen sec={s} appearAt={14.45} taps={MENU1_TAPS} />},
        ]} />
      </DevicePopup>
      <DevicePopup frame={frame} inAt={24.35} outAt={40.4} origin={tiny} overlay={<TouchLayer taps={handHappy} sec={t} />}>
        <ScreenSwitch sec={t} items={[
          {from: 0, render: (s) => <MenuScreen sec={s} appearAt={22.0} />},
          {from: 25.3, render: (s) => <HappyHourScreen sec={s} appearAt={25.3} />},
          {from: 28.1, render: (s) => <EventScreen sec={s} appearAt={28.1} />},
          {from: 29.8, render: (s) => <HappyHourScreen sec={s} appearAt={29.8} tapAt={HAPPY_TAP_AT} />},
          {from: 33.6, render: (s) => <PartnersScreen sec={s} appearAt={33.6} highlightAt={37.6} />},
          {from: 38.1, render: (s) => <AdScreen sec={s} appearAt={38.1} />},
        ]} />
      </DevicePopup>
      <DevicePopup frame={frame} inAt={46.55} outAt={50.2} origin={tiny} overlay={<TouchLayer taps={handMenu2} sec={t} />}>
        <MenuScreen sec={t} appearAt={46.4} taps={MENU2_TAPS} />
      </DevicePopup>

      {t >= PRODUCT_IN && t < PRODUCT_OUT + 0.1 && <ProductShot frame={frame} />}
      {t >= PRODUCT_OUT && <EndCard frame={frame} from={PRODUCT_OUT} />}

      {/* Szene 1 */}
      <BrandChip frame={frame} at={0.2} until={4.0} />
      <Headline frame={frame} at={0.1} until={4.0} lines={[{text: 'Jeder Tisch'}, {text: 'wird zur'}, {text: 'Umsatzquelle.', gold: true}]} />
      <StrikeText frame={frame} at={2.95} until={3.7} />
      <Headline frame={frame} at={8.0} until={10.1} lines={[{text: 'Mehr Umsatz.'}, {text: 'Weniger'}, {text: 'Wartezeit.', gold: true}]} />
      {/* Szene 2 */}
      <Headline frame={frame} at={19.3} until={22.2} size={100} lines={[{text: 'Bestellen.'}, {text: 'Ohne Warten.', gold: true}]} />
      {/* Szene 3 */}
      <StrikeText frame={frame} at={23.55} until={24.15} />
      <Headline frame={frame} at={29.6} until={32.9} size={100} lines={[{text: 'Mehr'}, {text: 'Verkäufe.'}, {text: 'Automatisch.', gold: true}]} />
      {/* Szene 4 */}
      <Headline frame={frame} at={43.6} until={46.3} size={100} lines={[{text: 'Neue'}, {text: 'Einnahmen'}, {text: 'durch'}, {text: 'Werbung.', gold: true}]} />

      {/* Umsatz-Zähler (oben rechts) */}
      <Counter frame={frame} label="TISCH 7" from={20.4} to={33.0} events={[
        {at: 20.45, amount: 22.3, chip: 'Bestellung gesendet'},
        {at: 25.3, amount: 0, chip: 'Happy Hour aktiv'},
        {at: 30.85, amount: 17.0, chip: 'Zusatzbestellung'},
      ]} />
      <Counter frame={frame} label="WERBEEINNAHMEN" from={43.5} to={46.35} color="#f59e0b" decimals={0} events={[
        {at: 43.6, amount: 1200, chip: 'Anzeigen live', dur: 2.2},
      ]} />
      <Counter frame={frame} label="TISCH 7" from={46.5} to={50.3} events={[
        {at: 46.55, amount: 39.3, chip: 'Tab offen', dur: 0.05},
        {at: 49.7, amount: 26.8, chip: 'Nachbestellung'},
      ]} />

      {/* Münzen */}
      <EuroBurst frame={frame} at={30.95} x={tiny.x} y={tiny.y - 40} n={7} spread={320} rise={330} />
      <EuroBurst frame={frame} at={49.8} x={tiny.x} y={tiny.y - 40} n={6} spread={300} rise={300} />
      {TABLES.map((tb, i) => {
        const p = worldToScreen(tb.x, tb.y, 1.4, overviewCam);
        return <EuroBurst key={i} frame={frame} at={43.6 + i * 0.18} x={p.x} y={p.y - 20} n={2} spread={90} rise={150} size={70} />;
      })}

      <Subtitles />
      {CUTS.map((c) => <Whip key={c} frame={frame} cut={c} />)}
      <Whip frame={frame} cut={PRODUCT_IN} dur={0.5} />
      <AudioTracks />
    </AbsoluteFill>
  );
};
