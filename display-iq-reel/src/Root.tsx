import React from 'react';
import {Composition} from 'remotion';
import {DisplayIQ} from './DisplayIQ';
import {IsoPreview} from './IsoPreview';
import {IsoPreview2} from './IsoPreview2';
import {IsoPreview3} from './IsoPreview3';
import {Reel2, REEL2_DURATION} from './reel2/Reel2';
import {Reel3, REEL3_DURATION} from './reel3/Reel3';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="DisplayIQ" component={DisplayIQ} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview" component={IsoPreview} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="PlasticReel" component={Reel2} durationInFrames={REEL2_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DayReel" component={Reel3} durationInFrames={REEL3_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview3" component={IsoPreview3} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="IsoPreview2" component={IsoPreview2} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
