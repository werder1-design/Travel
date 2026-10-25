import React from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {Fonts} from './components/Fonts';
import {IsoCam} from './iso/World';
import {DayWorld} from './reel3/DayWorld';

export const IsoPreview3: React.FC = () => {
  const p = getInputProps() as {t?: number; cam?: IsoCam};
  return (
    <AbsoluteFill>
      <Fonts />
      <DayWorld t={p.t ?? 0} cam={p.cam ?? {gx: 9, gy: 6.5, gz: 1, zoom: 0.8}} />
    </AbsoluteFill>
  );
};
