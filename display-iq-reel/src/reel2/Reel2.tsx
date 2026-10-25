import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS, sec} from '../theme';
import {OUT, prog, SOFT} from '../ease';
import {focus, keyIso} from '../camPath';
import {worldToScreen} from '../iso/World';
import {Fonts} from '../components/Fonts';
import {Device, DEV, DevicePopup, FloatCard} from '../components/Device';
import {Headline} from '../components/Headline';
import {EuroBurst} from '../components/Money';
import {EndCard} from '../components/Finale';
import {Vignette, Whip} from '../components/Overlays';
import {Subtitles} from '../components/Subtitles';
import {AudioTracks} from '../AudioTracks';
import {MenuScreen} from '../screens/MenuScreen';
import {ScreenSwitch} from '../screens/PromoScreens';
import {RT, HERO, RestaurantWorld, THEATER, TL} from './RestaurantWorld';
import {CAPTIONS2, REEL2_DURATION_SEC, SFX2} from './data2';
import {Happy20Screen, MusicScreen, PastaScreen, TheaterScreen} from './Screens2';
import {DASH, Dashboard, PhoneCharging, RevenueChart} from './Extras2';

export const REEL2_DURATION = sec(REEL2_DURATION_SEC);

const H = RT[HERO];
const F = focus;
const CAM2 = [
  [0.0, F(14, 5, 0.8, 0.46, 540, 1000)],
  [2.9, F(9, 7, 0.9, 0.85, 540, 960)],
  [4.6, F(5.5, 4.0, 0.9, 1.15, 540, 940)],
  [6.3, F(9.0, 4.2, 0.9, 1.15, 540, 940)],
  [8.2, F(11.5, 6.0, 0.9, 1.1, 540, 940)],
  [9.6, F(H.x, H.y, 0.9, 1.25, 540, 940)],
  [10.7, F(H.x, H.y, 1.0, 3.0, 540, 930)],
  [11.7, F(H.x, H.y, 1.0, 3.0, 540, 930)],
  [12.9, F(H.x, H.y, 0.9, 1.5, 540, 940)],
  [14.8, F(H.x, 6.8, 0.9, 0.95, 540, 940)],
  [16.9, F(H.x, H.y, 0.9, 1.25, 700, 880)],
  [23.2, F(H.x, H.y, 0.9, 1.25, 700, 880)],
  [24.0, F(H.x, H.y, 0.9, 2.1, 760, 900)],
  [28.4, F(H.x, H.y, 0.9, 2.1, 760, 900)],
  [29.4, F(H.x, H.y, 0.9, 1.0, 540, 940)],
  [30.4, F(H.x, H.y, 2.5, 0.5, 540, 960)],
  [32.0, F(8, -4, 1.0, 0.21, 540, 1010)],
  [37.4, F(8, -4, 1.0, 0.21, 540, 1010)],
  [39.0, F(16, 5.5, 1.5, 0.56, 540, 960)],
  [44.6, F(16, 5.5, 1.5, 0.6, 540, 940)],
  [46.7, F(13, 6.5, 1.0, 0.62, 540, 900)],
  [54.8, F(11, 6.5, 1.0, 0.52, 540, 900)],
] as const;

const SPLIT = (t: number, a: number, b: number) => t >= a && t < b;
const sw = (s: number) => s;

export const Reel2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = keyIso(t, CAM2);
  const tiny = worldToScreen(H.x, H.y, 1.4, cam);
  const phoneAt = worldToScreen(H.x + 0.62, H.y + 0.28, 1.0, cam);
  const dim = SPLIT(t, 46.6, 54.9) ? 0.62 * prog(frame, 46.8, 4.5, SOFT) : SPLIT(t, 29.9, 38.2) ? 0.22 * prog(frame, 29.9, 0.8) : 0;
  const heroIn = prog(frame, 47.4, 1.0, OUT);
  const heroOut = prog(frame, 54.3, 0.5, SOFT);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Fonts />
      {t < 55.2 && <RestaurantWorld t={t} cam={cam} dim={dim} />}
      <Vignette />

      {/* S3: Hero-Display mit wechselnden Angeboten */}
      <DevicePopup frame={frame} inAt={17.0} outAt={23.5} origin={tiny} scale={0.62} left={26} top={590}>
        <ScreenSwitch sec={t} items={[
          {from: 0, render: (s) => <Happy20Screen sec={s} appearAt={17.0} />},
          {from: 19.3, render: (s) => <PastaScreen sec={s} appearAt={19.3} />},
          {from: 20.4, render: (s) => <MusicScreen sec={s} appearAt={20.4} />},
          {from: 22.0, render: (s) => <Happy20Screen sec={s} appearAt={22.0} flipAt={22.7} />},
        ]} />
      </DevicePopup>

      {/* S4: Smartphone lädt am Display */}
      <FloatCard frame={frame} inAt={TL.phone + 0.5} outAt={28.5} origin={phoneAt} left={60} top={590} width={380} height={780} scale={0.86}>
        <PhoneCharging frame={frame} from={TL.phone + 0.6} to={28.4} />
      </FloatCard>

      {/* S5: zentrales Dashboard */}
      <FloatCard frame={frame} inAt={29.9} outAt={38.0} origin={{x: 540, y: 880}} left={50} top={620} width={DASH.w} height={DASH.h} scale={0.98}>
        <Dashboard frame={frame} appearAt={29.9} clickAt={35.45} />
      </FloatCard>

      {/* S6: Theater-Werbung + Einnahmegrafik */}
      <DevicePopup frame={frame} inAt={41.4} outAt={44.3} origin={tiny} scale={0.62} left={26} top={590}>
        <TheaterScreen sec={t} appearAt={41.4} />
      </DevicePopup>
      <FloatCard frame={frame} inAt={44.5} outAt={46.9} origin={{x: 540, y: 900}} left={160} top={690} width={760} height={420}>
        <RevenueChart frame={frame} at={44.5} to={1840} />
      </FloatCard>
      <EuroBurst frame={frame} at={44.5} x={540} y={760} n={9} spread={640} rise={360} />

      {/* S7: großes Hero-Gerät im Vordergrund */}
      {t >= 47.3 && t < 54.9 && (
        <div style={{position: 'absolute', left: 540 - (DEV.w * 0.66) / 2, top: 560 + (1 - heroIn) * 700, width: DEV.w * 0.66, height: DEV.h * 0.66, perspective: 2400, opacity: 1 - heroOut}}>
          <div style={{width: DEV.w, height: DEV.h, transformOrigin: '0 0', transform: 'scale(0.66)', transformStyle: 'preserve-3d'}}>
            <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${Math.sin((t - 47.4) * 0.9) * 14 + 4}deg) rotateX(-3deg)`}}>
              <Device extrude={16} glow={1}>
                <ScreenSwitch sec={t} items={[
                  {from: 0, render: (s) => <TheaterScreen sec={s} appearAt={47.4} />},
                  {from: 49.5, render: (s) => <Happy20Screen sec={s} appearAt={49.5} />},
                  {from: 51.3, render: (s) => <MusicScreen sec={s} appearAt={51.3} />},
                  {from: 53.0, render: (s) => <PastaScreen sec={s} appearAt={53.0} />},
                ]} />
              </Device>
            </div>
          </div>
        </div>
      )}
      {t >= 54.8 && <EndCard frame={frame} from={54.8} t1={56.1} t2={57.0} t3={58.3} line1="MACH MEHR AUS" line2="jedem Tisch." size1={118} />}

      {/* Headlines */}
      <Headline frame={frame} at={3.3} until={8.9} size={110} lines={[{text: 'Immer wieder'}, {text: 'neu drucken?', gold: true}]} />
      <Headline frame={frame} at={9.5} until={11.4} size={120} lines={[{text: 'Schluss'}, {text: 'damit.', gold: true}]} />
      <Headline frame={frame} at={13.6} until={16.9} size={100} lines={[{text: 'Ein Display.'}, {text: 'Unendliche'}, {text: 'Möglichkeiten.', gold: true}]} />
      <Headline frame={frame} at={21.6} until={23.7} size={104} lines={[{text: 'Angebote in'}, {text: 'Sekunden'}, {text: 'ändern.', gold: true}]} />
      <Headline frame={frame} at={24.6} until={28.6} size={100} lines={[{text: 'Smartphone laden.'}, {text: 'Ganz nebenbei.', gold: true}]} />
      <Headline frame={frame} at={32.3} until={37.5} size={100} lines={[{text: '20 Restaurants.'}, {text: 'Ein Dashboard.', gold: true}, {text: 'Alles zentral steuern.', serif: true, size: 66}]} />
      <Headline frame={frame} at={41.3} until={44.4} size={100} lines={[{text: 'Deine Tische'}, {text: 'werden zur'}, {text: 'Werbefläche.', gold: true}]} />
      <Headline frame={frame} at={44.5} until={47.0} size={92} lines={[{text: 'Neue Einnahmen'}, {text: 'durch lokale'}, {text: 'Werbung.', gold: true}]} y={272} />
      <Headline frame={frame} at={46.8} until={49.5} size={112} lines={[{text: 'Kein ständiges'}, {text: 'Neudrucken.', gold: true}]} />
      <Headline frame={frame} at={49.6} until={51.4} size={112} lines={[{text: 'Alles zentral'}, {text: 'gesteuert.', gold: true}]} />
      <Headline frame={frame} at={51.4} until={54.7} size={112} lines={[{text: 'Neue Umsatz-'}, {text: 'möglichkeiten.', gold: true}]} />

      <Subtitles captions={CAPTIONS2} />
      <Whip frame={frame} cut={9.9} dur={0.4} />
      <Whip frame={frame} cut={54.8} dur={0.5} />
      <AudioTracks vo="audio/vo2.mp3" music="audio/music2.mp3" sfx={SFX2} duration={REEL2_DURATION} />
    </AbsoluteFill>
  );
};
