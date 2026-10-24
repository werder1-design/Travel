import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS} from './theme';
import {OUT, prog} from './ease';
import {AlleyA, AlleyB, AlleyC} from './components/AlleyShots';
import {CrowdShot} from './components/Crowd';
import {LoungeShot} from './components/Lounge';
import {GridShot} from './components/Grid';
import {EndCard, ProductShot, PRODUCT_IN, PRODUCT_OUT} from './components/Finale';
import {Headline} from './components/Headline';
import {BrandChip, StrikeText, Vignette, Whip} from './components/Overlays';
import {EuroBurst, RevenueCard} from './components/Money';
import {Subtitles} from './components/Subtitles';
import {AudioTracks} from './AudioTracks';

/** Schnitt-Zeitpunkte (s) – jeweils mit Neon-Wisch überdeckt. */
export const CUTS = [4.2, 7.7, 22.4, 24.2, 33.0, 46.4, 50.3, 56.5];

const Shot: React.FC<{frame: number; from: number; to: number; children: React.ReactNode}> = ({frame, from, to, children}) => {
  const t = frame / FPS;
  if (t < from || t >= to) return null;
  const s = 1 + 0.06 * (1 - prog(frame, from, 0.5, OUT));
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const DisplayIQ: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Shot frame={frame} from={0} to={4.2}><AlleyA frame={frame} /></Shot>
      <Shot frame={frame} from={4.2} to={7.7}><CrowdShot frame={frame} /></Shot>
      <Shot frame={frame} from={7.7} to={22.4}><LoungeShot frame={frame} /></Shot>
      <Shot frame={frame} from={22.4} to={24.2}><AlleyB frame={frame} /></Shot>
      <Shot frame={frame} from={24.2} to={33.0}><LoungeShot frame={frame} /></Shot>
      <Shot frame={frame} from={33.0} to={46.4}><GridShot frame={frame} /></Shot>
      <Shot frame={frame} from={46.4} to={50.3}><LoungeShot frame={frame} /></Shot>
      <Shot frame={frame} from={50.3} to={PRODUCT_OUT}><AlleyC frame={frame} /></Shot>
      {frame / FPS >= PRODUCT_IN && frame / FPS < PRODUCT_OUT + 0.1 && <ProductShot frame={frame} />}
      <Shot frame={frame} from={PRODUCT_OUT} to={99}><EndCard frame={frame} from={PRODUCT_OUT} /></Shot>

      <Vignette />

      {/* Szene 1 */}
      <BrandChip frame={frame} at={0.2} until={4.0} />
      <StrikeText frame={frame} at={2.95} until={3.7} />
      <Headline frame={frame} at={8.0} until={10.1} size={92} lines={[{text: 'MEHR UMSATZ.', tone: 'amber'}, {text: 'WENIGER WARTEZEIT.'}]} />
      {/* Szene 2 */}
      <Headline frame={frame} at={19.3} until={22.2} size={108} lines={[{text: 'BESTELLEN.', tone: 'cyan'}, {text: 'OHNE WARTEN.'}]} />
      {/* Szene 3 */}
      <StrikeText frame={frame} at={23.55} until={24.15} />
      <Headline frame={frame} at={29.6} until={32.9} size={96} lines={[{text: 'MEHR VERKÄUFE.', tone: 'magenta'}, {text: 'AUTOMATISCH.'}]} />
      {frame / FPS >= 24.2 && frame / FPS < 33.0 && (
        <div style={{position: 'absolute', left: 90, top: 1050}}>
          <RevenueCard frame={frame} at={30.95} label="ZUSATZUMSATZ" to={248} />
        </div>
      )}
      {frame / FPS < 33.0 && <EuroBurst frame={frame} at={30.95} x={540} y={1060} n={7} spread={620} rise={380} />}
      {/* Szene 4 */}
      <Headline frame={frame} at={43.6} until={46.3} size={92} lines={[{text: 'NEUE EINNAHMEN', tone: 'amber'}, {text: 'DURCH WERBUNG.'}]} />
      {frame / FPS >= 33.0 && frame / FPS < 46.4 && (
        <div style={{position: 'absolute', left: 90, top: 1050}}>
          <RevenueCard frame={frame} at={44.0} label="WERBEEINNAHMEN" to={1200} color={C.amber} />
        </div>
      )}
      {frame / FPS >= 33.0 && frame / FPS < 46.4 && (
        <>
          <EuroBurst frame={frame} at={43.5} x={300} y={700} n={6} spread={360} rise={140} size={84} />
          <EuroBurst frame={frame} at={43.7} x={780} y={700} n={6} spread={360} rise={140} size={84} />
          <EuroBurst frame={frame} at={44.0} x={540} y={1000} n={6} spread={600} rise={260} size={76} />
        </>
      )}

      {CUTS.map((c) => <Whip key={c} frame={frame} cut={c} />)}
      <Whip frame={frame} cut={PRODUCT_IN} dur={0.5} />
      <Subtitles />
      <AudioTracks />
    </AbsoluteFill>
  );
};
