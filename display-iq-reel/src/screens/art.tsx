import React from 'react';

export const CarArt: React.FC<{width?: number; wheel?: number}> = ({width = 520, wheel = 0}) => (
  <svg viewBox="0 0 520 240" width={width} height={width * (240 / 520)} style={{overflow: 'visible'}}>
    <ellipse cx="260" cy="214" rx="230" ry="16" fill="rgba(0,0,0,.28)" />
    <path d="M30 170Q30 128 70 120L130 112Q168 56 236 52H318Q372 56 404 108L452 120Q490 128 490 164V184H30Z" fill="#E11D2E" />
    <path d="M30 170Q30 128 70 120L130 112Q168 56 236 52H318Q372 56 404 108L452 120Q490 128 490 164V184H30Z" fill="url(#car-sh)" />
    <defs>
      <linearGradient id="car-sh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,.28)" />
        <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
        <stop offset="1" stopColor="rgba(0,0,0,.25)" />
      </linearGradient>
    </defs>
    <path d="M160 108Q188 68 238 64H262V108Z" fill="#CFE9FF" />
    <path d="M276 64H318Q356 70 380 108H276Z" fill="#CFE9FF" />
    <path d="M160 108Q188 68 238 64H262V108Z" fill="rgba(255,255,255,.35)" />
    <rect x="262" y="64" width="14" height="46" fill="#B3121F" />
    <rect x="30" y="170" width="460" height="14" rx="7" fill="#1a1a1a" opacity=".5" />
    <circle cx="452" cy="146" r="12" fill="#FFF3B0" />
    <rect x="34" y="138" width="22" height="12" rx="6" fill="#FFB3B8" />
    {[130, 390].map((cx) => (
      <g key={cx} transform={`translate(${cx} 186)`}>
        <circle r="50" fill="#14161f" />
        <circle r="30" fill="#c8cde0" />
        <g transform={`rotate(${wheel})`}>
          {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0L0 -28" stroke="#6b7390" strokeWidth="7" strokeLinecap="round" transform={`rotate(${a})`} />)}
        </g>
        <circle r="8" fill="#14161f" />
      </g>
    ))}
  </svg>
);

export const BowlingArt: React.FC<{width?: number; sway?: number}> = ({width = 420, sway = 0}) => (
  <svg viewBox="0 0 420 420" width={width} height={width} style={{overflow: 'visible'}}>
    <defs>
      <radialGradient id="bw-ball" cx="0.32" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#7FE6FF" />
        <stop offset="0.45" stopColor="#2563EB" />
        <stop offset="1" stopColor="#0A1450" />
      </radialGradient>
    </defs>
    {[[250, 150, -6], [330, 130, 8], [290, 70, 0]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r + sway})`}>
        <path d="M-22 -60Q-30 -20 -34 20Q-40 70 -26 100H26Q40 70 34 20Q30 -20 22 -60Q30 -80 0 -92Q-30 -80 -22 -60Z" transform="translate(0 40) scale(1 .9)" fill="#fff" />
        <path d="M-26 -22H26" stroke="#FF3D9A" strokeWidth="9" transform="translate(0 40) scale(1 .9)" />
        <path d="M-27 4H27" stroke="#FF3D9A" strokeWidth="9" transform="translate(0 40) scale(1 .9)" />
      </g>
    ))}
    <g transform={`translate(130 270) rotate(${sway * 3})`}>
      <circle r="110" fill="url(#bw-ball)" />
      <circle cx="-22" cy="-30" r="12" fill="#050B33" />
      <circle cx="10" cy="-44" r="12" fill="#050B33" />
      <circle cx="-4" cy="-6" r="12" fill="#050B33" />
      <ellipse cx="-44" cy="-52" rx="30" ry="16" fill="rgba(255,255,255,.4)" transform="rotate(-35 -44 -52)" />
    </g>
  </svg>
);
