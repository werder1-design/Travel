import React from 'react';
import {FPS, FONT, C} from '../theme';
import {OUT, clamp01, prog} from '../ease';
import {LogoMark} from '../components/Logo';

/** Bildschirm des Hochkant-Tischdisplays (8", Seitenverhältnis ≈ 0,6). */
export const SW = 580;
export const SH = 960;

export const eur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

export const Screen: React.FC<{bg?: string; children: React.ReactNode}> = ({bg, children}) => (
  <div style={{position: 'absolute', inset: 0, width: SW, height: SH, overflow: 'hidden', fontFamily: FONT, color: C.ink, background: bg ?? 'linear-gradient(170deg,#101845,#070a1e)'}}>
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

export const Ripple: React.FC<{x: number; y: number; sec: number; at: number; color?: string}> = ({x, y, sec, at, color = '#fff'}) => {
  const p = prog(sec * FPS, at, 0.55, OUT);
  if (sec < at || p >= 1) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x - 70 * p - 8, top: y - 70 * p - 8, width: 140 * p + 16, height: 140 * p + 16, borderRadius: '50%', border: `5px solid ${color}`, opacity: 0.85 * (1 - p)}} />
      <div style={{position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: '50%', background: color, opacity: 0.45 * (1 - p)}} />
    </>
  );
};

export const TopBar: React.FC<{tag?: string}> = ({tag = 'Tisch 7'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <LogoMark size={46} glow={false} />
      <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 0.5}}>Display IQ</div>
    </div>
    <div style={{padding: '8px 22px', borderRadius: 999, background: 'rgba(45,212,255,.16)', color: C.cyan, fontSize: 28, fontWeight: 800}}>{tag}</div>
  </div>
);
