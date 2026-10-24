import React from 'react';
import {Composition} from 'remotion';
import {DisplayIQ} from './DisplayIQ';
import {IsoPreview} from './IsoPreview';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="DisplayIQ" component={DisplayIQ} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview" component={IsoPreview} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
