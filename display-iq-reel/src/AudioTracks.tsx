import React from 'react';
import {Audio, Sequence, staticFile, interpolate} from 'remotion';
import {DURATION, FPS, sec} from './theme';
import {SFX_CUES, SfxCue} from './data/sfx';

/** Voice-over (unverändert, 1:1 ElevenLabs), Musikbett und Soundeffekte. */
export const AudioTracks: React.FC<{vo?: string; music?: string; sfx?: SfxCue[]; duration?: number}> = ({
  vo = 'audio/vo.mp3', music = 'audio/music.mp3', sfx = SFX_CUES, duration = DURATION,
}) => (
  <>
    <Audio src={staticFile(vo)} volume={1} />
    <Audio
      src={staticFile(music)}
      volume={(f) =>
        interpolate(f, [0, 0.6 * FPS, duration - 2.2 * FPS, duration - 0.1 * FPS], [0, 0.29, 0.29, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      }
    />
    {sfx.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={Math.ceil(c.len * FPS) + 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${c.name}.wav`)} volume={c.vol * 0.8} />
      </Sequence>
    ))}
  </>
);
