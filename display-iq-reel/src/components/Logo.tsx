import React from 'react';
import {C, FONT} from '../theme';

/** Display-IQ-Bildmarke: abgewinkelter Tischdisplay mit Touch-Impuls. */
export const LogoMark: React.FC<{size?: number; glow?: boolean}> = ({size = 120, glow = true}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{filter: glow ? `drop-shadow(0 0 ${size * 0.22}px rgba(45,212,255,.55))` : undefined}}>
    <defs>
      <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2DD4FF" />
        <stop offset="1" stopColor="#7C4DFF" />
      </linearGradient>
      <linearGradient id="lg-sc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0A1030" />
        <stop offset="1" stopColor="#1A2766" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="112" height="112" rx="30" fill="url(#lg-bg)" />
    <path d="M30 40H90L102 82H18Z" fill="#fff" opacity=".95" />
    <path d="M36 46H84L93 77H27Z" fill="url(#lg-sc)" />
    <path d="M36 70L52 56L64 66L78 52" fill="none" stroke="#2DD4FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="86" cy="86" r="11" fill="none" stroke="#fff" strokeWidth="3.5" opacity=".9" />
    <circle cx="86" cy="86" r="4.5" fill="#fff" />
  </svg>
);

export const Wordmark: React.FC<{size?: number}> = ({size = 64}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: size * 0.04, lineHeight: 1, color: C.ink, display: 'flex', gap: size * 0.28}}>
    <span>DISPLAY</span>
    <span style={{background: 'linear-gradient(100deg,#2DD4FF,#9B6BFF)', WebkitBackgroundClip: 'text', color: 'transparent'}}>IQ</span>
  </div>
);

export const Logo: React.FC<{size?: number}> = ({size = 64}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
    <LogoMark size={size * 1.15} />
    <Wordmark size={size} />
  </div>
);
