import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAPTIONS} from '../data/captions';
import {C, FONT, FPS, HEIGHT, SUBTITLE_BOTTOM} from '../theme';
import {OUT, clamp01} from '../ease';

const TONE = {cyan: C.cyan, amber: C.amber};

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunk = CAPTIONS.find((c) => t >= c.start && t <= c.end);
  if (!chunk) return null;
  const inP = OUT(clamp01((t - chunk.start) / 0.16));
  const outP = clamp01((chunk.end - t) / 0.1);
  const opacity = Math.min(inP, outP);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: HEIGHT - SUBTITLE_BOTTOM, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 960, padding: '18px 34px 22px', borderRadius: 40, textAlign: 'center',
          background: 'rgba(5,7,26,.62)', border: '1.5px solid rgba(255,255,255,.1)',
          fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.16, letterSpacing: -0.5,
          opacity, transform: `translateY(${(1 - inP) * 22}px) scale(${0.94 + inP * 0.06})`,
          boxShadow: '0 20px 60px rgba(0,0,0,.35)',
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.04;
          const spoken = t >= w.start;
          const base = w.tone ? TONE[w.tone] : '#fff';
          const k = clamp01((t - w.start) / 0.12);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', marginRight: i === chunk.words.length - 1 ? 0 : 17,
                color: base, opacity: spoken ? 1 : 0.5,
                transform: `scale(${active ? 1 + 0.05 * Math.sin(k * Math.PI * 0.5 + 0.0001) : 1})`,
                textShadow: active && w.tone ? `0 0 28px ${base}` : '0 3px 10px rgba(0,0,0,.4)',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
