import {Cam, mixCam} from './camera';
import {IN_OUT} from './ease';

/** Interpoliert zwischen Kamera-Keyframes [Zeit in s, Kamera] mit sanftem Ease. */
export const keyCam = (t: number, keys: readonly (readonly [number, Cam])[]): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, c0] = keys[i];
    const [t1, c1] = keys[i + 1];
    if (t <= t1) return mixCam(c0, c1, IN_OUT((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
