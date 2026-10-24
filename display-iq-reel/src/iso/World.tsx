import React from 'react';
import {C, FPS} from '../theme';
import {IN_OUT, OUT, clamp01, lerp, prog, rand} from '../ease';
import {Waiter} from '../components/People';
import {Mat, darken, lighten, mat} from './colors';
import {P, V3, box, cyl, flat, floorM, poly, pts, ring, shadowEllipse, wallL, wallLM, wallR, wallRM} from './iso';
import {Item, Look, W, ballSprite, carAlongX, carAlongY, chair, lamp, miniDisplay, person, pinSprite, plant, table, tableware, tree} from './props';
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
const LANE_C = [1.55, 3.3, 5.05, 6.8];
const LANE_X0 = 0.9;
const LANE_X1 = 17.4;
export const PIN_X = 2.7;

export const TABLES = [
  {x: 6.2, y: 10.8}, // 0: Freunde (Held-Tisch)
  {x: 10.6, y: 13.1},
  {x: 11.4, y: 9.5},
  {x: 15.4, y: 11.9},
  {x: 19.2, y: 9.9},
  {x: 19.0, y: 13.7},
];
export const BAR = {x: 1.2, y: 11.7};

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

const SEATS = {w: [-1.18, 0], n: [0, -1.18], e: [1.18, 0], s: [0, 1.18]} as const;

// Streiks: Bahn, Startzeit, Treffer
export type Strike = {lane: number; from: number; start: number; hit: number};
export const STRIKES: Strike[] = [
  {lane: 2, from: 13.6, start: 0.35, hit: 2.9},
  {lane: 1, from: 9.0, start: 22.45, hit: 23.55},
  {lane: 3, from: 12.4, start: 50.35, hit: 51.5},
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

  // --- Halle: Boden
  cur.push(flat('hf', 0, 0, HW, HD, 0, '#1a1646'));
  cur.push(flat('lounge', 0, 8.2, HW, HD, 0.005, '#2a2062'));
  let carpet = '';
  for (let x = 0; x <= HW; x += 1) carpet += pathOf([[x - 0.02, 8.2, 0.01], [x + 0.02, 8.2, 0.01], [x + 0.02, HD, 0.01], [x - 0.02, HD, 0.01]]);
  for (let y = 8.2; y <= HD; y += 1) carpet += pathOf([[0, y - 0.02, 0.01], [HW, y - 0.02, 0.01], [HW, y + 0.02, 0.01], [0, y + 0.02, 0.01]]);
  cur.push(<path key="carpet" d={carpet} fill="rgba(255,255,255,.05)" />);
  cur.push(flat('walkway', 0, 7.45, HW, 8.2, 0.005, '#3a3078'));
  cur.push(flat('walkway2', 0, 7.45, HW, 7.5, 0.007, '#2dd4ff', {opacity: 0.7}));

  // --- Bahnen
  LANE_C.forEach((cy, i) => {
    cur.push(flat(`gut${i}`, 0.2, cy - 0.76, LANE_X1 + 0.3, cy + 0.76, 0.01, '#0b0928'));
    cur.push(flat(`pit${i}`, 0.0, cy - 0.58, LANE_X0, cy + 0.58, 0.012, '#04020f'));
    cur.push(flat(`ln${i}`, LANE_X0, cy - 0.58, LANE_X1, cy + 0.58, 0.02, '#dba766'));
    cur.push(flat(`ap${i}`, 14.0, cy - 0.58, LANE_X1, cy + 0.58, 0.022, '#efc78f'));
    cur.push(flat(`dk${i}`, LANE_X0, cy - 0.58, 3.4, cy + 0.58, 0.022, '#cd9556'));
    let boards = '';
    for (let o = -0.48; o <= 0.49; o += 0.16) boards += pathOf([[LANE_X0, cy + o - 0.004, 0.03], [LANE_X1, cy + o - 0.004, 0.03], [LANE_X1, cy + o + 0.004, 0.03], [LANE_X0, cy + o + 0.004, 0.03]]);
    cur.push(<path key={`bd${i}`} d={boards} fill="rgba(110,60,20,.28)" />);
    cur.push(flat(`sheen${i}`, LANE_X0, cy - 0.16, LANE_X1, cy + 0.16, 0.035, 'rgba(255,255,255,.13)'));
    cur.push(flat(`el${i}`, LANE_X0, cy - 0.64, LANE_X1, cy - 0.58, 0.04, i % 2 ? C.magenta : C.cyan));
    cur.push(flat(`er${i}`, LANE_X0, cy + 0.58, LANE_X1, cy + 0.64, 0.04, i % 2 ? C.cyan : C.magenta));
    cur.push(flat(`foul${i}`, 13.95, cy - 0.58, 14.05, cy + 0.58, 0.05, '#ffffff', {opacity: 0.9}));
    for (let a = -3; a <= 3; a++) {
      const ax = 8.6 + (3 - Math.abs(a)) * 0.35;
      cur.push(poly(`ar${i}${a}`, [[ax - 0.28, cy + a * 0.14, 0.05], [ax + 0.12, cy + a * 0.14 - 0.06, 0.05], [ax + 0.12, cy + a * 0.14 + 0.06, 0.05]], '#6b3d1a', {opacity: 0.55}));
    }
  });
  // Neon-Glow unter den Bahnen
  cur.push(flat('laneGlow', 0.9, 0.9, LANE_X1, 7.4, 0.001, 'rgba(255,61,154,.08)'));

  cur = hw;
  // --- Wände (Rückwände als dünne Boxen mit Kappe)
  const capTop = '#efe0c6';
  cur.push(box('wl', -0.4, -0.4, 0, 0.4, HD + 0.4, HH, {top: capTop, left: '#cdb894', right: '#3a2860'}));
  cur.push(box('wr', -0.4, -0.4, 0, HW + 0.4, 0.4, HH, {top: capTop, left: '#2b2966', right: '#cdb894'}));
  // linke Wand (Innenseite: Ebene gx=0)
  cur.push(wallL('wlWood', 0, 0, HD, 0, 1.35, '#7a4b37'));
  cur.push(wallL('wlTrim', 0, 0, HD, 1.35, 1.45, '#efe0c6'));
  cur.push(wallL('wlNeon', 0, 0, HD, 4.2, 4.3, C.cyan, {opacity: 0.95}));
  cur.push(wallL('wlNeonG', 0, 0, HD, 4.05, 4.45, C.cyan, {opacity: 0.18}));
  // rechte Wand (Innenseite: Ebene gy=0)
  cur.push(wallR('wrWood', 0, 0, HW, 0, 1.35, '#6a4252'));
  cur.push(wallR('wrTrim', 0, 0, HW, 1.35, 1.45, '#efe0c6'));
  cur.push(wallR('wrNeon', 0, 0, HW, 4.2, 4.3, C.magenta, {opacity: 0.95}));
  cur.push(wallR('wrNeonG', 0, 0, HW, 4.05, 4.45, C.magenta, {opacity: 0.18}));
  // Fenster in der rechten Wand
  [[2.0, 4.4], [5.0, 7.4], [14.7, 17.1], [18.1, 20.5]].forEach(([a, b], i) => {
    cur.push(wallR(`wf${i}`, 0.004, a - 0.12, b + 0.12, 1.75, 4.0, '#efe0c6'));
    cur.push(wallR(`wg${i}`, 0.006, a, b, 1.9, 3.88, '#13306a'));
    cur.push(wallR(`wgl${i}`, 0.007, a, b, 2.9, 3.88, '#1d4a8c', {opacity: 0.6}));
    cur.push(wallR(`wm${i}`, 0.008, (a + b) / 2 - 0.04, (a + b) / 2 + 0.04, 1.9, 3.88, '#efe0c6'));
    cur.push(wallR(`wm2${i}`, 0.008, a, b, 2.84, 2.92, '#efe0c6'));
  });
  // Neon-Schriftzug BOWLING
  cur.push(
    <g key="signR" transform={wallRM(8.1, 0.01, 4.0)}>
      <rect x="0" y="0" width="470" height="200" rx="16" fill="#120d34" opacity="0.85" />
      <text x="235" y="158" textAnchor="middle" fontFamily="Anton" fontSize="150" fill="none" stroke="#ff3d9a" strokeWidth="5" filter="url(#neonGlow)">BOWLING</text>
      <text x="235" y="158" textAnchor="middle" fontFamily="Anton" fontSize="150" fill="#ffd9ec" opacity="0.92">BOWLING</text>
    </g>,
  );
  // Pinsetter-Haube + Anzeigen
  cur.push(box('hood', 0, 0.3, 1.7, 1.5, 7.2, 0.9, {top: '#3a2e78', left: '#2a2160', right: '#241c52'}));
  cur.push(wallR('hoodN', 0.3 + 7.2 + 0.001, 0.0, 1.5, 1.8, 2.5, 'none'));
  LANE_C.forEach((cy, i) => {
    // Bahn-Nummer-Anzeige an der Haube
    cur.push(poly(`hn${i}`, [[1.5, cy - 0.5, 2.05], [1.5, cy + 0.5, 2.05], [1.5, cy + 0.5, 2.45], [1.5, cy - 0.5, 2.45]], i % 2 ? '#ff3d9a' : '#2dd4ff'));
  });
  cur.push(poly('hoodStrip', [[1.5, 0.3, 1.74], [1.5, 7.5, 1.74], [1.5, 7.5, 1.8], [1.5, 0.3, 1.8]], '#2dd4ff', {opacity: 0.95}));

  // Backbar + TV-Menütafeln an der linken Wand
  cur.push(box('shelf1', 0, 8.8, 1.8, 0.5, 5.8, 0.07, mat('#8a5640')));
  cur.push(box('shelf2', 0, 8.8, 2.4, 0.5, 5.8, 0.07, mat('#8a5640')));
  [1.87, 2.47].forEach((z, r) => {
    for (let i = 0; i < 13; i++) {
      const col = ['#2f9e6a', '#e8b34a', '#c45a3a', '#8fd0e8', '#a8508a'][(i + r) % 5];
      cur.push(cyl(`bt${r}${i}`, 0.22, 9.05 + i * 0.42, z, 0.07, 0.34, {top: lighten(col, 0.3), left: col, right: darken(col, 0.3)}));
    }
  });
  [11.87, 14.67].forEach((yHigh, i) => {
    cur.push(
      <g key={`tv${i}`} transform={wallLM(0, yHigh, 4.05)}>
        <rect x="-6" y="-6" width="256" height="118" rx="6" fill="#1a1a2a" />
        <rect x="0" y="0" width="244" height="106" fill="#0b0f26" />
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x="14" y={12 + r * 18} width={80 + ((r * 37) % 60)} height="7" fill={r % 2 ? '#ffd27a' : '#fff'} opacity="0.85" />
            <rect x="190" y={12 + r * 18} width="38" height="7" fill="#34e3a0" opacity="0.85" />
          </g>
        ))}
      </g>,
    );
  });
  cur = floors;
  // Tisch-Lichtinseln auf dem Boden
  TABLES.forEach((tb, i) => cur.push(<polygon key={`pool${i}`} points={pts(ring(tb.x, tb.y, 0.012, 1.7, 30))} fill="rgba(255,214,150,.06)" />));

  // --- Bar
  add(BAR.x + 0.6 + 0.01, box('barC', 0.55, 8.9, 0, 1.45, 5.6, 1.15, {top: '#efe0c6', left: '#8a5640', right: '#6a3f2e'}));
  add(BAR.x + 0.6 + 0.012, box('barTop', 0.45, 8.8, 1.15, 1.65, 5.8, 0.08, mat('#f6ead4')));
  [10.0, 11.4, 12.8, 14.2].forEach((y, i) => add(2.9 + y + 0.1, cyl(`st${i}`, 3.0, y, 0, 0.26, 0.62, mat('#b9553b'))));
  add(0.6 + 13.4, box('reg', 1.0, 13.2, 1.23, 0.5, 0.6, 0.32, mat('#232846')));
  add(0.6 + 10.2, box('reg2', 1.0, 9.7, 1.23, 0.6, 0.5, 0.3, mat('#d9dcf0')));

  // --- Lounge-Tische (statische Teile)
  TABLES.forEach((tb, i) => {
    const mats = [W.terracotta, W.teal, W.terracotta, W.teal, W.terracotta, W.teal];
    const sides = i === 0 ? (['w', 'n', 'e', 's'] as const) : i === 1 || i === 4 ? (['w', 'e'] as const) : (['n', 's'] as const);
    sides.forEach((sd) => {
      const [dx, dy] = SEATS[sd];
      add(tb.x + tb.y + dx + dy + (sd === 'w' || sd === 'n' ? -0.4 : 0.4) - 0.01, chair(`ch${i}${sd}`, tb.x + dx * 0.92, tb.y + dy * 0.92, sd, mats[i]));
    });
    add(tb.x + tb.y, table(`tb${i}`, tb.x, tb.y, 0.85));
    add(tb.x + tb.y + 0.3, tableware(`tw${i}`, tb.x, tb.y, 0.83, i));
  });

  // --- Pflanzen / Deko
  add(0.5 + 15.3, plant('pl1', 0.7, 14.6, 1.0));
  add(21.3 + 7.6, plant('pl2', 21.3, 7.7, 1.1));
  add(21.3 + 14.2, plant('pl3', 21.3, 14.4, 1.0));

  // --- Balltreter zwischen den Bahnen
  [0, 1, 2].forEach((i) => {
    const y = (LANE_C[i] + LANE_C[i + 1]) / 2;
    add(15.2 + y, box(`br${i}`, 14.4, y - 0.28, 0, 1.4, 0.56, 0.5, {top: '#2a2d52', left: '#3b3f74', right: '#23264a'}));
    add(15.2 + y + 0.1, box(`brh${i}`, 14.7, y - 0.2, 0.5, 0.7, 0.4, 0.3, mat(['#e5445a', '#2dd4ff', '#ffb627'][i])));
  });

  // --- Vordere Mauer (flach, wie im Referenzstil)
  const rim = {top: '#f3e5cc', left: '#c8b08a', right: '#a58f6c'};
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
  [0, 3.2, 12.2], [1.4, 9.0, 13.4], [2.4, 9.6, 12.3], [3.4, 10.2, 10.6], [4.2, 9.2, 12.9], [5.0, 10.4, 12.2],
  [5.7, 11.7, 10.5], [6.5, 13.8, 11.3], [7.2, 14.3, 13.0], [7.8, 12.2, 13.6], [9.0, 8.4, 12.6], [10.0, 6.6, 12.9],
  [11.0, 3.4, 12.2], [60, 3.4, 12.2],
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
  return {x: 3.4, y: 12.2, vx: 0, vy: 0, moving: false};
};

const buildDynamic = (t: number): Item[] => {
  const frame = t * FPS;
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode) => items.push({k, n});

  // Gäste an Tischen
  const waving = (i: number) => {
    const startTimes = [0, 4.7, 5.3, 5.9, 6.5, 6.9];
    return t > startTimes[i] && t < 9.5;
  };
  TABLES.forEach((tb, i) => {
    const sides = i === 0 ? (['w', 'n', 'e', 's'] as const) : i === 1 || i === 4 ? (['w', 'e'] as const) : (['n', 's'] as const);
    sides.forEach((sd, si) => {
      const [dx, dy] = SEATS[sd];
      const look = LOOKS[(i * 3 + si * 2) % LOOKS.length];
      let pose: 'idle' | 'wave' | 'cheer' | 'laugh' = 'idle';
      if (i === 0) pose = t > 20.4 && t < 22.6 ? 'cheer' : t > 30.5 && t < 32.5 ? 'cheer' : t > 49.4 && t < 51 ? 'cheer' : 'laugh';
      else if (i >= 1 && i <= 3 && waving(i) && si === 0) pose = 'wave';
      const behind = sd === 'w' || sd === 'n';
      add(tb.x + tb.y + dx + dy + (behind ? -0.7 : 0.7), person(`gp${i}${sd}`, tb.x + dx * 0.9, tb.y + dy * 0.9, 0.5, look, pose, frame, si * 1.7 + i));
    });
  });

  // Barkeeper
  add(0.6 + BAR.y + 0.1, person('bk', 0.9, 11.6, 1.0, {skin: SKIN[2], hair: '#171717', hs: 'short', shirt: '#2a2d52', beard: true}, t > 21.5 && t < 22.4 ? 'cheer' : 'idle', frame, 0.7, 0.19));

  // Sprechblasen der wartenden Gäste
  [1, 2, 3].forEach((i, bi) => {
    const at = [4.7, 5.5, 6.3][bi];
    if (t < at || t > 9.6) return;
    const tb = TABLES[i];
    const p = P(tb.x - 0.5, tb.y - 0.9, 2.2);
    const s = clamp01((t - at) / 0.25);
    const e = 1 - Math.pow(1 - s, 3);
    const bob = Math.sin(t * 5 + i) * 3;
    add(tb.x + tb.y + 2, (
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

  // Kellner
  const wp = waiterAt(t);
  const dirRight = wp.vx - wp.vy > 0; // Bildschirm-x ≈ (vx − vy)
  const wpos = P(wp.x, wp.y, 0);
  add(wp.x + wp.y + 0.3, (
    <g key="waiter" transform={`translate(${wpos.X} ${wpos.Y}) scale(${dirRight ? 0.2 : -0.2} 0.2) translate(-160 -500)`}>
      <ellipse cx="150" cy="500" rx="130" ry="30" fill="rgba(0,0,0,.3)" />
      {wp.moving ? <Waiter bare frame={frame} hurry={1.1} /> : <Waiter bare frame={0} hurry={0} />}
    </g>
  ));

  // Strikes: Ball + Pins
  STRIKES.forEach((s, si) => {
    const cy = LANE_C[s.lane];
    const rows = [0, 1, 2, 3];
    let n = 0;
    rows.forEach((r) => {
      for (let c = 0; c <= r; c++) {
        n++;
        const bx = PIN_X - r * 0.3;
        const by = cy + (c - r / 2) * 0.34;
        let ox = 0, oy = 0, oz = 0, rot = 0;
        const p = Math.max(0, t - s.hit - r * 0.015);
        if (t > s.hit - 0.02 && t < s.hit + 1.8) {
          const rn = rand(n * 3.7 + s.lane + si * 11);
          const rn2 = rand(n * 7.1 + si * 5);
          const dir = (c - r / 2) * 0.9 + (rn - 0.5) * 1.8;
          ox = -(0.6 + rn2 * 1.8) * p * 1.1;
          oy = dir * 1.6 * p;
          oz = Math.max(0, 3.2 * p * (0.6 + rn2) - 6.5 * p * p);
          rot = dir * 200 * Math.min(p, 0.6) * (rn > 0.5 ? 1 : -1);
        }
        const pp = P(bx + ox, by + oy, oz);
        const gone = t > s.hit + 1.6;
        if (gone && t < s.hit + 1.8) continue;
        add(bx + by + ox + oy + 0.02, pinSprite(`pin${si}${n}`, pp.X, pp.Y, 0.13, rot));
      }
    });
    if (t >= s.start && t < s.hit + 0.12) {
      const u = clamp01((t - s.start) / (s.hit - s.start));
      const bx = lerp(s.from, PIN_X + 0.1, u);
      const by = cy + Math.sin(u * Math.PI) * 0.12;
      const pp = P(bx, by, 0.2);
      add(bx + by + 0.05, ballSprite(`ball${si}`, pp.X, pp.Y - 5, 12, bx * 120));
    }
  });

  // Bon (Bestellung) von Tisch 1 zur Bar
  if (t > 20.55 && t < 22.1) {
    const u = (t - 20.55) / 1.45;
    const e = IN_OUT(clamp01(u));
    const x = lerp(TABLES[0].x, 1.2, e);
    const y = lerp(TABLES[0].y, 11.6, e);
    const z = 1.0 + Math.sin(u * Math.PI) * 1.4 + e * 0.4;
    const pp = P(x, y, z);
    const trail: React.ReactNode[] = [];
    for (let i = 1; i <= 8; i++) {
      const ue = IN_OUT(clamp01(u - i * 0.035));
      const q = P(lerp(TABLES[0].x, 1.2, ue), lerp(TABLES[0].y, 11.6, ue), 1.0 + Math.sin((u - i * 0.035) * Math.PI) * 1.4 + ue * 0.4);
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

  // Display-Miniaturen
  TABLES.forEach((tb, i) => {
    const mode = modeFor(i, t);
    add(tb.x + tb.y + 0.4, miniDisplay(`md${i}`, tb.x, tb.y, 0.83, mode, t, i * 1.3, i === 0 ? 1.15 : 1));
  });

  // Fahrendes Auto auf der Straße
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
