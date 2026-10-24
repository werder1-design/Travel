import React from 'react';
import {FONT} from '../theme';
import {OUT, pop, prog, rand} from '../ease';

/** Aufsteigende €-Münzen. */
export const EuroBurst: React.FC<{frame: number; at: number; x: number; y: number; n?: number; spread?: number; rise?: number; size?: number}> = ({
  frame, at, x, y, n = 8, spread = 420, rise = 520, size = 92,
}) => (
  <>
    {Array.from({length: n}).map((_, i) => {
      const t0 = at + i * 0.13;
      const life = 1.5;
      const p = prog(frame, t0, life, (t) => t);
      if (p <= 0 || p >= 1) return null;
      const px = x + (rand(i + 1.3) - 0.5) * spread;
      const e = OUT(p);
      const py = y - e * (rise * (0.6 + rand(i + 4.1) * 0.4));
      const s = (0.5 + pop(frame, t0) * 0.5) * (size / 92) * (0.8 + rand(i + 9.9) * 0.45);
      const op = p < 0.15 ? p / 0.15 : p > 0.7 ? (1 - p) / 0.3 : 1;
      return (
        <div key={i} style={{position: 'absolute', left: px - 46, top: py - 46, width: 92, height: 92, borderRadius: 46, transform: `scale(${s}) scaleX(${Math.max(0.3, Math.abs(Math.cos(p * Math.PI * 3)))})`, opacity: op, background: 'radial-gradient(circle at 32% 28%,#FFE98A,#FFB627 55%,#D98200)', boxShadow: '0 0 36px rgba(255,182,39,.7), inset 0 0 0 5px rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#8A5200'}}>
          €
        </div>
      );
    })}
  </>
);
