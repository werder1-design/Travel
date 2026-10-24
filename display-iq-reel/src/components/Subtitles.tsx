import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAPTIONS} from '../data/captions';
import {FONT, FPS, HEIGHT, SUBTITLE_BOTTOM} from '../theme';
import {OUT, clamp01} from '../ease';

const TONE = {cyan: '#8fe6ff', amber: '#ffc247'};

/** Untertitel: weiße Sans-Schrift, Schlüsselwörter in goldener Serifen-Kursiv (Stil des Referenzvideos). */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunk = CAPTIONS.find((c) => t >= c.start && t <= c.end);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1230, height: 500, background: 'linear-gradient(180deg,rgba(4,8,28,0) 0%,rgba(4,8,28,.8) 38%,rgba(4,8,28,.9) 100%)', pointerEvents: 'none'}} />
      {chunk && <Chunk chunk={chunk} t={t} />}
    </>
  );
};

const Chunk: React.FC<{chunk: (typeof CAPTIONS)[number]; t: number}> = ({chunk, t}) => {
  const inP = OUT(clamp01((t - chunk.start) / 0.18));
  const outP = clamp01((chunk.end - t) / 0.1);
  const opacity = Math.min(inP, outP);
  return (
    <div style={{position: 'absolute', left: 56, bottom: HEIGHT - SUBTITLE_BOTTOM, maxWidth: 880, fontFamily: FONT, opacity, transform: `translateY(${(1 - inP) * 24}px)`, pointerEvents: 'none'}}>
      {chunk.words.map((w, i) => {
        const spoken = t >= w.start;
        const active = t >= w.start && t < w.end + 0.04;
        const key = !!w.tone;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', marginRight: key ? 14 : 14, lineHeight: 1.12,
              fontFamily: key ? '"Playfair Display", serif' : FONT,
              fontStyle: key ? 'italic' : 'normal',
              fontWeight: key ? 700 : 800,
              fontSize: key ? 70 : 62,
              letterSpacing: key ? 0 : -1,
              color: key ? TONE[w.tone!] : '#fff',
              opacity: spoken ? 1 : 0.42,
              transform: `scale(${active ? 1.04 : 1})`,
              textShadow: '0 4px 18px rgba(0,0,0,.65), 0 1px 3px rgba(0,0,0,.6)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
