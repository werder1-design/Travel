import {HEIGHT, WIDTH} from './theme';

/**
 * Gemeinsames Kameramodell für SVG-Projektion (Boden, Bahn, Pins) und CSS-3D (Displays).
 * Koordinaten wie in CSS: x rechts, y nach unten, z zum Betrachter.
 * pitch > 0 = Kamera blickt nach unten. P = CSS-perspective (Augabstand zur Bildebene).
 */
export type Cam = {x: number; y: number; z: number; pitch: number; yaw: number; roll: number; P: number; zoom: number};

export const cam = (o: Partial<Cam> = {}): Cam => ({
  x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0, P: 1100, zoom: 1, ...o,
});

export const mixCam = (a: Cam, b: Cam, t: number): Cam => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
  pitch: a.pitch + (b.pitch - a.pitch) * t,
  yaw: a.yaw + (b.yaw - a.yaw) * t,
  roll: a.roll + (b.roll - a.roll) * t,
  P: a.P + (b.P - a.P) * t,
  zoom: a.zoom + (b.zoom - a.zoom) * t,
});

const rad = (d: number) => (d * Math.PI) / 180;
export type V3 = readonly [number, number, number];

/** Weltpunkt → Kameraraum (entspricht rotateZ(roll) rotateX(-pitch) rotateY(yaw) translate3d(-cam)). */
export function toCamSpace(p: V3, c: Cam): V3 {
  let x = p[0] - c.x;
  let y = p[1] - c.y;
  let z = p[2] - c.z;
  let a = rad(c.yaw);
  let ca = Math.cos(a);
  let sa = Math.sin(a);
  let x1 = x * ca + z * sa;
  let z1 = -x * sa + z * ca;
  x = x1;
  z = z1;
  a = rad(-c.pitch);
  ca = Math.cos(a);
  sa = Math.sin(a);
  let y1 = y * ca - z * sa;
  z1 = y * sa + z * ca;
  y = y1;
  z = z1;
  a = rad(c.roll);
  ca = Math.cos(a);
  sa = Math.sin(a);
  x1 = x * ca - y * sa;
  y1 = x * sa + y * ca;
  return [x1 * c.zoom, y1 * c.zoom, z * c.zoom];
}

const NEAR = 40;

const toScreen = (v: V3, c: Cam) => {
  const d = c.P - v[2];
  const s = c.P / d;
  return {x: WIDTH / 2 + v[0] * s, y: HEIGHT / 2 + v[1] * s, s, d};
};

export function project(p: V3, c: Cam) {
  const v = toCamSpace(p, c);
  if (c.P - v[2] < NEAR) return null;
  return toScreen(v, c);
}

/** Clippt ein Polygon (Weltkoordinaten) an der Near-Plane und liefert einen SVG-Pfad. */
export function polyPath(points: V3[], c: Cam, close = true): string {
  const cs = points.map((p) => toCamSpace(p, c));
  const out: V3[] = [];
  for (let i = 0; i < cs.length; i++) {
    const a = cs[i];
    const b = cs[(i + 1) % cs.length];
    const ia = c.P - a[2] >= NEAR;
    const ib = c.P - b[2] >= NEAR;
    if (ia) out.push(a);
    if (ia !== ib) {
      const t = (c.P - NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
  }
  if (out.length < 3) return '';
  return (
    out
      .map((v, i) => {
        const s = toScreen(v, c);
        return `${i ? 'L' : 'M'}${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
      })
      .join('') + (close ? 'Z' : '')
  );
}

/** Liniensegment (Weltkoordinaten) → SVG-Pfad (an Near-Plane geclippt). */
export function linePath(a: V3, b: V3, c: Cam): string {
  let va = toCamSpace(a, c);
  let vb = toCamSpace(b, c);
  const ia = c.P - va[2] >= NEAR;
  const ib = c.P - vb[2] >= NEAR;
  if (!ia && !ib) return '';
  if (!ia || !ib) {
    const t = (c.P - NEAR - va[2]) / (vb[2] - va[2]);
    const m: V3 = [va[0] + (vb[0] - va[0]) * t, va[1] + (vb[1] - va[1]) * t, va[2] + (vb[2] - va[2]) * t];
    if (!ia) va = m;
    else vb = m;
  }
  const sa = toScreen(va, c);
  const sb = toScreen(vb, c);
  return `M${sa.x.toFixed(1)} ${sa.y.toFixed(1)}L${sb.x.toFixed(1)} ${sb.y.toFixed(1)}`;
}

/** CSS-Transform der Kamera für den 3D-Container (Ursprung = Bildmitte). */
export const camTransform = (c: Cam) =>
  `scale3d(${c.zoom}, ${c.zoom}, ${c.zoom}) rotateZ(${c.roll}deg) rotateX(${-c.pitch}deg) rotateY(${c.yaw}deg) translate3d(${-c.x}px, ${-c.y}px, ${-c.z}px)`;
