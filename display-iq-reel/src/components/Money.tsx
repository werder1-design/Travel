import React from 'react';
import {C, FONT, FPS} from '../theme';
import {OUT, SOFT, clamp01, pop, prog, rand} from '../ease';
import {IconTrend} from './Icons';

/** Kompakte Glas-Karte: Zähler links, aufsteigende Umsatzgrafik rechts. */
export const RevenueCard: React.FC<{
  frame: number; at: number; label: string; to: number; prefix?: string; suffix?: string; color?: string; width?: number; badge?: string;
}> = ({frame, at, label, to, prefix = '+', suffix = ' €', color = C.green, width = 900, badge}) => {
  const a = pop(frame, at);
  if (a <= 0.001) return null;
  const grow = prog(frame, at + 0.25, 1.7, SOFT);
  const val = Math.round(to * grow);
  const H = 210;
  const pts = [0, 0.1, 0.07, 0.22, 0.18, 0.34, 0.3, 0.5, 0.46, 0.66, 0.62, 0.86, 1];
  const cw = 330;
  const ch = 120;
  const path = pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * cw} ${ch - v * (ch - 16)}`).join('');
  const len = 1500;
  const idx = clamp01(grow) * (pts.length - 1);
  const i0 = Math.floor(idx);
  const f = idx - i0;
  const v = pts[i0] + ((pts[Math.min(i0 + 1, pts.length - 1)] ?? pts[i0]) - pts[i0]) * f;
  const tipX = (idx / (pts.length - 1)) * cw;
  const tipY = ch - v * (ch - 16);
  return (
    <div style={{width, height: H, borderRadius: 40, padding: '24px 38px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(160deg,rgba(26,33,80,.96),rgba(13,17,48,.96))', border: '2px solid rgba(255,255,255,.16)', boxShadow: `0 30px 80px rgba(0,0,0,.5), 0 0 60px ${color}33`, fontFamily: FONT, color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 60}px) scale(${0.9 + a * 0.1})`}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 4, color: C.dim}}>{label}</div>
          {badge && (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 999, background: `${color}22`, color, fontSize: 26, fontWeight: 800}}>
              <IconTrend size={26} color={color} /> {badge}
            </div>
          )}
        </div>
        <div style={{fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, marginTop: 6, color, whiteSpace: 'nowrap'}}>
          {prefix}{val.toLocaleString('de-DE')}{suffix}
        </div>
      </div>
      <svg width={cw} height={ch + 12} style={{overflow: 'visible', flexShrink: 0}}>
        <defs>
          <linearGradient id="rc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".35" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id="rc-clip"><rect x="0" y="-20" width={tipX} height={ch + 40} /></clipPath>
        </defs>
        <path d={`${path}L${cw} ${ch}L0 ${ch}Z`} fill="url(#rc-area)" clipPath="url(#rc-clip)" />
        <path d={path} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - clamp01(grow))} style={{filter: `drop-shadow(0 0 10px ${color})`}} />
        <circle cx={tipX} cy={tipY} r="12" fill="#fff" stroke={color} strokeWidth="6" />
      </svg>
    </div>
  );
};

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
