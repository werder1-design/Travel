import React from 'react';
import {FPS} from '../theme';
import {IN_OUT, OUT, clamp01, lerp, rand} from '../ease';
import {SKIN, Waiter} from '../components/People';
import {P, V3, box, cyl, flat, pts, ring, shadowEllipse, wallL, wallLM, wallR, wallRM} from '../iso/iso';
import {darken, lighten, mat} from '../iso/colors';
import {Item, Look, carAlongX, chair, lamp, person, plant, table, tableware, tree} from '../iso/props';
import {IsoCam, SCREEN_CY, camOrigin} from '../iso/World';
import {MODE2, acrylicStand, cable, displayDevice, flowLine, miniRestaurant, paperStack, phoneOnTable, printer, theater, transformStand} from './props2';

// ---------- Geometrie & Zeitplan ----------
export const R = {W: 18, D: 13, H: 4.4};
export const RT = [
  {x: 4.5, y: 4.0}, {x: 9, y: 4.0}, {x: 13.5, y: 4.0},
  {x: 4.5, y: 7.2}, {x: 9, y: 7.2}, {x: 13.5, y: 7.2},
  {x: 4.5, y: 10.4}, {x: 9, y: 10.4}, {x: 13.5, y: 10.4},
];
export const HERO = 4;
export const THEATER = {x: 21, y: 1.5, w: 10, d: 8};
export const PILE = {x: 0.9, y: 4.8};
const PR = {x: 0.5, y: 1.0};
export const BLOCK = {w: 34, d: 22};

export const TL = {
  printStart: 3.3,
  pickUp: 4.6,
  swap: [5.5, 6.4, 7.3, 8.9, 8.2, 9.6] as const, // Reihenfolge der Tische siehe SWAP_ORDER
  transform: 11.3,
  wavePerTile: 0.3,
  slides: {happy: 17.2, pasta: 19.3, music: 20.4, happy2: 22.0},
  phone: 24.4,
  hub: 30.2,
  publish: 35.9,
  theaterOn: 38.3,
  theaterAds: 42.0,
};
const SWAP_ORDER = [0, 1, 2, 5, 4, 3];
const swapTime = (i: number) => {
  const k = SWAP_ORDER.indexOf(i);
  return k < 0 ? 9.8 + (i - 5) * 0.3 : TL.swap[k];
};
const dist = (i: number) => Math.hypot(RT[i].x - RT[HERO].x, RT[i].y - RT[HERO].y);
export const transformAt = (i: number) => TL.transform + dist(i) * TL.wavePerTile;

export const modeAt = (i: number, t: number): keyof typeof MODE2 => {
  if (t < TL.slides.happy) return 'menu';
  if (t < 28.8) {
    if (i === HERO) return t < TL.slides.pasta ? 'happy' : t < TL.slides.music ? 'pasta' : t < TL.slides.happy2 ? 'music' : 'happy';
    return (['menu', 'happy', 'menu', 'music', 'menu', 'pasta', 'menu', 'happy', 'menu'] as const)[i];
  }
  if (t < TL.publish) return 'menu';
  if (t < TL.theaterAds) return 'happy';
  if (t < 46.6) return 'theater';
  return (['theater', 'happy', 'music', 'pasta', 'theater', 'happy', 'music', 'pasta', 'theater'] as const)[(i + Math.floor((t - 46.6) / 1.9)) % 9];
};

export const LOOKS: Look[] = [
  {skin: SKIN[0], hair: '#2B1E1A', hs: 'short', shirt: '#2DD4FF'},
  {skin: SKIN[2], hair: '#171717', hs: 'long', shirt: '#FF3D9A', glasses: true},
  {skin: SKIN[1], hair: '#5B3A24', hs: 'cap', shirt: '#FFB627', beard: true},
  {skin: SKIN[4], hair: '#8A4B2A', hs: 'bun', shirt: '#8B5CF6'},
  {skin: SKIN[3], hair: '#111111', hs: 'curly', shirt: '#34E3A0'},
  {skin: SKIN[0], hair: '#C9A15A', hs: 'long', shirt: '#FF7A59'},
  {skin: SKIN[1], hair: '#222222', hs: 'short', shirt: '#E5445A'},
  {skin: SKIN[4], hair: '#5B3A24', hs: 'bun', shirt: '#2F7F86'},
];
export const SEATS: Record<number, ('w' | 'e' | 'n')[]> = {0: ['w', 'e'], 1: ['w'], 2: ['e'], 3: ['w', 'e'], 4: ['w', 'e'], 5: ['w', 'e'], 6: ['e'], 7: ['w', 'e'], 8: ['w']};
export const SEAT_OFF = {w: [-1.0, 0], e: [1.0, 0], n: [0, -1.0]} as const;

export const pathOf = (a: readonly V3[]) => {
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

export const Defs: React.FC = () => (
  <defs>
    <filter id="neonGlow" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="5" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0a1030" />
      <stop offset="1" stopColor="#14264e" />
    </linearGradient>
    <clipPath id="hallClip">
      <polygon points={pts([[0, 0, 0], [R.W, 0, 0], [R.W, R.D, 0], [0, R.D, 0]])} />
    </clipPath>
  </defs>
);

// Stadt-Raster: Blöcke mit Mini-Restaurants (insgesamt 20 Standorte inkl. Hero-Restaurant)
export const BLOCKS: {i: number; j: number; bx: number; by: number}[] = [];
for (let i = -2; i <= 2; i++) for (let j = -2; j <= 1; j++) if (!(i === 0 && j === 0)) BLOCKS.push({i, j, bx: i * BLOCK.w, by: j * BLOCK.d});
export const MINI_POS = BLOCKS.map((b) => ({x: b.bx + 8, y: b.by + 6.3, z: 3.4}));

// ---------- Statische Szene ----------
const buildStatic = () => {
  const far: React.ReactNode[] = [];
  const floors: React.ReactNode[] = [];
  const hw: React.ReactNode[] = [];
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode, b = false) => items.push({k, n, b});
  const {W, D, H} = R;
  let cur = floors;

  // Boden außen: Pflaster, Straßen im Blockraster
  cur.push(flat('gnd', -170, -130, 230, 130, -0.03, '#0e1a3e'));
  for (let i = -2; i <= 2; i++) {
    const bx = i * BLOCK.w;
    cur.push(flat(`rv${i}`, bx + 32, -110, bx + 36, 100, -0.01, '#0f1836'));
    for (let y = -108; y < 100; y += 3) cur.push(flat(`rvd${i}-${y}`, bx + 33.9, y, bx + 34.1, y + 1.5, 0.0, '#3a4a7e'));
  }
  for (let j = -2; j <= 1; j++) {
    const by = j * BLOCK.d;
    cur.push(flat(`rh${j}`, -100, by + 18, 190, by + 22, -0.01, '#0f1836'));
    for (let x = -98; x < 188; x += 3) cur.push(flat(`rhd${j}-${x}`, x, by + 19.9, x + 1.5, by + 20.1, 0.0, '#3a4a7e'));
  }
  cur.push(flat('walk', -3, -3, 33, 18, -0.015, '#1a2a56'));

  // Hero-Restaurant: Boden
  cur.push(flat('rf', 0, 0, W, D, 0, '#7b5238'));
  let planks = '';
  for (let y = 0.45; y < D; y += 0.45) planks += pathOf([[0, y - 0.012, 0.004], [W, y - 0.012, 0.004], [W, y + 0.012, 0.004], [0, y + 0.012, 0.004]]);
  cur.push(<path key="planks" d={planks} fill="rgba(40,20,10,.35)" />);
  for (let k = 0; k < 46; k++) {
    const y0 = Math.floor(rand(k * 1.7) * 28) * 0.45;
    const x0 = rand(k * 3.3) * (W - 3);
    cur.push(flat(`pl${k}`, x0, y0, x0 + 2.2 + rand(k) * 2.5, y0 + 0.45, 0.005, rand(k + 9) > 0.5 ? 'rgba(255,200,140,.10)' : 'rgba(30,10,0,.12)'));
  }
  RT.forEach((tb, i) => cur.push(<polygon key={`pool${i}`} points={pts(ring(tb.x, tb.y, 0.01, 2.3, 32))} fill="rgba(255,190,110,.12)" />));

  // Wände
  cur = hw;
  const capTop = '#eadfc9';
  cur.push(box('wl', -0.4, -0.4, 0, 0.4, D + 0.4, H, {top: capTop, left: '#bfae92', right: '#d7b595'}));
  cur.push(box('wr', -0.4, -0.4, 0, W + 0.4, 0.4, H, {top: capTop, left: '#c99f82', right: '#bfae92'}));
  cur.push(wallL('wlWood', 0, 0, D, 0, 1.25, '#7a4b37'));
  cur.push(wallL('wlTrim', 0, 0, D, 1.25, 1.34, '#efe0c6'));
  cur.push(wallR('wrWood', 0, 0, W, 0, 1.25, '#6f4332'));
  cur.push(wallR('wrTrim', 0, 0, W, 1.25, 1.34, '#efe0c6'));
  [[2.8, 4.8], [6.3, 8.3], [9.8, 11.8]].forEach(([a, b], i) => {
    cur.push(wallL(`lf${i}`, 0.004, a - 0.1, b + 0.1, 1.65, 3.8, '#efe0c6'));
    cur.push(wallL(`lg${i}`, 0.006, a, b, 1.78, 3.68, '#13306a'));
    cur.push(wallL(`lgl${i}`, 0.007, a, b, 2.8, 3.68, '#1d4a8c', {opacity: 0.6}));
    cur.push(wallL(`lm${i}`, 0.008, (a + b) / 2 - 0.04, (a + b) / 2 + 0.04, 1.78, 3.68, '#efe0c6'));
  });
  [[1.5, 3.7], [4.8, 7.0]].forEach(([a, b], i) => {
    cur.push(wallR(`rf${i}`, 0.004, a - 0.1, b + 0.1, 1.65, 3.8, '#efe0c6'));
    cur.push(wallR(`rg${i}`, 0.006, a, b, 1.78, 3.68, '#13306a'));
    cur.push(wallR(`rgl${i}`, 0.007, a, b, 2.8, 3.68, '#1d4a8c', {opacity: 0.6}));
    cur.push(wallR(`rm${i}`, 0.008, (a + b) / 2 - 0.04, (a + b) / 2 + 0.04, 1.78, 3.68, '#efe0c6'));
  });
  // Regal + Menütafeln an der rechten Wand (Bar)
  cur.push(box('shelf1', 8.4, 0, 1.8, 8.2, 0.5, 0.07, mat('#8a5640')));
  cur.push(box('shelf2', 8.4, 0, 2.4, 8.2, 0.5, 0.07, mat('#8a5640')));
  [1.87, 2.47].forEach((z, r) => {
    for (let i = 0; i < 17; i++) {
      const col = ['#2f9e6a', '#e8b34a', '#c45a3a', '#8fd0e8', '#a8508a'][(i + r) % 5];
      cur.push(cyl(`bt${r}${i}`, 8.7 + i * 0.47, 0.22, z, 0.07, 0.34, {top: lighten(col, 0.3), left: col, right: darken(col, 0.3)}));
    }
  });
  [8.6, 12.7].forEach((x0, i) =>
    cur.push(
      <g key={`tv${i}`} transform={wallRM(x0, 0.012, 4.3)}>
        <rect x="-5" y="-5" width="372" height="112" rx="5" fill="#15151f" />
        <rect x="0" y="0" width="362" height="102" fill="#0b0f26" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x="16" y={14 + r * 21} width={120 + ((r * 41) % 90)} height="9" fill={r % 2 ? '#ffd27a' : '#fff'} opacity="0.85" />
            <rect x="300" y={14 + r * 21} width="46" height="9" fill="#34e3a0" opacity="0.85" />
          </g>
        ))}
      </g>,
    ),
  );
  // Poster an der linken Wand (Druckerecke)
  cur.push(
    <g key="posters" transform={wallLM(0, 3.0, 3.9)}>
      <rect x="0" y="0" width="104" height="146" fill="#efe0c6" />
      <rect x="8" y="8" width="88" height="130" fill="#1d2038" />
      <circle cx="52" cy="56" r="24" fill="#e5445a" />
      <path d="M8 138 L8 100 Q52 66 96 104 L96 138Z" fill="#34406e" />
    </g>,
  );
  cur = floors;

  // Druckerecke (statischer Tisch)
  add(PR.x + 3.2 + PR.y, box('desk', 0.3, 0.7, 0, 1.6, 2.9, 0.78, {top: '#d6b48a', left: '#8a5a3c', right: '#6a4330'}));
  // Bar
  add(8.2 + 1.9 + 14.4, box('barC', 8.2, 0.6, 0, 8.6, 1.3, 1.15, {top: '#efe0c6', left: '#8a5640', right: '#6a3f2e'}));
  add(8.2 + 1.9 + 14.42, box('barTop', 8.1, 0.5, 1.15, 8.8, 1.5, 0.08, mat('#f6ead4')));
  [9.5, 11.2, 12.9, 14.6, 16.3].forEach((x, i) => add(x + 2.9 + 0.1, cyl(`st${i}`, x, 2.9, 0, 0.26, 0.64, mat('#b9553b'))));
  add(15.2 + 1.9 + 14.5, box('reg', 15.0, 0.8, 1.23, 0.7, 0.6, 0.32, mat('#232846')));
  add(11 + 1.9 + 14.5, box('pz1', 11.0, 0.9, 1.23, 0.9, 0.9, 0.12, mat('#efe0c6')));
  add(11 + 1.9 + 14.6, box('pz2', 11.05, 0.95, 1.35, 0.9, 0.9, 0.12, mat('#e9d8b8')));

  // Tische + Stühle
  RT.forEach((tb, i) => {
    SEATS[i].forEach((sd) => {
      const [dx, dy] = SEAT_OFF[sd];
      add(tb.x + tb.y + dx + dy + (sd === 'w' || sd === 'n' ? -0.45 : 0.45), chair(`ch${i}${sd}`, tb.x + dx * 0.95, tb.y + dy * 0.95, sd, i % 2 ? mat('#2f7f86') : mat('#b9553b')));
    });
    add(tb.x + tb.y, table(`tb${i}`, tb.x, tb.y, 0.82));
    add(tb.x + tb.y + 0.3, tableware(`tw${i}`, tb.x, tb.y, 0.83, i));
  });
  // Pendelleuchten
  RT.forEach((tb, i) => {
    const top = P(tb.x, tb.y, 4.3);
    const low = P(tb.x, tb.y, 3.1);
    add(tb.x + tb.y + 2.6, (
      <g key={`pend${i}`}>
        <line x1={top.X} y1={top.Y} x2={low.X} y2={low.Y} stroke="#2a2630" strokeWidth="2" />
        <ellipse cx={low.X} cy={low.Y + 10} rx="46" ry="30" fill="rgba(255,206,140,.14)" />
        <path d={`M${low.X - 16} ${low.Y} L${low.X - 6} ${low.Y - 14} L${low.X + 6} ${low.Y - 14} L${low.X + 16} ${low.Y}Z`} fill="#ffd9a0" />
      </g>
    ));
  });
  add(0.6 + 12.2, plant('pl1', 0.9, 12.0, 1.15));
  add(17.2 + 12.0, plant('pl2', 17.0, 12.0, 1.1));
  add(17.2 + 2.2, plant('pl3', 17.1, 2.3, 1.1));
  const rim = {top: '#efe5d1', left: '#cdb895', right: '#a99472'};
  add(W + D + 5, box('rimF', 0, D, 0, W + 0.4, 0.4, 0.5, rim));
  add(W + D + 5.1, box('rimR', W, 0, 0, 0.4, D, 0.5, rim));

  // Straße & Umgebung
  [[3, 16.5, 1.2], [8, 17, 1.35], [14, 16.6, 1.1], [19, 17.4, 1.2], [-3, 8, 1.2], [-3.4, 2, 1.0]].forEach(([x, y, s], i) => add(x + y, tree(`tr${i}`, x, y, s), x < 0.2));
  [[10, 18.6], [32.6, 8], [32.6, 20]].forEach(([x, y], i) => add(x + y, lamp(`lamp${i}`, x, y, 1)));

  // Filler-Gebäude + Mini-Restaurants (statische Teile)
  BLOCKS.forEach((b, n) => {
    const bh = 6 + rand(n * 2.1) * 6;
    const col = ['#1b2a55', '#223263', '#1a2650', '#243568'][n % 4];
    const fx = b.bx + 18 + rand(n) * 4;
    const fy = b.by + 2 + rand(n + 3) * 4;
    const behind = b.bx < 0 || b.by < 0;
    add(fx + fy + 12, (
      <g key={`fil${n}`}>
        {box('f', fx, fy, 0, 7, 6, bh, mat(col))}
        <path d={windowsR(fy + 6 + 0.003, fx, fx + 7, 0.6, bh - 0.4, 6, Math.round(bh / 0.9), n * 4.7)} fill="#f8d98a" opacity="0.8" />
      </g>
    ), behind);
    [[b.bx + 3, b.by + 16, 1.1], [b.bx + 12, b.by + 17, 0.9], [b.bx + 26, b.by + 16, 1.0]].forEach(([tx, ty, s], q) => add(tx + ty, tree(`bt${n}${q}`, tx, ty, s), behind));
  });
  // Theater-Block hat eigenen Schatten/Straße
  return {far, floors, hw, items};
};

let STATIC: ReturnType<typeof buildStatic> | null = null;
export const getStatic = () => (STATIC ??= buildStatic());

// ---------- Mitarbeiter-Weg ----------
const spot = (i: number) => [RT[i].x, RT[i].y - 1.5] as const;
const staffPath: [number, number, number][] = [
  [0, 10.8, 2.9], [2.8, 2.9, 2.4], [4.6, 2.9, 2.4], [5.5, spot(0)[0], spot(0)[1]], [6.4, spot(1)[0], spot(1)[1]],
  [7.3, spot(2)[0], spot(2)[1]], [8.2, spot(5)[0], spot(5)[1]], [8.9, spot(4)[0], spot(4)[1]], [9.6, spot(3)[0], spot(3)[1]],
  [10.6, 6.9, 5.6], [60, 6.9, 5.6],
];
export const staffAt = (t: number) => {
  for (let i = 0; i < staffPath.length - 1; i++) {
    const [t0, x0, y0] = staffPath[i];
    const [t1, x1, y1] = staffPath[i + 1];
    if (t <= t1) {
      const u = clamp01((t - t0) / (t1 - t0));
      const e = IN_OUT(u);
      return {x: lerp(x0, x1, e), y: lerp(y0, y1, e), vx: (x1 - x0) / (t1 - t0), vy: (y1 - y0) / (t1 - t0), moving: Math.hypot(x1 - x0, y1 - y0) > 0.3 && u > 0.02 && u < 0.98};
    }
  }
  return {x: 6.9, y: 5.6, vx: 0, vy: 0, moving: false};
};

// ---------- Dynamische Szene ----------
const buildDynamic = (t: number): Item[] => {
  const frame = t * FPS;
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode, b = false) => items.push({k, n, b});
  const hero = RT[HERO];

  // Aufsteller / Displays pro Tisch
  RT.forEach((tb, i) => {
    const ts = swapTime(i);
    const tt = transformAt(i);
    const card = t < ts ? i % 4 : (i + 1) % 4;
    const p = clamp01((t - tt) / 1.0);
    const key = tb.x + tb.y + 0.6;
    if (t < tt) {
      // alter Aufsteller; kurzer Pop beim Tausch
      const pop = t >= ts && t < ts + 0.4 ? 1 + Math.sin(((t - ts) / 0.4) * Math.PI) * 0.18 : 1;
      add(key, acrylicStand(`st${i}`, tb.x, tb.y, 0.84, card, {scale: 1.0 * pop}));
      if (t >= ts && t < ts + 0.5) {
        const q = (t - ts) / 0.5;
        const pp = P(tb.x, tb.y, 1.2);
        add(key + 0.1, <g key={`spk${i}`}>{[0, 1, 2, 3, 4].map((n) => <circle key={n} cx={pp.X + Math.cos(n * 1.3) * 34 * q} cy={pp.Y + Math.sin(n * 1.3) * 22 * q - 10} r={4 * (1 - q)} fill="#ffe38a" opacity={1 - q} />)}</g>);
      }
    } else if (p < 1) {
      add(key, transformStand(`tr${i}`, tb.x, tb.y, 0.84, p, card, modeAt(i, t) === 'menu' ? 'menu' : modeAt(i, t), t, i * 1.3));
    } else {
      add(key, displayDevice(`dv${i}`, tb.x, tb.y, 0.84, modeAt(i, t), t, i === HERO ? 1.15 : 1.0, i * 1.3, i === HERO && t > TL.phone));
    }
    // alte Karte fliegt zum Papierstapel
    if (t >= ts && t < ts + 0.9) {
      const q = clamp01((t - ts) / 0.9);
      const a = P(tb.x, tb.y, 1.2);
      const b = P(PILE.x, PILE.y, 0.9);
      const x = lerp(a.X, b.X, q);
      const y = lerp(a.Y, b.Y, q) - Math.sin(q * Math.PI) * 120;
      add(2000, (
        <g key={`fly${i}`} transform={`translate(${x} ${y}) rotate(${q * 540})`}>
          <rect x="-14" y="-19" width="28" height="38" rx="3" fill="#f3ecd2" stroke="#b7ae8e" strokeWidth="2" />
          <rect x="-9" y="-13" width="18" height="6" fill="#9ab24a" />
        </g>
      ));
    }
  });

  // Welle (Lichtring) durchs Restaurant
  if (t > TL.transform && t < TL.transform + 3.6) {
    const r = (t - TL.transform) / TL.wavePerTile;
    const op = clamp01(1 - (t - TL.transform) / 3.6);
    add(0.2, (
      <g key="wave" clipPath="url(#hallClip)">
        <polygon points={pts(ring(hero.x, hero.y, 0.03, r, 48))} fill="none" stroke="#2dd4ff" strokeWidth="14" opacity={0.7 * op} />
        <polygon points={pts(ring(hero.x, hero.y, 0.03, Math.max(0, r - 0.8), 48))} fill="rgba(45,212,255,.10)" opacity={op} />
      </g>
    ));
  }

  // Gäste
  RT.forEach((tb, i) => {
    SEATS[i].forEach((sd, si) => {
      const [dx, dy] = SEAT_OFF[sd];
      const look = LOOKS[(i * 3 + si * 2) % LOOKS.length];
      let pose: 'idle' | 'wave' | 'cheer' | 'laugh' = 'idle';
      if (i === HERO && t > 11.6 && t < 13.4) pose = 'cheer';
      else if (i === 5 && si === 1 && t > 18.5 && t < 20.4) pose = 'cheer';
      else if (t > 38.3 && t < 47) pose = (i + si) % 3 === 0 ? 'laugh' : 'idle';
      else if (t > 12.5) pose = 'laugh';
      const behind = sd === 'w' || sd === 'n';
      add(tb.x + tb.y + dx + dy + (behind ? -0.7 : 0.7), person(`gp${i}${si}`, tb.x + dx * 0.95, tb.y + dy * 0.95, 0.5, look, pose, frame, si * 1.7 + i));
    });
  });

  // Sprechblase: Gast entdeckt das Cocktailangebot
  if (t > 18.4 && t < 21.0) {
    const tb = RT[5];
    const pp = P(tb.x + 0.95, tb.y, 2.4);
    const q = clamp01((t - 18.4) / 0.25);
    const e = 1 - Math.pow(1 - q, 3);
    add(tb.x + tb.y + 4, (
      <g key="cocktail" transform={`translate(${pp.X} ${pp.Y + Math.sin(t * 5) * 3}) scale(${e})`}>
        <rect x="-38" y="-70" width="76" height="62" rx="20" fill="#fff" />
        <path d="M-6 -10 L0 6 L10 -10Z" fill="#fff" />
        <path d="M-18 -56 H18 L2 -34 V-22 H12 V-18 H-12 V-22 H-2 V-34Z" fill="#ff3d9a" />
        <circle cx="14" cy="-58" r="6" fill="#ffb627" />
      </g>
    ));
  }

  // Mitarbeiter
  const st = staffAt(t);
  const dirRight = st.vx - st.vy > 0;
  const sp = P(st.x, st.y, 0);
  const carry = t >= TL.pickUp && t < 9.9 ? 'paper' : 'none';
  const happy = t > 12.0;
  add(st.x + st.y + 0.35, (
    <g key="staff" transform={`translate(${sp.X} ${sp.Y}) scale(${dirRight ? 0.2 : -0.2} 0.2) translate(-160 -500)`}>
      <ellipse cx="150" cy="500" rx="130" ry="30" fill="rgba(0,0,0,.3)" />
      {st.moving ? <Waiter bare frame={frame} hurry={1.1} carry={carry} /> : <Waiter bare frame={happy ? Math.floor(frame * 0.3) : 0} hurry={happy ? 0.25 : 0} carry={carry} />}
      {t > 9.7 && t < 12.2 && (
        <g transform="translate(120 -10)"><path d="M0 0 Q8 22 0 36" stroke="#8fd0ff" strokeWidth="9" fill="none" strokeLinecap="round" /></g>
      )}
    </g>
  ));

  // Druckerecke: Drucker, wachsender Papierstapel, Ablagestapel mit alten Karten
  const pr = clamp01((t - TL.printStart) / (TL.pickUp - TL.printStart));
  add(PR.x + 2.2 + PR.y + 1.5, printer('prn', PR.x + 0.4, PR.y + 0.4, 0.78, t > TL.printStart && t < TL.pickUp ? pr : 0));
  const stack = t < TL.pickUp ? 2 + pr * 26 : 2;
  add(PR.x + 2.5 + PR.y + 2.9, paperStack('stk', 0.5, 2.55, 0.78, stack, 0.6, 0.55));
  const swapped = SWAP_ORDER.filter((i) => t > swapTime(i) + 0.8).length;
  const pile = 4 + swapped * 4 + (t > 11.5 ? 4 : 0);
  add(PILE.x + PILE.y + 0.7, paperStack('pile', PILE.x - 0.3, PILE.y - 0.3, 0, pile, 0.6, 0.75));

  // Smartphone laden
  if (t > TL.phone - 0.4) {
    const level = lerp(41, 78, clamp01((t - TL.phone) / 4.2));
    const ph = [hero.x + 0.62, hero.y + 0.28] as const;
    const slide = clamp01((t - (TL.phone - 0.4)) / 0.5);
    add(hero.x + hero.y + 0.9, phoneOnTable('phone', ph[0], ph[1] - (1 - slide) * 0.3, 0.83, t, level));
    if (t > TL.phone + 0.2) add(hero.x + hero.y + 0.95, cable('cab', [hero.x - 0.35, hero.y + 0.0, 0.98], [ph[0] - 0.12, ph[1], 0.87]));
  }

  // Zentrale Steuerung (S5): Hub + Linien + Mini-Restaurants
  const hubA = clamp01((t - TL.hub) / 0.8) * (1 - clamp01((t - 38.0) / 0.8));
  const hubPos: V3 = [hero.x, hero.y, 7.0];
  if (hubA > 0.01) {
    const hp = P(...hubPos);
    const pulseR = ((t - TL.publish) % 1.2) / 1.2;
    add(9999, (
      <g key="hub" opacity={hubA}>
        <ellipse cx={hp.X} cy={hp.Y} rx="76" ry="76" fill="rgba(45,212,255,.18)" />
        <circle cx={hp.X} cy={hp.Y} r="38" fill="#0f1a4a" stroke="#2dd4ff" strokeWidth="5" style={{filter: 'drop-shadow(0 0 16px #2dd4ff)'}} />
        <text x={hp.X} y={hp.Y + 12} textAnchor="middle" fontFamily="Anton" fontSize="36" fill="#fff">iQ</text>
        {t > TL.publish && t < TL.publish + 2.4 && <circle cx={hp.X} cy={hp.Y} r={38 + pulseR * 160} fill="none" stroke="#ff3d9a" strokeWidth={6 * (1 - pulseR)} opacity={1 - pulseR} />}
      </g>
    ));
    MINI_POS.forEach((m, n) => {
      const reveal = clamp01((t - TL.hub - 0.2 - n * 0.04) / 0.8);
      const sent = t > TL.publish + Math.hypot(m.x - hero.x, m.y - hero.y) * 0.012;
      add(9998, flowLine(`fl${n}`, hubPos, [m.x, m.y, m.z + 0.6], t, sent ? '#ff3d9a' : '#2dd4ff', {lift: 3.0 + (n % 3), speed: 0.35, dots: 2, width: 3, progress: reveal}));
    });
  }
  BLOCKS.forEach((b, n) => {
    const m = MINI_POS[n];
    const sent = t > TL.publish + Math.hypot(m.x - hero.x, m.y - hero.y) * 0.012 && t < TL.theaterAds + 6;
    const behind = b.bx < 0 || b.by < 0;
    const online = clamp01((t - TL.hub - 0.2 - n * 0.04) / 0.8);
    add(b.bx + 4 + 8 + b.by + 3 + 6.6, miniRestaurant(`mini${n}`, b.bx + 4, b.by + 3, n, t, sent ? '#ff3d9a' : '#2dd4ff', sent ? 1 : 0.25 + online * 0.4), behind);
  });

  // Theater + Werbe-Verbindung (S6)
  const lit = clamp01((t - TL.theaterOn) / 0.9);
  add(THEATER.x + THEATER.w + THEATER.y + THEATER.d, theater('theater', THEATER.x, THEATER.y, THEATER.w, THEATER.d, t, lit));
  if (t > 40.6 && t < 47.2) {
    const reveal = clamp01((t - 40.8) / 1.2);
    const a: V3 = [THEATER.x + THEATER.w / 2, THEATER.y + THEATER.d + 0.2, 5.8];
    RT.forEach((tb, i) => add(9997, flowLine(`th${i}`, a, [tb.x, tb.y, 1.2], t, '#ffc247', {lift: 2.8 + (i % 3) * 0.6, speed: 0.4, dots: 3, width: 3.5, progress: reveal, coin: t > 44.0})));
  }

  // Autos auf der Süd-Straße
  const cx1 = ((t * 2.6 + 6) % 90) - 30;
  items.push({k: cx1 + 19.5 + 1, n: carAlongX('drive', cx1, 18.4, 0, '#e8b34a'), b: false});
  const cx2 = 60 - ((t * 3.1 + 20) % 90);
  items.push({k: cx2 + 21 + 1, n: carAlongX('drive2', cx2, 20.3, 0, '#8b5cf6'), b: false});
  return items;
};

// ---------- Komponente ----------
export const RestaurantWorld: React.FC<{t: number; cam: IsoCam; dim?: number; blur?: number}> = ({t, cam, dim = 0, blur = 0}) => {
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
        {st.floors}
        {behind.map(draw)}
        {st.hw}
        {front.map(draw)}
      </g>
      {dim > 0 && <rect width="1080" height="1920" fill="#050a1e" opacity={dim} />}
    </svg>
  );
};
