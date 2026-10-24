import React from 'react';
import {Composition} from 'remotion';
import {DisplayIQ} from './DisplayIQ';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
  <Composition id="DisplayIQ" component={DisplayIQ} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
