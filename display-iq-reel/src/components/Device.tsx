import React from 'react';
import {C, FONT, FPS} from '../theme';
import {IN_OUT, OUT, clamp01, prog} from '../ease';
import {SH, SW} from '../screens/common';

/** Hochkant-Tischdisplay nach Produktfoto: schwarzes Gehäuse, 8"-Screen, Lautsprecher-Kinn, dicke Rückseite. */
export const DEV = {w: 640, h: 1100, bz: 30};

export const Device: React.FC<{
  children: React.ReactNode;
  overlay?: React.ReactNode;
  extrude?: number;
  glow?: number;
  accent?: string;
}> = ({children, overlay, extrude = 12, glow = 0, accent = C.cyan}) => {
  const layers = Array.from({length: extrude}, (_, i) => i + 1);
  return (
    <div style={{position: 'relative', width: DEV.w, height: DEV.h, transformStyle: 'preserve-3d'}}>
      {glow > 0 && <div style={{position: 'absolute', left: 40, top: 60, right: 40, bottom: 60, borderRadius: 90, boxShadow: `0 0 200px 60px ${accent}`, opacity: 0.35 * glow, transform: `translateZ(${-extrude * 5 - 8}px)`}} />}
      {layers.map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: i * 1.2, right: i * 1.2, top: i * 24, bottom: 0, borderRadius: '54px 54px 40px 40px',
            background: i === extrude ? '#04050c' : `rgb(${14 - i * 0.6},${15 - i * 0.6},${28 - i})`,
            transform: `translateZ(${-i * 5}px)`,
          }}
        />
      ))}
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: 'linear-gradient(150deg,#3a3f5c 0%,#1a1d33 35%,#0b0c18 100%)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12), inset 0 3px 0 rgba(255,255,255,.2)'}}>
        <div style={{position: 'absolute', left: DEV.w / 2 - 7, top: 11, width: 14, height: 14, borderRadius: 7, background: '#04050c', boxShadow: 'inset 0 0 0 3px #1c2142'}} />
        <div style={{position: 'absolute', left: DEV.bz, top: DEV.bz, width: SW, height: SH, borderRadius: 22, overflow: 'hidden', background: '#05071a', boxShadow: `0 0 0 4px #04050f, 0 0 60px ${accent}33`}}>
          {children}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,.04) 24%,rgba(255,255,255,0) 38%)', pointerEvents: 'none'}} />
        </div>
        {/* Kinn: Marke + Lautsprecher */}
        <div style={{position: 'absolute', left: 40, bottom: 38, fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: '#59618a'}}>DISPLAY <span style={{color: '#2c8fb0'}}>IQ</span></div>
        <div style={{position: 'absolute', right: 40, bottom: 26, width: 150, height: 56, display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gridTemplateRows: 'repeat(4,1fr)', gap: 4}}>
          {Array.from({length: 40}).map((_, i) => <div key={i} style={{borderRadius: 4, background: '#050610'}} />)}
        </div>
        <div style={{position: 'absolute', left: DEV.w / 2 - 38, bottom: 14, width: 76, height: 6, borderRadius: 3, background: accent, boxShadow: `0 0 14px ${accent}`, opacity: 0.9}} />
      </div>
      {overlay && <div style={{position: 'absolute', left: DEV.bz, top: DEV.bz, width: SW, height: SH, transform: 'translateZ(3px)', pointerEvents: 'none'}}>{overlay}</div>}
    </div>
  );
};

/** Das Display "springt" aus der Miniatur auf dem Tisch heraus (Popup wie im Referenzvideo). */
export const DevicePopup: React.FC<{
  frame: number;
  inAt: number;
  outAt: number;
  origin: {x: number; y: number};
  left?: number;
  top?: number;
  scale?: number;
  children: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({frame, inAt, outAt, origin, left = 20, top = 604, scale = 0.72, children, overlay}) => {
  const t = frame / FPS;
  if (t < inAt || t > outAt + 0.5) return null;
  const pIn = prog(frame, inAt, 0.65, OUT);
  const pOut = prog(frame, outAt, 0.42, IN_OUT);
  const k = pIn * (1 - pOut);
  const w = DEV.w * scale;
  const h = DEV.h * scale;
  const cx = left + w / 2;
  const cy = top + h / 2;
  const s0 = 0.05;
  const s = s0 + (1 - s0) * k;
  const yaw = 9 - (1 - pIn) * 40 + Math.sin(t * 0.8) * 1.5;
  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, transform: `translate(${(origin.x - cx) * (1 - k)}px, ${(origin.y - cy) * (1 - k)}px) scale(${s})`, opacity: clamp01(k * 4), perspective: 2200}}>
      <div style={{width: DEV.w, height: DEV.h, transformOrigin: '0 0', transform: `scale(${scale})`, transformStyle: 'preserve-3d'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${yaw}deg) rotateX(2deg)`}}>
          <div style={{position: 'absolute', left: 30, top: 70, right: 30, bottom: -10, borderRadius: 60, boxShadow: '0 50px 90px rgba(0,0,0,.55)', transform: 'translateZ(-72px)'}} />
          <Device overlay={overlay} extrude={12} glow={0.6}>{children}</Device>
        </div>
      </div>
    </div>
  );
};

/** Frei schwebende 2D-Karte (Smartphone, Dashboard, Grafik), die aus einem Ursprungspunkt aufspringt. */
export const FloatCard: React.FC<{
  frame: number;
  inAt: number;
  outAt: number;
  origin: {x: number; y: number};
  left: number;
  top: number;
  width: number;
  height: number;
  scale?: number;
  children: React.ReactNode;
}> = ({frame, inAt, outAt, origin, left, top, width, height, scale = 1, children}) => {
  const t = frame / FPS;
  if (t < inAt || t > outAt + 0.5) return null;
  const pIn = prog(frame, inAt, 0.6, OUT);
  const pOut = prog(frame, outAt, 0.4, IN_OUT);
  const k = pIn * (1 - pOut);
  const w = width * scale;
  const h = height * scale;
  const cx = left + w / 2;
  const cy = top + h / 2;
  const s = 0.05 + 0.95 * k;
  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, transform: `translate(${(origin.x - cx) * (1 - k)}px, ${(origin.y - cy) * (1 - k)}px) scale(${s})`, opacity: clamp01(k * 4)}}>
      <div style={{width, height, transformOrigin: '0 0', transform: `scale(${scale})`}}>{children}</div>
    </div>
  );
};
