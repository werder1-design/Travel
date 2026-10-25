import React from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {Fonts} from './components/Fonts';
import {IsoCam} from './iso/World';
import {RestaurantWorld} from './reel2/RestaurantWorld';

export const IsoPreview2: React.FC = () => {
  const p = getInputProps() as {t?: number; cam?: IsoCam};
  return (
    <AbsoluteFill>
      <Fonts />
      <RestaurantWorld t={p.t ?? 0} cam={p.cam ?? {gx: 9, gy: 6.5, gz: 1, zoom: 0.8}} />
    </AbsoluteFill>
  );
};
