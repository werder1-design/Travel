import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cam} from '../camera';
import {C, FONT, FPS} from '../theme';
import {OUT, IN_OUT, SOFT, pop, prog, rand} from '../ease';
import {MenuScreen} from '../screens/MenuScreen';
import {AdScreen, HappyHourScreen, ScreenSwitch} from '../screens/PromoScreens';
import {HW, TableDisplay} from './TableDisplay';
import {Plane, World3D} from './World3D';
import {IconBag, IconClock, IconTrend} from './Icons';
import {Logo, LogoMark, Wordmark} from './Logo';

export const PRODUCT_IN = 50.95;
export const PRODUCT_OUT = 56.5;

const BENEFITS = [
  {label: 'WENIGER SERVICEAUFWAND', at: 51.15, icon: IconClock, from: '#8B5CF6', to: '#2DD4FF'},
  {label: 'MEHR BESTELLUNGEN', at: 53.4, icon: IconBag, from: '#34E3A0', to: '#2DD4FF'},
  {label: 'ZUSÄTZLICHE WERBEEINNAHMEN', at: 54.6, icon: IconTrend, from: '#FFB627', to: '#FF3D9A'},
];

/** Freigestellter Produkt-Shot: Display schwebt im Zentrum, darunter erscheinen die drei Vorteile. */
export const ProductShot: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const inP = prog(frame, PRODUCT_IN, 1.0, OUT);
  const outP = prog(frame, PRODUCT_OUT - 0.5, 0.5, SOFT);
  const yaw = Math.sin((t - PRODUCT_IN) * 0.9) * 7;
  const hover = Math.sin(t * 1.6) * 10;
  const c = cam({x: 0, y: 40, z: 0, pitch: 6, zoom: 1.0});
  const dispY = -310 + hover + (1 - inP) * 520;
  const dispZ = (1 - inP) * -700;
  const vis = (1 - outP) * Math.min(1, inP * 2);
  return (
    <AbsoluteFill style={{opacity: vis, transform: `scale(${1 + outP * 0.12})`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%,rgba(45,212,255,.22),rgba(5,7,26,.0) 55%), linear-gradient(180deg,rgba(5,7,26,.78),rgba(5,7,26,.88))'}} />
      <World3D cam={c}>
        {/* Boden-Glow / Podest */}
        <Plane x={0} y={160} z={0} w={1500} h={1000} rotX={90} style={{background: 'radial-gradient(ellipse at center,rgba(45,212,255,.45) 0%,rgba(139,92,246,.18) 38%,transparent 66%)', opacity: inP}} />
        <Plane x={0} y={159} z={0} w={1120} h={760} rotX={90} style={{borderRadius: '50%', border: '5px solid rgba(45,212,255,.7)', boxShadow: '0 0 60px rgba(45,212,255,.6), inset 0 0 60px rgba(45,212,255,.3)', opacity: inP * 0.9}} />
        <Plane x={0} y={dispY} z={dispZ} w={HW.w} h={HW.h} rotX={50} rotY={yaw} scale={0.62} style={{transformStyle: 'preserve-3d'}}>
          <TableDisplay glow={1.2} extrude={12}>
            <ScreenSwitch sec={t} items={[
              {from: 0, render: (s) => <MenuScreen sec={s} appearAt={50.9} preset={['mojito', 'pils', 'nachos']} showSent={false} />},
              {from: 53.4, render: (s) => <HappyHourScreen sec={s} appearAt={53.4} />},
              {from: 54.6, render: (s) => <AdScreen sec={s} appearAt={54.6} />},
            ]} />
          </TableDisplay>
        </Plane>
      </World3D>
      {/* Vorteile */}
      {BENEFITS.map((b, i) => {
        const p = pop(frame, b.at, 14, 190);
        const Icon = b.icon;
        return (
          <div key={b.label} style={{position: 'absolute', left: 90, right: 90, top: 940 + i * 106, height: 92, borderRadius: 46, display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px', fontFamily: FONT, background: 'linear-gradient(120deg,rgba(26,33,80,.95),rgba(13,17,48,.95))', border: '2px solid rgba(255,255,255,.16)', boxShadow: `0 16px 50px rgba(0,0,0,.45), 0 0 40px ${b.from}33`, opacity: p, transform: `translateX(${(1 - p) * 140}px) scale(${0.92 + p * 0.08})`}}>
            <div style={{width: 62, height: 62, borderRadius: 31, background: `linear-gradient(135deg,${b.from},${b.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icon size={36} color="#fff" stroke={2.6} />
            </div>
            <div style={{fontSize: 40, fontWeight: 900, letterSpacing: -0.5, color: C.ink, whiteSpace: 'nowrap'}}>{b.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Abschluss: Logo, Claim und URL. */
export const EndCard: React.FC<{frame: number; from: number}> = ({frame, from}) => {
  const t = frame / FPS;
  const logo = pop(frame, from + 0.15, 12, 150);
  const word = prog(frame, from + 0.3, 0.7, OUT);
  const l1 = pop(frame, 58.05);
  const l2 = pop(frame, 59.3);
  const url = pop(frame, 60.0);
  const pulse = (Math.sin(t * 3) + 1) / 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 34%,#1a2a80 0%,#0a0f33 52%,#05071a 100%)', fontFamily: FONT}}>
      {Array.from({length: 26}).map((_, i) => {
        const x = rand(i + 1) * 1080;
        const y = ((rand(i + 40) * 2000 - t * (20 + rand(i + 7) * 40)) % 2000 + 2000) % 2000 - 40;
        const s = 6 + rand(i + 3) * 16;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: i % 2 ? C.cyan : C.violet, opacity: 0.22 + rand(i + 9) * 0.3, filter: 'blur(2px)'}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + logo * 0.5})`, opacity: Math.min(1, logo * 1.4)}}>
        <div style={{position: 'absolute', top: 70, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,212,255,.4),transparent 65%)'}} />
        <LogoMark size={250} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center', opacity: word, transform: `translateY(${(1 - word) * 40}px)`}}>
        <Wordmark size={118} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center'}}>
        <div style={{fontSize: 94, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, background: 'linear-gradient(95deg,#FFB627,#FF7A3D)', WebkitBackgroundClip: 'text', color: 'transparent', opacity: l1, transform: `translateY(${(1 - l1) * 50}px) scale(${0.9 + l1 * 0.1})`}}>Mehr Umsatz.</div>
        <div style={{fontSize: 94, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, color: C.ink, opacity: l2, transform: `translateY(${(1 - l2) * 50}px) scale(${0.9 + l2 * 0.1})`}}>An jedem Tisch.</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, display: 'flex', justifyContent: 'center', opacity: url, transform: `scale(${0.85 + url * 0.15})`}}>
        <div style={{padding: '18px 54px', borderRadius: 999, border: `3px solid ${C.cyan}`, color: C.cyan, fontSize: 58, fontWeight: 800, letterSpacing: 1, boxShadow: `0 0 ${24 + pulse * 30}px rgba(45,212,255,.4)`, background: 'rgba(45,212,255,.08)'}}>display-iq.de</div>
      </div>
    </AbsoluteFill>
  );
};
