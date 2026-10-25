import React from 'react';
import {FPS} from '../theme';
import {OUT, SOFT, prog} from '../ease';

export type HeadLine = {text: string; gold?: boolean; size?: number; serif?: boolean};

/** Große Condensed-Headline links oben (Anton), Zeile für Zeile eingeblendet – Stil des Referenzvideos. */
export const Headline: React.FC<{frame: number; lines: HeadLine[]; at: number; until: number; y?: number; size?: number}> = ({
  frame, lines, at, until, y = 272, size = 104,
}) => {
  const t = frame / FPS;
  if (t < at - 0.05 || t > until + 0.4) return null;
  const out = prog(frame, until, 0.3, SOFT);
  return (
    <div style={{position: 'absolute', left: 52, top: y, opacity: 1 - out, transform: `translateY(${-out * 40}px)`, fontFamily: 'Anton'}}>
      {lines.map((l, i) => {
        const p = prog(frame, at + i * 0.13, 0.5, OUT);
        return (
          <div
            key={i}
            style={{
              fontSize: l.size ?? size, lineHeight: 1.0, letterSpacing: l.serif ? 0 : 1, textTransform: l.serif ? 'none' : 'uppercase', whiteSpace: 'nowrap',
              fontFamily: l.serif ? '"Playfair Display", serif' : 'Anton', fontStyle: l.serif ? 'italic' : 'normal', fontWeight: l.serif ? 700 : 400,
              color: l.gold || l.serif ? '#ffc247' : '#fff',
              opacity: p, transform: `translateX(${(1 - p) * -120}px)`,
              textShadow: '0 6px 0 rgba(8,12,40,.35), 0 10px 40px rgba(0,0,0,.55)',
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
