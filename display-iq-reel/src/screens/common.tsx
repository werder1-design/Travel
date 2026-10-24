import React from 'react';
import {FPS, FONT, C} from '../theme';
import {OUT, clamp01, prog} from '../ease';

export const SW = 1200;
export const SH = 800;

export const eur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

export const Screen: React.FC<{bg?: string; children: React.ReactNode}> = ({bg, children}) => (
  <div style={{position: 'absolute', inset: 0, width: SW, height: SH, overflow: 'hidden', fontFamily: FONT, color: C.ink, background: bg ?? 'linear-gradient(160deg,#0e1436,#070a1c)'}}>
    {children}
  </div>
);

export const frameOf = (sec: number) => sec * FPS;

/** Kurzer Press-Impuls (0→1→0) um einen Tap-Zeitpunkt. */
export const press = (sec: number, at: number) => {
  const d = sec - at;
  if (d < -0.08 || d > 0.22) return 0;
  return d < 0 ? clamp01((d + 0.08) / 0.08) : 1 - clamp01(d / 0.22);
};

/** Ring-Ripple am Tap-Punkt. */
export const Ripple: React.FC<{x: number; y: number; sec: number; at: number; color?: string}> = ({x, y, sec, at, color = '#fff'}) => {
  const p = prog(sec * FPS, at, 0.55, OUT);
  if (sec < at || p >= 1) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x - 90 * p - 10, top: y - 90 * p - 10, width: 180 * p + 20, height: 180 * p + 20, borderRadius: '50%', border: `5px solid ${color}`, opacity: 0.8 * (1 - p)}} />
      <div style={{position: 'absolute', left: x - 36, top: y - 36, width: 72, height: 72, borderRadius: '50%', background: color, opacity: 0.45 * (1 - p)}} />
    </>
  );
};

export const TopBar: React.FC<{title?: string; right?: string}> = ({title = 'Bahn 4 · Tisch 7', right = '20:14'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#2DD4FF,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24}}>iQ</div>
      <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 1}}>Display IQ</div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{padding: '8px 22px', borderRadius: 999, background: 'rgba(45,212,255,.14)', color: C.cyan, fontSize: 26, fontWeight: 700}}>{title}</div>
      <div style={{fontSize: 28, fontWeight: 600, color: C.dim}}>{right}</div>
    </div>
  </div>
);
