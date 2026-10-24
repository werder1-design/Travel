import React from 'react';
import {C, FONT, FPS} from '../theme';
import {FoodIcon} from '../components/Food';
import {IconCar, IconCoffee, IconDumbbell, IconScissors, IconCheck, IconPin} from '../components/Icons';
import {LogoMark} from '../components/Logo';
import {OUT, clamp01, pop, prog} from '../ease';
import {BowlingArt, CarArt} from './art';
import {Ripple, SH, SW, Screen, press} from './common';

type PromoBase = {sec: number; appearAt: number};

export const HAPPY_CTA = {x: 304, y: 648};
export const AD_CTA = {x: 300, y: 664};

const Cta: React.FC<{x: number; y: number; w?: number; label: string; bg: string; color: string; pr?: number; pulse?: number}> = ({x, y, w = 480, label, bg, color, pr = 0, pulse = 0}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - 50, width: w, height: 100, borderRadius: 50, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 42, fontWeight: 900, letterSpacing: 1, transform: `scale(${1 + pulse * 0.04 - pr * 0.06})`, boxShadow: '0 16px 40px rgba(0,0,0,.28)'}}>
    {label}
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </div>
);

export const HappyHourScreen: React.FC<PromoBase & {tapAt?: number}> = ({sec, appearAt, tapAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  const pulse = (Math.sin(sec * 5) + 1) / 2;
  const added = tapAt !== undefined && sec >= tapAt + 0.25;
  return (
    <Screen bg="linear-gradient(130deg,#FF2E93 0%,#FF6A3D 55%,#FFB627 100%)">
      <div style={{position: 'absolute', right: -120, top: -140, width: 620, height: 620, borderRadius: '50%', background: 'rgba(255,255,255,.12)'}} />
      <div style={{position: 'absolute', right: 120, bottom: -260, width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,.1)'}} />
      <div style={{position: 'absolute', left: 64, top: 64, padding: '12px 34px', borderRadius: 999, background: '#fff', color: '#E11D6A', fontSize: 34, fontWeight: 900, letterSpacing: 4, opacity: a(0), transform: `translateY(${(1 - a(0)) * -30}px)`}}>HAPPY HOUR</div>
      <div style={{position: 'absolute', left: 56, top: 130, fontSize: 224, fontWeight: 900, letterSpacing: -9, lineHeight: 1.0, color: '#fff', textShadow: '0 12px 0 rgba(160,20,70,.28)', opacity: a(0.1), transform: `scale(${0.7 + a(0.1) * 0.3})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>2 FÜR 1</div>
      <div style={{position: 'absolute', left: 68, top: 410, fontSize: 58, fontWeight: 800, color: '#fff', opacity: a(0.2), transform: `translateX(${(1 - a(0.2)) * -60}px)`}}>auf alle Cocktails</div>
      <div style={{position: 'absolute', left: 68, top: 490, fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,.9)', opacity: a(0.28)}}>Täglich 17–19 Uhr</div>
      <Cta x={HAPPY_CTA.x} y={HAPPY_CTA.y} label={added ? 'HINZUGEFÜGT' : 'JETZT BESTELLEN'} bg={added ? C.green : '#fff'} color={added ? '#04243a' : '#E11D6A'} pr={tapAt !== undefined ? press(sec, tapAt) : 0} pulse={added ? 0 : pulse} />
      <div style={{position: 'absolute', right: 50, top: 70, width: 400, transform: `translateY(${Math.sin(sec * 2.2) * 10}px) rotate(6deg) scale(${a(0.15)})`}}>
        <FoodIcon kind="sunset" size={400} />
      </div>
      <div style={{position: 'absolute', right: 120, top: 400, width: 320, transform: `translateY(${Math.sin(sec * 2.2 + 1.5) * 10}px) rotate(-6deg) scale(${a(0.25)})`}}>
        <FoodIcon kind="mojito" size={320} />
      </div>
      {tapAt !== undefined && <Ripple x={HAPPY_CTA.x} y={HAPPY_CTA.y} sec={sec} at={tapAt} color="#fff" />}
    </Screen>
  );
};

export const EventScreen: React.FC<PromoBase> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  const pulse = (Math.sin(sec * 5) + 1) / 2;
  return (
    <Screen bg="linear-gradient(150deg,#150C45 0%,#3A1AA8 55%,#1E7BFF 100%)">
      <svg width={SW} height={SH} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={i * 110 - 40} y1={SH} x2={i * 110 + 360} y2={SH * 0.38} stroke="#7CD7FF" strokeWidth="2" />)}
        {Array.from({length: 6}).map((_, i) => <line key={i} x1="0" y1={SH * 0.4 + i * i * 14 + i * 24} x2={SW} y2={SH * 0.4 + i * i * 14 + i * 24} stroke="#7CD7FF" strokeWidth="2" />)}
      </svg>
      <div style={{position: 'absolute', left: 64, top: 62, padding: '12px 32px', borderRadius: 999, background: 'rgba(255,255,255,.16)', border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontSize: 30, fontWeight: 800, letterSpacing: 4, opacity: a(0)}}>KOMMENDES EVENT</div>
      <div style={{position: 'absolute', left: 60, top: 128, fontSize: 112, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: '#fff', opacity: a(0.08), transform: `translateX(${(1 - a(0.08)) * -100}px)`}}>FRIDAY NIGHT</div>
      <div style={{position: 'absolute', left: 56, top: 240, fontSize: 210, fontWeight: 900, letterSpacing: -7, lineHeight: 1, background: 'linear-gradient(95deg,#FF3D9A,#FFB627)', WebkitBackgroundClip: 'text', color: 'transparent', opacity: a(0.16), transform: `scale(${0.8 + a(0.16) * 0.2})`, transformOrigin: 'left center', filter: 'drop-shadow(0 0 28px rgba(255,61,154,.5))'}}>BOWLING</div>
      <div style={{position: 'absolute', left: 68, top: 482, fontSize: 36, fontWeight: 700, color: '#CFE4FF', opacity: a(0.26)}}>Fr · 20:00 Uhr · Live-DJ · Neon-Lanes</div>
      <div style={{position: 'absolute', left: 64, top: 598, width: 440, height: 96, borderRadius: 48, background: 'linear-gradient(120deg,#2DD4FF,#7C4DFF)', color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + pulse * 0.04})`, opacity: a(0.34), boxShadow: '0 0 40px rgba(45,212,255,.5)'}}>PLATZ SICHERN</div>
      <div style={{position: 'absolute', right: -10, top: 420, opacity: a(0.2), transform: `scale(${0.7 + a(0.2) * 0.3})`}}>
        <BowlingArt width={360} sway={Math.sin(sec * 3) * 3} />
      </div>
    </Screen>
  );
};

export const AdScreen: React.FC<PromoBase & {tapAt?: number}> = ({sec, appearAt, tapAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  const pulse = (Math.sin(sec * 5) + 1) / 2;
  const type = prog(f, appearAt + 0.55, 0.9, (t) => t);
  const sub = 'Jetzt Inspektion sichern!';
  return (
    <Screen bg="linear-gradient(135deg,#FFD41F 0%,#FFB800 100%)">
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg,rgba(0,0,0,.06) 0 36px,transparent 36px 72px)'}} />
      <div style={{position: 'absolute', right: 32, top: 28, padding: '8px 22px', borderRadius: 10, background: 'rgba(0,0,0,.82)', color: '#FFD41F', fontSize: 24, fontWeight: 800, letterSpacing: 3}}>ANZEIGE</div>
      <div style={{position: 'absolute', left: 64, top: 70, display: 'flex', alignItems: 'center', gap: 14, color: '#111', opacity: a(0), fontSize: 30, fontWeight: 800}}>
        <IconPin size={34} color="#111" /> Direkt nebenan
      </div>
      <div style={{position: 'absolute', left: 60, top: 120, fontSize: 92, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: '#111', opacity: a(0.06), transform: `translateX(${(1 - a(0.06)) * -90}px)`}}>AUTO SERVICE</div>
      <div style={{position: 'absolute', left: 56, top: 246, fontSize: 176, fontWeight: 900, letterSpacing: -6, lineHeight: 1, color: '#111', opacity: a(0.14), transform: `scale(${0.82 + a(0.14) * 0.18})`, transformOrigin: 'left center'}}>MÜLLER</div>
      <div style={{position: 'absolute', left: 64, top: 446, width: 640 * a(0.22), height: 14, background: '#E11D2E', borderRadius: 7}} />
      <div style={{position: 'absolute', left: 64, top: 482, fontSize: 52, fontWeight: 900, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', width: 'fit-content'}}>
        {sub.slice(0, Math.round(sub.length * clamp01(type)))}
        <span style={{display: 'inline-block', width: 4, height: 50, background: '#E11D2E', marginLeft: 6, verticalAlign: 'middle', opacity: type < 1 ? 1 : 0}} />
      </div>
      <Cta x={AD_CTA.x + 20} y={AD_CTA.y + 6} w={470} label="TERMIN SICHERN" bg="#111" color="#FFD41F" pr={tapAt !== undefined ? press(sec, tapAt) : 0} pulse={pulse} />
      <div style={{position: 'absolute', right: -50, top: 470, transform: `translateX(${(1 - a(0.1)) * 300}px)`}}>
        <CarArt width={520} wheel={sec * 180} />
      </div>
    </Screen>
  );
};

const PARTNERS = [
  {name: 'Autowerkstatt', icon: IconCar, c: '#FFB800'},
  {name: 'Café & Bäckerei', icon: IconCoffee, c: '#FF7A59'},
  {name: 'Friseur', icon: IconScissors, c: '#C084FC'},
  {name: 'Fitnessstudio', icon: IconDumbbell, c: '#34E3A0'},
];

export const PartnersScreen: React.FC<PromoBase & {highlightAt?: number}> = ({sec, appearAt, highlightAt = Infinity}) => {
  const f = sec * FPS;
  const hl = prog(f, highlightAt, 0.4);
  return (
    <Screen>
      <div style={{position: 'absolute', left: 48, top: 40, opacity: pop(f, appearAt)}}>
        <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 5, color: C.cyan}}>LOKALE WERBEPARTNER</div>
        <div style={{fontSize: 64, fontWeight: 900, letterSpacing: -1.5, marginTop: 6}}>Deine Anzeige auf jedem Tisch</div>
      </div>
      {PARTNERS.map((p, i) => {
        const a = pop(f, appearAt + 0.15 + i * 0.5);
        const x = 48 + (i % 2) * 558;
        const y = 210 + Math.floor(i / 2) * 286;
        const Icon = p.icon;
        const isMain = i === 0;
        const dim = isMain ? 1 : 1 - hl * 0.6;
        return (
          <div key={p.name} style={{position: 'absolute', left: x, top: y, width: 534, height: 262, borderRadius: 34, background: 'linear-gradient(160deg,#1c2459,#121839)', border: `3px solid ${isMain && hl > 0 ? p.c : 'rgba(255,255,255,.08)'}`, opacity: a * dim, transform: `scale(${(0.85 + a * 0.15) * (isMain ? 1 + hl * 0.03 : 1)})`, boxShadow: isMain && hl > 0 ? `0 0 60px ${p.c}55` : undefined}}>
            <div style={{position: 'absolute', left: 36, top: 34, width: 120, height: 120, borderRadius: 34, background: p.c, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon size={74} color="#111" stroke={2.2} />
            </div>
            <div style={{position: 'absolute', right: 30, top: 34, padding: '6px 16px', borderRadius: 10, background: 'rgba(255,255,255,.1)', color: C.dim, fontSize: 22, fontWeight: 800, letterSpacing: 2}}>ANZEIGE</div>
            <div style={{position: 'absolute', left: 36, top: 176, fontSize: 46, fontWeight: 800}}>{p.name}</div>
          </div>
        );
      })}
    </Screen>
  );
};

export const WelcomeScreen: React.FC<{sec: number; appearAt?: number}> = ({sec, appearAt = 0}) => {
  const f = sec * FPS;
  const a = pop(f, appearAt);
  const pulse = (Math.sin(sec * 3.2) + 1) / 2;
  return (
    <Screen bg="radial-gradient(circle at 50% 42%,#1b2a73 0%,#0a0f2c 62%)">
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', transform: `scale(${0.7 + a * 0.3})`, opacity: a}}>
        <LogoMark size={190} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontSize: 92, fontWeight: 900, letterSpacing: -2, opacity: a}}>Willkommen an Bahn 4</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 40, fontWeight: 600, color: C.dim, opacity: a}}>Bestelle direkt hier am Tisch</div>
      <div style={{position: 'absolute', left: 350, top: 626, width: 500, height: 96, borderRadius: 48, border: `3px solid ${C.cyan}`, color: C.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 800, opacity: a * (0.55 + pulse * 0.45), boxShadow: `0 0 ${20 + pulse * 30}px rgba(45,212,255,.35)`}}>TIPPEN ZUM STARTEN</div>
    </Screen>
  );
};

/** Wechselt zwischen Screens (Slide + Fade, 0,4 s). */
export const ScreenSwitch: React.FC<{sec: number; items: {from: number; render: (sec: number) => React.ReactNode}[]; dur?: number}> = ({sec, items, dur = 0.4}) => {
  let idx = 0;
  items.forEach((it, i) => {
    if (sec >= it.from) idx = i;
  });
  const cur = items[idx];
  const t = clamp01((sec - cur.from) / dur);
  const e = OUT(t);
  const prev = idx > 0 && t < 1 ? items[idx - 1] : null;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {prev && <div style={{position: 'absolute', inset: 0, transform: `translateX(${-e * 220}px)`, opacity: 1 - e}}>{prev.render(sec)}</div>}
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - e) * 260}px)`, opacity: prev ? e : 1}}>{cur.render(sec)}</div>
    </div>
  );
};
