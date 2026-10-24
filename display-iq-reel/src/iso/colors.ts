const h2r = (h: string): [number, number, number] => {
  const s = h.replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  const A = h2r(a);
  const B = h2r(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
export const lighten = (c: string, t: number) => mix(c, '#ffffff', t);
export const darken = (c: string, t: number) => mix(c, '#050a1e', t);

/** Flächen-Schattierung: Licht von links oben. */
export type Mat = {top: string; left: string; right: string};
export const mat = (base: string): Mat => ({top: lighten(base, 0.16), left: base, right: darken(base, 0.3)});
