import React from 'react';
import {FPS} from '../theme';
import {IN_OUT, clamp01, lerp, rand} from '../ease';
import {Waiter} from '../components/People';
import {P, V3, flat, pts, ring, wallL, wallLM, wallR, wallRM} from '../iso/iso';
import {Item, person} from '../iso/props';
import {IsoCam, SCREEN_CY, camOrigin} from '../iso/World';
import {BLOCKS, Defs, LOOKS, MINI_POS, R, RT, SEATS, SEAT_OFF, HERO, getStatic} from '../reel2/RestaurantWorld';
import {flowLine, miniRestaurant} from '../reel2/props2';
import {MODE3, Mode3, dayDisplay, tableSetting} from './props3';
import {S6, SLOT_COLORS, SlotId, T3, daylight, h24, hourAt, mixh, neon, settle, skyColors, slotOf, sunShafts, warmth} from './timeline';

// Silhouette des Restaurants (Boden + zwei Rückwände) für die Tageslicht-Maske
const HALL_SIL = pts([[0, R.D, 0], [0, R.D, R.H], [0, 0, R.H], [R.W, 0, R.H], [R.W, 0, 0], [R.W, R.D, 0]]);

// ---------- Gäste je Tageszeit ----------
const SEAT_LIST: {i: number; sd: 'w' | 'e' | 'n'; si: number}[] = [];
RT.forEach((_, i) => SEATS[i].forEach((sd, si) => SEAT_LIST.push({i, sd, si})));
const idx = (i: number, sd: string) => SEAT_LIST.findIndex((s) => s.i === i && s.sd === sd);
const ARR = [idx(1, 'w'), idx(2, 'e'), idx(8, 'w')]; // Gäste, die zum Mittag hereinkommen
const PRES: Record<SlotId, Set<number>> = {
  B: new Set([idx(0, 'e'), idx(3, 'w'), idx(4, 'w'), idx(4, 'e'), idx(5, 'e'), idx(7, 'e')]),
  L: new Set(SEAT_LIST.map((_, n) => n)),
  C: new Set([idx(0, 'w'), idx(0, 'e'), idx(3, 'e'), idx(4, 'w'), idx(4, 'e'), idx(5, 'w'), idx(7, 'w'), idx(8, 'w'), idx(6, 'e')]),
  E: new Set(SEAT_LIST.map((_, n) => n)),
};
const PREV: Record<SlotId, SlotId> = {B: 'E', L: 'B', C: 'L', E: 'C'};

const WALK_START = [T3.mittags2 - 0.5, T3.mittags2 - 0.05, T3.mittags2 + 0.4];
const WALK_DUR = 3.2;
const WALK: [number, number][][] = [
  [[19.4, 9.6], [16.2, 8.8], [11.25, 8.8], [11.25, 5.6], [8.05, 5.6], [8.05, 4.5]],
  [[19.4, 9.9], [16.2, 8.8], [16.0, 5.6], [14.45, 5.6], [14.45, 4.5]],
  [[19.4, 10.4], [15.8, 9.6], [12.55, 9.0], [12.55, 10.0]],
];
const walkPos = (path: [number, number][], u: number) => {
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const tot = seg.reduce((a, b) => a + b, 0);
  let d = clamp01(u) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const q = d / seg[i];
      return {x: lerp(path[i][0], path[i + 1][0], q), y: lerp(path[i][1], path[i + 1][1], q), vx: path[i + 1][0] - path[i][0], vy: path[i + 1][1] - path[i][1]};
    }
    d -= seg[i];
  }
  const e = path[path.length - 1];
  return {x: e[0], y: e[1], vx: 0, vy: 0};
};

// Kellner mit Pasta (Mittag, Hero-Tisch)
const TW_START = T3.mittags2 + 0.1;
const TSERVE = TW_START + 2.5;
const SERVE_PATH: [number, number, number][] = [
  [TW_START, 10.3, 2.4], [TW_START + 2.3, 10.2, 5.8], [TW_START + 2.6, 9.4, 6.05], [TW_START + 4.0, 9.4, 6.05], [TW_START + 6.0, 10.3, 2.4],
];
const servePos = (t: number) => {
  if (t < SERVE_PATH[0][0]) return null;
  for (let i = 0; i < SERVE_PATH.length - 1; i++) {
    const [t0, x0, y0] = SERVE_PATH[i];
    const [t1, x1, y1] = SERVE_PATH[i + 1];
    if (t <= t1) {
      const e = IN_OUT(clamp01((t - t0) / (t1 - t0)));
      return {x: lerp(x0, x1, e), y: lerp(y0, y1, e), vx: x1 - x0, vy: y1 - y0, moving: Math.hypot(x1 - x0, y1 - y0) > 0.3};
    }
  }
  return null;
};

export const modeOf = (t: number, h: number): Mode3 => {
  // „dieselbe Werbung“ in der Problemstellung, danach Tageszeit
  if (t >= T3.warum - 0.2 && t < T3.mit + 0.5) return 'neutral';
  return slotOf(h).id;
};

// ---------- Statische Zusatzebenen (Fenster, Neon) ----------
const WL = [[2.8, 4.8], [6.3, 8.3], [9.8, 11.8]];
const WR = [[1.5, 3.7], [4.8, 7.0]];

const windowsAndSun = (h: number, t: number) => {
  const sky = skyColors(h);
  const d = daylight(h);
  const glassLo = mixh('#13306a', '#7fc3f2', d);
  const glassHi = mixh('#1d4a8c', '#b9e1fb', d);
  const warm = warmth(h);
  const gLo = warm > 0.05 ? mixh(glassLo, '#ffb06a', warm * 0.5) : glassLo;
  const out: React.ReactNode[] = [];
  WL.forEach(([a, b], i) => {
    out.push(wallL(`dlg${i}`, 0.01, a, b, 1.78, 3.68, gLo));
    out.push(wallL(`dlgl${i}`, 0.011, a, b, 2.8, 3.68, glassHi, {opacity: 0.6}));
    out.push(wallL(`dlm${i}`, 0.012, (a + b) / 2 - 0.04, (a + b) / 2 + 0.04, 1.78, 3.68, '#efe0c6'));
  });
  WR.forEach(([a, b], i) => {
    out.push(wallR(`drg${i}`, 0.01, a, b, 1.78, 3.68, gLo));
    out.push(wallR(`drgl${i}`, 0.011, a, b, 2.8, 3.68, glassHi, {opacity: 0.6}));
    out.push(wallR(`drm${i}`, 0.012, (a + b) / 2 - 0.04, (a + b) / 2 + 0.04, 1.78, 3.68, '#efe0c6'));
  });
  // Lichtschächte auf dem Boden
  const sun = sunShafts(h);
  const shimmer = 0.92 + 0.08 * Math.sin(t * 1.3);
  const tint = warm > 0.2 ? '255,200,130' : '255,243,205';
  const shafts: React.ReactNode[] = [];
  if (sun.morning > 0.01) {
    WL.forEach(([a, b], i) => {
      const L = sun.lenM;
      const skew = 1.6;
      shafts.push(<polygon key={`sm${i}`} points={pts([[0, a, 0.005], [0, b, 0.005], [L, b + skew, 0.005], [L, a + skew, 0.005]])} fill={`rgba(${tint},${0.3 * sun.morning * shimmer})`} />);
      shafts.push(<polygon key={`sn${i}`} points={pts([[0, a + 0.3, 0.006], [0, b - 0.3, 0.006], [L * 0.8, b - 0.3 + skew * 0.8, 0.006], [L * 0.8, a + 0.3 + skew * 0.8, 0.006]])} fill={`rgba(255,255,235,${0.14 * sun.morning * shimmer})`} />);
    });
  }
  if (sun.afternoon > 0.01) {
    WR.forEach(([a, b], i) => {
      const L = sun.lenA;
      const skew = 1.2;
      shafts.push(<polygon key={`sa${i}`} points={pts([[a, 0, 0.005], [b, 0, 0.005], [b + skew, L, 0.005], [a + skew, L, 0.005]])} fill={`rgba(${tint},${0.3 * sun.afternoon * shimmer})`} />);
      shafts.push(<polygon key={`sb${i}`} points={pts([[a + 0.3, 0, 0.006], [b - 0.3, 0, 0.006], [b - 0.3 + skew * 0.8, L * 0.8, 0.006], [a + 0.3 + skew * 0.8, L * 0.8, 0.006]])} fill={`rgba(255,240,210,${0.14 * sun.afternoon * shimmer})`} />);
    });
  }
  return {sky, glass: out, shafts};
};

const NeonGlass: React.FC = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke="#ff3d9a" strokeWidth="6">
    <path d="M10 14 H100 L55 70Z" />
    <path d="M55 70 V108 M32 112 H78" />
    <path d="M70 6 L92 34" stroke="#ffd27a" strokeWidth="5" />
    <circle cx="88" cy="22" r="8" stroke="#2dd4ff" strokeWidth="5" />
  </g>
);

const neonLayer = (h: number, t: number) => {
  const n = neon(h);
  if (n < 0.02) return null;
  const flick = n * (0.92 + 0.08 * Math.sin(t * 17));
  const a = P(0.2, 0.06, 4.15);
  const b = P(R.W - 0.2, 0.06, 4.15);
  const c = P(0.06, 0.2, 4.15);
  const d = P(0.06, R.D - 0.2, 4.15);
  return (
    <g key="neon" opacity={flick} style={{filter: 'url(#neonGlow)'}}>
      <line x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke="#ff3d9a" strokeWidth="5" strokeLinecap="round" />
      <line x1={c.X} y1={c.Y} x2={d.X} y2={d.Y} stroke="#2dd4ff" strokeWidth="5" strokeLinecap="round" />
      <g transform={wallLM(0.1, 6.1, 3.6)}><g transform="scale(0.9)"><NeonGlass /></g></g>
      <g transform={wallRM(0.3, 0.1, 3.9)}><text x="0" y="40" fontFamily="Anton" fontSize="36" letterSpacing="4" fill="#ff3d9a" stroke="#ff3d9a" strokeWidth="1">HAPPY HOUR</text></g>
    </g>
  );
};

// ---------- Dynamische Ebene ----------
const buildDay = (t: number): Item[] => {
  const frame = t * FPS;
  const h = hourAt(t);
  const slot = slotOf(h);
  const sp = settle(h);
  const mode = modeOf(t, h);
  const items: Item[] = [];
  const add = (k: number, n: React.ReactNode, b = false) => items.push({k, n, b});
  const hero = RT[HERO];
  const flash = Math.max(0, 1 - (sp < 1 ? sp * 2 : 2)); // Anzeige blitzt beim Wechsel

  // Tische: Display + Deko
  RT.forEach((tb, i) => {
    const key = tb.x + tb.y + 0.6;
    const served = !(i === HERO && slot.id === 'L' && t >= T3.mittags2 - 0.3 && t < TSERVE);
    add(key - 0.3, tableSetting(`set${i}`, tb.x, tb.y, 0.83, slot.id, i, t, sp, served));
    add(key, dayDisplay(`dv${i}`, tb.x, tb.y, 0.84, mode, t, i === HERO ? 1.15 : 1.0, i * 1.3, flash));
  });

  // Gäste
  SEAT_LIST.forEach((sd, n) => {
    const tb = RT[sd.i];
    const [dx, dy] = SEAT_OFF[sd.sd];
    const walkK = ARR.indexOf(n);
    let present = PRES[slot.id].has(n);
    let scaleK = 1;
    if (present && walkK >= 0 && slot.id === 'L' && t >= T3.mittags2 - 0.8) {
      const tArr = WALK_START[walkK] + WALK_DUR;
      if (t < tArr) present = false;
      else scaleK = 0.35 + 0.65 * Math.min(1, (t - tArr) / 0.25) + Math.sin(clamp01((t - tArr) / 0.25) * Math.PI) * 0.12;
    } else if (present && !PRES[PREV[slot.id]].has(n)) {
      scaleK = 0.35 + 0.65 * sp + Math.sin(sp * Math.PI) * 0.12;
    }
    if (!present) return;
    const look = LOOKS[(sd.i * 3 + sd.si * 2) % LOOKS.length];
    let pose: 'idle' | 'wave' | 'cheer' | 'laugh' = 'idle';
    if (slot.id === 'E') pose = sp < 1 || (n + Math.floor(t * 0.7)) % 4 === 0 ? 'cheer' : 'laugh';
    else if (slot.id === 'L') pose = n % 3 === 0 ? 'laugh' : 'idle';
    else if (slot.id === 'C') pose = n % 2 ? 'laugh' : 'idle';
    const behind = sd.sd === 'w' || sd.sd === 'n';
    add(tb.x + tb.y + dx + dy + (behind ? -0.7 : 0.7), person(`gp${n}`, tb.x + dx * 0.95, tb.y + dy * 0.95, 0.5, look, pose, frame, sd.si * 1.7 + sd.i, 0.2 * scaleK));
  });

  // Hereinkommende Gäste (Mittag)
  WALK.forEach((path, k) => {
    const u = (t - WALK_START[k]) / WALK_DUR;
    if (u < 0 || u > 1) return;
    const w = walkPos(path, u);
    const ps = P(w.x, w.y, 0);
    const dirRight = w.vx - w.vy > 0;
    add(w.x + w.y + 0.35, (
      <g key={`walker${k}`} transform={`translate(${ps.X} ${ps.Y}) scale(${dirRight ? 0.2 : -0.2} 0.2) translate(-160 -500)`}>
        <ellipse cx="150" cy="500" rx="130" ry="30" fill="rgba(0,0,0,.3)" />
        <g style={{filter: `hue-rotate(${[200, 90, 300][k]}deg) saturate(1.25)`}}>
          <Waiter bare frame={frame} hurry={1.05} carry="none" />
        </g>
      </g>
    ));
  });

  // Kellner: bringt die Pasta
  const sv = servePos(t);
  const wp = sv ?? {x: 10.3, y: 2.4, vx: 0, vy: 0, moving: false};
  const dirRight = wp.vx - wp.vy > 0;
  const wps = P(wp.x, wp.y, 0);
  const carrying = sv && t < TSERVE + 0.05 && t >= TW_START;
  add(wp.x + wp.y + 0.35, (
    <g key="staff" transform={`translate(${wps.X} ${wps.Y}) scale(${dirRight ? 0.2 : -0.2} 0.2) translate(-160 -500)`}>
      <ellipse cx="150" cy="500" rx="130" ry="30" fill="rgba(0,0,0,.3)" />
      <Waiter bare frame={wp.moving ? frame : Math.floor(frame * 0.2)} hurry={wp.moving ? 1.0 : 0.2} carry={carrying ? 'tray' : 'none'} />
    </g>
  ));

  // Bestell-Sprechblase im Frühstück („Ein Gast bestellt einen Kaffee“)
  const b0 = T3.neun + 1.2;
  const bDur = Math.min(2.2, T3.mittags2 - b0 - 0.3);
  if (t > b0 && t < b0 + bDur) {
    const tb = RT[HERO];
    const pp = P(tb.x + 0.95, tb.y, 2.4);
    const q = clamp01((t - b0) / 0.25);
    const e = 1 - Math.pow(1 - q, 3);
    const pop = t > b0 + bDur - 0.3 ? 1 - clamp01((t - b0 - bDur + 0.3) / 0.3) : 1;
    add(tb.x + tb.y + 4, (
      <g key="order" transform={`translate(${pp.X} ${pp.Y + Math.sin(t * 5) * 3}) scale(${e * pop})`}>
        <rect x="-38" y="-70" width="76" height="62" rx="20" fill="#fff" />
        <path d="M-6 -10 L0 6 L10 -10Z" fill="#fff" />
        <path d="M-17 -54 H15 V-38 Q15 -26 -1 -26 Q-17 -26 -17 -38Z" fill="#7a4a2a" />
        <path d="M15 -50 H22 Q27 -50 27 -44 Q27 -38 21 -38 H15" fill="none" stroke="#7a4a2a" strokeWidth="4" />
        <path d="M-8 -60 q4 -6 0 -10 M4 -60 q4 -6 0 -10" stroke="#aab" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    ));
  }

  // ----- Zeitplan-Szene: Hub, Datenlinien, Mini-Restaurants -----
  const hubA = clamp01((t - S6.hubIn) / 0.8) * (1 - clamp01((t - (S6.back + 0.2)) / 0.8));
  const hubPos: V3 = [hero.x, hero.y, 7.0];
  const pubT = S6.publish;
  const cyc = t > pubT ? Math.floor((t - pubT) / 0.95) % 4 : -1;
  const colNow = cyc >= 0 ? SLOT_COLORS[cyc] : '#2dd4ff';
  if (hubA > 0.01) {
    const hp = P(...hubPos);
    const pulseR = ((t - pubT) % 1.1) / 1.1;
    add(9999, (
      <g key="hub" opacity={hubA}>
        <ellipse cx={hp.X} cy={hp.Y} rx="76" ry="76" fill="rgba(45,212,255,.18)" />
        <circle cx={hp.X} cy={hp.Y} r="38" fill="#0f1a4a" stroke="#2dd4ff" strokeWidth="5" style={{filter: 'drop-shadow(0 0 16px #2dd4ff)'}} />
        <text x={hp.X} y={hp.Y + 12} textAnchor="middle" fontFamily="Anton" fontSize="36" fill="#fff">iQ</text>
        {t > pubT && t < pubT + 2.6 && <circle cx={hp.X} cy={hp.Y} r={38 + pulseR * 160} fill="none" stroke={colNow} strokeWidth={6 * (1 - pulseR)} opacity={1 - pulseR} />}
      </g>
    ));
    MINI_POS.forEach((m, n) => {
      const reveal = clamp01((t - S6.hubIn - 0.2 - n * 0.04) / 0.8);
      const sent = t > pubT + Math.hypot(m.x - hero.x, m.y - hero.y) * 0.012;
      add(9998, flowLine(`fl${n}`, hubPos, [m.x, m.y, m.z + 0.6], t, sent ? colNow : '#2dd4ff', {lift: 3.0 + (n % 3), speed: 0.35, dots: 2, width: 3, progress: reveal}));
    });
  }
  BLOCKS.forEach((b, n) => {
    const m = MINI_POS[n];
    const sent = t > pubT + Math.hypot(m.x - hero.x, m.y - hero.y) * 0.012;
    const behind = b.bx < 0 || b.by < 0;
    const online = clamp01((t - S6.hubIn - 0.2 - n * 0.04) / 0.8);
    add(b.bx + 4 + 8 + b.by + 3 + 6.6, miniRestaurant(`mini${n}`, b.bx + 4, b.by + 3, n, t, sent ? colNow : '#2dd4ff', sent ? 1 : 0.25 + online * 0.4), behind);
  });

  // Autos auf der Süd-Straße (nur Tag/Abend – fahren immer)
  return items;
};

// ---------- Komponente ----------
export const DayWorld: React.FC<{t: number; cam: IsoCam; dim?: number}> = ({t, cam, dim = 0}) => {
  const st = getStatic();
  const dyn = buildDay(t);
  const h = hourAt(t);
  const ws = windowsAndSun(h, t);
  const d = daylight(h);
  const warm = warmth(h);
  const night = 1 - d;
  const sorted = [...st.items, ...dyn].sort((a, b) => a.k - b.k);
  const behind = sorted.filter((i) => i.b);
  const front = sorted.filter((i) => !i.b);
  const draw = (it: Item) => <g key={`${it.k}-${(it.n as React.ReactElement).key}`}>{it.n}</g>;
  const o = camOrigin(cam);
  const cy = cam.cy ?? SCREEN_CY;
  const sunX = 120 + clamp01((h24(h) - 6) / 13) * 840;
  const sunY = 520 - Math.sin(clamp01((h24(h) - 6) / 13) * Math.PI) * 330;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <Defs />
      <defs>
        <linearGradient id="skyDyn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ws.sky.top} />
          <stop offset="1" stopColor={ws.sky.bot} />
        </linearGradient>
        <mask id="hallMask" maskUnits="userSpaceOnUse" x={-2000} y={-1500} width={4000} height={3600}>
          <rect x={-2000} y={-1500} width={4000} height={3600} fill="#fff" />
          <polygon points={HALL_SIL} fill="#000" />
        </mask>
        <radialGradient id="sunG">
          <stop offset="0" stopColor="#fff6d0" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ffe08a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#skyDyn)" />
      {d > 0.05 && h24(h) > 6 && h24(h) < 19.5 && <circle cx={sunX} cy={sunY} r="260" fill="url(#sunG)" opacity={Math.min(1, d * 1.5)} />}
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={rand(i + 3) * 1080} cy={rand(i + 9) * 700} r={1 + rand(i + 1) * 2} fill="#fff" opacity={(0.2 + 0.4 * rand(i + 5)) * Math.max(0, night - 0.2)} />
      ))}
      <g transform={`translate(540 ${cy}) scale(${cam.zoom}) translate(${-o.X} ${-o.Y})`}>
        {st.floors}
        <g clipPath="url(#hallClip)">{ws.shafts}</g>
        {behind.map(draw)}
        {st.hw}
        {ws.glass}
        {neonLayer(h, t)}
        {front.map(draw)}
      </g>
      {/* Tageslicht: hellt die dunkle Nachtwelt außen auf, innen nur dezent; goldene Stunde wärmt */}
      <g transform={`translate(540 ${cy}) scale(${cam.zoom}) translate(${-o.X} ${-o.Y})`}>
        <rect x={-2000} y={-1500} width={4000} height={3600} fill="rgb(120,168,226)" opacity={d * 0.5} mask="url(#hallMask)" style={{mixBlendMode: 'screen'}} />
        <polygon points={HALL_SIL} fill="rgb(255,236,200)" opacity={d * 0.07} style={{mixBlendMode: 'screen'}} />
      </g>
      {warm > 0.02 && <rect width="1080" height="1920" fill="rgb(255,150,70)" opacity={warm * 0.22} style={{mixBlendMode: 'soft-light'}} />}
      {dim > 0 && <rect width="1080" height="1920" fill="#050a1e" opacity={dim} />}
    </svg>
  );
};
