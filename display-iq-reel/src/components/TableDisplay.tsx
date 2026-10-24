import React from 'react';
import {C} from '../theme';
import {SH, SW} from '../screens/common';

export const BEZEL = 32;
export const HW = {w: SW + BEZEL * 2, h: SH + BEZEL * 2};

/**
 * Tischdisplay-Hardware (1264×864 Design-Einheiten). Die Oberfläche (1200×800) liegt in children,
 * overlay (Touch-Hand, Ripples) liegt ungeclippt darüber. Wird im Weltraum per Plane platziert.
 */
export const TableDisplay: React.FC<{
  children: React.ReactNode;
  overlay?: React.ReactNode;
  glow?: number;
  extrude?: number;
  accent?: string;
}> = ({children, overlay, glow = 1, extrude = 0, accent = C.cyan}) => {
  const layers = Array.from({length: extrude}, (_, i) => i + 1);
  return (
    <div style={{position: 'relative', width: HW.w, height: HW.h, transformStyle: extrude ? 'preserve-3d' : 'flat'}}>
      {glow > 0 && (
        <div style={{position: 'absolute', left: 30, top: 30, right: 30, bottom: 30, borderRadius: 60, boxShadow: `0 0 ${150}px ${50}px ${accent}`, opacity: 0.32 * glow}} />
      )}
      {layers.map((i) => (
        <div key={i} style={{position: 'absolute', inset: 0, borderRadius: 46, background: i === extrude ? '#05060f' : '#0d1022', transform: `translateZ(${-i * 2}px)`}} />
      ))}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 46,
          background: 'linear-gradient(145deg,#343c63 0%,#171c3a 40%,#0a0d20 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12), inset 0 2px 0 rgba(255,255,255,.18)',
        }}
      >
        <div style={{position: 'absolute', left: HW.w / 2 - 6, top: 11, width: 12, height: 12, borderRadius: 6, background: '#050612', boxShadow: 'inset 0 0 0 2px #1d2347'}} />
        <div style={{position: 'absolute', left: BEZEL, top: BEZEL, width: SW, height: SH, borderRadius: 16, overflow: 'hidden', background: '#05071a', boxShadow: `0 0 0 3px #04050f, 0 0 50px ${accent}33`}}>
          {children}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.03) 28%,rgba(255,255,255,0) 40%)', pointerEvents: 'none'}} />
        </div>
        <div style={{position: 'absolute', left: HW.w / 2 - 70, bottom: 10, width: 140, height: 6, borderRadius: 3, background: accent, opacity: 0.85, boxShadow: `0 0 16px ${accent}`}} />
      </div>
      {overlay && <div style={{position: 'absolute', left: BEZEL, top: BEZEL, width: SW, height: SH, transform: extrude ? 'translateZ(2px)' : undefined}}>{overlay}</div>}
    </div>
  );
};
