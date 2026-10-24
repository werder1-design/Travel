import React from 'react';
import {Mat, darken, lighten} from './colors';

/** Isometrie 2:1. x = gx (nach rechts unten), y = gy (nach links unten), z = Höhe. 1 Einheit = 1 Kachel. */
export const TW = 96;
export const TH = 48;
export const ZH = 56;
export type V3 = readonly [number, number, number];

export const P = (x: number, y: number, z = 0) => ({X: ((x - y) * TW) / 2, Y: ((x + y) * TH) / 2 - z * ZH});
const f = (n: number) => n.toFixed(1);
export const pts = (a: readonly V3[]) =>
  a
    .map(([x, y, z]) => {
      const p = P(x, y, z);
      return `${f(p.X)},${f(p.Y)}`;
    })
    .join(' ');

type Extra = React.SVGProps<SVGPolygonElement>;
export const poly = (k: React.Key, a: readonly V3[], fill: string, extra: Extra = {}) => (
  <polygon key={k} points={pts(a)} fill={fill} {...extra} />
);

export const flat = (k: React.Key, x0: number, y0: number, x1: number, y1: number, z: number, fill: string, extra: Extra = {}) =>
  poly(k, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill, extra);

/** Wand-Ebene gx = x (zeigt nach +gx, linke Rückwand). */
export const wallL = (k: React.Key, x: number, y0: number, y1: number, z0: number, z1: number, fill: string, extra: Extra = {}) =>
  poly(k, [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], fill, extra);
/** Wand-Ebene gy = y (zeigt nach +gy, rechte Rückwand). */
export const wallR = (k: React.Key, y: number, x0: number, x1: number, z0: number, z1: number, fill: string, extra: Extra = {}) =>
  poly(k, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], fill, extra);

export const box = (k: React.Key, x: number, y: number, z: number, w: number, d: number, h: number, m: Mat, extra: Extra = {}) => (
  <g key={k}>
    <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={m.left} {...extra} />
    <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={m.right} {...extra} />
    <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={m.top} {...extra} />
  </g>
);

export const ring = (cx: number, cy: number, z: number, r: number, n = 28): V3[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3;
  });

/** Zylinder (Tischplatte, Hocker, Fass). */
export const cyl = (k: React.Key, cx: number, cy: number, z: number, r: number, h: number, m: Mat) => {
  // Extrempunkte der Silhouette in Screen-X: θ = 135° (links) bzw. −45° (rechts)
  const l = [cx + r * Math.cos((3 * Math.PI) / 4), cy + r * Math.sin((3 * Math.PI) / 4)];
  const rr = [cx + r * Math.cos(-Math.PI / 4), cy + r * Math.sin(-Math.PI / 4)];
  return (
    <g key={k}>
      <polygon points={pts(ring(cx, cy, z, r))} fill={m.right} />
      <polygon points={pts([[l[0], l[1], z], [rr[0], rr[1], z], [rr[0], rr[1], z + h], [l[0], l[1], z + h]])} fill={m.left} />
      <polygon points={pts(ring(cx, cy, z + h, r))} fill={m.top} />
    </g>
  );
};

const mtx = (a: number, b: number, c: number, d: number, X: number, Y: number) => `matrix(${a} ${b} ${c} ${d} ${f(X)} ${f(Y)})`;
/** Aufkleber-Koordinaten (96 Einheiten = 1 Kachel): Boden. u entlang gx, v entlang gy. */
export const floorM = (x: number, y: number, z = 0) => {
  const p = P(x, y, z);
  return mtx(0.5, 0.25, -0.5, 0.25, p.X, p.Y);
};
/** Wand gy = y (rechte Rückwand). Ursprung = linke OBERE Ecke; u nach rechts (entlang gx), v nach unten (SVG-üblich). */
export const wallRM = (x: number, y: number, zTop = 0) => {
  const p = P(x, y, zTop);
  return mtx(0.5, 0.25, 0, ZH / 96, p.X, p.Y);
};
/** Wand gx = x (linke Rückwand). Ursprung = linke OBERE Ecke (= Ende mit größerem gy); u nach rechts (entlang −gy). */
export const wallLM = (x: number, yHigh: number, zTop = 0) => {
  const p = P(x, yHigh, zTop);
  return mtx(0.5, -0.25, 0, ZH / 96, p.X, p.Y);
};

export const shadowEllipse = (k: React.Key, x: number, y: number, rx: number, ry: number, op = 0.35) => {
  const p = P(x, y, 0);
  return <ellipse key={k} cx={p.X} cy={p.Y} rx={rx} ry={ry} fill={`rgba(3,6,20,${op})`} />;
};

export {darken, lighten};
