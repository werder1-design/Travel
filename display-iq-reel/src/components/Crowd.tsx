import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FPS} from '../theme';
import {IN_OUT, OUT, pop, prog} from '../ease';
import {Bubble, SeatedPerson, SKIN, Waiter} from './People';
import {IconClock} from './Icons';

const TABLE_X = [260, 880, 1500, 2120];
const GUESTS: {skin: string; hair: string; hs: 'short' | 'long' | 'bun' | 'curly' | 'cap'; shirt: string; pose: 'idle' | 'wave'; phase: number}[][] = [
  [
    {skin: SKIN[1], hair: '#2B1E1A', hs: 'short', shirt: '#2DD4FF', pose: 'idle', phase: 0},
    {skin: SKIN[0], hair: '#8A4B2A', hs: 'long', shirt: '#FF3D9A', pose: 'wave', phase: 1},
  ],
  [
    {skin: SKIN[3], hair: '#111', hs: 'curly', shirt: '#FFB627', pose: 'wave', phase: 2},
    {skin: SKIN[4], hair: '#C9A15A', hs: 'bun', shirt: '#8B5CF6', pose: 'idle', phase: 3},
  ],
  [
    {skin: SKIN[2], hair: '#222', hs: 'cap', shirt: '#34E3A0', pose: 'idle', phase: 4},
    {skin: SKIN[0], hair: '#5B3A24', hs: 'short', shirt: '#FF7A59', pose: 'wave', phase: 5},
  ],
  [
    {skin: SKIN[1], hair: '#171717', hs: 'long', shirt: '#2DD4FF', pose: 'wave', phase: 6},
    {skin: SKIN[4], hair: '#8A4B2A', hs: 'short', shirt: '#FF3D9A', pose: 'idle', phase: 7},
  ],
];

const BUBBLE_AT = [4.7, 5.25, 5.8, 6.35, 6.8, 7.15];

/** Szene 1b: voller Laden, gestresster Kellner, wartende Gäste (2D-Parallax). */
export const CrowdShot: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const k = prog(frame, 4.2, 3.7, IN_OUT);
  const pan = -k * 1020;
  const zoom = 1 + k * 0.1;
  const wx = -420 + prog(frame, 4.25, 3.4, (x) => x) * 2300 + pan * -0; // Kellner läuft von links nach rechts durchs Bild
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#07091f 0%,#14125a 55%,#0b0e33 100%)'}}>
      {/* Hintergrund-Neon */}
      <div style={{position: 'absolute', left: -200 + pan * 0.25, top: 420, width: 3200, height: 12, background: C.cyan, boxShadow: `0 0 50px 12px ${C.cyan}`, opacity: 0.8}} />
      <div style={{position: 'absolute', left: -200 + pan * 0.25, top: 560, width: 3200, height: 10, background: C.magenta, boxShadow: `0 0 50px 12px ${C.magenta}`, opacity: 0.7}} />
      {Array.from({length: 14}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: i * 260 - 100 + pan * 0.35, top: 640 + (i % 3) * 60, width: 90, height: 90, borderRadius: '50%', background: [C.cyan, C.magenta, C.violet][i % 3], opacity: 0.18, filter: 'blur(14px)'}} />
      ))}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '540px 1000px'}}>
        <div style={{position: 'absolute', left: pan, top: 0, width: 2600, height: 1920}}>
          {TABLE_X.map((x, ti) => (
            <React.Fragment key={ti}>
              {GUESTS[ti].map((g, gi) => (
                <div key={gi} style={{position: 'absolute', left: x - 110 + (gi ? 125 : -125), top: 1030 - 330 + (gi ? 8 : 0), width: 220, height: 323}}>
                  <SeatedPerson skin={g.skin} hair={g.hair} hairStyle={g.hs} shirt={g.shirt} pose={g.pose} frame={frame} phase={g.phase} />
                </div>
              ))}
              {/* Tisch mit schlafendem Display */}
              <div style={{position: 'absolute', left: x - 300, top: 1010, width: 600, height: 120, borderRadius: 30, background: 'linear-gradient(180deg,#1b2370,#0c1040)', boxShadow: `inset 0 0 0 5px rgba(45,212,255,.5)`}} />
              <div style={{position: 'absolute', left: x - 110, top: 1030, width: 220, height: 66, borderRadius: 10, background: 'linear-gradient(135deg,#0b1030,#1a2766)', boxShadow: `0 0 40px rgba(45,212,255,.4)`, border: '3px solid #2b3366'}} />
              <div style={{position: 'absolute', left: x - 300, top: 1130, width: 600, height: 150, background: 'linear-gradient(180deg,#0a0e38,transparent)'}} />
            </React.Fragment>
          ))}
          {/* Sprechblasen der wartenden Gäste */}
          {[[0, 0], [1, 0], [1, 1], [2, 1], [3, 0], [3, 1]].map(([ti, gi], i) => {
            const p = pop(frame, BUBBLE_AT[i]);
            if (p <= 0) return null;
            const x = TABLE_X[ti] + (gi ? 125 : -125) - 60;
            return (
              <div key={i} style={{position: 'absolute', left: x, top: 610 + (i % 2) * 24}}>
                <Bubble size={120} scale={p}>
                  {i % 3 === 0 ? <IconClock size={64} color="#111" stroke={2.4} /> : <span style={{fontSize: 74, fontWeight: 900, color: i % 3 === 1 ? C.red : '#111'}}>{i % 3 === 1 ? '?' : '!'}</span>}
                </Bubble>
              </div>
            );
          })}
        </div>
        {/* Kellner im Vordergrund */}
        <div style={{position: 'absolute', left: wx, top: 1020, width: 400, height: 650}}>
          <Waiter frame={frame} hurry={1.15} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
