import React from 'react';
import {FPS} from '../theme';
import {IN_OUT, OUT, clamp01, lerp} from '../ease';
import {press} from '../screens/common';

export type TapPoint = {x: number; y: number; at: number};
const LEAD = 0.55;

/** Berechnet Position/Sichtbarkeit der Hand aus einer Tap-Liste (Screen-Koordinaten). */
export const handPose = (taps: TapPoint[], sec: number) => {
  if (!taps.length || sec < taps[0].at - LEAD) return null;
  const last = taps[taps.length - 1];
  if (sec > last.at + 0.9) return null;
  let i = 0;
  taps.forEach((t, k) => {
    if (sec >= t.at - LEAD) i = k;
  });
  const to = taps[i];
  const from = i > 0 ? taps[i - 1] : {x: to.x + 300, y: to.y + 520, at: 0};
  const startAt = Math.max(to.at - LEAD, i > 0 ? from.at + 0.12 : to.at - LEAD);
  const p = clamp01((sec - startAt) / (to.at - startAt));
  const e = IN_OUT(p);
  let x = lerp(from.x, to.x, e);
  let y = lerp(from.y, to.y, e);
  let opacity = i === 0 ? clamp01((sec - (to.at - LEAD)) / 0.25) : 1;
  if (sec > last.at + 0.25) {
    const q = OUT(clamp01((sec - last.at - 0.25) / 0.65));
    x = lerp(last.x, last.x + 260, q);
    y = lerp(last.y, last.y + 480, q);
    opacity = 1 - q;
  }
  const pr = Math.max(...taps.map((t) => press(sec, t.at)));
  return {x, y, opacity, pr};
};

/** Zeigefinger, Fingerspitze liegt im Ursprung. */
export const Hand: React.FC = () => (
  <svg width="300" height="520" viewBox="-70 -30 300 520" style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id="hd-skin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#F4CDAE" />
        <stop offset="1" stopColor="#DDA982" />
      </linearGradient>
    </defs>
    <ellipse cx="46" cy="500" rx="120" ry="16" fill="rgba(0,0,0,.0)" />
    {/* Handrücken */}
    <path d="M-30 150C-52 190 -52 250 -30 300C-14 336 4 346 28 346L116 346C132 300 146 250 136 196C128 160 106 142 80 138L18 138Z" fill="url(#hd-skin)" />
    {/* eingerollte Finger */}
    {[[62, 176], [92, 184], [118, 200]].map(([x, y], i) => (
      <rect key={i} x={x - 24} y={y - 20} width="48" height={92 - i * 8} rx="24" fill="url(#hd-skin)" stroke="rgba(150,90,60,.35)" strokeWidth="2.5" />
    ))}
    {/* Zeigefinger */}
    <rect x="-24" y="-18" width="50" height="190" rx="25" fill="url(#hd-skin)" />
    <path d="M-24 40V150" stroke="rgba(150,90,60,.18)" strokeWidth="3" />
    <ellipse cx="2" cy="10" rx="15" ry="20" fill="rgba(255,255,255,.4)" />
    {/* Daumen */}
    <path d="M-30 200C-62 196 -76 222 -60 248C-48 268 -26 272 -8 262Z" fill="url(#hd-skin)" stroke="rgba(150,90,60,.3)" strokeWidth="2.5" />
  </svg>
);

export const TouchLayer: React.FC<{taps: TapPoint[]; sec: number}> = ({taps, sec}) => {
  const pose = handPose(taps, sec);
  if (!pose) return null;
  const scale = 1 - pose.pr * 0.07;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none', opacity: pose.opacity}}>
      <div style={{position: 'absolute', left: pose.x - 70 - 6, top: pose.y - 30 + 14, width: 300, height: 520, transform: `scale(${scale})`, transformOrigin: '70px 30px', opacity: 0.35, filter: 'blur(14px)'}}>
        <svg width="300" height="520" viewBox="-70 -30 300 520"><path d="M-30 150C-52 190 -52 250 -30 300L116 346C132 300 146 250 136 196Z" fill="#000" /><rect x="-24" y="-18" width="50" height="190" rx="25" fill="#000" /></svg>
      </div>
      <div style={{position: 'absolute', left: pose.x - 70, top: pose.y - 30 - pose.pr * -6, width: 300, height: 520, transform: `scale(${scale}) rotate(-8deg)`, transformOrigin: '70px 30px', WebkitMaskImage: 'linear-gradient(to bottom,#000 0,#000 62%,transparent 80%)', maskImage: 'linear-gradient(to bottom,#000 0,#000 62%,transparent 80%)'}}>
        <Hand />
      </div>
    </div>
  );
};
