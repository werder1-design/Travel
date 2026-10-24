import React from 'react';
import {Audio, Sequence, staticFile, interpolate} from 'remotion';
import {DURATION, FPS, sec} from './theme';
import {SFX_CUES} from './data/sfx';

/** Voice-over (unverändert, 1:1 ElevenLabs), Musikbett und Soundeffekte. */
export const AudioTracks: React.FC = () => (
  <>
    <Audio src={staticFile('audio/vo.mp3')} volume={1} />
    <Audio
      src={staticFile('audio/music.mp3')}
      volume={(f) =>
        interpolate(f, [0, 0.6 * FPS, DURATION - 2.2 * FPS, DURATION - 0.1 * FPS], [0, 0.29, 0.29, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      }
    />
    {SFX_CUES.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={Math.ceil(c.len * FPS) + 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${c.name}.wav`)} volume={c.vol * 0.8} />
      </Sequence>
    ))}
  </>
);
