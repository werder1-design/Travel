import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cam} from '../camera';
import {FPS} from '../theme';
import {IN_OUT, OUT, lerp, clamp01} from '../ease';
import {Alley, BallShot} from './Alley';

const P = 1000;

const BALL_A: BallShot = {lane: 2, from: 500, start: 0.35, hit: 2.9};
export const AlleyA: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const e = IN_OUT(clamp01(t / 4.2));
  const c = cam({x: 40 + Math.sin(t * 1.3) * 55, y: -40 + Math.sin(t * 2.4) * 7, z: lerp(1700, -4650, e), pitch: 4, roll: Math.sin(t * 1.1) * 1.3, P});
  return <AbsoluteFill><Alley cam={c} sec={t} ball={BALL_A} /></AbsoluteFill>;
};

const BALL_B: BallShot = {lane: 2, from: -1300, start: 22.45, hit: 23.55};
export const AlleyB: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const e = OUT(clamp01((t - 22.4) / 1.9));
  const c = cam({x: 250 + Math.sin(t) * 20, y: 120, z: lerp(-1700, -3500, e), pitch: 2, roll: -1.2, P});
  return <AbsoluteFill><Alley cam={c} sec={t} ball={BALL_B} /></AbsoluteFill>;
};

const BALL_C: BallShot = {lane: 2, from: 300, start: 50.4, hit: 51.55};
export const AlleyC: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const e = OUT(clamp01((t - 50.3) / 6.2));
  const c = cam({x: 120 + Math.sin(t * 0.7) * 140, y: -60, z: lerp(900, -3300, e), pitch: 3, roll: Math.sin(t * 0.9) * 1, P});
  return <AbsoluteFill><Alley cam={c} sec={t} ball={BALL_C} /></AbsoluteFill>;
};
