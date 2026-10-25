import React from 'react';
import {C, FPS} from '../theme';
import {FoodIcon} from '../components/Food';
import {OUT, clamp01, pop, prog} from '../ease';
import {Screen, SH, SW} from '../screens/common';

type B = {sec: number; appearAt: number};

const Pill: React.FC<{text: string; color: string; bg: string; at: number; f: number}> = ({text, color, bg, at, f}) => {
  const a = pop(f, at);
  return <div style={{position: 'absolute', left: 36, top: 40, padding: '10px 30px', borderRadius: 999, background: bg, color, fontSize: 30, fontWeight: 900, letterSpacing: 4, opacity: a, transform: `translateY(${(1 - a) * -30}px)`}}>{text}</div>;
};

/** Happy Hour 20 % – die Zahl kann live auf einen neuen Wert „rollen“ (Änderung in Sekunden). */
export const Happy20Screen: React.FC<B & {to?: number; flipAt?: number}> = ({sec, appearAt, to = 30, flipAt = 1e6}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  const flip = prog(f, flipAt, 0.55, OUT);
  const saved = prog(f, flipAt + 0.7, 0.35);
  return (
    <Screen bg="linear-gradient(160deg,#FF2E93 0%,#FF6A3D 58%,#FFB627 100%)">
      <div style={{position: 'absolute', right: -140, top: -120, width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,.12)'}} />
      <div style={{position: 'absolute', left: -120, bottom: 120, width: 460, height: 460, borderRadius: '50%', background: 'rgba(255,255,255,.1)'}} />
      <Pill text="HAPPY HOUR" color="#E11D6A" bg="#fff" at={appearAt} f={f} />
      <div style={{position: 'absolute', left: 30, top: 92, height: 200, overflow: 'hidden', opacity: a(0.1), transform: `scale(${0.7 + a(0.1) * 0.3})`, transformOrigin: 'left center'}}>
        <div style={{transform: `translateY(${-flip * 200}px)`}}>
          {[20, to].map((n, i) => (
            <div key={i} style={{height: 200, fontSize: 190, fontWeight: 900, letterSpacing: -8, lineHeight: '200px', color: '#fff', textShadow: '0 10px 0 rgba(160,20,70,.28)', whiteSpace: 'nowrap', filter: flip > 0 && flip < 1 ? 'blur(2px)' : undefined}}>{n} %</div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 38, top: 296, fontSize: 50, fontWeight: 800, color: '#fff', opacity: a(0.2), transform: `translateX(${(1 - a(0.2)) * -60}px)`}}>AUF COCKTAILS</div>
      <div style={{position: 'absolute', left: 150, top: 370, width: 360, transform: `translateY(${Math.sin(sec * 2.2) * 10}px) rotate(6deg) scale(${a(0.15)})`}}><FoodIcon kind="sunset" size={360} /></div>
      <div style={{position: 'absolute', left: 20, top: 480, width: 320, transform: `translateY(${Math.sin(sec * 2.2 + 1.5) * 10}px) rotate(-6deg) scale(${a(0.25)})`}}><FoodIcon kind="mojito" size={320} /></div>
      <div style={{position: 'absolute', left: 38, top: 790, fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,.95)', opacity: a(0.3)}}>Heute · 17–19 Uhr</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 850, height: 76, borderRadius: 38, background: '#fff', color: '#E11D6A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, letterSpacing: 1, opacity: a(0.35)}}>JETZT BESTELLEN  →</div>
      {saved > 0 && (
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 120, height: 84, borderRadius: 26, background: 'rgba(5,8,26,.9)', color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 30, fontWeight: 900, opacity: saved, transform: `translateY(${(1 - saved) * 40}px)`}}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          Geändert in 3 Sekunden
        </div>
      )}
    </Screen>
  );
};

const PastaArt: React.FC<{size?: number}> = ({size = 360}) => (
  <svg viewBox="0 0 300 260" width={size} height={size * (260 / 300)} style={{overflow: 'visible'}}>
    <ellipse cx="150" cy="226" rx="120" ry="20" fill="rgba(0,0,0,.25)" />
    <path d="M30 120 Q30 220 150 224 Q270 220 270 120Z" fill="#f5f0e6" />
    <path d="M30 120 Q30 214 150 218 Q270 214 270 120Z" fill="#fff" opacity=".8" />
    <ellipse cx="150" cy="120" rx="120" ry="34" fill="#f2e9d8" />
    <ellipse cx="150" cy="116" rx="104" ry="26" fill="#e3463a" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <path key={i} d={`M${60 + i * 26} ${110 + (i % 2) * 8} q 24 -36 50 -4 t 40 10`} fill="none" stroke={i % 2 ? '#f7d36b' : '#f2c14e'} strokeWidth="11" strokeLinecap="round" />
    ))}
    <ellipse cx="150" cy="96" rx="64" ry="26" fill="#f7d36b" opacity=".9" />
    {[[110, 90], [160, 84], [196, 100]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="16" ry="8" fill="#2fb45a" transform={`rotate(${i * 25 - 20} ${x} ${y})`} />)}
    {[[130, 104], [176, 112], [96, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill="#c1272d" />)}
    <path d="M232 60 L190 118" stroke="#c9ccdc" strokeWidth="8" strokeLinecap="round" />
    <path d="M226 52 L238 52 M222 62 L234 62" stroke="#c9ccdc" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PastaScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(160deg,#FF8A3D 0%,#E5483A 70%,#B3262E 100%)">
      <div style={{position: 'absolute', right: -120, top: 260, width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,.1)'}} />
      <Pill text="HEUTE" color="#B3262E" bg="#fff" at={appearAt} f={f} />
      <div style={{position: 'absolute', left: 30, top: 112, fontSize: 118, fontWeight: 900, letterSpacing: -4, lineHeight: 0.96, color: '#fff', textShadow: '0 8px 0 rgba(120,20,30,.3)', opacity: a(0.1), transform: `translateX(${(1 - a(0.1)) * -100}px)`}}>PASTA<br />SPECIAL</div>
      <div style={{position: 'absolute', left: 90, top: 390, transform: `translateY(${Math.sin(sec * 2) * 8}px) scale(${a(0.2)})`, transformOrigin: 'center'}}><PastaArt size={420} /></div>
      <div style={{position: 'absolute', left: 38, top: 740, fontSize: 36, fontWeight: 800, color: '#fff', opacity: a(0.3)}}>Frisch zubereitet · ab 17 Uhr</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 820, height: 100, borderRadius: 50, background: '#fff', color: '#B3262E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900, opacity: a(0.35)}}>nur 9,90 €</div>
    </Screen>
  );
};

export const MusicScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(160deg,#150C45 0%,#3A1AA8 55%,#1E7BFF 100%)">
      <Pill text="FREITAG" color="#fff" bg="rgba(255,255,255,.18)" at={appearAt} f={f} />
      <div style={{position: 'absolute', left: 30, top: 108, fontSize: 138, fontWeight: 900, letterSpacing: -5, lineHeight: 0.94, color: '#fff', opacity: a(0.1), transform: `translateX(${(1 - a(0.1)) * -100}px)`}}>LIVE<br /><span style={{background: 'linear-gradient(95deg,#FF3D9A,#FFB627)', WebkitBackgroundClip: 'text', color: 'transparent'}}>MUSIK</span></div>
      <div style={{position: 'absolute', left: 38, top: 410, display: 'flex', gap: 12, alignItems: 'flex-end', height: 260, opacity: a(0.2)}}>
        {Array.from({length: 16}).map((_, i) => {
          const h = 50 + (Math.sin(sec * 7 + i * 0.9) * 0.5 + 0.5) * 180;
          return <div key={i} style={{width: 24, height: h, borderRadius: 12, background: i % 2 ? '#2DD4FF' : '#FF3D9A', boxShadow: `0 0 18px ${i % 2 ? '#2DD4FF' : '#FF3D9A'}`}} />;
        })}
      </div>
      <svg width="200" height="260" viewBox="0 0 120 160" style={{position: 'absolute', right: 40, top: 430, opacity: a(0.25), transform: `rotate(12deg) scale(${a(0.25)})`}}>
        <rect x="42" y="6" width="36" height="62" rx="18" fill="#e9ecf7" /><path d="M42 30H78M42 44H78" stroke="#8e96b8" strokeWidth="4" />
        <path d="M30 56 Q30 92 60 92 Q90 92 90 56" fill="none" stroke="#e9ecf7" strokeWidth="6" strokeLinecap="round" />
        <rect x="56" y="92" width="8" height="40" fill="#e9ecf7" /><rect x="34" y="130" width="52" height="10" rx="5" fill="#e9ecf7" />
      </svg>
      <div style={{position: 'absolute', left: 38, top: 740, fontSize: 64, fontWeight: 900, color: '#fff', opacity: a(0.3)}}>AB 20 UHR</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 840, height: 90, borderRadius: 45, background: 'linear-gradient(120deg,#2DD4FF,#7C4DFF)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, opacity: a(0.35)}}>PLATZ SICHERN  →</div>
    </Screen>
  );
};

const Masks: React.FC<{size?: number}> = ({size = 360}) => (
  <svg viewBox="0 0 300 200" width={size} height={size * (200 / 300)} style={{overflow: 'visible'}}>
    <g transform="rotate(-12 100 100)">
      <path d="M40 40 Q100 20 160 40 Q168 120 100 170 Q32 120 40 40Z" fill="#ffd978" />
      <path d="M62 80 q 14 -14 28 0" fill="none" stroke="#7a1020" strokeWidth="7" strokeLinecap="round" />
      <path d="M112 80 q 14 -14 28 0" fill="none" stroke="#7a1020" strokeWidth="7" strokeLinecap="round" />
      <path d="M62 116 Q100 152 138 116" fill="#7a1020" />
    </g>
    <g transform="rotate(14 200 110)">
      <path d="M150 50 Q210 30 270 50 Q278 130 210 180 Q142 130 150 50Z" fill="#f5e6b0" />
      <path d="M172 92 q 14 10 28 0" fill="none" stroke="#7a1020" strokeWidth="7" strokeLinecap="round" />
      <path d="M222 92 q 14 10 28 0" fill="none" stroke="#7a1020" strokeWidth="7" strokeLinecap="round" />
      <path d="M172 150 Q210 118 248 150" fill="none" stroke="#7a1020" strokeWidth="8" strokeLinecap="round" />
    </g>
  </svg>
);

export const TheaterScreen: React.FC<B> = ({sec, appearAt}) => {
  const f = sec * FPS;
  const a = (d: number) => pop(f, appearAt + d);
  return (
    <Screen bg="linear-gradient(180deg,#5a0a18 0%,#a3122a 55%,#5a0a18 100%)">
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 34px,transparent 34px 68px)'}} />
      <div style={{position: 'absolute', right: 24, top: 26, padding: '6px 18px', borderRadius: 8, background: 'rgba(0,0,0,.6)', color: '#ffd978', fontSize: 22, fontWeight: 800, letterSpacing: 3}}>ANZEIGE</div>
      <div style={{position: 'absolute', left: 36, top: 64, fontSize: 30, fontWeight: 800, letterSpacing: 6, color: '#ffd978', opacity: a(0)}}>★ JETZT IM PROGRAMM ★</div>
      <div style={{position: 'absolute', left: 30, top: 124, fontSize: 104, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, whiteSpace: 'nowrap', color: '#ffd978', textShadow: '0 8px 0 rgba(0,0,0,.35)', opacity: a(0.1), transform: `scale(${0.8 + a(0.1) * 0.2})`, transformOrigin: 'left center'}}>THEATER</div>
      <div style={{position: 'absolute', left: 34, top: 250, fontSize: 70, fontWeight: 900, color: '#fff', opacity: a(0.18)}}>AM PLATZ</div>
      <div style={{position: 'absolute', left: 110, top: 380, transform: `translateY(${Math.sin(sec * 2) * 8}px) scale(${a(0.25)})`}}><Masks size={380} /></div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 660, textAlign: 'center', fontSize: 34, fontWeight: 800, letterSpacing: 4, color: '#ffe9b0', opacity: a(0.3)}}>HEUTE</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 700, textAlign: 'center', fontSize: 100, fontWeight: 900, color: '#fff', opacity: a(0.32), textShadow: '0 0 30px rgba(255,217,120,.6)'}}>19:30 UHR</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 840, height: 90, borderRadius: 45, background: '#ffd978', color: '#5a0a18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, opacity: a(0.38)}}>TICKETS SICHERN  →</div>
    </Screen>
  );
};
