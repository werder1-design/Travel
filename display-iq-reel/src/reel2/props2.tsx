import React from 'react';
import {C} from '../theme';
import {lighten, darken, mat} from '../iso/colors';
import {P, box, cyl, flat, pts, ring, shadowEllipse, wallR, wallRM, wallLM, poly} from '../iso/iso';
import {rand, clamp01} from '../ease';

/** Farbwelten der Tischdisplays (Miniatur) – inkl. Theater-Werbung. */
export const MODE2: Record<string, {bg: string; bar: string; glow: string}> = {
  off: {bg: '#0b0e22', bar: '#1c2244', glow: '#2dd4ff'},
  menu: {bg: '#101a46', bar: '#2dd4ff', glow: '#2dd4ff'},
  happy: {bg: '#ff4f7b', bar: '#ffd27a', glow: '#ff3d9a'},
  pasta: {bg: '#ff8a3d', bar: '#fff1c9', glow: '#ff9a3c'},
  music: {bg: '#5b3bd8', bar: '#2dd4ff', glow: '#8b5cf6'},
  theater: {bg: '#a3122a', bar: '#ffd27a', glow: '#ffb627'},
};

/** Transparenter Acryl-Tischaufsteller (L-Form) mit gedruckter Karte – nach dem Referenzfoto. */
export const acrylicStand = (k: React.Key, x: number, y: number, z: number, card: number, opts: {scale?: number; alpha?: number; wobble?: number} = {}) => {
  const s = opts.scale ?? 1;
  const alpha = opts.alpha ?? 1;
  const w = 0.5 * s;
  const h = 0.78 * s;
  const fy = y + 0.02;
  const palette = [['#7fb23a', '#f3f6ea'], ['#e8a13a', '#fff6e6'], ['#d9466f', '#fdeff3'], ['#3a8fd9', '#eef6fd']][card % 4];
  const out: React.ReactNode[] = [];
  // Fuß (transparente Platte)
  out.push(poly('foot', [[x - w * 0.6, y - 0.05 * s, z], [x + w * 0.6, y - 0.05 * s, z], [x + w * 0.6, y + 0.32 * s, z], [x - w * 0.6, y + 0.32 * s, z]], 'rgba(235,245,255,.35)', {stroke: 'rgba(255,255,255,.8)', strokeWidth: 1.2}));
  // Rückwand der Halterung (transparent)
  out.push(wallR('back', fy, x - w / 2, x + w / 2, z + 0.02, z + h, 'rgba(225,238,255,.20)', {stroke: 'rgba(255,255,255,.85)', strokeWidth: 1.5}));
  // gedruckte Karte
  out.push(wallR('card', fy + 0.002, x - w / 2 + 0.04 * s, x + w / 2 - 0.04 * s, z + 0.08 * s, z + h - 0.08 * s, palette[1]));
  out.push(wallR('head', fy + 0.003, x - w / 2 + 0.04 * s, x + w / 2 - 0.04 * s, z + h - 0.26 * s, z + h - 0.08 * s, palette[0]));
  for (let i = 0; i < 5; i++) out.push(wallR(`l${i}`, fy + 0.003, x - w / 2 + 0.09 * s, x + w / 2 - 0.09 * s - (i % 2) * 0.08 * s, z + h - 0.36 * s - i * 0.085 * s, z + h - 0.325 * s - i * 0.085 * s, '#9a9a9a', {opacity: 0.8}));
  out.push(wallR('img', fy + 0.003, x - 0.12 * s, x + 0.12 * s, z + 0.12 * s, z + 0.3 * s, palette[0], {opacity: 0.55}));
  out.push(wallR('shine', fy + 0.004, x - w / 2, x - w / 2 + 0.06 * s, z + 0.02, z + h, 'rgba(255,255,255,.35)'));
  return (
    <g key={k} opacity={alpha}>
      {out}
    </g>
  );
};

/** Hochkant-Tischdisplay mit Schrägfuß (Miniatur) – wie das Produktfoto. */
export const displayDevice = (k: React.Key, x: number, y: number, z: number, mode: keyof typeof MODE2, t: number, scale = 1, phase = 0, charging = false) => {
  const c = MODE2[mode];
  const pulse = 0.5 + 0.5 * Math.sin(t * 4 + phase);
  const w = 0.44 * scale;
  const h = 0.9 * scale;
  const d = 0.15 * scale;
  const out: React.ReactNode[] = [];
  out.push(<polygon key="g" points={pts(ring(x, y, z + 0.01, 0.95 * scale))} fill={c.glow} opacity={0.14 + 0.1 * pulse} />);
  out.push(box('base', x - 0.27 * scale, y - 0.2 * scale, z, 0.54 * scale, 0.42 * scale, 0.08 * scale, mat('#1b1e36')));
  out.push(box('body', x - w / 2, y - d / 2, z + 0.08 * scale, w, d, h, mat('#0f1226')));
  const fy = y + d / 2 + 0.002;
  const sx0 = x - w / 2 + 0.03 * scale;
  const sx1 = x + w / 2 - 0.03 * scale;
  const sz0 = z + 0.22 * scale;
  const sz1 = z + 0.08 * scale + h - 0.05 * scale;
  out.push(wallR('scr', fy, sx0, sx1, sz0, sz1, c.bg));
  const rows = mode === 'menu' ? 3 : 1;
  for (let i = 0; i < rows; i++) {
    const a = sz1 - 0.06 * scale - i * 0.2 * scale;
    out.push(wallR(`r${i}`, fy + 0.001, sx0 + 0.03 * scale, sx1 - 0.03 * scale, a - (mode === 'menu' ? 0.14 : 0.26) * scale, a, c.bar, {opacity: mode === 'menu' ? 0.5 : 0.9}));
  }
  out.push(wallR('shine', fy + 0.002, sx0, sx0 + 0.07 * scale, sz0, sz1, 'rgba(255,255,255,.12)'));
  if (charging) out.push(box('usb', x - w / 2 - 0.1 * scale, y - 0.05 * scale, z + 0.14 * scale, 0.1 * scale, 0.1 * scale, 0.05 * scale, mat('#8d94b3')));
  return <g key={k}>{out}</g>;
};

/** Verwandlung Aufsteller → Display (p: 0…1) mit Partikeln und Lichtring. */
export const transformStand = (k: React.Key, x: number, y: number, z: number, p: number, card: number, mode: keyof typeof MODE2, t: number, phase: number, scale = 1.0) => {
  const base = P(x, y, z);
  const e = (v: number) => clamp01(v);
  const standOut = e(p / 0.32);
  const dispIn = e((p - 0.22) / 0.5);
  const overshoot = dispIn < 1 ? 1 + Math.sin(dispIn * Math.PI) * 0.18 : 1;
  const parts: React.ReactNode[] = [];
  if (p > 0.04 && p < 0.9) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + rand(i) * 0.6;
      const q = e((p - 0.06) / 0.7);
      const r = (30 + rand(i + 5) * 70) * q;
      parts.push(
        <rect key={i} x={base.X + Math.cos(a) * r - 4} y={base.Y - 40 + Math.sin(a) * r * 0.6 - q * 40 - 4} width="8" height="8" rx="2" fill={i % 2 ? '#fff' : MODE2[mode].glow} opacity={(1 - q) * 0.95} transform={`rotate(${q * 220} ${base.X + Math.cos(a) * r} ${base.Y - 40 + Math.sin(a) * r * 0.6})`} />,
      );
    }
  }
  const ringP = e((p - 0.2) / 0.6);
  return (
    <g key={k}>
      {ringP > 0 && ringP < 1 && <polygon points={pts(ring(x, y, z + 0.02, 0.4 + ringP * 1.9, 32))} fill="none" stroke={MODE2[mode].glow} strokeWidth={5 * (1 - ringP) + 1} opacity={0.9 * (1 - ringP)} />}
      {standOut < 1 && (
        <g transform={`translate(${base.X} ${base.Y}) scale(${1 - standOut * 0.25} ${1 - standOut * 0.9}) translate(${-base.X} ${-base.Y})`} opacity={1 - standOut}>
          {acrylicStand('st', x, y, z, card, {scale})}
        </g>
      )}
      {dispIn > 0 && (
        <g transform={`translate(${base.X} ${base.Y}) scale(${overshoot * (0.25 + 0.75 * dispIn)}) translate(${-base.X} ${-base.Y})`} opacity={Math.min(1, dispIn * 2)}>
          {displayDevice('dv', x, y, z, mode, t, scale, phase)}
        </g>
      )}
      {parts}
    </g>
  );
};

export const printer = (k: React.Key, x: number, y: number, z: number, printing: number) => {
  // printing 0…1: Papier läuft aus dem Ausgabefach
  const out: React.ReactNode[] = [];
  out.push(box('body', x, y, z, 0.9, 1.1, 0.42, {top: '#e9ecf7', left: '#c9cde0', right: '#a5abc6'}));
  out.push(box('top', x + 0.1, y + 0.1, z + 0.42, 0.7, 0.7, 0.1, {top: '#2a2d44', left: '#1d2033', right: '#13152a'}));
  out.push(box('tray', x + 0.9, y + 0.15, z + 0.1, 0.45, 0.8, 0.04, {top: '#cfd3e6', left: '#aeb3c9', right: '#8d93ad'}));
  if (printing > 0) {
    const run = (Math.sin(printing * 40) * 0.5 + 0.5) * 0.25;
    out.push(box('sheet', x + 0.95, y + 0.25 + run * 0.1, z + 0.14, 0.35 + run, 0.6, 0.02, {top: '#fff', left: '#e5e7f0', right: '#cfd2e2'}));
  }
  out.push(box('led', x + 0.7, y + 1.1, z + 0.28, 0.06, 0.02, 0.05, {top: '#34e3a0', left: '#34e3a0', right: '#34e3a0'}));
  return <g key={k}>{out}</g>;
};

export const paperStack = (k: React.Key, x: number, y: number, z: number, n: number, w = 0.55, d = 0.75) => {
  const out: React.ReactNode[] = [];
  const layers = Math.max(0, Math.min(40, Math.round(n)));
  for (let i = 0; i < layers; i++) {
    const jx = (rand(i * 3.1) - 0.5) * 0.05;
    const jy = (rand(i * 1.7) - 0.5) * 0.05;
    out.push(box(`p${i}`, x + jx, y + jy, z + i * 0.035, w, d, 0.03, {top: i % 5 === 0 ? '#f4efe0' : '#ffffff', left: '#dcdfec', right: '#c0c4d8'}));
  }
  return <g key={k}>{out}</g>;
};

export const phoneOnTable = (k: React.Key, x: number, y: number, z: number, t: number, level: number) => {
  const p = P(x, y, z + 0.03);
  const pulse = 0.6 + 0.4 * Math.sin(t * 5);
  return (
    <g key={k}>
      {box('ph', x - 0.18, y - 0.3, z, 0.36, 0.6, 0.04, {top: '#14172b', left: '#0b0d1b', right: '#060713'})}
      {flat('scr', x - 0.15, y - 0.27, x + 0.15, y + 0.27, z + 0.041, `rgba(52,227,160,${0.35 + 0.3 * pulse})`)}
      <g transform={`translate(${p.X} ${p.Y - 14})`}>
        <path d="M2 -16 L-7 2 H0 L-3 14 L8 -5 H1Z" fill="#34e3a0" opacity={0.7 + 0.3 * pulse} style={{filter: 'drop-shadow(0 0 6px #34e3a0)'}} />
        <text x="14" y="6" fontFamily="Anton" fontSize="16" fill="#eafff6">{Math.round(level)}%</text>
      </g>
    </g>
  );
};

/** Verbindungskabel Display → Smartphone (Bogen in Iso-Raum). */
export const cable = (k: React.Key, a: readonly [number, number, number], b: readonly [number, number, number], color = '#dfe6ff') => {
  const pa = P(...a);
  const pb = P(...b);
  const mx = (pa.X + pb.X) / 2;
  const my = Math.max(pa.Y, pb.Y) + 14;
  return (
    <g key={k}>
      <path d={`M${pa.X} ${pa.Y} Q${mx} ${my} ${pb.X} ${pb.Y}`} fill="none" stroke="#0a0b14" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${pa.X} ${pa.Y} Q${mx} ${my} ${pb.X} ${pb.Y}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity=".85" />
    </g>
  );
};

/** Animierte Verbindungslinie im Raum mit wandernden Punkten. */
export const flowLine = (k: React.Key, a: readonly [number, number, number], b: readonly [number, number, number], t: number, color: string, opts: {lift?: number; speed?: number; dots?: number; width?: number; progress?: number; coin?: boolean} = {}) => {
  const lift = opts.lift ?? 2.2;
  const pa = P(...a);
  const pb = P(...b);
  const mx = (pa.X + pb.X) / 2;
  const my = (pa.Y + pb.Y) / 2 - lift * 56;
  const prog = opts.progress ?? 1;
  const path = `M${pa.X} ${pa.Y} Q${mx} ${my} ${pb.X} ${pb.Y}`;
  const dots = opts.dots ?? 4;
  const speed = opts.speed ?? 0.5;
  const els: React.ReactNode[] = [];
  for (let i = 0; i < dots; i++) {
    const u = ((t * speed + i / dots) % 1) * prog;
    const x = (1 - u) * (1 - u) * pa.X + 2 * (1 - u) * u * mx + u * u * pb.X;
    const y = (1 - u) * (1 - u) * pa.Y + 2 * (1 - u) * u * my + u * u * pb.Y;
    els.push(opts.coin ? (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r="11" fill="#ffc247" stroke="#b7791f" strokeWidth="2" />
        <text y="5" textAnchor="middle" fontFamily="Anton" fontSize="14" fill="#7a4a00">€</text>
      </g>
    ) : <circle key={i} cx={x} cy={y} r="7" fill="#fff" style={{filter: `drop-shadow(0 0 8px ${color})`}} />);
  }
  return (
    <g key={k}>
      <path d={path} fill="none" stroke={color} strokeWidth={(opts.width ?? 4) + 6} opacity=".12" strokeLinecap="round" pathLength={1} strokeDasharray={`${prog} 2`} />
      <path d={path} fill="none" stroke={color} strokeWidth={opts.width ?? 4} opacity=".75" strokeLinecap="round" strokeDasharray="10 9" strokeDashoffset={-t * 60} />
      {els}
    </g>
  );
};

/** Theater-Gebäude (Fassade zur gy+-Seite) mit Leuchtreklame. */
export const theater = (k: React.Key, x: number, y: number, w: number, d: number, t: number, lit: number) => {
  const H = 5.6;
  const out: React.ReactNode[] = [];
  const stone = {top: '#e8dcc6', left: '#cfae86', right: '#9d7f5f'};
  out.push(shadowEllipse('sh', x + w / 2, y + d + 0.6, w * 48, 40, 0.3));
  out.push(box('main', x, y, 0, w, d, H, stone));
  out.push(box('cornice', x - 0.2, y - 0.2, H, w + 0.4, d + 0.4, 0.35, {top: '#f1e6d0', left: '#d9bc92', right: '#a98a68'}));
  // Säulen an der Fassade
  for (let i = 0; i < 5; i++) out.push(box(`col${i}`, x + 0.9 + i * ((w - 2.2) / 4), y + d, 0, 0.45, 0.35, H - 0.4, {top: '#fff7e6', left: '#f0e1c6', right: '#bfa57f'}));
  // Eingang
  out.push(wallR('door', y + d + 0.001, x + w / 2 - 1.1, x + w / 2 + 1.1, 0, 2.6, '#7a1020'));
  out.push(wallR('doorL', y + d + 0.002, x + w / 2 - 0.02, x + w / 2 + 0.02, 0, 2.6, '#e9c46a'));
  out.push(box('steps', x + w / 2 - 1.6, y + d, 0, 3.2, 0.9, 0.18, {top: '#e8dcc6', left: '#cfae86', right: '#9d7f5f'}));
  const g = 0.55 + 0.45 * lit;
  // Reklame-Schild
  out.push(
    <g key="sign" transform={wallRM(x + 1.2, y + d + 0.02, H - 0.55)}>
      <rect x="0" y="0" width={(w - 2.4) * 96} height="150" rx="14" fill="#2a0a10" stroke="#ffc247" strokeWidth="6" />
      {Array.from({length: Math.floor(((w - 2.4) * 96) / 26)}).map((_, i) => (
        <circle key={i} cx={14 + i * 26} cy={12} r="5" fill="#ffd978" opacity={0.4 + 0.6 * lit * (0.5 + 0.5 * Math.sin(t * 6 + i))} />
      ))}
      <text x={((w - 2.4) * 96) / 2} y="112" textAnchor="middle" fontFamily="Anton" fontSize="104" fill="#ffd978" letterSpacing="6" style={{filter: lit > 0.5 ? 'drop-shadow(0 0 12px #ffb627)' : undefined}} opacity={0.35 + 0.65 * lit}>THEATER</text>
    </g>,
  );
  // Plakate
  [x + 1.0, x + w - 2.0].forEach((px, i) =>
    out.push(
      <g key={`poster${i}`} transform={wallRM(px, y + d + 0.02, 3.4)}>
        <rect x="0" y="0" width="82" height="118" fill="#f4e8cf" />
        <rect x="6" y="6" width="70" height="106" fill={i ? '#233a8a' : '#a3122a'} />
        <circle cx="41" cy="44" r="20" fill="#ffd978" opacity={0.9} />
        <rect x="16" y="78" width="50" height="8" fill="#fff" opacity=".8" />
        <rect x="22" y="94" width="38" height="6" fill="#fff" opacity=".6" />
      </g>,
    ),
  );
  // Lichtkegel
  out.push(<polygon key="beam" points={pts([[x + w / 2 - 0.7, y + d + 0.4, 0.1], [x + w / 2 + 0.7, y + d + 0.4, 0.1], [x + w / 2 + 2.2, y + d + 3.2, 0.0], [x + w / 2 - 2.2, y + d + 3.2, 0.0]])} fill={`rgba(255,200,110,${0.2 * g})`} />);
  return <g key={k}>{out}</g>;
};

/** Kleines Restaurant (Stadtblock) mit Markise und Dach-Display-Marker. */
export const miniRestaurant = (k: React.Key, x: number, y: number, hue: number, t: number, glow: string, glowAmt: number) => {
  const walls = [mat('#d9b48c'), mat('#c98f6b'), mat('#e0c9a2'), mat('#b87a5a')][hue % 4];
  const awn = ['#c4453a', '#2f7f86', '#d9a13a', '#7a4ab8'][hue % 4];
  const out: React.ReactNode[] = [];
  out.push(shadowEllipse('sh', x + 4, y + 7.5, 210, 70, 0.28));
  out.push(box('b', x, y, 0, 8, 6.6, 3.0, walls));
  out.push(box('roof', x - 0.2, y - 0.2, 3.0, 8.4, 7.0, 0.22, {top: '#6a4b3c', left: '#4a3329', right: '#392820'}));
  out.push(wallR('awn', y + 6.6 + 0.02, x + 0.5, x + 7.5, 1.9, 2.5, awn));
  out.push(wallR('win', y + 6.6 + 0.02, x + 1.0, x + 7.0, 0.5, 1.7, 'rgba(255,200,120,.75)'));
  out.push(wallR('door', y + 6.6 + 0.02, x + 3.6, x + 4.4, 0, 1.5, '#4a2a1c'));
  const base = P(x + 4, y + 3.3, 3.2);
  const pulse = 0.5 + 0.5 * Math.sin(t * 4 + hue);
  out.push(
    <g key="mk" transform={`translate(${base.X} ${base.Y})`}>
      <ellipse cx="0" cy="4" rx="46" ry="16" fill={glow} opacity={0.22 + glowAmt * 0.3 * pulse} />
      <rect x="-9" y="-44" width="18" height="40" rx="3" fill="#0f1226" stroke={glow} strokeWidth="2" />
      <rect x="-6" y="-40" width="12" height="28" fill={glow} opacity={0.75 + 0.25 * glowAmt} />
    </g>,
  );
  return <g key={k}>{out}</g>;
};
