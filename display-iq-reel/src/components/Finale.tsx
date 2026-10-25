import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, FPS} from '../theme';
import {OUT, SOFT, pop, prog, rand} from '../ease';
import {MenuScreen} from '../screens/MenuScreen';
import {AdScreen, HappyHourScreen, ScreenSwitch} from '../screens/PromoScreens';
import {DEV, Device} from './Device';
import {IconBag, IconClock, IconTrend} from './Icons';
import {LogoMark, Wordmark} from './Logo';

export const PRODUCT_IN = 50.95;
export const PRODUCT_OUT = 56.5;

const BENEFITS = [
  {label: 'WENIGER SERVICEAUFWAND', at: 51.15, icon: IconClock, from: '#8B5CF6', to: '#2DD4FF'},
  {label: 'MEHR BESTELLUNGEN', at: 53.4, icon: IconBag, from: '#34E3A0', to: '#2DD4FF'},
  {label: 'ZUSÄTZLICHE WERBEEINNAHMEN', at: 54.6, icon: IconTrend, from: '#FFB627', to: '#FF3D9A'},
];

/** Freigestellter Produkt-Shot: das Display schwebt im Zentrum, darunter erscheinen die drei Vorteile. */
export const ProductShot: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const inP = prog(frame, PRODUCT_IN, 1.0, OUT);
  const outP = prog(frame, PRODUCT_OUT - 0.5, 0.5, SOFT);
  const yaw = Math.sin((t - PRODUCT_IN) * 0.9) * 14 + 4;
  const hover = Math.sin(t * 1.6) * 8;
  const vis = (1 - outP) * Math.min(1, inP * 2);
  const scale = 0.66;
  return (
    <AbsoluteFill style={{opacity: vis, transform: `scale(${1 + outP * 0.1})`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 36%,rgba(45,212,255,.25),rgba(5,9,30,0) 58%), linear-gradient(180deg,rgba(5,9,30,.7),rgba(5,9,30,.88))'}} />
      {/* Podest-Glow */}
      <div style={{position: 'absolute', left: 140, top: 958, width: 800, height: 140, borderRadius: '50%', background: 'radial-gradient(ellipse at center,rgba(45,212,255,.5),rgba(139,92,246,.18) 50%,transparent 70%)', opacity: inP}} />
      <div style={{position: 'absolute', left: 190, top: 984, width: 700, height: 90, borderRadius: '50%', border: '4px solid rgba(45,212,255,.75)', boxShadow: '0 0 40px rgba(45,212,255,.7)', opacity: inP * 0.9}} />
      <div style={{position: 'absolute', left: 540 - (DEV.w * scale) / 2, top: 272 + hover + (1 - inP) * 500, width: DEV.w * scale, height: DEV.h * scale, perspective: 2400}}>
        <div style={{width: DEV.w, height: DEV.h, transformOrigin: '0 0', transform: `scale(${scale})`, transformStyle: 'preserve-3d'}}>
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${yaw}deg) rotateX(-3deg)`}}>
            <Device extrude={16} glow={1}>
              <ScreenSwitch sec={t} items={[
                {from: 0, render: (s) => <MenuScreen sec={s} appearAt={50.9} preset={['mojito', 'pils', 'nachos']} showSent={false} />},
                {from: 53.4, render: (s) => <HappyHourScreen sec={s} appearAt={53.4} />},
                {from: 54.6, render: (s) => <AdScreen sec={s} appearAt={54.6} />},
              ]} />
            </Device>
          </div>
        </div>
      </div>
      {BENEFITS.map((b, i) => {
        const p = pop(frame, b.at, 14, 190);
        const Icon = b.icon;
        return (
          <div key={`c${b.label}`} style={{position: 'absolute', left: 60, right: 60, top: 1066 + i * 72, height: 62, borderRadius: 31, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px', background: 'linear-gradient(120deg,rgba(26,33,80,.96),rgba(13,17,48,.96))', border: '2px solid rgba(255,255,255,.18)', boxShadow: `0 12px 36px rgba(0,0,0,.45), 0 0 30px ${b.from}44`, opacity: p, transform: `translateX(${(1 - p) * 140}px) scale(${0.92 + p * 0.08})`}}>
            <div style={{width: 48, height: 48, borderRadius: 24, background: `linear-gradient(135deg,${b.from},${b.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icon size={26} color="#fff" stroke={2.6} />
            </div>
            <div style={{fontFamily: 'Anton', fontSize: 44, letterSpacing: 1.5, color: '#fff', whiteSpace: 'nowrap', lineHeight: 1}}>{b.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Abschluss: Logo, Claim und URL. */
export const EndCard: React.FC<{frame: number; from: number; t1?: number; t2?: number; t3?: number; line1?: string; line2?: string; size1?: number}> = ({frame, from, t1 = 58.05, t2 = 59.3, t3 = 60.0, line1 = 'MEHR UMSATZ.', line2 = 'An jedem Tisch.', size1 = 150}) => {
  const t = frame / FPS;
  const logo = pop(frame, from + 0.15, 12, 150);
  const word = prog(frame, from + 0.3, 0.7, OUT);
  const l1 = pop(frame, t1);
  const l2 = pop(frame, t2);
  const url = pop(frame, t3);
  const pulse = (Math.sin(t * 3) + 1) / 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 34%,#1a2a80 0%,#0a0f33 52%,#05071a 100%)', fontFamily: FONT}}>
      {Array.from({length: 26}).map((_, i) => {
        const x = rand(i + 1) * 1080;
        const y = (((rand(i + 40) * 2000 - t * (20 + rand(i + 7) * 40)) % 2000) + 2000) % 2000 - 40;
        const s = 6 + rand(i + 3) * 16;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: i % 2 ? C.cyan : C.violet, opacity: 0.22 + rand(i + 9) * 0.3, filter: 'blur(2px)'}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${0.5 + logo * 0.5})`, opacity: Math.min(1, logo * 1.4)}}>
        <div style={{position: 'absolute', top: 70, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,212,255,.4),transparent 65%)'}} />
        <LogoMark size={240} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center', opacity: word, transform: `translateY(${(1 - word) * 40}px)`}}>
        <Wordmark size={112} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center'}}>
        <div style={{fontFamily: 'Anton', fontSize: size1, lineHeight: 1.0, letterSpacing: 2, color: '#fff', opacity: l1, transform: `translateY(${(1 - l1) * 50}px) scale(${0.9 + l1 * 0.1})`, textShadow: '0 8px 40px rgba(0,0,0,.5)'}}>{line1}</div>
        <div style={{fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700, fontSize: 124, lineHeight: 1.1, color: '#ffc247', opacity: l2, transform: `translateY(${(1 - l2) * 50}px) scale(${0.9 + l2 * 0.1})`}}>{line2}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1160, display: 'flex', justifyContent: 'center', opacity: url, transform: `scale(${0.85 + url * 0.15})`}}>
        <div style={{padding: '16px 52px', borderRadius: 999, border: `3px solid ${C.cyan}`, color: C.cyan, fontSize: 56, fontWeight: 800, letterSpacing: 1, boxShadow: `0 0 ${24 + pulse * 30}px rgba(45,212,255,.4)`, background: 'rgba(45,212,255,.08)'}}>display-iq.de</div>
      </div>
    </AbsoluteFill>
  );
};
