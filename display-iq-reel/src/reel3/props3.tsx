import React from 'react';
import {P, box, cyl, pts, ring} from '../iso/iso';
import {darken, lighten, mat} from '../iso/colors';
import {SlotId} from './timeline';

/** Farbwelten der Tischdisplays (Miniatur) je Tageszeit. */
export const MODE3 = {
  neutral: {bg: '#101a46', bar: '#2dd4ff', glow: '#2dd4ff'},
  B: {bg: '#ffc94d', bar: '#7a3a12', glow: '#ffb627'},
  L: {bg: '#ee5a3a', bar: '#fff1c9', glow: '#ff7a3d'},
  C: {bg: '#e98bbd', bar: '#fff3f8', glow: '#ff9ac8'},
  E: {bg: '#ff2e93', bar: '#ffd27a', glow: '#ff3d9a'},
} as const;
export type Mode3 = keyof typeof MODE3;

const plate = (k: string, x: number, y: number, z: number, r = 0.17, col = '#ffffff') => (
  <g key={k}>
    <polygon points={pts(ring(x, y, z, r + 0.015, 16))} fill="rgba(0,0,0,.14)" />
    <polygon points={pts(ring(x, y, z + 0.004, r, 16))} fill={col} />
  </g>
);
const cup = (k: string, x: number, y: number, z: number, coffee = '#6b3b1e', t = 0, steam = true) => {
  const p = P(x, y, z + 0.14);
  return (
    <g key={k}>
      <polygon points={pts(ring(x, y, z, 0.15, 14))} fill="#f4f1ea" />
      {cyl('c', x, y, z + 0.004, 0.085, 0.13, {top: coffee, left: '#ffffff', right: '#c9ccd6'})}
      {steam && [0, 1].map((i) => {
        const ph = (t * 0.9 + i * 0.5) % 1;
        return <path key={i} d={`M${p.X - 3 + i * 6} ${p.Y - ph * 20} q 4 -6 0 -11 q -4 -5 0 -10`} stroke="rgba(255,255,255,.7)" strokeWidth="2" fill="none" strokeLinecap="round" opacity={1 - ph} />;
      })}
    </g>
  );
};
const glassC = (k: string, x: number, y: number, z: number, col: string, h = 0.22) =>
  <g key={k}>{cyl('g', x, y, z, 0.065, h, {top: lighten(col, 0.4), left: col, right: darken(col, 0.25)})}</g>;

const croissant = (k: string, x: number, y: number, z: number) => {
  const p = P(x, y, z + 0.03);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y})`}>
      <path d="M-14 3 Q-12 -9 0 -10 Q12 -9 14 3 Q8 -2 0 -2 Q-8 -2 -14 3Z" fill="#d98a3a" />
      <path d="M-9 -4 Q-4 -9 0 -9 M-3 -2 Q1 -9 4 -8 M4 -2 Q7 -8 10 -4" stroke="#a85f1f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M-12 1 Q-10 -6 -2 -8" stroke="#f1b86c" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
};
const pasta = (k: string, x: number, y: number, z: number) => {
  const p = P(x, y, z + 0.03);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y})`}>
      <ellipse cx="0" cy="-2" rx="12" ry="6.5" fill="#f2bf5a" />
      <ellipse cx="0" cy="-5" rx="9" ry="4.6" fill="#e5483a" />
      <path d="M-6 -6 q3 -4 6 0 q3 -4 6 0" stroke="#f6d27a" strokeWidth="1.6" fill="none" />
      <circle cx="-3" cy="-7" r="1.6" fill="#2f9e6a" /><circle cx="4" cy="-6" r="1.6" fill="#2f9e6a" />
    </g>
  );
};
const cakeSlice = (k: string, x: number, y: number, z: number, sponge = '#e8c07a', icing = '#f4a6c7') => (
  <g key={k}>
    {box('s', x - 0.13, y - 0.12, z + 0.01, 0.26, 0.24, 0.07, mat(sponge))}
    {box('i', x - 0.13, y - 0.12, z + 0.08, 0.26, 0.24, 0.05, mat(icing))}
    {box('c', x - 0.13, y - 0.12, z + 0.13, 0.26, 0.24, 0.05, mat('#fff3df'))}
    {cyl('b', x + 0.03, y, z + 0.18, 0.045, 0.05, mat('#d9314f'))}
  </g>
);
const candle = (k: string, x: number, y: number, z: number, t: number, glow: number) => {
  const p = P(x, y, z + 0.2);
  return (
    <g key={k}>
      <polygon points={pts(ring(x, y, z + 0.005, 0.5 + glow * 0.2, 20))} fill="rgba(255,190,110,.2)" opacity={glow} />
      {cyl('c', x, y, z, 0.05, 0.16, mat('#f8efe0'))}
      <ellipse cx={p.X} cy={p.Y - 3 + Math.sin(t * 9 + x) * 0.8} rx="3" ry="5.5" fill="#ffd36a" opacity={glow} />
    </g>
  );
};
const cocktail = (k: string, x: number, y: number, z: number, col: string) => {
  const p = P(x, y, z + 0.26);
  return (
    <g key={k}>
      {cyl('g', x, y, z, 0.07, 0.24, {top: lighten(col, 0.45), left: col, right: darken(col, 0.25)})}
      <line x1={p.X + 2} y1={p.Y + 4} x2={p.X + 7} y2={p.Y - 12} stroke="#fff" strokeWidth="2" />
      <circle cx={p.X - 5} cy={p.Y + 1} r="4.5" fill="#ffb627" />
    </g>
  );
};

/** Tischdeko je Tageszeit (Mittelpunkt des Tisches x,y, Plattenhöhe z). `pop` 0…1 lässt alles aufspringen. */
export const tableSetting = (k: React.Key, x: number, y: number, z: number, slot: SlotId, i: number, t: number, popv: number, served = true) => {
  const out: React.ReactNode[] = [];
  const pw: [number, number] = [x - 0.56, y + 0.05];
  const pe: [number, number] = [x + 0.56, y + 0.05];
  const nn: [number, number] = [x - 0.2, y - 0.6];
  const ss: [number, number] = [x + 0.22, y + 0.6];
  out.push(plate('plw', pw[0], pw[1], z), plate('ple', pe[0], pe[1], z));
  if (slot === 'B') {
    out.push(croissant('c1', pw[0], pw[1], z), croissant('c2', pe[0], pe[1], z));
    out.push(cup('cu1', nn[0], nn[1], z, '#7a4a2a', t), cup('cu2', ss[0], ss[1], z, '#7a4a2a', t + 0.4));
    out.push(glassC('oj', x + 0.42, y - 0.5, z, '#ffa21a'));
  } else if (slot === 'L') {
    if (served) out.push(pasta('p1', pw[0], pw[1], z), pasta('p2', pe[0], pe[1], z));
    out.push(glassC('w1', nn[0], nn[1], z, '#9fe8ff'), glassC('w2', ss[0], ss[1], z, '#9fe8ff'));
    out.push(glassC('w3', x + 0.42, y - 0.5, z, '#d6f6ff', 0.2));
  } else if (slot === 'C') {
    out.push(cakeSlice('k1', pw[0], pw[1], z, '#e8c07a', '#f4a6c7'), cakeSlice('k2', pe[0], pe[1], z, '#7a4a2a', '#f1dfc4'));
    out.push(cup('cu1', nn[0], nn[1], z, '#7a4a2a', t), cup('cu2', ss[0], ss[1], z, '#7a4a2a', t + 0.4));
  } else {
    out.push(cocktail('o1', pw[0], pw[1] - 0.05, z, '#ff3d9a'), cocktail('o2', pe[0], pe[1] - 0.05, z, '#2dd4ff'));
    out.push(cocktail('o3', nn[0], nn[1], z, '#ff8a3d'), cocktail('o4', ss[0], ss[1], z, '#8b5cf6'));
    out.push(candle('cd', x + 0.42, y - 0.5, z, t + i, 1));
  }
  const p = P(x, y, z);
  const s = 0.3 + 0.7 * popv + Math.sin(popv * Math.PI) * 0.12;
  return <g key={k} opacity={Math.min(1, popv * 3)} transform={`translate(${p.X} ${p.Y}) scale(${s}) translate(${-p.X} ${-p.Y})`}>{out}</g>;
};

/** Tischdisplay im Tageszeit-Look: wie displayDevice, aber mit eigenen Farbwelten und Inhaltssymbol. */
export const dayDisplay = (k: React.Key, x: number, y: number, z: number, mode: Mode3, t: number, scale = 1, phase = 0, flash = 0) => {
  const c = MODE3[mode];
  const pulse = 0.5 + 0.5 * Math.sin(t * 4 + phase);
  const w = 0.44 * scale;
  const h = 0.9 * scale;
  const d = 0.15 * scale;
  const out: React.ReactNode[] = [];
  out.push(<polygon key="g" points={pts(ring(x, y, z + 0.01, 0.95 * scale))} fill={c.glow} opacity={0.14 + 0.1 * pulse + flash * 0.25} />);
  out.push(box('base', x - 0.27 * scale, y - 0.2 * scale, z, 0.54 * scale, 0.42 * scale, 0.08 * scale, mat('#1b1e36')));
  out.push(box('body', x - w / 2, y - d / 2, z + 0.08 * scale, w, d, h, mat('#0f1226')));
  const fy = y + d / 2 + 0.002;
  const sx0 = x - w / 2 + 0.03 * scale;
  const sx1 = x + w / 2 - 0.03 * scale;
  const sz0 = z + 0.22 * scale;
  const sz1 = z + 0.08 * scale + h - 0.05 * scale;
  out.push(poly3(fy, sx0, sx1, sz0, sz1, c.bg));
  const rows = mode === 'neutral' ? 3 : 1;
  for (let i = 0; i < rows; i++) {
    const a = sz1 - 0.06 * scale - i * 0.2 * scale;
    out.push(poly3(fy + 0.001, sx0 + 0.03 * scale, sx1 - 0.03 * scale, a - (mode === 'neutral' ? 0.14 : 0.26) * scale, a, c.bar, mode === 'neutral' ? 0.5 : 0.9));
  }
  // kleines Motiv (Kreis) auf dem Screen
  const mid = (sz0 + sz1) / 2 - 0.08 * scale;
  const cp = P(x, fy, mid);
  out.push(<circle key="mot" cx={cp.X} cy={cp.Y} r={7 * scale} fill={mode === 'neutral' ? 'none' : c.bar} opacity={0.85} />);
  out.push(poly3(fy + 0.002, sx0, sx0 + 0.07 * scale, sz0, sz1, 'rgba(255,255,255,.12)'));
  return <g key={k}>{out}</g>;
};
const poly3 = (fy: number, x0: number, x1: number, z0: number, z1: number, fill: string, opacity = 1) => (
  <polygon key={`${fy}-${z0}`} points={pts([[x0, fy, z0], [x1, fy, z0], [x1, fy, z1], [x0, fy, z1]])} fill={fill} opacity={opacity} />
);
