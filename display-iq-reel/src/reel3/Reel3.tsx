import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, sec} from '../theme';
import {IN_OUT, OUT, clamp01, pop, prog, rand} from '../ease';
import {focus, keyIso} from '../camPath';
import {worldToScreen} from '../iso/World';
import {Fonts} from '../components/Fonts';
import {Device, DEV, DevicePopup, FloatCard} from '../components/Device';
import {Headline} from '../components/Headline';
import {Vignette, Whip} from '../components/Overlays';
import {Subtitles} from '../components/Subtitles';
import {Wordmark} from '../components/Logo';
import {AudioTracks} from '../AudioTracks';
import {RT, HERO} from '../reel2/RestaurantWorld';
import {DayWorld} from './DayWorld';
import {CAPTIONS3, SFX3} from './data3';
import {BreakfastScreen, CakeScreen, HappyHourScreen, LunchScreen, NeutralScreen} from './Screens3';
import {Clock, DASH3, Dashboard3} from './Extras3';
import {REEL3_DURATION_SEC, S6, T3, hourAt, slotOf} from './timeline';

export const REEL3_DURATION = sec(REEL3_DURATION_SEC);

const H = RT[HERO];
const F = focus;
const POP_L = 26;
const POP_T = 575;
const POP_S = 0.68;

const CAM3 = [
  [0.0, F(H.x, H.y, 0.9, 1.5, 540, 930)],
  [T3.warum, F(H.x, H.y, 0.9, 1.4, 560, 920)],
  [T3.mit - 0.4, F(H.x, H.y, 0.9, 1.2, 690, 860)],
  [S6.zoomOut, F(H.x, H.y, 0.9, 1.22, 690, 860)],
  [S6.zoomOut + 1.9, F(8, -4, 1.0, 0.21, 540, 1010)],
  [S6.back, F(8, -4, 1.0, 0.21, 540, 1010)],
  [S6.back + 1.7, F(H.x, H.y, 0.9, 1.2, 690, 860)],
  [T3.display2 - 0.4, F(H.x, H.y, 0.9, 1.26, 690, 860)],
] as const;

type ScreenKey = 'N' | 'B' | 'L' | 'C' | 'E';
/** Welcher Bildschirminhalt gerade gilt (Problemfall „immer dieselbe Werbung“ oder Tageszeit). */
const keyAt = (t: number): ScreenKey => (t >= T3.warum - 0.2 && t < T3.mit + 0.5 ? 'N' : slotOf(hourAt(t)).id);
const startOf = (t: number): number => {
  const k = keyAt(t);
  let tt = t;
  while (tt > 0 && keyAt(tt - 1 / FPS) === k) tt -= 1 / FPS;
  return tt;
};
const renderKey = (k: ScreenKey, s: number, at: number) => {
  if (k === 'N') return <NeutralScreen sec={s} appearAt={at} />;
  if (k === 'B') return <BreakfastScreen sec={s} appearAt={at} />;
  if (k === 'L') return <LunchScreen sec={s} appearAt={at} />;
  if (k === 'C') return <CakeScreen sec={s} appearAt={at} />;
  return <HappyHourScreen sec={s} appearAt={at} />;
};
/** Display-Inhalt folgt der Tageszeit; beim Wechsel schiebt der neue Inhalt weich herein. */
const LiveScreen: React.FC<{t: number}> = ({t}) => {
  const k = keyAt(t);
  const ts = startOf(t);
  const e = OUT(clamp01((t - ts) / 0.35));
  const prevKey = ts > 0 ? keyAt(ts - 1 / FPS) : null;
  const prevStart = prevKey ? startOf(ts - 1 / FPS) : 0;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {prevKey && e < 1 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${-e * 160}px)`, opacity: 1 - e}}>{renderKey(prevKey, t, prevStart)}</div>}
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - e) * 220}px)`, opacity: prevKey ? e : 1}}>{renderKey(k, t, ts)}</div>
    </div>
  );
};

const EndCard3: React.FC<{frame: number; from: number}> = ({frame, from}) => {
  const t = frame / FPS;
  const logo = pop(frame, from + 0.1, 12, 150);
  const word = prog(frame, from + 0.35, 0.7, OUT);
  const l1 = pop(frame, T3.richtige);
  const l2 = pop(frame, T3.zeit);
  const url = pop(frame, T3.tisch);
  const pulse = (Math.sin(t * 3) + 1) / 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 34%,#1a2a80 0%,#0a0f33 52%,#05071a 100%)', fontFamily: FONT}}>
      {Array.from({length: 26}).map((_, i) => {
        const x = rand(i + 1) * 1080;
        const y = (((rand(i + 40) * 2000 - t * (20 + rand(i + 7) * 40)) % 2000) + 2000) % 2000 - 40;
        const s = 6 + rand(i + 3) * 16;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: i % 2 ? C.cyan : C.violet, opacity: 0.22 + rand(i + 9) * 0.3, filter: 'blur(2px)'}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + logo * 0.5})`, opacity: Math.min(1, logo * 1.4)}}>
        <div style={{position: 'absolute', top: 20, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,212,255,.38),transparent 65%)'}} />
        <div style={{width: 380, height: 380, borderRadius: 56, background: '#fff', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.5), 0 0 60px rgba(45,212,255,.35)', position: 'relative'}}>
          <Img src={staticFile('brand/logo.jpg')} style={{position: 'absolute', left: -40, top: -52, width: 460, height: 519}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', opacity: word, transform: `translateY(${(1 - word) * 40}px)`}}>
        <Wordmark size={112} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, textAlign: 'center'}}>
        <div style={{fontFamily: 'Anton', fontSize: 92, lineHeight: 1.05, letterSpacing: 1.5, color: '#fff', opacity: l1, transform: `translateY(${(1 - l1) * 50}px) scale(${0.9 + l1 * 0.1})`, textShadow: '0 8px 40px rgba(0,0,0,.5)', whiteSpace: 'nowrap'}}>DIE RICHTIGE WERBUNG.</div>
        <div style={{fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700, fontSize: 112, lineHeight: 1.12, color: '#ffc247', opacity: l2, transform: `translateY(${(1 - l2) * 50}px) scale(${0.9 + l2 * 0.1})`, whiteSpace: 'nowrap'}}>Zur richtigen Zeit.</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', opacity: url, transform: `scale(${0.85 + url * 0.15})`}}>
        <div style={{padding: '16px 52px', borderRadius: 999, border: `3px solid ${C.cyan}`, color: C.cyan, fontSize: 56, fontWeight: 800, letterSpacing: 1, boxShadow: `0 0 ${24 + pulse * 30}px rgba(45,212,255,.4)`, background: 'rgba(45,212,255,.08)'}}>display-iq.de</div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let cam = keyIso(t, CAM3);
  // rhythmischer Zoom-Schlag auf „Morgens / Mittags / Abends“
  const punch = [T3.morgens, T3.mittags1, T3.abends1].reduce((a, tw) => a + (t >= tw ? 0.12 * Math.exp(-(t - tw) * 5) : 0), 0);
  cam = {...cam, zoom: cam.zoom + punch};
  const h = hourAt(t);
  const tiny = worldToScreen(H.x, H.y, 1.4, cam);
  const inS6 = t >= S6.zoomOut - 0.2 && t < S6.back + 0.3;
  const dim = inS6 ? 0.1 * prog(frame, S6.zoomOut + 1.2, 0.8) * (1 - prog(frame, S6.back, 0.6)) : 0;
  const recap = t >= S6.back + 1.4 && t < T3.display2 - 0.3;
  const popA = T3.warum + 0.15;
  const popUntil = S6.zoomOut - 0.25;
  const popB = S6.back + 1.5;
  const popBUntil = T3.display2 - 0.45;
  const clockVis = (t >= 0.05 && t < S6.zoomOut - 0.1) || recap;
  const clockA = clockVis ? Math.min(pop(frame, 0.05), 1) * (t >= S6.zoomOut - 0.4 && t < S6.back ? 1 - prog(frame, S6.zoomOut - 0.4, 0.3) : 1) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Fonts />
      {t < T3.display2 + 0.1 && <DayWorld t={t} cam={cam} dim={dim + (recap ? 0.22 : 0)} />}
      <Vignette />

      {/* Uhr über dem Restaurant */}
      {clockA > 0.01 && (
        <div style={{position: 'absolute', left: 800, top: 280}}>
          <Clock h={h} size={196} appear={clockA} />
        </div>
      )}

      {/* Tischdisplay als große schwebende Ansicht: Inhalt folgt der Tageszeit */}
      <DevicePopup frame={frame} inAt={popA} outAt={popUntil} origin={tiny} scale={POP_S} left={POP_L} top={POP_T}>
        <LiveScreen t={t} />
      </DevicePopup>
      <DevicePopup frame={frame} inAt={popB} outAt={popBUntil} origin={tiny} scale={POP_S} left={POP_L} top={POP_T}>
        <LiveScreen t={t} />
      </DevicePopup>

      {/* Zeitplan-Dashboard */}
      <FloatCard frame={frame} inAt={S6.zoomOut + 0.9} outAt={S6.back - 0.2} origin={{x: 540, y: 880}} left={104} top={600} width={DASH3.w} height={DASH3.h} scale={0.86}>
        <Dashboard3 frame={frame} appearAt={S6.zoomOut + 0.9} clickAt={S6.click} publishAt={S6.publish} />
      </FloatCard>

      {/* Headlines */}
      <Headline frame={frame} at={T3.morgens} until={T3.warum - 0.2} y={272} size={84} lines={[{text: 'Morgens Kaffee.'}]} />
      <Headline frame={frame} at={T3.mittags1} until={T3.warum - 0.2} y={356} size={84} lines={[{text: 'Mittags Lunch.'}]} />
      <Headline frame={frame} at={T3.abends1} until={T3.warum - 0.2} y={440} size={84} lines={[{text: 'Abends Cocktails.', gold: true}]} />
      <Headline frame={frame} at={T3.warum + 0.5} until={T3.mit - 0.1} size={88} lines={[{text: 'Dieselbe Werbung.'}, {text: 'Den ganzen Tag?', gold: true}]} />
      <Headline frame={frame} at={T3.mit + 0.3} until={T3.neun - 0.35} size={96} lines={[{text: 'Werbung nach'}, {text: 'Tageszeit.', gold: true}]} />
      <Headline frame={frame} at={T3.neun + 0.2} until={T3.mittags2 - 0.4} size={104} lines={[{text: 'Frühstück'}, {text: 'ab 09:00 Uhr.', gold: true}]} />
      <Headline frame={frame} at={T3.mittags2 + 0.25} until={T3.nachmittags - 0.35} size={88} lines={[{text: 'Automatisch'}, {text: 'zur Mittagszeit.', gold: true}]} />
      <Headline frame={frame} at={T3.nachmittags + 0.25} until={T3.abends2 - 0.35} size={104} lines={[{text: 'Kaffee &'}, {text: 'Kuchen.', gold: true}]} />
      <Headline frame={frame} at={T3.abends2 + 0.25} until={S6.zoomOut - 0.2} size={74} lines={[{text: 'Die richtige Werbung.'}, {text: 'Zur richtigen Zeit.', gold: true}]} />
      <Headline frame={frame} at={S6.zoomOut + 0.4} until={S6.back - 0.3} size={96} lines={[{text: 'Einmal planen.'}, {text: 'Automatisch'}, {text: 'ausspielen.', gold: true}]} />
      <Headline frame={frame} at={T3.kein} until={T3.display2 - 0.5} y={272} size={80} lines={[{text: 'Kein Neudrucken.'}]} />
      <Headline frame={frame} at={T3.austauschen} until={T3.display2 - 0.5} y={356} size={80} lines={[{text: 'Kein Austauschen.'}]} />
      <Headline frame={frame} at={T3.aufwand} until={T3.display2 - 0.5} y={440} size={80} lines={[{text: 'Kein Aufwand.', gold: true}]} />

      {/* Finale: großes Gerät, dann Logo */}
      {t >= T3.display2 - 0.55 && t < T3.display2 + 0.05 && (
        <div style={{position: 'absolute', left: 540 - (DEV.w * 0.66) / 2, top: 560 + (1 - prog(frame, T3.display2 - 0.55, 0.5, OUT)) * 600, width: DEV.w * 0.66, height: DEV.h * 0.66, perspective: 2400}}>
          <div style={{width: DEV.w, height: DEV.h, transformOrigin: '0 0', transform: 'scale(0.66)', transformStyle: 'preserve-3d'}}>
            <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'rotateY(8deg) rotateX(-3deg)'}}>
              <Device extrude={16} glow={1}><LiveScreen t={t} /></Device>
            </div>
          </div>
        </div>
      )}
      {t >= T3.display2 - 0.05 && <EndCard3 frame={frame} from={T3.display2 - 0.05} />}

      <Subtitles captions={CAPTIONS3} />
      <Whip frame={frame} cut={S6.zoomOut + 0.9} dur={0.4} />
      <Whip frame={frame} cut={T3.display2 - 0.05} dur={0.5} />
      <AudioTracks vo="audio/vo3.mp3" music="audio/music3.mp3" sfx={SFX3} duration={REEL3_DURATION} />
    </AbsoluteFill>
  );
};
