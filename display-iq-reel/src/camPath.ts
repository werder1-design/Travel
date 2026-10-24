import {IN_OUT, lerp} from './ease';
import {IsoCam, camOrigin} from './iso/World';
import {P} from './iso/iso';

/**
 * Kamera-Fokus: der Weltpunkt (x,y,z) soll bei Zoom `zoom` an der Bildschirmposition (sx, sy) erscheinen.
 * Liefert die passende Diorama-Kamera (gx/gy/gz = Bildmitte in Iso-Koordinaten).
 */
export const focus = (x: number, y: number, z: number, zoom: number, sx = 540, sy = 940): IsoCam => {
  const p = P(x, y, z);
  const X = p.X - (sx - 540) / zoom;
  const Y = p.Y - (sy - 940) / zoom;
  // gx − gy = X/48 ; gx + gy = (Y + gz·ZH)/24 mit gz = z
  const sum = (Y + z * 56) / 24;
  const diff = X / 48;
  return {gx: (sum + diff) / 2, gy: (sum - diff) / 2, gz: z, zoom};
};

export const keyIso = (t: number, keys: readonly (readonly [number, IsoCam])[]): IsoCam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i];
    const [t1, b] = keys[i + 1];
    if (t <= t1) {
      const e = IN_OUT((t - t0) / Math.max(1e-6, t1 - t0));
      return {gx: lerp(a.gx, b.gx, e), gy: lerp(a.gy, b.gy, e), gz: lerp(a.gz, b.gz, e), zoom: lerp(a.zoom, b.zoom, e)};
    }
  }
  return keys[keys.length - 1][1];
};

export {camOrigin};
