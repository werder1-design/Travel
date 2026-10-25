import React from 'react';
import {Composition} from 'remotion';
import {DisplayIQ} from './DisplayIQ';
import {IsoPreview} from './IsoPreview';
import {IsoPreview2} from './IsoPreview2';
import {Reel2, REEL2_DURATION} from './reel2/Reel2';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="DisplayIQ" component={DisplayIQ} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview" component={IsoPreview} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="PlasticReel" component={Reel2} durationInFrames={REEL2_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview2" component={IsoPreview2} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
