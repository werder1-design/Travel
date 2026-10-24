import React from 'react';
import {C, FONT, FPS} from '../theme';
import {IN_OUT, OUT, SOFT, clamp01, lerp, pop, prog} from '../ease';

export type CounterEvent = {at: number; amount: number; chip: string; dur?: number};

/** Umsatz-Zähler oben rechts (wie im Referenzvideo) mit Status-Chip und Mini-Umsatzkurve. */
export const Counter: React.FC<{
  frame: number;
  label: string;
  from: number;
  to: number;
  events: CounterEvent[];
  suffix?: string;
  color?: string;
  decimals?: number;
}> = ({frame, label, from, to, events, suffix = ' €', color = '#3b82ff', decimals = 2}) => {
  const t = frame / FPS;
  if (t < from - 0.05 || t > to + 0.4) return null;
  const a = pop(frame, from);
  const out = prog(frame, to, 0.35, SOFT);
  // Wert = Summe der bisher gestarteten Events (mit Zählanimation)
  let value = 0;
  let chip = events[0]?.chip ?? '';
  const pts: number[] = [0];
  let evT = from;
  events.forEach((e) => {
    const d = e.dur ?? 1.1;
    const k = OUT(clamp01((t - e.at) / d));
    value += e.amount * k;
    if (t >= e.at) {
      chip = e.chip;
      evT = e.at;
    }
    pts.push(pts[pts.length - 1] + e.amount);
  });
  const max = Math.max(...pts, 1);
  const W = 300;
  const H = 74;
  const sx = (i: number) => (i / Math.max(1, pts.length - 1)) * W;
  const cur = events.filter((e) => t >= e.at).length;
  const path = pts
    .slice(0, cur + 1)
    .map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)} ${(H - (v / max) * (H - 10) - 4).toFixed(1)}`)
    .join('');
  const chipPop = pop(frame, evT + 0.1);
  return (
    <div style={{position: 'absolute', right: 40, top: 262, textAlign: 'right', fontFamily: FONT, opacity: a * (1 - out), transform: `translateY(${(1 - a) * -30}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: '#ffe3a8'}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: '#ffb627', boxShadow: '0 0 14px #ffb627'}} />
        {label}
      </div>
      <div style={{fontFamily: 'Anton', fontSize: 128, lineHeight: 1.0, color: '#fff', letterSpacing: 1, textShadow: '0 8px 30px rgba(0,0,0,.55)', whiteSpace: 'nowrap'}}>
        {value.toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}
        <span style={{fontSize: 90}}>{suffix}</span>
      </div>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '8px 22px', borderRadius: 999, background: color, color: '#fff', fontSize: 30, fontWeight: 800, opacity: chipPop, transform: `scale(${0.8 + 0.2 * chipPop})`, transformOrigin: 'right center', boxShadow: `0 8px 24px ${color}77`}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: '#fff'}} />
        {chip}
      </div>
      {pts.length > 2 && (
        <svg width={W} height={H} style={{display: 'block', marginTop: 10, marginLeft: 'auto', overflow: 'visible'}}>
          <path d={path} fill="none" stroke="#34e3a0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 8px #34e3a0)'}} />
        </svg>
      )}
    </div>
  );
};
