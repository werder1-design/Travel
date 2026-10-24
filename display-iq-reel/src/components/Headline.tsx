import React from 'react';
import {C, FONT, FPS} from '../theme';
import {OUT, SOFT, prog} from '../ease';

export type HeadLine = {text: string; tone?: 'cyan' | 'amber' | 'magenta' | 'white'};

const GRAD: Record<string, string> = {
  cyan: 'linear-gradient(95deg,#2DD4FF,#7C8BFF)',
  amber: 'linear-gradient(95deg,#FFB627,#FF7A3D)',
  magenta: 'linear-gradient(95deg,#FF3D9A,#FF8A3D)',
};

/** Große, animierte Textüberblendung im oberen Sicherheitsbereich. */
export const Headline: React.FC<{frame: number; lines: HeadLine[]; at: number; until: number; y?: number; size?: number}> = ({
  frame, lines, at, until, y = 330, size = 104,
}) => {
  const t = frame / FPS;
  if (t < at - 0.05 || t > until + 0.4) return null;
  const out = prog(frame, until, 0.3, SOFT);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 1 - out, transform: `translateY(${-out * 40}px)`, fontFamily: FONT}}>
      {lines.map((l, i) => {
        const p = prog(frame, at + i * 0.16, 0.55, OUT);
        const grad = l.tone && l.tone !== 'white' ? GRAD[l.tone] : undefined;
        return (
          <div
            key={i}
            style={{
              fontSize: size, fontWeight: 900, letterSpacing: -3, lineHeight: 1.02, textAlign: 'center', whiteSpace: 'nowrap',
              opacity: p, transform: `translateY(${(1 - p) * 70}px) scale(${0.86 + p * 0.14})`,
              ...(grad
                ? {background: grad, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.55))'}
                : {color: C.ink, textShadow: '0 8px 30px rgba(0,0,0,.65)'}),
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
