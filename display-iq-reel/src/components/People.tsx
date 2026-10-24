import React from 'react';
import {FPS} from '../theme';

export type HairStyle = 'short' | 'long' | 'bun' | 'curly' | 'cap' | 'bald';
export type Pose = 'idle' | 'cheer' | 'wave' | 'laugh';

export const SKIN = ['#F2C7A5', '#D9A074', '#B97A56', '#8D5A3B', '#F7D8BF'];

type SeatedProps = {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  shirt: string;
  pose?: Pose;
  frame: number;
  phase?: number;
  beard?: boolean;
  glasses?: boolean;
  /** true: liefert nur <g> (für Einbettung in eine bestehende SVG-Szene). */
  bare?: boolean;
};

/** Stilisierte, minimalistische Büste (sitzend, frontal). 300×440 Design-Einheiten. */
export const SeatedPerson: React.FC<SeatedProps> = ({
  skin, hair, hairStyle, shirt, pose = 'idle', frame, phase = 0, beard, glasses, bare,
}) => {
  const t = frame / FPS;
  const bob = Math.sin(t * Math.PI * 1.3 + phase) * 3;
  const tilt = Math.sin(t * 0.9 + phase * 1.7) * 2.2;
  const breathe = 1 + Math.sin(t * 2 + phase) * 0.006;
  const blink = (Math.floor((t + phase * 3) * 10) % 38) === 0 ? 0.1 : 1;
  const wob = Math.sin(t * 9 + phase) * 8;
  const cheerLift = pose === 'cheer' ? Math.sin(t * 7 + phase) * 6 : 0;
  const mouth =
    pose === 'laugh' || pose === 'cheer'
      ? <path d="M132 160Q150 190 168 160Z" fill="#7A2E2E" />
      : <path d="M134 164Q150 177 166 164" fill="none" stroke="#7A3B2E" strokeWidth="4.5" strokeLinecap="round" />;

  const arm = (side: 1 | -1, lift: number) => {
    const sx = 150 + side * 92;
    return (
      <g>
        <path
          d={`M${sx} 300Q${sx + side * 46} 250 ${sx + side * 16 + wob * side * 0.4} ${150 - lift}`}
          fill="none" stroke={shirt} strokeWidth="42" strokeLinecap="round"
        />
        <circle cx={sx + side * 16 + wob * side * 0.4} cy={140 - lift} r="23" fill={skin} />
      </g>
    );
  };

  const content = (
    <>
      {(pose === 'cheer') && <g transform={`translate(0 ${cheerLift})`}>{arm(1, 90)}{arm(-1, 90)}</g>}
      {pose === 'wave' && <g>{arm(1, 70)}</g>}
      <g transform={`translate(150 440) scale(1 ${breathe}) translate(-150 -440)`}>
        <path d="M24 440V330Q24 250 104 232L196 232Q276 250 276 330V440Z" fill={shirt} />
        <path d="M24 440V330Q24 250 104 232L150 232V440Z" fill="rgba(255,255,255,.07)" />
        <path d="M118 232L150 276L182 232Z" fill={skin} />
        <path d="M118 232L150 276L182 232" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <g transform={`translate(0 ${bob}) rotate(${tilt} 150 220)`}>
        <rect x="128" y="186" width="44" height="52" rx="18" fill={skin} />
        <rect x="128" y="186" width="44" height="52" rx="18" fill="rgba(0,0,0,.14)" />
        {/* Haare hinten (lang) */}
        {hairStyle === 'long' && <path d="M92 120Q88 60 150 58Q212 60 208 120L220 238Q200 250 190 232L110 232Q100 250 80 238Z" fill={hair} />}
        <circle cx="101" cy="140" r="11" fill={skin} />
        <circle cx="199" cy="140" r="11" fill={skin} />
        <ellipse cx="150" cy="134" rx="51" ry="59" fill={skin} />
        {beard && <path d="M101 148Q104 204 150 208Q196 204 199 148Q188 178 150 180Q112 178 101 148Z" fill={hair} opacity=".95" />}
        {/* Haare */}
        {hairStyle === 'short' && <path d="M96 128Q90 66 150 64Q210 66 204 128Q196 98 150 96Q104 98 96 128Z" fill={hair} />}
        {hairStyle === 'long' && <path d="M97 128Q92 68 150 64Q208 68 203 128Q196 94 150 92Q104 94 97 128Z" fill={hair} />}
        {hairStyle === 'bun' && (<><circle cx="150" cy="56" r="26" fill={hair} /><path d="M96 128Q90 68 150 66Q210 68 204 128Q196 98 150 96Q104 98 96 128Z" fill={hair} /></>)}
        {hairStyle === 'curly' && (
          <g fill={hair}>
            {[[104, 92], [124, 74], [150, 68], [176, 74], [196, 92], [100, 116], [200, 116], [136, 90], [164, 90]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="22" />
            ))}
          </g>
        )}
        {hairStyle === 'cap' && (
          <g>
            <path d="M94 114Q98 56 150 54Q202 56 206 114Z" fill={hair} />
            <path d="M92 110H236Q240 122 228 124H92Z" fill={hair} />
            <path d="M92 110H236" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
          </g>
        )}
        {/* Gesicht */}
        <ellipse cx="130" cy="140" rx="5" ry={6.5 * blink} fill="#1B1F3A" />
        <ellipse cx="170" cy="140" rx="5" ry={6.5 * blink} fill="#1B1F3A" />
        <circle cx="118" cy="158" r="9" fill="#FF7A8A" opacity=".22" />
        <circle cx="182" cy="158" r="9" fill="#FF7A8A" opacity=".22" />
        {mouth}
        {glasses && (
          <g fill="none" stroke="#161A33" strokeWidth="4">
            <rect x="110" y="126" width="32" height="26" rx="10" />
            <rect x="158" y="126" width="32" height="26" rx="10" />
            <path d="M142 138H158" />
          </g>
        )}
      </g>
    </>
  );
  return bare ? <g>{content}</g> : <svg viewBox="0 0 300 440" width="100%" height="100%" style={{overflow: 'visible'}}>{content}</svg>;
};

/** Kellner im Laufschritt (Seitenansicht nach rechts), 320×520 Design-Einheiten. */
export const Waiter: React.FC<{frame: number; hurry?: number; bare?: boolean}> = ({frame, hurry = 1, bare}) => {
  const t = frame / FPS;
  const th = t * 11 * hurry;
  const bounce = Math.abs(Math.sin(th)) * -12;
  const leg = (offset: number, dark: string) => {
    const a = Math.sin(th + offset) * 42;
    const k = Math.max(0, -Math.sin(th + offset + 1.1)) * 62;
    return (
      <g transform={`rotate(${a} 150 300)`}>
        <path d="M150 300V392" stroke={dark} strokeWidth="38" strokeLinecap="round" />
        <g transform={`translate(0 392) rotate(${k} 150 0)`}>
          <path d="M150 0V88" stroke={dark} strokeWidth="32" strokeLinecap="round" />
          <path d="M138 98Q170 96 188 108V116H134Z" fill="#0b0e22" />
        </g>
      </g>
    );
  };
  const swing = Math.sin(th) * 34;
  const trayTilt = Math.sin(th * 0.5) * 3;
  const content = (
    <>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${-60 - i * 12} ${180 + i * 52}H${40 - i * 8}`} stroke="rgba(255,255,255,.22)" strokeWidth="6" strokeLinecap="round" />
      ))}
      <g transform={`translate(0 ${bounce}) rotate(7 150 300)`}>
        {leg(Math.PI, '#141833')}
        {/* hinterer Arm */}
        <g transform={`rotate(${swing} 138 206)`}>
          <path d="M138 206L120 296" stroke="#E9ECFF" strokeWidth="30" strokeLinecap="round" />
          <circle cx="119" cy="304" r="15" fill="#E8B58F" />
        </g>
        {/* Torso */}
        <rect x="96" y="168" width="108" height="150" rx="34" fill="#F1F3FF" />
        <path d="M110 178L150 232L190 178L204 194V312H96V194Z" fill="#161B3B" />
        <path d="M150 232V312" stroke="rgba(255,255,255,.18)" strokeWidth="3" />
        {[250, 272, 294].map((y) => <circle key={y} cx="150" cy={y} r="3.4" fill="#FFB627" />)}
        <path d="M134 176L150 186L166 176L162 192L150 188L138 192Z" fill="#FF3D9A" />
        {/* Kopf */}
        <rect x="136" y="130" width="30" height="46" rx="12" fill="#E8B58F" />
        <ellipse cx="156" cy="112" rx="38" ry="42" fill="#F0C09B" />
        <path d="M116 108Q112 66 160 66Q200 68 196 106Q190 86 160 86Q128 86 116 108Z" fill="#2B1E1A" />
        <circle cx="176" cy="114" r="4.6" fill="#1B1F3A" />
        <path d="M168 134Q180 140 190 130" fill="none" stroke="#7A3B2E" strokeWidth="4" strokeLinecap="round" />
        <circle cx="118" cy="118" r="8" fill="#F0C09B" />
        {/* Vorderer Arm mit Tablett */}
        <path d="M170 204L222 252L240 150" fill="none" stroke="#F1F3FF" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="240" cy="144" r="15" fill="#E8B58F" />
        <g transform={`rotate(${trayTilt} 240 132)`}>
          <ellipse cx="240" cy="130" rx="78" ry="12" fill="#C9D0F2" />
          <ellipse cx="240" cy="126" rx="78" ry="10" fill="#E5E9FF" />
          {[[206, '#2DD4FF'], [240, '#FFB627'], [274, '#FF3D9A']].map(([x, c]) => (
            <g key={String(x)}>
              <path d={`M${Number(x) - 12} 70L${Number(x) + 12} 70L${Number(x) + 8} 122H${Number(x) - 8}Z`} fill="rgba(255,255,255,.55)" />
              <path d={`M${Number(x) - 10} 88L${Number(x) + 10} 88L${Number(x) + 7} 120H${Number(x) - 7}Z`} fill={String(c)} />
            </g>
          ))}
        </g>
        {leg(0, '#1d2247')}
      </g>
    </>
  );
  return bare ? <g>{content}</g> : <svg viewBox="0 0 320 520" width="100%" height="100%" style={{overflow: 'visible'}}>{content}</svg>;
};

/** Sprechblase mit beliebigem Inhalt. */
export const Bubble: React.FC<{size?: number; children: React.ReactNode; scale?: number; tail?: 'left' | 'right'}> = ({
  size = 120, children, scale = 1, tail = 'left',
}) => (
  <div style={{position: 'relative', width: size, height: size * 0.82, transform: `scale(${scale})`, transformOrigin: tail === 'left' ? '20% 100%' : '80% 100%'}}>
    <div style={{
      position: 'absolute', inset: 0, borderRadius: size * 0.34, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,0,0,.35)',
    }}>{children}</div>
    <div style={{
      position: 'absolute', bottom: -size * 0.1, [tail]: size * 0.2, width: size * 0.22, height: size * 0.22,
      background: '#fff', transform: 'rotate(45deg)', borderRadius: 6,
    }} />
  </div>
);
