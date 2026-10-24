import React from 'react';
import {Mat, darken, lighten, mat} from './colors';
import {P, V3, box, cyl, flat, poly, pts, ring, shadowEllipse, wallLM, wallR, wallRM} from './iso';
import {SeatedPerson, Pose, HairStyle} from '../components/People';

export type Item = {k: number; n: React.ReactNode; b?: boolean};

export const W = {
  cream: mat('#efe0c6'),
  wood: mat('#8a5640'),
  darkwood: mat('#5a3828'),
  terracotta: mat('#b9553b'),
  teal: mat('#2f7f86'),
  steel: mat('#8b93ad'),
  black: mat('#161830'),
};

export const tree = (k: React.Key, x: number, y: number, s = 1) => {
  const p = P(x, y, 0);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y}) scale(${s})`}>
      <ellipse cx="0" cy="6" rx="62" ry="22" fill="rgba(2,6,20,.4)" />
      <rect x="-7" y="-70" width="14" height="76" rx="4" fill="#3a2a2a" />
      <ellipse cx="0" cy="-118" rx="64" ry="62" fill="#17484f" />
      <ellipse cx="-30" cy="-98" rx="40" ry="38" fill="#1c5a60" />
      <ellipse cx="26" cy="-136" rx="38" ry="34" fill="#206a6c" />
      <ellipse cx="14" cy="-150" rx="22" ry="16" fill="#2a8584" opacity=".7" />
    </g>
  );
};

export const lamp = (k: React.Key, x: number, y: number, glow = 1) => {
  const p = P(x, y, 0);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y})`}>
      <ellipse cx="0" cy="6" rx={150} ry={56} fill={`rgba(255,214,140,${0.16 * glow})`} />
      <rect x="-4" y="-180" width="8" height="184" fill="#20243c" />
      <path d="M-4 -180 q 0 -22 30 -22" stroke="#20243c" strokeWidth="7" fill="none" />
      <ellipse cx="30" cy="-196" rx="18" ry="7" fill="#ffe3a8" />
      <ellipse cx="30" cy="-196" rx="40" ry="16" fill={`rgba(255,226,160,${0.25 * glow})`} />
    </g>
  );
};

export const chair = (k: React.Key, x: number, y: number, side: 'w' | 'n' | 'e' | 's', m: Mat) => {
  const out: React.ReactNode[] = [];
  out.push(box(`${k}s`, x - 0.3, y - 0.3, 0, 0.6, 0.6, 0.46, m));
  const bk = 0.1;
  if (side === 'w') out.push(box(`${k}b`, x - 0.4, y - 0.3, 0.46, bk, 0.6, 0.55, m));
  if (side === 'n') out.push(box(`${k}b`, x - 0.3, y - 0.4, 0.46, 0.6, bk, 0.55, m));
  if (side === 'e') out.push(box(`${k}b`, x + 0.3, y - 0.3, 0.46, bk, 0.6, 0.55, m));
  if (side === 's') out.push(box(`${k}b`, x - 0.3, y + 0.3, 0.46, 0.6, bk, 0.55, m));
  return <g key={k}>{out}</g>;
};

export const MODE: Record<string, {bg: string; bar: string; glow: string}> = {
  off: {bg: '#0b0e22', bar: '#1c2244', glow: '#2dd4ff'},
  menu: {bg: '#101a46', bar: '#2dd4ff', glow: '#2dd4ff'},
  happy: {bg: '#ff4f7b', bar: '#ffd27a', glow: '#ff3d9a'},
  event: {bg: '#5b3bd8', bar: '#2dd4ff', glow: '#8b5cf6'},
  ad: {bg: '#ffc61a', bar: '#161830', glow: '#ffb627'},
};

/** Miniatur des Tischdisplays (hochkant, Schrägfuß) auf dem Tisch. */
export const miniDisplay = (k: React.Key, x: number, y: number, z: number, mode: keyof typeof MODE, t: number, phase = 0, scale = 1) => {
  const c = MODE[mode];
  const pulse = 0.5 + 0.5 * Math.sin(t * 4 + phase);
  const w = 0.42 * scale;
  const h = 0.86 * scale;
  const d = 0.14 * scale;
  const out: React.ReactNode[] = [];
  out.push(<polygon key="g" points={pts(ring(x, y, z + 0.01, 0.95 * scale))} fill={c.glow} opacity={0.14 + 0.12 * pulse} />);
  out.push(<polygon key="g2" points={pts(ring(x, y, z + 0.012, 0.6 * scale))} fill={c.glow} opacity={0.12 + 0.12 * pulse} />);
  out.push(box('base', x - 0.26 * scale, y - 0.2 * scale, z, 0.52 * scale, 0.42 * scale, 0.07 * scale, mat('#1b1e36')));
  out.push(box('body', x - w / 2, y - d / 2, z + 0.07 * scale, w, d, h, mat('#0f1226')));
  const fy = y + d / 2 + 0.002;
  const sx0 = x - w / 2 + 0.03 * scale;
  const sx1 = x + w / 2 - 0.03 * scale;
  const sz0 = z + 0.2 * scale;
  const sz1 = z + 0.07 * scale + h - 0.05 * scale;
  out.push(wallR('scr', fy, sx0, sx1, sz0, sz1, c.bg));
  const rows = mode === 'menu' ? 3 : 1;
  for (let i = 0; i < rows; i++) {
    const a = sz1 - 0.06 * scale - i * 0.2 * scale;
    out.push(wallR(`r${i}`, fy + 0.001, sx0 + 0.03 * scale, sx1 - 0.03 * scale, a - (mode === 'menu' ? 0.14 : 0.24) * scale, a, c.bar, {opacity: mode === 'menu' ? 0.5 : 0.9}));
  }
  out.push(wallR('shine', fy + 0.002, sx0, sx0 + 0.07 * scale, sz0, sz1, 'rgba(255,255,255,.12)'));
  return <g key={k}>{out}</g>;
};

export const table = (k: React.Key, x: number, y: number, r = 0.85, topColor = '#f1e3cc') => {
  const tm = mat(topColor);
  return (
    <g key={k}>
      {shadowEllipse('sh', x + 0.2, y + 0.2, r * 62, r * 30, 0.35)}
      {cyl('base', x, y, 0, 0.36, 0.06, mat('#262a45'))}
      {cyl('ped', x, y, 0.06, 0.1, 0.7, mat('#262a45'))}
      {cyl('top', x, y, 0.76, r, 0.07, tm)}
    </g>
  );
};

const plate = (k: React.Key, x: number, y: number, z: number, r = 0.2, col = '#ffffff') => (
  <polygon key={k} points={pts(ring(x, y, z, r, 16))} fill={col} />
);
const glass = (k: React.Key, x: number, y: number, z: number, col = '#9fe8ff') => (
  <g key={k}>
    {cyl('g', x, y, z, 0.07, 0.2, {top: lighten(col, 0.4), left: col, right: darken(col, 0.25)})}
  </g>
);
export const tableware = (k: React.Key, x: number, y: number, z: number, variant = 0) => (
  <g key={k}>
    {plate('p1', x + 0.35, y - 0.25, z, 0.17, variant % 2 ? '#e8b25a' : '#ffffff')}
    {plate('p2', x - 0.3, y + 0.3, z, 0.17, '#ffffff')}
    {glass('a', x + 0.45, y + 0.25, z, variant % 2 ? '#ffb86b' : '#8fe9ff')}
    {glass('b', x - 0.4, y - 0.3, z, '#ff9ac8')}
  </g>
);

export type Look = {skin: string; hair: string; hs: HairStyle; shirt: string; beard?: boolean; glasses?: boolean};
export const person = (k: React.Key, x: number, y: number, z: number, look: Look, pose: Pose, frame: number, phase: number, scale = 0.2) => {
  const p = P(x, y, z);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y}) scale(${scale}) translate(-150 -440)`}>
      <SeatedPerson bare skin={look.skin} hair={look.hair} hairStyle={look.hs} shirt={look.shirt} pose={pose} frame={frame} phase={phase} beard={look.beard} glasses={look.glasses} />
    </g>
  );
};

const PIN =
  'M0 -300C-22 -300 -30 -274 -24 -246C-18 -222 -30 -196 -38 -150C-48 -96 -42 -40 -34 -10Q-30 0 -20 0H20Q30 0 34 -10C42 -40 48 -96 38 -150C30 -196 18 -222 24 -246C30 -274 22 -300 0 -300Z';
export const pinSprite = (k: React.Key, sx: number, sy: number, scale: number, rot = 0) => (
  <g key={k} transform={`translate(${sx} ${sy}) rotate(${rot}) scale(${scale})`}>
    <ellipse cx="0" cy="2" rx="38" ry="12" fill="rgba(0,0,0,.28)" />
    <path d={PIN} fill="#f4f6ff" />
    <path d={PIN} fill="url(#pinShade)" />
    <path d="M-23 -240H23V-226H-23Z M-27 -214H27V-198H-27Z" fill="#e5445a" />
  </g>
);

export const ballSprite = (k: React.Key, sx: number, sy: number, r: number, spin: number) => (
  <g key={k} transform={`translate(${sx} ${sy})`}>
    <ellipse cx="0" cy={r * 0.9} rx={r * 1.1} ry={r * 0.4} fill="rgba(0,0,0,.35)" />
    <circle r={r} fill="url(#ballGrad)" />
    <g transform={`rotate(${spin})`}>
      {[[-0.3, -0.35], [0.05, -0.5], [-0.08, -0.1]].map(([hx, hy], i) => (
        <circle key={i} cx={hx * r} cy={hy * r} r={r * 0.13} fill="#030823" />
      ))}
    </g>
    <ellipse cx={-r * 0.35} cy={-r * 0.42} rx={r * 0.3} ry={r * 0.16} fill="rgba(255,255,255,.55)" transform={`rotate(-35 ${-r * 0.35} ${-r * 0.42})`} />
  </g>
);

/** Auto (Länge entlang gy), x/y = Ecke, Karosserie in Farbe c. */
export const carAlongY = (k: React.Key, x: number, y: number, c: string, lights = true) => {
  const body = mat(c);
  const glassM: Mat = {top: '#a9d8f4', left: '#7fb8dc', right: '#5f95b8'};
  return (
    <g key={k}>
      {shadowEllipse('sh', x + 0.5, y + 1.0, 60, 30, 0.35)}
      {box('b', x, y, 0.14, 1.0, 2.1, 0.42, body)}
      {box('c', x + 0.08, y + 0.5, 0.56, 0.84, 1.1, 0.34, glassM)}
      <g transform={wallLM(x + 1.0, y + 2.1, 0)}>
        {[44, 168].map((u) => (
          <g key={u}>
            <ellipse cx={u} cy={-22} rx="19" ry="19" fill="#12142a" />
            <ellipse cx={u} cy={-22} rx="9" ry="9" fill="#9aa2c4" />
          </g>
        ))}
      </g>
      {lights && <polygon points={pts([[x + 0.05, y + 2.1, 0.32], [x + 0.35, y + 2.1, 0.32], [x + 0.35, y + 2.1, 0.46], [x + 0.05, y + 2.1, 0.46]])} fill="#fff3b0" />}
    </g>
  );
};
export const carAlongX = (k: React.Key, x: number, y: number, z: number, c: string) => {
  const body = mat(c);
  const glassM: Mat = {top: '#a9d8f4', left: '#7fb8dc', right: '#5f95b8'};
  return (
    <g key={k}>
      {box('b', x, y, z + 0.14, 2.1, 1.0, 0.42, body)}
      {box('c', x + 0.5, y + 0.08, z + 0.56, 1.1, 0.84, 0.34, glassM)}
      <g transform={wallRM(x, y + 1.0, z)}>
        {[44, 168].map((u) => (
          <g key={u}>
            <ellipse cx={u} cy={-22} rx="19" ry="19" fill="#12142a" />
            <ellipse cx={u} cy={-22} rx="9" ry="9" fill="#9aa2c4" />
          </g>
        ))}
      </g>
    </g>
  );
};

export const plant = (k: React.Key, x: number, y: number, s = 1) => {
  const p = P(x, y, 0);
  return (
    <g key={k} transform={`translate(${p.X} ${p.Y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="28" ry="11" fill="rgba(0,0,0,.3)" />
      <path d="M-18 -36 L18 -36 L12 2 L-12 2Z" fill="#b9553b" />
      {[[-18, -64, -28], [0, -80, 0], [18, -62, 28], [-6, -56, -10]].map(([lx, ly, r], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx="12" ry="30" fill={i % 2 ? '#2a8a5a' : '#1d7048'} transform={`rotate(${r} ${lx} ${ly + 20})`} />
      ))}
    </g>
  );
};

export const pbox = poly;
export {flat};
