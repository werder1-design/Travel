import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, HEIGHT, WIDTH} from '../theme';
import {IN_OUT, SOFT, pop, prog} from '../ease';
import {LogoMark} from './Logo';

/** Neon-Wisch über das Bild – verdeckt den harten Schnitt (Mitte des Wischs = Schnitt). */
export const Whip: React.FC<{frame: number; cut: number; dur?: number}> = ({frame, cut, dur = 0.42}) => {
  const p = prog(frame, cut - dur / 2, dur, IN_OUT);
  if (p <= 0 || p >= 1) return null;
  const x = -700 + p * (WIDTH + 1400);
  const flash = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: x - 340, top: -300, width: 680, height: HEIGHT + 600, transform: 'rotate(14deg)', background: 'linear-gradient(90deg,transparent 0%,rgba(45,212,255,.0) 8%,rgba(45,212,255,.75) 38%,rgba(255,255,255,.98) 50%,rgba(255,61,154,.75) 62%,rgba(255,61,154,0) 92%,transparent 100%)', filter: 'blur(10px)'}} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash * 0.16}} />
    </AbsoluteFill>
  );
};

export const BrandChip: React.FC<{frame: number; at: number; until: number}> = ({frame, at, until}) => {
  const p = pop(frame, at);
  const out = prog(frame, until, 0.25, SOFT);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{position: 'absolute', right: 40, top: 280, opacity: (1 - out) * Math.min(1, p), transform: `translateY(${(1 - p) * -40}px) scale(${0.9 + p * 0.1})`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 28px 10px 12px', borderRadius: 999, background: 'rgba(5,9,30,.7)', border: '2px solid rgba(255,255,255,.18)', fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: '#fff'}}>
        <LogoMark size={54} glow={false} /> DISPLAY <span style={{color: C.cyan}}>IQ</span>
      </div>
    </div>
  );
};

export const StrikeText: React.FC<{frame: number; at: number; until: number}> = ({frame, at, until}) => {
  const p = pop(frame, at, 9, 210);
  const out = prog(frame, until, 0.2, SOFT);
  if (p <= 0 || out >= 1) return null;
  const flash = prog(frame, at, 0.12, (t) => t) * (1 - prog(frame, at + 0.12, 0.35, SOFT));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 46%,rgba(255,255,255,.7),rgba(120,200,255,.0) 60%)', opacity: flash}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: 'Anton', fontSize: 230, letterSpacing: 2, color: '#fff', transform: `rotate(-5deg) scale(${0.3 + p * 0.7})`, opacity: 1 - out, textShadow: `0 0 30px ${C.magenta}, 0 0 80px ${C.magenta}, 0 0 140px ${C.cyan}`}}>
        STRIKE!
      </div>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.4) 100%)'}} />
);
