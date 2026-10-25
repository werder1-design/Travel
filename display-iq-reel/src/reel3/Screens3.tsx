import React from 'react';
import {FPS} from '../theme';
import {FoodIcon} from '../components/Food';
import {pop} from '../ease';
import {Screen} from '../screens/common';

type B = {sec: number; appearAt: number};

const Tag: React.FC<{text: string; color: string; bg: string; f: number; at: number; top?: number}> = ({text, color, bg, f, at, top = 40}) => {
  const a = pop(f, at);
  return <div style={{position: 'absolute', left: 36, top, padding: '10px 30px', borderRadius: 999, background: bg, color, fontSize: 30, fontWeight: 900, letterSpacing: 4, opacity: a, transform: `translateY(${(1 - a) * -30}px)`}}>{text}</div>;
};
const Price: React.FC<{text: string; color: string; f: number; at: number; top?: number}> = ({text, color, f, at, top = 800}) => {
  const a = pop(f, at);
  return <div style={{position: 'absolute', left: 30, right: 30, top, height: 112, borderRadius: 56, background: '#fff', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 66, fontWeight: 900, opacity: a, transform: `translateY(${(1 - a) * 60}px) scale(${0.9 + a * 0.1})`, boxShadow: '0 14px 30px rgba(0,0,0,.2)'}}>{text}</div>;
};
const slide = (a: number) => ({opacity: a, transform: `translateX(${(1 - a) * 220}px)`});

export const Croissant: React.FC<{size?: number}> = ({size = 300}) => (
  <svg viewBox="0 0 300 180" width={size} height={size * 0.6} style={{overflow: 'visible'}}>
    <ellipse cx="150" cy="160" rx="120" ry="16" fill="rgba(0,0,0,.18)" />
    <path d="M18 128 Q10 70 74 52 Q150 24 226 52 Q290 70 282 128 Q250 100 222 112 Q150 82 78 112 Q50 100 18 128Z" fill="#d9822b" />
    <path d="M70 60 Q98 30 150 30 Q202 30 230 60 Q196 48 150 50 Q104 48 70 60Z" fill="#f0b25f" />
    {[[78, 112, 96, 56], [112, 100, 124, 42], [150, 96, 150, 38], [188, 100, 176, 42], [222, 112, 204, 56]].map(([x1, y1, x2, y2], i) => (
      <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + (i - 2) * 6} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke="#a85b14" strokeWidth="7" fill="none" strokeLinecap="round" />
    ))}
    <path d="M40 96 Q60 70 96 62" stroke="#f8d089" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".8" />
  </svg>
);

export const Cappuccino: React.FC<{size?: number; sec?: number}> = ({size = 260, sec = 0}) => (
  <svg viewBox="0 0 260 240" width={size} height={size * (240 / 260)} style={{overflow: 'visible'}}>
    <ellipse cx="130" cy="214" rx="112" ry="20" fill="#f4f1ea" /><ellipse cx="130" cy="210" rx="112" ry="18" fill="#ffffff" />
    <path d="M52 100 H208 V150 Q208 202 130 202 Q52 202 52 150Z" fill="#ffffff" />
    <path d="M208 112 H232 Q250 112 250 136 Q250 160 224 160 H204" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
    <ellipse cx="130" cy="100" rx="78" ry="20" fill="#7a4a2a" />
    <ellipse cx="130" cy="100" rx="52" ry="12" fill="#f3dcc0" />
    <path d="M130 108 Q108 96 118 90 Q130 88 130 96 Q130 88 142 90 Q152 96 130 108Z" fill="#7a4a2a" />
    {[0, 1, 2].map((i) => {
      const ph = (sec * 0.7 + i * 0.33) % 1;
      return <path key={i} d={`M${100 + i * 30} ${70 - ph * 40} q 10 -14 0 -26 q -10 -12 0 -24`} stroke="rgba(255,255,255,.75)" strokeWidth="6" fill="none" strokeLinecap="round" opacity={1 - ph} />;
    })}
  </svg>
);

export const Cake: React.FC<{size?: number}> = ({size = 300}) => (
  <svg viewBox="0 0 300 220" width={size} height={size * (220 / 300)} style={{overflow: 'visible'}}>
    <ellipse cx="150" cy="200" rx="130" ry="18" fill="rgba(0,0,0,.18)" />
    <path d="M30 100 L270 70 V150 L30 180Z" fill="#e8c07a" />
    <path d="M30 128 L270 98 V112 L30 142Z" fill="#fff3df" />
    <path d="M30 100 L120 40 L270 70 L30 100Z" fill="#f6a8c8" />
    <path d="M30 100 L30 180 L120 150 V40Z" fill="#c98b4a" />
    <path d="M120 40 V150 L30 180 V100Z" fill="#d79a58" opacity=".6" />
    <circle cx="146" cy="52" r="20" fill="#d9314f" /><path d="M146 36 q-4 -14 8 -18" stroke="#2f9e6a" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="140" cy="48" r="5" fill="rgba(255,255,255,.55)" />
  </svg>
);

const PastaBowl: React.FC<{size?: number}> = ({size = 360}) => (
  <svg viewBox="0 0 360 260" width={size} height={size * (260 / 360)} style={{overflow: 'visible'}}>
    <ellipse cx="180" cy="236" rx="140" ry="18" fill="rgba(0,0,0,.2)" />
    <path d="M40 120 H320 Q320 220 180 230 Q40 220 40 120Z" fill="#ffffff" />
    <ellipse cx="180" cy="120" rx="140" ry="34" fill="#f2f2f2" />
    <ellipse cx="180" cy="112" rx="112" ry="26" fill="#f2bf5a" />
    <ellipse cx="180" cy="100" rx="86" ry="22" fill="#e5483a" />
    {[-60, -25, 15, 55].map((x, i) => <path key={i} d={`M${180 + x - 24} ${96 + (i % 2) * 6} q12 -14 24 0 q12 -14 24 0`} stroke="#f6d27a" strokeWidth="6" fill="none" strokeLinecap="round" />)}
    <circle cx="150" cy="86" r="8" fill="#2f9e6a" /><circle cx="210" cy="92" r="8" fill="#2f9e6a" /><circle cx="184" cy="78" r="6" fill="#2f9e6a" />
  </svg>
);

/** Fester „immer dieselbe Werbung“-Bildschirm (Problemstellung). */
export const NeutralScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(165deg,#12204f 0%,#0b1233 100%)">
      <Tag text="UNSERE KARTE" color="#0b1233" bg="#2dd4ff" f={f} at={appearAt} />
      <div style={{position: 'absolute', left: 34, top: 120, fontSize: 120, fontWeight: 900, letterSpacing: -4, lineHeight: 0.95, color: '#fff', opacity: a(0.1)}}>PIZZA<br />&amp; PASTA</div>
      <div style={{position: 'absolute', left: 110, top: 400, transform: `translateY(${Math.sin(sec * 2) * 8}px) scale(${a(0.2)})`}}><FoodIcon kind="pizza" size={380} /></div>
      <div style={{position: 'absolute', left: 38, top: 790, fontSize: 38, fontWeight: 800, color: '#9CA6D0', opacity: a(0.3)}}>Heute · gestern · immer</div>
      <Price text="ab 8,90 €" color="#12204f" f={f} at={appearAt + 0.35} />
    </Screen>
  );
};

export const BreakfastScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  const ink = '#4a2208';
  return (
    <Screen bg="linear-gradient(165deg,#FFE29A 0%,#FFB347 55%,#FF8A3D 100%)">
      <div style={{position: 'absolute', right: -120, top: -100, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,#fff6c9 0%,rgba(255,246,201,.2) 60%,transparent 70%)'}} />
      <Tag text="09:00 – 11:00 UHR" color="#fff" bg={ink} f={f} at={appearAt} />
      <div style={{position: 'absolute', left: 32, top: 118, fontSize: 100, fontWeight: 900, letterSpacing: -3, lineHeight: 0.94, color: ink, ...slide(a(0.1))}}>GOOD<br />MORNING</div>
      <div style={{position: 'absolute', left: 150, top: 420, transform: `translateY(${Math.sin(sec * 2) * 6}px) rotate(-6deg) scale(${a(0.22)})`}}><Croissant size={320} /></div>
      <div style={{position: 'absolute', left: 54, top: 470, transform: `translateY(${Math.sin(sec * 2 + 1) * 6}px) scale(${a(0.3)})`}}><Cappuccino size={260} sec={sec} /></div>
      <div style={{position: 'absolute', left: 38, top: 738, fontSize: 42, fontWeight: 900, color: ink, whiteSpace: 'nowrap', ...slide(a(0.34))}}>FRÜHSTÜCK + KAFFEE</div>
      <Price text="9,90 €" color="#c4581a" f={f} at={appearAt + 0.4} top={800} />
    </Screen>
  );
};

export const LunchScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(160deg,#FF8A3D 0%,#E5483A 62%,#B3262E 100%)">
      <div style={{position: 'absolute', right: -120, top: 260, width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,.1)'}} />
      <Tag text="12:00 – 14:30 UHR" color="#B3262E" bg="#fff" f={f} at={appearAt} />
      <div style={{position: 'absolute', left: 32, top: 118, fontSize: 112, fontWeight: 900, letterSpacing: -4, lineHeight: 0.94, color: '#fff', textShadow: '0 8px 0 rgba(120,20,30,.3)', ...slide(a(0.1))}}>LUNCH<br />SPECIAL</div>
      <div style={{position: 'absolute', left: 90, top: 400, transform: `translateY(${Math.sin(sec * 2) * 8}px) scale(${a(0.22)})`}}><PastaBowl size={420} /></div>
      <div style={{position: 'absolute', left: 38, top: 738, fontSize: 46, fontWeight: 900, color: '#fff', ...slide(a(0.34))}}>PASTA + GETRÄNK</div>
      <Price text="12,90 €" color="#B3262E" f={f} at={appearAt + 0.4} top={800} />
    </Screen>
  );
};

export const CakeScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(165deg,#FFD3E6 0%,#F08BBE 55%,#A9559E 100%)">
      <div style={{position: 'absolute', left: -140, bottom: 80, width: 460, height: 460, borderRadius: '50%', background: 'rgba(255,255,255,.14)'}} />
      <Tag text="14:30 – 17:00 UHR" color="#fff" bg="#6a2a66" f={f} at={appearAt} />
      <div style={{position: 'absolute', left: 32, top: 118, fontSize: 104, fontWeight: 900, letterSpacing: -4, lineHeight: 0.94, color: '#fff', textShadow: '0 8px 0 rgba(106,42,102,.35)', ...slide(a(0.1))}}>COFFEE<br />&amp; CAKE</div>
      <div style={{position: 'absolute', left: 110, top: 410, transform: `translateY(${Math.sin(sec * 2) * 6}px) scale(${a(0.22)})`}}><Cake size={340} /></div>
      <div style={{position: 'absolute', left: 36, top: 560, transform: `translateY(${Math.sin(sec * 2 + 1) * 6}px) scale(${a(0.3)})`}}><Cappuccino size={190} sec={sec} /></div>
      <div style={{position: 'absolute', left: 38, top: 738, fontSize: 46, fontWeight: 900, color: '#fff', ...slide(a(0.34))}}>KAFFEE + KUCHEN</div>
      <Price text="7,90 €" color="#a9559e" f={f} at={appearAt + 0.4} top={800} />
    </Screen>
  );
};

export const HappyHourScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(160deg,#FF2E93 0%,#B3199B 55%,#4A1A9A 100%)">
      <div style={{position: 'absolute', right: -140, top: -120, width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,.12)'}} />
      <Tag text="AB 19:00 UHR" color="#E11D6A" bg="#fff" f={f} at={appearAt} />
      <div style={{position: 'absolute', left: 32, top: 118, fontSize: 118, fontWeight: 900, letterSpacing: -4, lineHeight: 0.92, color: '#fff', textShadow: '0 8px 0 rgba(60,10,90,.35)', ...slide(a(0.1))}}>HAPPY<br />HOUR</div>
      <div style={{position: 'absolute', left: 150, top: 380, width: 360, transform: `translateY(${Math.sin(sec * 2.2) * 10}px) rotate(6deg) scale(${a(0.2)})`}}><FoodIcon kind="sunset" size={360} /></div>
      <div style={{position: 'absolute', left: 20, top: 470, width: 320, transform: `translateY(${Math.sin(sec * 2.2 + 1.5) * 10}px) rotate(-6deg) scale(${a(0.28)})`}}><FoodIcon kind="mojito" size={320} /></div>
      <div style={{position: 'absolute', left: 38, top: 738, fontSize: 40, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', ...slide(a(0.34))}}>2 FÜR 1 COCKTAILS</div>
      <Price text="2 für 1" color="#E11D6A" f={f} at={appearAt + 0.4} top={810} />
    </Screen>
  );
};
