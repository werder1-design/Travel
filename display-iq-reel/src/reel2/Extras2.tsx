import React from 'react';
import {C, FONT, FPS} from '../theme';
import {IN_OUT, OUT, SOFT, clamp01, lerp, pop, prog} from '../ease';
import {LogoMark} from '../components/Logo';
import {IconTrend} from '../components/Icons';

/** Smartphone (Hochkant) mit Ladeanimation. */
export const PhoneCharging: React.FC<{frame: number; from: number; to: number; level0?: number; level1?: number}> = ({frame, from, to, level0 = 41, level1 = 78}) => {
  const t = frame / FPS;
  const lvl = lerp(level0, level1, clamp01((t - from) / (to - from)));
  const pulse = 0.5 + 0.5 * Math.sin(t * 5);
  const R = 118;
  const circ = 2 * Math.PI * R;
  return (
    <div style={{width: 380, height: 780, borderRadius: 70, background: 'linear-gradient(150deg,#3b3f58,#14162a 40%,#07080f)', padding: 14, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.14), 0 40px 80px rgba(0,0,0,.5)', fontFamily: FONT, position: 'relative'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 58, overflow: 'hidden', background: 'radial-gradient(circle at 50% 40%,#10263f 0%,#060b18 70%)', position: 'relative'}}>
        <div style={{position: 'absolute', left: 130, top: 14, width: 100, height: 30, borderRadius: 15, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#9fb4d6'}}>Ladevorgang</div>
        <svg width="300" height="300" viewBox="0 0 300 300" style={{position: 'absolute', left: 25, top: 150}}>
          <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="22" />
          <circle cx="150" cy="150" r={R} fill="none" stroke="#34e3a0" strokeWidth="22" strokeLinecap="round" strokeDasharray={`${(circ * lvl) / 100} ${circ}`} transform="rotate(-90 150 150)" style={{filter: 'drop-shadow(0 0 14px #34e3a0)'}} />
          <path d="M160 70 L112 160 H146 L136 232 L190 132 H154Z" fill="#fff" opacity={0.7 + 0.3 * pulse} style={{filter: 'drop-shadow(0 0 12px #34e3a0)'}} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: 'Anton', fontSize: 120, color: '#fff', lineHeight: 1}}>{Math.round(lvl)} %</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#34e3a0'}}>lädt am Display IQ · USB</div>
      </div>
    </div>
  );
};

/** Dashboard (Web-Oberfläche) mit 20 Standorten, Aktion und Veröffentlichen-Button. */
export const DASH = {w: 940, h: 640, btn: {x: 786, y: 560}};
export const Dashboard: React.FC<{frame: number; appearAt: number; clickAt: number}> = ({frame, appearAt, clickAt}) => {
  const t = frame / FPS;
  const a = pop(frame, appearAt);
  const sent = prog(frame, clickAt + 0.1, 1.1, (x) => x);
  const done = t > clickAt + 1.2;
  const count = Math.round(lerp(0, 20, prog(frame, appearAt + 0.4, 1.4, OUT)));
  const displays = Math.round(lerp(0, 186, prog(frame, appearAt + 0.4, 1.6, OUT)));
  const names = ['Pizzeria Roma', 'Café Central', 'Bistro Nord', 'Burger Haus', 'Sushi Bar', 'Brauhaus'];
  // Mauszeiger
  const cm = clamp01((t - (clickAt - 1.2)) / 1.0);
  const cx = lerp(480, DASH.btn.x, IN_OUT(cm));
  const cyv = lerp(250, DASH.btn.y, IN_OUT(cm));
  const press = t > clickAt - 0.05 && t < clickAt + 0.15 ? 0.94 : 1;
  return (
    <div style={{position: 'relative', width: DASH.w, height: DASH.h, borderRadius: 36, background: 'linear-gradient(160deg,#10173f,#080b22)', border: '2px solid rgba(255,255,255,.14)', boxShadow: '0 40px 100px rgba(0,0,0,.6), 0 0 80px rgba(45,212,255,.18)', fontFamily: FONT, color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 80}px) scale(${0.9 + a * 0.1})`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><LogoMark size={50} glow={false} /><div style={{fontSize: 29, fontWeight: 900, whiteSpace: 'nowrap'}}>Display IQ <span style={{color: C.cyan}}>Dashboard</span></div></div>
        <div style={{display: 'flex', gap: 12, whiteSpace: 'nowrap'}}>
          <div style={{padding: '8px 18px', borderRadius: 999, background: 'rgba(45,212,255,.15)', color: C.cyan, fontSize: 23, fontWeight: 800}}>{count} Standorte</div>
          <div style={{padding: '8px 18px', borderRadius: 999, background: 'rgba(52,227,160,.15)', color: C.green, fontSize: 23, fontWeight: 800}}>● {displays} Displays online</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 28, top: 108, width: 240}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.dim, marginBottom: 14}}>STANDORTE</div>
        {names.map((n, i) => (
          <div key={n} style={{height: 62, marginBottom: 10, borderRadius: 16, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', fontSize: 25, fontWeight: 700, opacity: pop(frame, appearAt + 0.3 + i * 0.08)}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: done ? '#ff3d9a' : C.green, boxShadow: `0 0 12px ${done ? '#ff3d9a' : C.green}`}} />{n}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 296, top: 108, width: 330}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.dim, marginBottom: 14}}>ALLE 20 STANDORTE</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12}}>
          {Array.from({length: 20}).map((_, i) => {
            const hit = t > clickAt + 0.3 + i * 0.045;
            return <div key={i} style={{height: 56, borderRadius: 14, background: hit ? 'linear-gradient(135deg,#ff3d9a,#ff8a3d)' : 'rgba(45,212,255,.18)', border: `2px solid ${hit ? '#ffb3d5' : 'rgba(45,212,255,.4)'}`, opacity: pop(frame, appearAt + 0.4 + i * 0.03), transform: `scale(${hit && t < clickAt + 0.5 + i * 0.045 ? 1.15 : 1})`}} />;
          })}
        </div>
        <div style={{marginTop: 26, fontSize: 24, fontWeight: 700, color: done ? '#ff9ac8' : C.dim}}>{done ? '20 / 20 aktualisiert ✓' : `${Math.round(sent * 20)} / 20 …`}</div>
        <div style={{marginTop: 12, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.1)', overflow: 'hidden'}}><div style={{width: `${sent * 100}%`, height: '100%', background: 'linear-gradient(90deg,#2dd4ff,#ff3d9a)'}} /></div>
      </div>
      <div style={{position: 'absolute', left: 650, top: 108, width: 262, height: 500, borderRadius: 24, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', padding: 20}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.dim}}>AKTION</div>
        <div style={{marginTop: 14, height: 150, borderRadius: 18, background: 'linear-gradient(160deg,#FF2E93,#FF6A3D,#FFB627)', padding: 14, fontWeight: 900}}>
          <div style={{fontSize: 20, letterSpacing: 2}}>HAPPY HOUR</div>
          <div style={{fontSize: 62, lineHeight: 1.1, whiteSpace: 'nowrap'}}>20 %</div>
          <div style={{fontSize: 20}}>AUF COCKTAILS</div>
        </div>
        <div style={{marginTop: 14, fontSize: 22, fontWeight: 700, color: C.dim}}>Ausspielen an</div>
        <div style={{marginTop: 6, padding: '10px 14px', borderRadius: 14, background: 'rgba(45,212,255,.14)', color: C.cyan, fontSize: 21, fontWeight: 800, whiteSpace: 'nowrap'}}>✓ Alle Standorte</div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 400, height: 76, borderRadius: 38, background: done ? C.green : 'linear-gradient(120deg,#2DD4FF,#7C4DFF)', color: done ? '#04241a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, whiteSpace: 'nowrap', fontWeight: 900, transform: `scale(${press})`, boxShadow: '0 12px 30px rgba(45,212,255,.35)'}}>{done ? 'VERÖFFENTLICHT ✓' : 'VERÖFFENTLICHEN'}</div>
      </div>
      <svg width="40" height="40" viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cyv, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.5))', opacity: cm > 0 ? 1 : 0}}>
        <path d="M5 3 L5 19 L9.2 15.2 L12 21 L14.4 19.9 L11.6 14.2 L17 14 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Einnahmegrafik: wachsende Balken + Linie + Zahl. */
export const RevenueChart: React.FC<{frame: number; at: number; to: number}> = ({frame, at, to}) => {
  const a = pop(frame, at);
  const g = prog(frame, at + 0.3, 1.8, SOFT);
  const vals = [0.18, 0.26, 0.34, 0.43, 0.55, 0.72, 1];
  const W = 640;
  const H = 170;
  const pts = vals.map((v, i) => [40 + i * 92, H - v * g * (H - 20)] as const);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
  return (
    <div style={{width: 760, height: 420, borderRadius: 40, padding: '28px 40px', background: 'linear-gradient(160deg,rgba(26,33,80,.96),rgba(13,17,48,.96))', border: '2px solid rgba(255,255,255,.16)', boxShadow: '0 30px 80px rgba(0,0,0,.5), 0 0 60px rgba(255,194,71,.25)', fontFamily: FONT, color: '#fff', opacity: a, transform: `translateY(${(1 - a) * 60}px) scale(${0.9 + a * 0.1})`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 4, color: '#ffe3a8'}}>WERBEEINNAHMEN</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, background: 'rgba(255,194,71,.16)', color: '#ffc247', fontSize: 26, fontWeight: 800}}><IconTrend size={26} color="#ffc247" /> pro Monat</div>
      </div>
      <div style={{fontFamily: 'Anton', fontSize: 104, lineHeight: 1.05, color: '#ffc247', marginTop: 4}}>+{Math.round(to * g).toLocaleString('de-DE')} €</div>
      <svg width={W} height={H} style={{marginTop: 4, overflow: 'visible'}}>
        {pts.map((p, i) => <rect key={i} x={p[0] - 26} y={p[1]} width="52" height={H - p[1]} rx="10" fill="rgba(255,194,71,.22)" />)}
        <path d={line} fill="none" stroke="#ffc247" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 10px #ffc247)'}} />
        <circle cx={pts[6][0]} cy={pts[6][1]} r="12" fill="#fff" stroke="#ffc247" strokeWidth="6" />
      </svg>
    </div>
  );
};
