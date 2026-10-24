import React from 'react';
import {C} from '../theme';
import {FoodIcon, FoodKind} from '../components/Food';
import {IconPlus} from '../components/Icons';
import {pop, prog, clamp01} from '../ease';
import {FPS} from '../theme';
import {Ripple, Screen, TopBar, eur, press} from './common';

export type MenuId = 'mojito' | 'pils' | 'pizza' | 'nachos';

export const MENU_ITEMS: Record<MenuId, {name: string; desc: string; price: number; kind: FoodKind; col: number; row: number}> = {
  mojito: {name: 'Mojito', desc: 'Rum · Minze', price: 8.5, kind: 'mojito', col: 0, row: 0},
  pils: {name: 'Pils', desc: '0,5 l frisch', price: 4.9, kind: 'beer', col: 1, row: 0},
  pizza: {name: 'Pizza', desc: 'Steinofen', price: 9.9, kind: 'pizza', col: 0, row: 1},
  nachos: {name: 'Nachos', desc: 'Käse · Salsa', price: 8.9, kind: 'nachos', col: 1, row: 1},
};

const CARD = {x0: 24, y0: 176, w: 254, h: 296, gap: 16};
const cardPos = (id: MenuId) => ({
  x: CARD.x0 + MENU_ITEMS[id].col * (CARD.w + CARD.gap),
  y: CARD.y0 + MENU_ITEMS[id].row * (CARD.h + CARD.gap),
});

/** Tap-Ziele in Bildschirm-Koordinaten (580×960). */
export const menuTarget = (id: MenuId | 'order') => {
  if (id === 'order') return {x: 430, y: 872};
  const p = cardPos(id);
  return {x: p.x + CARD.w - 47, y: p.y + CARD.h - 47};
};

export type MenuTap = {id: MenuId | 'order'; at: number};

export const MenuScreen: React.FC<{
  sec: number;
  appearAt: number;
  taps?: MenuTap[];
  preset?: MenuId[];
  showSent?: boolean;
}> = ({sec, appearAt, taps = [], preset = [], showSent = true}) => {
  const frame = sec * FPS;
  const adds = taps.filter((t) => t.id !== 'order' && t.at <= sec).map((t) => t.id as MenuId);
  const cartIds = [...preset, ...adds];
  const total = cartIds.reduce((s, id) => s + MENU_ITEMS[id].price, 0);
  const orderTap = taps.find((t) => t.id === 'order');
  const sentAt = orderTap ? orderTap.at + 0.28 : Infinity;
  const barPop = pop(frame, appearAt + 0.3);

  return (
    <Screen>
      <TopBar />
      <div style={{position: 'absolute', left: 24, top: 98, display: 'flex', gap: 10, opacity: pop(frame, appearAt)}}>
        {['Alle', 'Drinks', 'Food', 'Specials'].map((t, i) => (
          <div key={t} style={{padding: '0 22px', height: 60, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, fontSize: 29, fontWeight: 800, background: i === 0 ? 'linear-gradient(120deg,#2DD4FF,#7C4DFF)' : 'rgba(255,255,255,.08)', color: i === 0 ? '#fff' : C.dim}}>
            {t}
            {t === 'Specials' && <span style={{width: 12, height: 12, borderRadius: 6, background: C.magenta}} />}
          </div>
        ))}
      </div>

      {(Object.keys(MENU_ITEMS) as MenuId[]).map((id, i) => {
        const it = MENU_ITEMS[id];
        const p = cardPos(id);
        const a = pop(frame, appearAt + 0.06 + i * 0.07);
        const added = taps.find((t) => t.id === id && t.at <= sec);
        const pr = taps.reduce((m, t) => (t.id === id ? Math.max(m, press(sec, t.at)) : m), 0);
        const cnt = cartIds.filter((x) => x === id).length;
        return (
          <div key={id} style={{position: 'absolute', left: p.x, top: p.y, width: CARD.w, height: CARD.h, borderRadius: 30, background: 'linear-gradient(160deg,#1c2558,#121839)', border: `2px solid ${added || cnt ? 'rgba(52,227,160,.6)' : 'rgba(255,255,255,.08)'}`, opacity: a, transform: `translateY(${(1 - a) * 46}px) scale(${1 - pr * 0.03})`, boxShadow: cnt ? '0 0 36px rgba(52,227,160,.2)' : undefined}}>
            <div style={{position: 'absolute', left: 6, top: 4, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,212,255,.22),transparent 68%)'}} />
            <div style={{position: 'absolute', left: 16, top: 14}}><FoodIcon kind={it.kind} size={130} /></div>
            <div style={{position: 'absolute', right: 18, top: 22, fontSize: 32, fontWeight: 800, color: C.cyan}}>{eur(it.price)}</div>
            <div style={{position: 'absolute', left: 20, top: 160, fontSize: 42, fontWeight: 900, letterSpacing: -0.5}}>{it.name}</div>
            <div style={{position: 'absolute', left: 20, top: 214, fontSize: 25, fontWeight: 600, color: C.dim}}>{it.desc}</div>
            <div style={{position: 'absolute', right: 16, bottom: 16, width: 62, height: 62, borderRadius: 31, background: cnt ? C.green : 'linear-gradient(135deg,#2DD4FF,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - pr * 0.18})`, boxShadow: cnt ? '0 0 26px rgba(52,227,160,.6)' : '0 8px 20px rgba(45,212,255,.3)'}}>
              {cnt > 0 ? <span style={{fontSize: 32, fontWeight: 900, color: '#04241a'}}>{cnt}</span> : <IconPlus size={36} />}
            </div>
          </div>
        );
      })}

      {/* Bestell-Leiste */}
      <div style={{position: 'absolute', left: 24, top: 806, width: 532, height: 130, borderRadius: 30, background: 'linear-gradient(170deg,#1f2a66,#111738)', border: '2px solid rgba(255,255,255,.1)', opacity: barPop, transform: `translateY(${(1 - barPop) * 60}px)`}}>
        {cartIds.length === 0 ? (
          <div style={{position: 'absolute', left: 26, top: 38, fontSize: 30, fontWeight: 700, color: 'rgba(156,166,208,.8)'}}>Tippe auf <b style={{color: C.cyan}}>+</b> und wähle aus</div>
        ) : (
          <>
            <div style={{position: 'absolute', left: 24, top: 16, display: 'flex'}}>
              {cartIds.slice(0, 5).map((id, i) => (
                <div key={i} style={{marginLeft: i ? -16 : 0, width: 52, height: 52, borderRadius: 26, background: '#0b1030', border: '2px solid #2a3470', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 - i}}>
                  <FoodIcon kind={MENU_ITEMS[id].kind} size={40} />
                </div>
              ))}
            </div>
            <div style={{position: 'absolute', left: 26, top: 72, fontSize: 40, fontWeight: 900, whiteSpace: 'nowrap'}}>{eur(total)}</div>
          </>
        )}
        <div style={{position: 'absolute', right: 16, top: 22, width: 230, height: 86, borderRadius: 26, background: total > 0 ? 'linear-gradient(120deg,#34E3A0,#2DD4FF)' : 'rgba(255,255,255,.1)', color: total > 0 ? '#04243a' : C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 900, letterSpacing: 0.5, transform: `scale(${1 - (orderTap ? press(sec, orderTap.at) : 0) * 0.06})`, boxShadow: total > 0 ? '0 10px 30px rgba(52,227,160,.35)' : undefined}}>
          BESTELLEN
        </div>
      </div>

      {taps.map((t, i) => {
        const tg = menuTarget(t.id);
        return <Ripple key={i} x={tg.x} y={tg.y} sec={sec} at={t.at} color={t.id === 'order' ? '#7CFFD0' : '#fff'} />;
      })}

      {showSent && <OrderSent sec={sec} at={sentAt} total={total} counts={Object.entries(cartIds.reduce<Record<string, number>>((m, id) => ({...m, [id]: (m[id] ?? 0) + 1}), {})).map(([id, n]) => `${n}× ${MENU_ITEMS[id as MenuId].name}`)} />}
    </Screen>
  );
};

export const OrderSent: React.FC<{sec: number; at: number; total: number; counts: string[]}> = ({sec, at, total, counts}) => {
  if (sec < at) return null;
  const frame = sec * FPS;
  const a = prog(frame, at, 0.3);
  const check = prog(frame, at + 0.1, 0.45);
  const bar = prog(frame, at + 0.45, 1.6, (t) => t);
  const ring = pop(frame, at + 0.05);
  return (
    <div style={{position: 'absolute', inset: 0, background: 'rgba(5,8,26,.93)', opacity: a, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '0 30px'}}>
      <div style={{width: 160, height: 160, borderRadius: 80, background: 'linear-gradient(135deg,#34E3A0,#2DD4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + ring * 0.4})`, boxShadow: '0 0 90px rgba(52,227,160,.55)'}}>
        <svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="#04243a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="22" strokeDashoffset={22 * (1 - check)} />
        </svg>
      </div>
      <div style={{fontSize: 56, fontWeight: 900, letterSpacing: -1, lineHeight: 1.05}}>Bestellung gesendet!</div>
      <div style={{fontSize: 32, color: C.dim, fontWeight: 700, lineHeight: 1.3}}>{counts.join(' · ')}<br />{eur(total)}</div>
      <div style={{width: 420, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.12)', overflow: 'hidden', marginTop: 6}}>
        <div style={{width: `${clamp01(bar) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#34E3A0,#2DD4FF)'}} />
      </div>
      <div style={{fontSize: 30, color: C.green, fontWeight: 800}}>Direkt an Bar &amp; Küche</div>
    </div>
  );
};
