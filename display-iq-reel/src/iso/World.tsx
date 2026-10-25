import React from 'react';
import {C, FPS} from '../theme';
import {IN_OUT, OUT, clamp01, lerp, prog, rand} from '../ease';
import {Waiter} from '../components/People';
import {Mat, darken, lighten, mat} from './colors';
import {P, V3, box, cyl, flat, floorM, poly, pts, ring, shadowEllipse, wallL, wallLM, wallR, wallRM} from './iso';
import {Item, Look, ballColored, ballReturn, ballSprite, bench, carAlongX, carAlongY, diningChair, lamp, miniDisplay, person, pinSprite, plant, railBalls, rectTable, tableLamp, tableware, tree} from './props';
import {SKIN} from '../components/People';

export type IsoCam = {gx: number; gy: number; gz: number; zoom: number; cy?: number};
export const SCREEN_CY = 940;

export const camOrigin = (c: IsoCam) => P(c.gx, c.gy, c.gz);
export const worldToScreen = (x: number, y: number, z: number, c: IsoCam) => {
  const o = camOrigin(c);
  const p = P(x, y, z);
  return {x: 540 + (p.X - o.X) * c.zoom, y: (c.cy ?? SCREEN_CY) + (p.Y - o.Y) * c.zoom};
};

// ---------- Geometrie ----------
const HALL = {W: 22, D: 15, H: 4.6};
/** Bahn-Mittelachsen (gx). Bahnen laufen entlang gy: Pins an der rechten Rückwand (gy ≈ 1–3), Anwurf bei gy ≈ 7. */
export const LANES_X = [3.6, 6.9, 10.2, 13.5, 16.8, 20.1];
export const PIN_Y = 2.55;
const TABLE_Y = 11.5;

/** Tische stehen direkt in der Verlängerung der Bahnen (Sitzen & Spielen). Index 0 = Held-Tisch der vier Freunde. */
export const TABLES = [
  {x: LANES_X[1], y: TABLE_Y},
  {x: LANES_X[2], y: TABLE_Y},
  {x: LANES_X[3], y: TABLE_Y},
  {x: LANES_X[4], y: TABLE_Y},
  {x: LANES_X[5], y: TABLE_Y},
  {x: LANES_X[0], y: TABLE_Y},
];
export const BAR = {x: 1.2, y: 11.9};

const LOOKS: Look[] = [
  {skin: SKIN[0], hair: '#2B1E1A', hs: 'short', shirt: '#2DD4FF'},
  {skin: SKIN[2], hair: '#171717', hs: 'long', shirt: '#FF3D9A', glasses: true},
  {skin: SKIN[1], hair: '#5B3A24', hs: 'cap', shirt: '#FFB627', beard: true},
  {skin: SKIN[4], hair: '#8A4B2A', hs: 'bun', shirt: '#8B5CF6'},
  {skin: SKIN[3], hair: '#111111', hs: 'curly', shirt: '#34E3A0'},
  {skin: SKIN[0], hair: '#C9A15A', hs: 'long', shirt: '#FF7A59'},
  {skin: SKIN[1], hair: '#222222', hs: 'short', shirt: '#E5445A'},
  {skin: SKIN[4], hair: '#5B3A24', hs: 'bun', shirt: '#2F7F86'},
];

// Strikes: Bahn-Index, Startposition (gy), Startzeit, Trefferzeit
export type Strike = {lane: number; from: number; start: number; hit: number};
export const STRIKES: Strike[] = [
  {lane: 2, from: 8.2, start: 0.35, hit: 2.9},
  {lane: 1, from: 6.2, start: 22.45, hit: 23.55},
  {lane: 3, from: 6.6, start: 50.35, hit: 51.5},
];

export const modeFor = (i: number, t: number): 'off' | 'menu' | 'happy' | 'event' | 'ad' => {
  if (i === 0) {
    if (t < 25.3) return 'menu';
    if (t < 28.1) return 'happy';
    if (t < 29.8) return 'event';
    if (t < 33.6) return 'happy';
    if (t < 38.1) return 'menu';
    if (t < 46.4) return 'ad';
    return 'menu';
  }
  if (t < 40.4) return (['menu', 'menu', 'off', 'menu', 'off', 'menu'] as const)[i];
  const cyc = ['ad', 'happy', 'menu', 'event', 'ad', 'happy'] as const;
  return cyc[(i + Math.floor((t - 40.4) / 1.4)) % cyc.length];
};

// ---------- Hilfen ----------
const pathOf = (a: readonly V3[]) => {
  const pp = a.map(([x, y, z]) => P(x, y, z));
  return `M${pp.map((p) => `${p.X.toFixed(1)} ${p.Y.toFixed(1)}`).join('L')}Z`;
};
const windowsR = (y: number, x0: number, x1: number, z0: number, z1: number, cols: number, rows: number, seed: number) => {
  let d = '';
  const cw = (x1 - x0) / cols;
  const rh = (z1 - z0) / rows;
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      if (rand(seed + c * 7.1 + r * 3.3) < 0.35) continue;
      d += pathOf([[x0 + c * cw + cw * 0.2, y, z0 + r * rh + rh * 0.2], [x0 + c * cw + cw * 0.8, y, z0 + r * rh + rh * 0.2], [x0 + c * cw + cw * 0.8, y, z0 + r * rh + rh * 0.8], [x0 + c * cw + cw * 0.2, y, z0 + r * rh + rh * 0.8]]);
    }
  return d;
};
const windowsL = (x: number, y0: number, y1: number, z0: number, z1: number, cols: number, rows: number, seed: number) => {
  let d = '';
  const cw = (y1 - y0) / cols;
  const rh = (z1 - z0) / rows;
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      if (rand(seed + c * 5.7 + r * 2.9) < 0.35) continue;
      d += pathOf([[x, y0 + c * cw + cw * 0.2, z0 + r * rh + rh * 0.2], [x, y0 + c * cw + cw * 0.8, z0 + r * rh + rh * 0.2], [x, y0 + c * cw + cw * 0.8, z0 + r * rh + rh * 0.8], [x, y0 + c * cw + cw * 0.2, z0 + r * rh + rh * 0.8]]);
    }
  return d;
};

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="pinShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="rgba(120,130,190,.25)" />
      <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
      <stop offset="1" stopColor="rgba(80,90,150,.35)" />
    </linearGradient>
    <radialGradient id="ballGrad" cx="0.32" cy="0.3" r="0.9">
      <stop offset="0" stopColor="#8DEBFF" />
      <stop offset="0.45" stopColor="#2F6BFF" />
      <stop offset="1" stopColor="#0A1450" />
    </radialGradient>
    <filter id="neonGlow" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="5" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    {['#e5445a', '#2f6bff', '#34c47c', '#ff9a3c', '#14b8c4', '#a855f7'].map((c, i) => (
      <radialGradient key={i} id={`ballC${i}`} cx="0.32" cy="0.3" r="0.9">
        <stop offset="0" stopColor={lighten(c, 0.5)} />
        <stop offset="0.5" stopColor={c} />
        <stop offset="1" stopColor={darken(c, 0.55)} />
      </radialGradient>
    ))}
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0a1030" />
      <stop offset="1" stopColor="#14264e" />
    </linearGradient>
  </defs>
);

// Liegt ein Außenobjekt (Baum, Lampe, Auto) hinter einer Schnittwand? Dann wird es vor den Wänden gezeichnet.
const SHOP = {x: 29, y: 1, w: 12, d: 10};
const behindWalls = (x: number, y: number) =>
  (x < 0.2 && y > -1.5 && y < HALL.D + 1.5) ||
  (y < 0.2 && x > -1.5 && x < HALL.W + 1.5) ||
  (x < SHOP.x + 0.2 && x > 20 && y > SHOP.y - 1.5 && y < SHOP.y + SHOP.d + 1.5) ||
  (y < SHOP.y + 0.2 && x > SHOP.x - 1.5 && x < SHOP.x + SHOP.w + 1.5);

// ---------- Statische Szene ----------
const buildStatic = () => {
  const far: React.ReactNode[] = [];
  const floors: React.ReactNode[] = [];
  const hw: React.ReactNode[] = [];
  const sw: React.ReactNode[] = [];
  let cur = floors;
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode) => items.push({k, n});
  const addExt = (x: number, y: number, n: React.ReactNode, kOff = 0) => items.push({k: x + y + kOff, n, b: behindWalls(x, y)});
  const {W: HW, D: HD, H: HH} = HALL;

  // --- Stadt im Hintergrund (hinter der rechten Rückwand und links hinter der linken Wand)
  const bld = (k: string, x: number, y: number, w: number, d: number, h: number, seed: number, col: string) => {
    far.push(box(k, x, y, 0, w, d, h, mat(col)));
    far.push(<path key={k + 'wr'} d={windowsR(y + d + 0.002, x, x + w, 0.6, h - 0.4, Math.max(2, Math.floor(w / 0.9)), Math.max(2, Math.floor(h / 0.9)), seed)} fill="#f8d98a" opacity="0.85" />);
    far.push(<path key={k + 'wl'} d={windowsL(x + w + 0.002, y, y + d, 0.6, h - 0.4, Math.max(2, Math.floor(d / 0.9)), Math.max(2, Math.floor(h / 0.9)), seed + 9)} fill="#f8d98a" opacity="0.45" />);
  };
  [[-6, -17, 4, 3, 9, '#1b2a55'], [-1, -19, 5, 3.5, 12.5, '#223263'], [5, -16, 4, 3, 7.5, '#1a2650'], [10, -20, 5, 3, 14, '#243568'], [16, -17, 4.5, 3, 9.5, '#1c2b58'],
    [22, -19, 5, 3.5, 11.5, '#233466'], [28, -17, 4, 3, 8, '#1b2a55'], [33, -20, 5, 3, 13, '#243568'], [39, -17, 4, 3, 9, '#1c2b58']].forEach((b, i) =>
    bld(`bf${i}`, b[0] as number, b[1] as number, b[2] as number, b[3] as number, b[4] as number, i * 3.1, b[5] as string));
  [[-17, 2, 3, 4, 8, '#1b2a55'], [-17, 8, 3.5, 4, 11, '#223263'], [-16, 14, 3, 3.5, 7, '#1a2650'], [-18, 20, 3, 4, 10, '#243568']].forEach((b, i) =>
    bld(`bl${i}`, b[0] as number, b[1] as number, b[2] as number, b[3] as number, b[4] as number, 40 + i * 2.7, b[5] as string));

  // --- Boden außen: Pflaster + Straße
  cur.push(flat('gnd', -26, -26, 70, 44, -0.02, '#0e1a3e'));
  cur.push(flat('walk', -3, -3, 24.2, 18.2, -0.01, '#1a2a56'));
  cur.push(flat('walk2', 24.2, -6, 30, 30, -0.01, '#18274f'));
  cur.push(flat('road', 22.8, -26, 28.6, 44, -0.005, '#0f1836'));
  for (let y = -24; y < 42; y += 3) cur.push(flat(`rd${y}`, 25.4, y, 25.7, y + 1.5, 0.0, '#3a4a7e'));
  cur.push(flat('curb1', 22.5, -26, 22.8, 44, 0.0, '#2a3a6c'));
  cur.push(flat('curb2', 28.6, -26, 28.9, 44, 0.0, '#2a3a6c'));

  // --- Halle: Boden (warm, nach Referenzbild)
  cur = floors;
  const LX = LANES_X;
  cur.push(flat('hf', 0, 0, HW, HD, 0, '#1b151d'));
  cur.push(flat('lounge', 0, 9.0, HW, HD, 0.004, '#4a403f'));
  let tiles = '';
  for (let x = 0; x <= HW; x += 1.1) tiles += pathOf([[x - 0.015, 8.9, 0.006], [x + 0.015, 8.9, 0.006], [x + 0.015, HD, 0.006], [x - 0.015, HD, 0.006]]);
  for (let y = 8.9; y <= HD; y += 1.1) tiles += pathOf([[0, y - 0.015, 0.006], [HW, y - 0.015, 0.006], [HW, y + 0.015, 0.006], [0, y + 0.015, 0.006]]);
  cur.push(<path key="tiles" d={tiles} fill="rgba(255,255,255,.05)" />);
  // Warmes Licht unter den Tischen
  TABLES.forEach((tb, i) => cur.push(<polygon key={`pool${i}`} points={pts(ring(tb.x, tb.y, 0.012, 2.1, 32))} fill="rgba(255,170,90,.17)" />));
  LX.forEach((cx, i) => {
    cur.push(flat(`gut${i}`, cx - 1.42, 0.4, cx + 1.42, 9.0, 0.01, '#120d16'));
    cur.push(flat(`glow${i}`, cx - 1.42, 1.0, cx + 1.42, 8.9, 0.011, i % 2 ? '#a35bff' : '#58b6ff', {opacity: 0.16}));
    cur.push(flat(`pit${i}`, cx - 1.2, 0.4, cx + 1.2, 1.0, 0.012, '#07040b'));
    cur.push(flat(`ln${i}`, cx - 1.2, 1.0, cx + 1.2, 8.8, 0.02, '#e9c28b'));
    cur.push(flat(`ap${i}`, cx - 1.2, 6.7, cx + 1.2, 8.8, 0.022, '#f5dcb0'));
    cur.push(flat(`dk${i}`, cx - 1.2, 1.0, cx + 1.2, 3.2, 0.022, '#dbb076'));
    let boards = '';
    for (let o = -1.1; o <= 1.11; o += 0.22) boards += pathOf([[cx + o - 0.004, 1.0, 0.03], [cx + o + 0.004, 1.0, 0.03], [cx + o + 0.004, 8.8, 0.03], [cx + o - 0.004, 8.8, 0.03]]);
    cur.push(<path key={`bd${i}`} d={boards} fill="rgba(120,70,25,.26)" />);
    cur.push(flat(`sheen${i}`, cx - 0.4, 1.0, cx + 0.4, 8.8, 0.032, 'rgba(255,255,255,.2)'));
    cur.push(flat(`warm${i}`, cx - 1.2, 3.4, cx + 1.2, 6.2, 0.033, 'rgba(255,160,80,.14)'));
    cur.push(flat(`rl${i}`, cx - 1.29, 1.0, cx - 1.2, 8.8, 0.04, '#e6efff', {opacity: 0.9}));
    cur.push(flat(`rr${i}`, cx + 1.2, 1.0, cx + 1.29, 8.8, 0.04, '#e6efff', {opacity: 0.9}));
    cur.push(flat(`pg${i}`, cx - 1.2, 0.4, cx + 1.2, 2.7, 0.035, 'rgba(190,100,255,.3)'));
    cur.push(flat(`foul${i}`, cx - 1.2, 6.7, cx + 1.2, 6.78, 0.05, '#ffffff', {opacity: 0.9}));
    for (let a2 = -3; a2 <= 3; a2++) {
      const ax = cx + a2 * 0.3;
      const ay = 4.7 + (3 - Math.abs(a2)) * 0.28;
      cur.push(poly(`ar${i}${a2}`, [[ax, ay - 0.34, 0.05], [ax - 0.1, ay + 0.14, 0.05], [ax + 0.1, ay + 0.14, 0.05]], '#7a4a22', {opacity: 0.5}));
    }
  });

  // --- Wände (hell abgesetzte Kappen wie im Referenzbild)
  cur = hw;
  const capTop = '#cfc9c0';
  cur.push(box('wl', -0.4, -0.4, 0, 0.4, HD + 0.4, HH, {top: capTop, left: '#8d8780', right: '#6d4733'}));
  cur.push(box('wr', -0.4, -0.4, 0, HW + 0.4, 0.4, HH, {top: capTop, left: '#2a2838', right: '#8d8780'}));
  // linke Wand: Holzpaneel, Neon-Pin, Bilder, Wandleuchten
  cur.push(wallL('wlBase', 0, 0, HD, 0, HH, '#6d4733'));
  cur.push(wallL('wlBand', 0, 0, HD, 3.7, HH, '#7d5440'));
  let slats = '';
  for (let y = 0.3; y < HD; y += 0.55) slats += pathOf([[0, y, 0.0], [0, y + 0.03, 0.0], [0, y + 0.03, HH], [0, y, HH]]);
  cur.push(<path key="slats" d={slats} fill="rgba(0,0,0,.2)" />);
  cur.push(wallL('wlGlow', 0, 0, HD, 4.3, 4.4, '#ffb066', {opacity: 0.95}));
  cur.push(wallL('wlGlowB', 0, 0, HD, 4.0, 4.6, '#ffb066', {opacity: 0.14}));
  cur.push(
    <g key="neonPin" transform={wallLM(0, 8.4, 3.9)}>
      <g filter="url(#neonGlow)" fill="none" stroke="#ff8a3c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 10C44 10 38 28 44 44C50 58 36 72 30 100C24 130 30 150 36 164H84C90 150 96 130 90 100C84 72 70 58 76 44C82 28 76 10 60 10Z" transform="translate(0 -2)" />
        <circle cx="150" cy="128" r="36" />
        <circle cx="140" cy="116" r="4" /><circle cx="154" cy="112" r="4" /><circle cx="150" cy="128" r="4" />
      </g>
    </g>,
  );
  [[5.0, 3.9], [3.2, 3.9]].forEach(([yH, zT], i) =>
    cur.push(
      <g key={`art${i}`} transform={wallLM(0, yH, zT)}>
        <rect x="0" y="0" width="120" height="170" rx="4" fill="#efe0c6" />
        <rect x="9" y="9" width="102" height="152" fill={i ? '#e7c9a2' : '#1d2038'} />
        <circle cx="62" cy="64" r="28" fill={i ? '#c4583f' : '#e5445a'} />
        <path d="M9 161 L9 118 Q60 80 111 126 L111 161Z" fill={i ? '#8c6a4f' : '#34406e'} />
      </g>,
    ),
  );
  // rechte Wand: dunkle Rückwand mit Wandbild, Anzeigetafeln, Bahnnummern
  cur.push(wallR('wrBase', 0, 0, HW, 0, HH, '#24212f'));
  const mural: string[] = [];
  for (let i = 0; i < 16; i++) {
    const x0 = i * 135 - 30;
    const c = ['#e4783a', '#7a4fb8', '#2e5aa8', '#d9466f', '#f0a04b'][i % 5];
    mural.push(`<polygon points="${x0},150 ${x0 + 90 + (i % 3) * 30},20 ${x0 + 190},150" fill="${c}" opacity="0.72"/>`);
  }
  cur.push(<g key="mural" transform={wallRM(0, 0.008, 3.35)} dangerouslySetInnerHTML={{__html: mural.join('')}} />);
  cur.push(wallR('wrBand', 0.006, 0, HW, 3.35, 3.45, '#ffb066', {opacity: 0.85}));
  LX.forEach((cx, i) => {
    cur.push(
      <g key={`tv${i}`} transform={wallRM(cx - 1.05, 0.015, 4.5)}>
        <rect x="-4" y="-4" width="209" height="118" rx="5" fill="#0b0b12" />
        <rect x="2" y="2" width="197" height="106" fill="#0d1636" />
        {i % 2 === 0 ? (
          <g>
            {[0, 1, 2, 3].map((r) => <rect key={r} x="12" y={14 + r * 22} width="176" height="12" fill={r === 1 ? '#e5445a' : '#2f6bff'} opacity="0.8" />)}
          </g>
        ) : (
          <g>
            <circle cx="100" cy="56" r="30" fill="#1c3f9a" />
            <path d="M100 26 C92 26 90 36 92 44 C95 52 90 60 88 72 H112 C110 60 105 52 108 44 C110 36 108 26 100 26Z" fill="#fff" />
          </g>
        )}
      </g>,
    );
    cur.push(
      <g key={`num${i}`} transform={wallRM(cx - 0.3, 0.015, 2.05)}>
        <rect x="0" y="0" width="58" height="66" rx="6" fill="#111018" />
        <text x="29" y="52" textAnchor="middle" fontFamily="Anton" fontSize="48" fill="#fff">{i + 1}</text>
      </g>,
    );
    // Wandleuchten zwischen den Tafeln
    if (i < LX.length - 1) {
      const gx = cx + 1.65;
      const p = P(gx, 0.02, 2.9);
      cur.push(<ellipse key={`sc${i}`} cx={p.X} cy={p.Y} rx="46" ry="30" fill="rgba(255,196,120,.22)" />);
      cur.push(wallR(`scb${i}`, 0.02, gx - 0.08, gx + 0.08, 2.8, 3.0, '#ffe3b0'));
    }
  });

  // Regal mit Kugeln an der linken Wand
  cur.push(box('shelfBody', 0, 3.0, 0, 0.7, 3.0, 1.75, {top: '#3a2a22', left: '#4a362b', right: '#2a1d17'}));
  [0.18, 0.68, 1.18].forEach((z, r) => {
    for (let i = 0; i < 6; i++) {
      const p = P(0.45, 3.2 + i * 0.5, z + 0.22);
      cur.push(ballColored(`sb${r}${i}`, p.X, p.Y, 9, (r * 2 + i) % 6));
    }
  });

  // --- Bar an der linken Wand (Bestellung landet hier)
  cur.push(box('shelf1', 0, 9.4, 1.8, 0.5, 5.2, 0.07, mat('#8a5640')));
  cur.push(box('shelf2', 0, 9.4, 2.4, 0.5, 5.2, 0.07, mat('#8a5640')));
  [1.87, 2.47].forEach((z, r) => {
    for (let i = 0; i < 12; i++) {
      const col = ['#2f9e6a', '#e8b34a', '#c45a3a', '#8fd0e8', '#a8508a'][(i + r) % 5];
      cur.push(cyl(`bt${r}${i}`, 0.22, 9.65 + i * 0.42, z, 0.07, 0.34, {top: lighten(col, 0.3), left: col, right: darken(col, 0.3)}));
    }
  });
  [12.1, 14.5].forEach((yHigh, i) => {
    cur.push(
      <g key={`tvm${i}`} transform={wallLM(0, yHigh, 4.05)}>
        <rect x="-6" y="-6" width="230" height="118" rx="6" fill="#1a1a2a" />
        <rect x="0" y="0" width="218" height="106" fill="#0b0f26" />
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x="14" y={12 + r * 18} width={80 + ((r * 37) % 60)} height="7" fill={r % 2 ? '#ffd27a' : '#fff'} opacity="0.85" />
            <rect x="170" y={12 + r * 18} width="34" height="7" fill="#34e3a0" opacity="0.85" />
          </g>
        ))}
      </g>,
    );
  });
  cur = floors;

  // --- Bahn-Ausstattung: Ball-Rückführung, Sitzbank, Tisch, Lampe, Stühle – alles direkt an der Bahn
  LX.forEach((cx, i) => {
    add(cx + 9.8, ballReturn(`br${i}`, cx, 9.0, i));
    add(cx + 9.82, railBalls(`rb${i}`, cx, 9.0, 0.52, i * 2));
    add(cx + 10.5, bench(`bn${i}`, cx, 10.0));
  });
  TABLES.forEach((tb, i) => {
    add(tb.x + tb.y, rectTable(`tb${i}`, tb.x, tb.y));
    add(tb.x + tb.y + 0.5, tableware(`tw${i}`, tb.x + 0.2, tb.y, 0.81, i));
    add(tb.x + tb.y + 0.45, tableLamp(`lp${i}`, tb.x - 0.75, tb.y - 0.2, 0.81, 0));
    if (i === 0) {
      add(tb.x - 1.75 + tb.y, diningChair('chw', tb.x - 1.75, tb.y, 'w'));
      add(tb.x + 1.75 + tb.y, diningChair('che', tb.x + 1.75, tb.y, 'e'));
    }
  });

  // Bar-Tresen
  add(BAR.x + 0.6 + 9.6, box('barC', 0.55, 9.6, 0, 1.45, 5.0, 1.15, {top: '#efe0c6', left: '#8a5640', right: '#6a3f2e'}));
  add(BAR.x + 0.6 + 9.62, box('barTop', 0.45, 9.5, 1.15, 1.65, 5.2, 0.08, mat('#f6ead4')));
  add(0.6 + 13.4, box('reg', 1.0, 13.2, 1.23, 0.5, 0.6, 0.32, mat('#232846')));
  add(0.6 + 10.2, box('reg2', 1.0, 10.2, 1.23, 0.6, 0.5, 0.3, mat('#d9dcf0')));

  // --- Pflanzen
  add(0.7 + 1.6, plant('pl1', 0.9, 1.8, 1.1));
  add(21.2 + 1.6, plant('pl2', 21.2, 1.5, 1.1));
  add(21.3 + 8.4, plant('pl3', 21.3, 8.4, 1.0));
  add(21.2 + 14.2, plant('pl4', 21.2, 14.3, 1.0));
  add(1.0 + 7.5, plant('pl5', 1.2, 7.6, 1.2));

  // --- Vordere Mauer
  const rim = {top: '#d8d2c8', left: '#a8a29a', right: '#8a847c'};
  add(HW + HD + 5, box('rimF', 0, HD, 0, HW + 0.4, 0.4, 0.5, rim));
  add(HW + HD + 5.1, box('rimR', HW, 0, 0, 0.4, HD, 0.5, rim));

  // --- Straße & Umgebung
  [[24.2, 8], [24.2, 26], [27.2, 2], [27.2, 20], [24.2, -10]].forEach(([x, y], i) => addExt(x, y, lamp(`lamp${i}`, x, y, 1)));
  [[-1.5, 17.5, 1.1], [3, 19, 1.35], [8.5, 18, 1.0], [14, 19.5, 1.3], [19.5, 18.2, 1.0], [23.5, 16.5, 1.2], [24, 4, 1.0], [24.3, -3, 1.1], [29, 14.5, 1.1], [34, 14, 1.0], [40, 14.5, 1.2], [-4, 9, 1.2], [-4.5, 3, 1.0]].forEach(([x, y, s], i) =>
    addExt(x, y, tree(`tr${i}`, x, y, s)));
  addExt(23.7, 18, carAlongY('parked', 23.2, 17.0, '#2f7f86', false), 0.5);

  // --- Nachbar: Auto Service Müller (Schnittmodell)
  const SX = 29;
  const SY = 1;
  const SW = 12;
  const SD = 10;
  const SHh = 5.0;
  cur = floors;
  cur.push(flat('sFloor', SX, SY, SX + SW, SY + SD, 0.0, '#3b4160'));
  cur.push(flat('sFloor2', SX, SY, SX + SW, SY + 1.0, 0.003, '#2c3150'));
  cur = sw;
  cur.push(box('swl', SX - 0.4, SY - 0.4, 0, 0.4, SD + 0.4, SHh, {top: '#e9ddc6', left: '#b8a888', right: '#5b6285'}));
  cur.push(box('swr', SX - 0.4, SY - 0.4, 0, SW + 0.4, 0.4, SHh, {top: '#e9ddc6', left: '#656c8f', right: '#b8a888'}));
  cur.push(wallL('swlLow', SX, SY, SY + SD, 0, 1.2, '#3b4160'));
  cur.push(wallR('swrLow', SY, SX, SX + SW, 0, 1.2, '#3b4160'));
  // Rolltor
  cur.push(wallR('door', SY + 0.004, SX + 1.2, SX + 5.0, 0, 3.0, '#aab0c8'));
  for (let z = 0.2; z < 3; z += 0.25) cur.push(wallR(`rib${z}`, SY + 0.006, SX + 1.2, SX + 5.0, z, z + 0.04, '#7c84a6'));
  // Schild
  cur.push(
    <g key="signW" transform={wallRM(SX + 0.8, SY + 0.01, 4.85)}>
      <rect x="0" y="0" width="1010" height="150" rx="14" fill="#14162c" />
      <rect x="10" y="10" width="990" height="130" rx="10" fill="none" stroke="#ffc61a" strokeWidth="5" />
      <text x="40" y="104" fontFamily="Anton" fontSize="92" fill="#ffc61a" letterSpacing="2">AUTO SERVICE MÜLLER</text>
      <rect x="40" y="118" width="400" height="8" fill="#e11d2e" />
    </g>,
  );
  cur.push(
    <g key="signS" transform={wallRM(SX + 5.6, SY + 0.012, 3.0)}>
      <rect x="0" y="0" width="430" height="230" rx="10" fill="#ffc61a" />
      <text x="24" y="86" fontFamily="Anton" fontSize="62" fill="#14162c">INSPEKTION</text>
      <text x="24" y="150" fontFamily="Anton" fontSize="62" fill="#14162c">JETZT</text>
      <text x="24" y="206" fontFamily="Anton" fontSize="52" fill="#e11d2e">SICHERN!</text>
    </g>,
  );
  // Hebebühne mit Auto
  [[4.0, 4.1], [6.2, 4.1], [4.0, 5.7], [6.2, 5.7]].forEach(([dx, dy], i) => add(SX + dx + SY + dy, box(`lift${i}`, SX + dx, SY + dy, 0, 0.28, 0.28, 1.75, mat('#e5445a'))));
  add(SX + 6.5 + SY + 5.4, carAlongX('shopCar', SX + 4.1, SY + 4.35, 1.75, '#e11d2e'));
  add(SX + 10.9 + SY + 7, box('toolbox', SX + 10.4, SY + 6.4, 0, 1.0, 0.7, 0.9, mat('#e11d2e')));
  add(SX + 11 + SY + 6.5, box('toolbox2', SX + 10.5, SY + 6.4, 0.9, 0.8, 0.5, 0.18, mat('#c9ccdd')));
  add(SX + 1.9 + SY + 7.8, cyl('drum1', SX + 1.4, SY + 7.8, 0, 0.42, 0.95, mat('#3a6ea5')));
  add(SX + 2.8 + SY + 8.2, cyl('drum2', SX + 2.4, SY + 8.2, 0, 0.42, 0.95, mat('#3a6ea5')));
  [0, 1, 2].forEach((i) => add(SX + 8.9 + SY + 8.8 + i * 0.01, cyl(`tire${i}`, SX + 8.4, SY + 8.4, i * 0.34, 0.5, 0.34, mat('#222538'))));
  add(SX + 11 + SY + 2.2, box('bench', SX + 8.2, SY + 0.5, 0, 3.2, 0.9, 1.1, {top: '#d9dcf0', left: '#7a4b37', right: '#5a3828'}));
  add(SX + 10 + SY + 2.2 + 0.1, box('bench2', SX + 8.6, SY + 0.7, 1.1, 0.7, 0.4, 0.3, mat('#3a6ea5')));
  add(SX + 1 + SY + 4, box('rack', SX + 0.4, SY + 2.8, 0, 0.6, 3.0, 1.6, mat('#555d82')));
  add(SX + 3 + SY + 3.5, person('mech', SX + 2.4, SY + 3.4, 0.0, {skin: SKIN[1], hair: '#ffc61a', hs: 'cap', shirt: '#2f6bff'}, 'idle', 0, 1.5, 0.2));
  cur.push(
    <g key="peg" transform={wallLM(SX, SY + 6.8, 3.6)}>
      <rect x="0" y="0" width="390" height="160" rx="6" fill="#454d73" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={24 + i * 56} y={26 + (i % 2) * 34} width="14" height="90" rx="4" fill={['#e5445a', '#ffc61a', '#aab0c8'][i % 3]} />)}
    </g>,
  );
  add(SX + SW + SD + SY + 5, box('srimF', SX, SY + SD, 0, SW + 0.4, 0.4, 0.5, rim));
  add(SX + SW + SD + SY + 5.1, box('srimR', SX + SW, SY, 0, 0.4, SD, 0.5, rim));

  return {far, floors, hw, sw, items};
};

let STATIC: ReturnType<typeof buildStatic> | null = null;
const getStatic = () => (STATIC ??= buildStatic());

// ---------- Bewegte Teile ----------
const waiterPath: [number, number, number][] = [
  [0, 2.8, 13.5], [1.6, 10.0, 13.3], [2.6, 10.6, 12.8], [3.4, 11.8, 13.6], [4.2, 13.4, 12.9], [5.0, 15.0, 13.6],
  [5.8, 16.8, 12.9], [6.6, 18.6, 13.7], [7.2, 20.2, 12.9], [8.0, 17.0, 13.9], [9.2, 10.0, 13.9], [10.4, 4.6, 13.5],
  [11.0, 3.0, 13.3], [60, 3.0, 13.3],
];
const waiterAt = (t: number) => {
  for (let i = 0; i < waiterPath.length - 1; i++) {
    const [t0, x0, y0] = waiterPath[i];
    const [t1, x1, y1] = waiterPath[i + 1];
    if (t <= t1) {
      const u = clamp01((t - t0) / (t1 - t0));
      return {x: lerp(x0, x1, u), y: lerp(y0, y1, u), vx: (x1 - x0) / (t1 - t0), vy: (y1 - y0) / (t1 - t0), moving: t1 - t0 < 3};
    }
  }
  return {x: 3.0, y: 13.3, vx: 0, vy: 0, moving: false};
};

const buildDynamic = (t: number): Item[] => {
  const frame = t * FPS;
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode) => items.push({k, n});

  // Gäste: Bank auf der Bahnseite (2 Personen), am Held-Tisch zusätzlich zwei Stühle seitlich
  TABLES.forEach((tb, i) => {
    const seats: {dx: number; dy: number; z: number}[] = [{dx: -0.55, dy: -1.3, z: 0.5}, {dx: 0.55, dy: -1.3, z: 0.5}];
    if (i === 0) seats.push({dx: -1.75, dy: 0, z: 0.5}, {dx: 1.75, dy: 0, z: 0.5});
    seats.forEach((sd, si) => {
      const look = LOOKS[(i * 3 + si * 2) % LOOKS.length];
      let pose: 'idle' | 'wave' | 'cheer' | 'laugh' = 'idle';
      if (i === 0) pose = t > 20.4 && t < 22.6 ? 'cheer' : t > 30.5 && t < 32.5 ? 'cheer' : t > 49.4 && t < 51 ? 'cheer' : 'laugh';
      else if (i >= 1 && i <= 3 && si === 0 && t > [0, 4.7, 5.3, 5.9][i] && t < 9.5) pose = 'wave';
      add(tb.x + sd.dx + tb.y + sd.dy + 0.12, person(`gp${i}${si}`, tb.x + sd.dx, tb.y + sd.dy, sd.z, look, pose, frame, si * 1.7 + i));
    });
  });

  // Barkeeper
  add(0.6 + BAR.y + 0.1, person('bk', 0.9, BAR.y, 1.0, {skin: SKIN[2], hair: '#171717', hs: 'short', shirt: '#2a2d52', beard: true}, t > 21.5 && t < 22.4 ? 'cheer' : 'idle', frame, 0.7, 0.19));

  // Sprechblasen der wartenden Gäste
  [1, 2, 3].forEach((i, bi) => {
    const at = [4.7, 5.5, 6.3][bi];
    if (t < at || t > 9.6) return;
    const tb = TABLES[i];
    const p = P(tb.x - 0.55, tb.y - 1.3, 2.35);
    const s = clamp01((t - at) / 0.25);
    const e = 1 - Math.pow(1 - s, 3);
    const bob = Math.sin(t * 5 + i) * 3;
    add(tb.x + tb.y + 3, (
      <g key={`bub${i}`} transform={`translate(${p.X} ${p.Y + bob}) scale(${0.9 + 0.1 * e}) scale(${e})`}>
        <rect x="-34" y="-62" width="68" height="52" rx="18" fill="#fff" />
        <path d="M-6 -12 L0 4 L10 -12Z" fill="#fff" />
        {bi % 2 === 0 ? (
          <g fill="none" stroke="#161830" strokeWidth="5" strokeLinecap="round"><circle cx="0" cy="-36" r="15" /><path d="M0 -46 V-36 L7 -32" /></g>
        ) : (
          <text x="0" y="-22" textAnchor="middle" fontFamily="Anton" fontSize="46" fill="#e5445a">?</text>
        )}
      </g>
    ));
  });

  // Kellner (läuft im Gang hinter den Tischen)
  const wp = waiterAt(t);
  const dirRight = wp.vx - wp.vy > 0;
  const wpos = P(wp.x, wp.y, 0);
  add(wp.x + wp.y + 0.3, (
    <g key="waiter" transform={`translate(${wpos.X} ${wpos.Y}) scale(${dirRight ? 0.2 : -0.2} 0.2) translate(-160 -500)`}>
      <ellipse cx="150" cy="500" rx="130" ry="30" fill="rgba(0,0,0,.3)" />
      {wp.moving ? <Waiter bare frame={frame} hurry={1.1} /> : <Waiter bare frame={0} hurry={0} />}
    </g>
  ));

  // Strikes: Ball rollt entlang gy zu den Pins, Pins fliegen Richtung Wand
  STRIKES.forEach((s, si) => {
    const cx = LANES_X[s.lane];
    let n = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c <= r; c++) {
        n++;
        const by = PIN_Y - r * 0.5;
        const bx = cx + (c - r / 2) * 0.62;
        let ox = 0, oy = 0, oz = 0, rot = 0;
        const p = Math.max(0, t - s.hit - r * 0.015);
        if (t > s.hit - 0.02 && t < s.hit + 1.8) {
          const rn = rand(n * 3.7 + s.lane + si * 11);
          const rn2 = rand(n * 7.1 + si * 5);
          const dir = (c - r / 2) * 0.9 + (rn - 0.5) * 1.8;
          oy = -(0.2 + rn2 * 0.9) * p * 1.1;
          ox = dir * 1.1 * p;
          oz = Math.max(0, 3.2 * p * (0.6 + rn2) - 6.5 * p * p);
          rot = dir * 200 * Math.min(p, 0.6) * (rn > 0.5 ? 1 : -1);
        }
        const pp = P(bx + ox, by + oy, oz);
        if (t > s.hit + 1.6 && t < s.hit + 1.8) continue;
        add(bx + by + ox + oy + 0.02, pinSprite(`pin${si}${n}`, pp.X, pp.Y, 0.13, rot));
      }
    }
    if (t >= s.start && t < s.hit + 0.12) {
      const u = clamp01((t - s.start) / (s.hit - s.start));
      const by = lerp(s.from, PIN_Y + 0.1, u);
      const bx = cx + Math.sin(u * Math.PI) * 0.12;
      const pp = P(bx, by, 0.2);
      add(bx + by + 0.05, ballSprite(`ball${si}`, pp.X, pp.Y - 5, 12, by * 120));
    }
  });

  // Bon (Bestellung) von Tisch 1 zur Bar
  if (t > 20.55 && t < 22.1) {
    const u = (t - 20.55) / 1.45;
    const e = IN_OUT(clamp01(u));
    const x = lerp(TABLES[0].x, 1.2, e);
    const y = lerp(TABLES[0].y, BAR.y, e);
    const z = 1.0 + Math.sin(u * Math.PI) * 1.4 + e * 0.4;
    const pp = P(x, y, z);
    const trail: React.ReactNode[] = [];
    for (let i = 1; i <= 8; i++) {
      const ue = IN_OUT(clamp01(u - i * 0.035));
      const q = P(lerp(TABLES[0].x, 1.2, ue), lerp(TABLES[0].y, BAR.y, ue), 1.0 + Math.sin((u - i * 0.035) * Math.PI) * 1.4 + ue * 0.4);
      trail.push(<circle key={i} cx={q.X} cy={q.Y} r={9 - i * 0.8} fill="#34e3a0" opacity={0.5 - i * 0.05} />);
    }
    add(2000, (
      <g key="ticket">
        {trail}
        <g transform={`translate(${pp.X} ${pp.Y}) rotate(${Math.sin(u * 9) * 8})`}>
          <rect x="-20" y="-26" width="40" height="52" rx="6" fill="#fff" stroke="#34e3a0" strokeWidth="4" />
          {[-14, -6, 2, 10].map((yy) => <rect key={yy} x="-12" y={yy} width="24" height="4" fill="#161830" opacity="0.7" />)}
        </g>
      </g>
    ));
  }

  // Display-Miniaturen auf den Tischen
  TABLES.forEach((tb, i) => {
    const mode = modeFor(i, t);
    add(tb.x + tb.y + 0.6, miniDisplay(`md${i}`, tb.x + 0.1, tb.y - 0.05, 0.81, mode, t, i * 1.3, i === 0 ? 1.15 : 1));
  });

  // Fahrende Autos auf der Straße
  const cy = ((t * 2.2 + 4) % 60) - 22;
  items.push({k: 26.8 + cy + 1, n: carAlongY('drive', 26.3, cy, '#e8b34a', true), b: behindWalls(26.8, cy + 1)});
  const cy2 = 40 - ((t * 2.8 + 11) % 62);
  items.push({k: 24.3 + cy2 + 1, n: carAlongY('drive2', 23.8, cy2, '#8b5cf6', false), b: behindWalls(24.3, cy2 + 1)});

  return items;
};

// ---------- Komponente ----------
export const IsoWorld: React.FC<{t: number; cam: IsoCam; dim?: number; blur?: number}> = ({t, cam, dim = 0, blur = 0}) => {
  const st = getStatic();
  const dyn = buildDynamic(t);
  const sorted = [...st.items, ...dyn].sort((a, b) => a.k - b.k);
  const behind = sorted.filter((i) => i.b);
  const front = sorted.filter((i) => !i.b);
  const draw = (it: Item) => <g key={`${it.k}-${(it.n as React.ReactElement).key}`}>{it.n}</g>;
  const o = camOrigin(cam);
  const cy = cam.cy ?? SCREEN_CY;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, filter: blur ? `blur(${blur}px)` : undefined}}>
      <Defs />
      <rect width="1080" height="1920" fill="url(#skyG)" />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={rand(i + 3) * 1080} cy={rand(i + 9) * 700} r={1 + rand(i + 1) * 2} fill="#fff" opacity={0.2 + 0.4 * rand(i + 5)} />
      ))}
      <g transform={`translate(540 ${cy}) scale(${cam.zoom}) translate(${-o.X} ${-o.Y})`}>
        {st.far}
        {st.floors}
        {behind.map(draw)}
        {st.hw}
        {st.sw}
        {front.map(draw)}
      </g>
      {dim > 0 && <rect width="1080" height="1920" fill="#050a1e" opacity={dim} />}
    </svg>
  );
};
