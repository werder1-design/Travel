import React from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {Fonts} from './components/Fonts';
import {IsoCam, IsoWorld} from './iso/World';

/** Entwicklungs-Vorschau: Diorama mit frei wählbarer Kamera/Zeit (inputProps {t, cam}). */
export const IsoPreview: React.FC = () => {
  const p = getInputProps() as {t?: number; cam?: IsoCam};
  const cam = p.cam ?? {gx: 11, gy: 7.5, gz: 1, zoom: 0.62};
  return (
    <AbsoluteFill>
      <Fonts />
      <IsoWorld t={p.t ?? 0} cam={cam} />
    </AbsoluteFill>
  );
};
