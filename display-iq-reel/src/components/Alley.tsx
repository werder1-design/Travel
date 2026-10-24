import React from 'react';
import {Cam, polyPath, project, V3} from '../camera';
import {C, HEIGHT, WIDTH} from '../theme';
import {clamp01, lerp, rand} from '../ease';

export const LANE_X = [-840, -280, 280, 840];
export const LANE_HALF = 235;
export const PIN_Z = -5200;
const NEON = [C.cyan, C.magenta, C.violet];

export type BallShot = {lane: number; from: number; start: number; hit: number};

type Props = {
  cam: Cam;
  sec: number;
  floorY?: number;
  ball?: BallShot;
  tables?: boolean;
  glow?: number;
  ceilY?: number;
};

const PIN =
  'M0 -300C-22 -300 -30 -274 -24 -246C-18 -222 -30 -196 -38 -150C-48 -96 -42 -40 -34 -10Q-30 0 -20 0H20Q30 0 34 -10C42 -40 48 -96 38 -150C30 -196 18 -222 24 -246C30 -274 22 -300 0 -300Z';

/** Perspektivisch projizierte Neon-Bowlinghalle (reines SVG, kein CSS-3D → schnell & randscharf). */
export const Alley: React.FC<Props> = ({cam, sec, floorY = 360, ball, tables = true, glow = 1, ceilY: ceilProp}) => {
  const fy = floorY;
  const zMin = cam.z - 7600;
  const zMax = cam.z + 1100;
  const flat = (x0: number, x1: number, z0: number, z1: number, y: number) =>
    polyPath([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], cam);
  const wall = (x: number, y0: number, y1: number, z0: number, z1: number) =>
    polyPath([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]], cam);
  const plane = (z: number, x0: number, x1: number, y0: number, y1: number) =>
    polyPath([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], cam);

  const els: React.ReactNode[] = [];
  let key = 0;
  const push = (d: string, fill: string, extra: React.SVGProps<SVGPathElement> = {}) => {
    if (d) els.push(<path key={key++} d={d} fill={fill} {...extra} />);
  };

  // Rückwand mit Neon-Rahmen
  const wallZ = PIN_Z - 1100;
  push(plane(wallZ, -3200, 3200, -1400, fy), 'url(#al-wall)');
  [-1, 1, 0].forEach((k, i) => {
    const x = k * 1150;
    push(plane(wallZ + 5, x - 380, x + 380, fy - 880, fy - 760), NEON[i], {opacity: 0.9});
    push(plane(wallZ + 5, x - 520, x + 520, fy - 1000, fy - 640), NEON[i], {opacity: 0.12 * glow});
  });

  // Seitenwände + Neonbänder
  [-1, 1].forEach((side) => {
    const x = side * 2300;
    push(wall(x, -1400, fy, zMin, zMax), 'url(#al-side)');
    [fy - 700, fy - 380, fy - 120].forEach((y, i) => {
      push(wall(x - side * 4, y - 10, y + 10, zMin, zMax), NEON[(i + (side > 0 ? 1 : 0)) % 3], {opacity: 0.95});
      push(wall(x - side * 4, y - 70, y + 70, zMin, zMax), NEON[(i + (side > 0 ? 1 : 0)) % 3], {opacity: 0.10 * glow});
    });
  });

  // Decke + Lichtbalken (laufen beim Flug über die Kamera hinweg)
  const ceilY = ceilProp ?? -620;
  push(flat(-2300, 2300, zMin, zMax, ceilY), '#070a22');
  const k0 = Math.floor(zMin / 700);
  const k1 = Math.ceil(zMax / 700);
  for (let k = k0; k <= k1; k++) {
    const z = k * 700;
    const col = NEON[((k % 3) + 3) % 3];
    push(flat(-1900, 1900, z - 30, z + 30, ceilY + 2), col, {opacity: 0.98});
    push(flat(-1900, 1900, z - 150, z + 150, ceilY + 2), col, {opacity: 0.16 * glow});
  }
  [-700, 700].forEach((x, i) => {
    push(flat(x - 14, x + 14, zMin, zMax, ceilY + 2), NEON[i + 1], {opacity: 0.9});
    push(flat(x - 90, x + 90, zMin, zMax, ceilY + 2), NEON[i + 1], {opacity: 0.12 * glow});
  });

  // Boden + Bahnen
  push(flat(-2300, 2300, zMin, zMax, fy), 'url(#al-floor)');
  LANE_X.forEach((lx, li) => {
    const x0 = lx - LANE_HALF;
    const x1 = lx + LANE_HALF;
    push(flat(lx - LANE_HALF - 44, lx + LANE_HALF + 44, zMin, zMax, fy), '#04061a');
    push(flat(x0, x1, zMin, zMax, fy), 'url(#al-lane)');
    // Längsplanken
    [-188, -94, 0, 94, 188].forEach((o) => push(flat(lx + o - 1.5, lx + o + 1.5, zMin, PIN_Z + 400, fy - 1), 'rgba(160,190,255,.10)'));
    // Quermarken (Bewegungs-Cue)
    for (let z = Math.ceil(zMin / 260) * 260; z < zMax; z += 260) {
      push(flat(x0, x1, z - 2, z + 2, fy - 1), 'rgba(160,190,255,.07)');
    }
    // Neonkanten
    push(flat(x0 - 7, x0 + 3, zMin, zMax, fy - 2), C.cyan, {opacity: 0.95});
    push(flat(x1 - 3, x1 + 7, zMin, zMax, fy - 2), C.magenta, {opacity: 0.95});
    push(flat(x0 - 40, x0 + 20, zMin, zMax, fy - 2), C.cyan, {opacity: 0.10 * glow});
    push(flat(x1 - 20, x1 + 40, zMin, zMax, fy - 2), C.magenta, {opacity: 0.10 * glow});
    // Foullinie, Pfeile, Punkte
    push(flat(x0, x1, -420, -396, fy - 2), '#fff', {opacity: 0.85});
    for (let a = -3; a <= 3; a++) {
      const ax = lx + a * 54;
      const az = -1300 - (3 - Math.abs(a)) * 140;
      push(polyPath([[ax, fy - 2, az - 70], [ax - 22, fy - 2, az + 40], [ax + 22, fy - 2, az + 40]], cam), C.cyan, {opacity: 0.7});
    }
    // Pindeck-Glow
    push(flat(x0, x1, PIN_Z - 420, PIN_Z + 120, fy - 3), li === 2 ? C.magenta : C.violet, {opacity: 0.16 * glow});
  });

  // Tische mit leuchtenden Displays entlang der Bahnen
  if (tables) {
    const side = [-1, 1];
    for (let k = 7; k >= -3; k--) {
      const z = -520 - k * 900;
      if (z < zMin || z > zMax) continue;
      side.forEach((sd, si) => {
        const x = sd * 1560;
        const col = (k + si) % 2 === 0 ? C.cyan : C.magenta;
        const col2 = (k + si) % 2 === 0 ? C.violet : C.amber;
        const ty = fy - 150;
        push(flat(x - 380, x + 380, z - 330, z + 330, fy - 1), col, {opacity: 0.10 * glow});
        push(polyPath([[x - 34, ty, z], [x + 34, ty, z], [x + 34, fy, z], [x - 34, fy, z]], cam), '#0b0f2e');
        push(flat(x - 200, x + 200, z - 160, z + 160, ty), '#171d4d');
        push(flat(x - 200, x + 200, z - 160, z + 160, ty - 1), 'none', {stroke: col, strokeWidth: 3, opacity: 0.8});
        push(flat(x - 130, x + 130, z - 84, z + 84, ty - 2), col2);
        push(flat(x - 100, x + 100, z - 58, z + 58, ty - 3), col, {opacity: 0.85});
        push(flat(x - 300, x + 300, z - 230, z + 230, ty - 4), col, {opacity: 0.12 * glow});
        // Silhouetten der Gäste
        [-1, 1].forEach((o) => {
          const px = x + o * 120;
          const pz = z - sd * 0 + 250;
          const head = project([px, fy - 430, pz], cam);
          const body = polyPath([[px - 62, fy - 340, pz], [px + 62, fy - 340, pz], [px + 76, fy - 150, pz], [px - 76, fy - 150, pz]], cam);
          push(body, '#0a0e2b', {stroke: col, strokeWidth: 2, opacity: 0.95});
          if (head) els.push(<circle key={key++} cx={head.x} cy={head.y} r={46 * head.s} fill="#0a0e2b" stroke={col} strokeWidth={2} />);
        });
      });
    }
  }

  // Pins (alle Bahnen) + Strike-Animation auf Zielbahn
  const pinsEls: {z: number; node: React.ReactNode}[] = [];
  LANE_X.forEach((lx, li) => {
    let n = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c <= r; c++) {
        n++;
        const bx = lx + (c - r / 2) * 112;
        const bz = PIN_Z - r * 98;
        let ox = 0, oz = 0, oy = 0, rot = 0;
        if (ball && ball.lane === li) {
          const p = Math.max(0, sec - ball.hit - r * 0.012);
          if (p > 0) {
            const rn = rand(n * 3.1 + li);
            const rn2 = rand(n * 7.7 + 1);
            const dir = (c - r / 2) * 0.9 + (rn - 0.5) * 1.6;
            ox = dir * 520 * p;
            oz = -rn2 * 900 * p;
            oy = -Math.max(0, 640 * p * rn2 * 1.6 - 1500 * p * p) ;
            rot = dir * 260 * Math.min(p, 0.55) * (rn > 0.5 ? 1 : -1);
          }
        }
        const pr = project([bx + ox, fy, bz + oz], cam);
        if (!pr) continue;
        const lift = oy * pr.s;
        pinsEls.push({
          z: bz + oz,
          node: (
            <g key={`p${li}-${n}`} transform={`translate(${pr.x} ${pr.y + lift}) rotate(${rot}) scale(${pr.s})`}>
              <ellipse cx="0" cy="4" rx="38" ry="10" fill="rgba(0,0,0,.35)" transform={`translate(0 ${-lift / pr.s})`} />
              <path d={PIN} fill="url(#al-pin)" />
              <path d="M-23 -240H23V-226H-23Z M-27 -214H27V-198H-27Z" fill={C.red} />
            </g>
          ),
        });
      }
    }
  });
  pinsEls.sort((a, b) => a.z - b.z).forEach((p) => els.push(p.node));

  // Kugel
  if (ball) {
    const p = clamp01((sec - ball.start) / (ball.hit - ball.start));
    if (sec >= ball.start && sec < ball.hit + 0.25) {
      const lx = LANE_X[ball.lane];
      const bz = lerp(ball.from, PIN_Z, p);
      const bx = lx + Math.sin(p * Math.PI) * 46 - 40 * (1 - p);
      const pr = project([bx, fy - 78, bz], cam);
      if (pr) {
        const r = 78 * pr.s;
        const spin = (bz / 78) * 57.3;
        els.push(
          <g key="ball" transform={`translate(${pr.x} ${pr.y})`} opacity={sec > ball.hit ? 1 - (sec - ball.hit) / 0.25 : 1}>
            <ellipse cx="0" cy={r * 0.95} rx={r * 1.1} ry={r * 0.3} fill="rgba(0,0,0,.45)" />
            <circle r={r * 1.55} fill="url(#al-ballglow)" />
            <circle r={r} fill="url(#al-ball)" />
            <g transform={`rotate(${spin * 0.3})`}>
              {[[-0.32, -0.38], [0.04, -0.54], [-0.1, -0.12]].map(([hx, hy], i) => (
                <circle key={i} cx={hx * r} cy={hy * r} r={r * 0.13} fill="#030823" />
              ))}
            </g>
            <ellipse cx={-r * 0.38} cy={-r * 0.46} rx={r * 0.3} ry={r * 0.16} fill="rgba(255,255,255,.45)" transform={`rotate(-35 ${-r * 0.38} ${-r * 0.46})`} />
          </g>,
        );
      }
    }
  }

  const horizon = project([0, fy, zMin], cam)?.y ?? HEIGHT / 2;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="al-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0d2e" />
          <stop offset="1" stopColor="#2a1170" />
        </linearGradient>
        <linearGradient id="al-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060820" />
          <stop offset="1" stopColor="#14144a" />
        </linearGradient>
        <linearGradient id="al-floor" gradientUnits="userSpaceOnUse" x1="0" y1={horizon} x2="0" y2={HEIGHT}>
          <stop offset="0" stopColor="#0d0f3a" />
          <stop offset="1" stopColor="#050720" />
        </linearGradient>
        <linearGradient id="al-lane" gradientUnits="userSpaceOnUse" x1="0" y1={horizon} x2="0" y2={HEIGHT}>
          <stop offset="0" stopColor="#3a2f95" />
          <stop offset="0.5" stopColor="#2a2c86" />
          <stop offset="1" stopColor="#1c2467" />
        </linearGradient>
        <linearGradient id="al-pin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B9BEE6" />
          <stop offset="0.45" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#8F96C9" />
        </linearGradient>
        <radialGradient id="al-ball" cx="0.32" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#8DEBFF" />
          <stop offset="0.45" stopColor="#2F6BFF" />
          <stop offset="1" stopColor="#0A1450" />
        </radialGradient>
        <radialGradient id="al-ballglow">
          <stop offset="0" stopColor="rgba(80,170,255,.45)" />
          <stop offset="1" stopColor="rgba(80,170,255,0)" />
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#05071a" />
      {els}
    </svg>
  );
};
