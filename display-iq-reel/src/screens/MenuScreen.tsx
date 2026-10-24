import React from 'react';
import {C, FONT} from '../theme';
import {FoodIcon, FoodKind} from '../components/Food';
import {IconCheck, IconPlus} from '../components/Icons';
import {pop, prog, clamp01} from '../ease';
import {FPS} from '../theme';
import {Ripple, Screen, TopBar, eur, press} from './common';

export type MenuId = 'mojito' | 'pils' | 'pizza' | 'nachos';

export const MENU_ITEMS: Record<MenuId, {name: string; short: string; desc: string; price: number; kind: FoodKind; col: number; row: number}> = {
  mojito: {name: 'Mojito', short: 'Mojito', desc: 'Rum · Minze', price: 8.5, kind: 'mojito', col: 0, row: 0},
  pils: {name: 'Pils 0,5 l', short: 'Pils', desc: 'Frisch gezapft', price: 4.9, kind: 'beer', col: 1, row: 0},
  pizza: {name: 'Pizza', short: 'Pizza', desc: 'Steinofen', price: 9.9, kind: 'pizza', col: 0, row: 1},
  nachos: {name: 'Nachos', short: 'Nachos', desc: 'Käse · Salsa', price: 8.9, kind: 'nachos', col: 1, row: 1},
};

const CARD = {x0: 32, y0: 190, w: 396, h: 268, gap: 24};
const cardPos = (id: MenuId) => ({
  x: CARD.x0 + MENU_ITEMS[id].col * (CARD.w + CARD.gap),
  y: CARD.y0 + MENU_ITEMS[id].row * (CARD.h + CARD.gap),
});

/** Tap-Ziele in Screen-Koordinaten (1200×800). */
export const menuTarget = (id: MenuId | 'order') => {
  if (id === 'order') return {x: 1020, y: 690};
  const p = cardPos(id);
  return {x: p.x + CARD.w - 58, y: p.y + CARD.h - 58};
};

export type MenuTap = {id: MenuId | 'order'; at: number};

export const MenuScreen: React.FC<{
  sec: number;
  appearAt: number;
  taps?: MenuTap[];
  /** Vorbelegte Positionen im Warenkorb (z. B. für Mini-Displays). */
  preset?: MenuId[];
  showSent?: boolean;
}> = ({sec, appearAt, taps = [], preset = [], showSent = true}) => {
  const frame = sec * FPS;
  const adds = taps.filter((t) => t.id !== 'order' && t.at <= sec).map((t) => t.id as MenuId);
  const cartIds = [...preset, ...adds];
  const counts = (Object.keys(MENU_ITEMS) as MenuId[])
    .map((id) => ({id, n: cartIds.filter((x) => x === id).length}))
    .filter((x) => x.n > 0);
  const total = counts.reduce((s, x) => s + x.n * MENU_ITEMS[x.id].price, 0);
  const orderTap = taps.find((t) => t.id === 'order');
  const sentAt = orderTap ? orderTap.at + 0.28 : Infinity;
  const cartPop = pop(frame, appearAt + 0.25);

  return (
    <Screen>
      <TopBar />
      {/* Tabs */}
      <div style={{position: 'absolute', left: 32, top: 100, display: 'flex', gap: 14, opacity: pop(frame, appearAt)}}>
        {['Alle', 'Drinks', 'Food', 'Specials'].map((t, i) => (
          <div key={t} style={{padding: '0 32px', height: 66, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 999, fontSize: 36, fontWeight: 700, background: i === 0 ? 'linear-gradient(120deg,#2DD4FF,#7C4DFF)' : 'rgba(255,255,255,.07)', color: i === 0 ? '#fff' : C.dim}}>
            {t}
            {t === 'Specials' && <span style={{width: 14, height: 14, borderRadius: 7, background: C.magenta}} />}
          </div>
        ))}
      </div>

      {/* Karten */}
      {(Object.keys(MENU_ITEMS) as MenuId[]).map((id, i) => {
        const it = MENU_ITEMS[id];
        const p = cardPos(id);
        const a = pop(frame, appearAt + 0.06 + i * 0.07);
        const added = taps.find((t) => t.id === id && t.at <= sec);
        const pr = taps.reduce((m, t) => (t.id === id ? Math.max(m, press(sec, t.at)) : m), 0);
        const cnt = cartIds.filter((x) => x === id).length;
        return (
          <div key={id} style={{position: 'absolute', left: p.x, top: p.y, width: CARD.w, height: CARD.h, borderRadius: 30, background: 'linear-gradient(160deg,#1a2152,#121839)', border: `2px solid ${added ? 'rgba(52,227,160,.55)' : 'rgba(255,255,255,.07)'}`, opacity: a, transform: `translateY(${(1 - a) * 46}px) scale(${1 - pr * 0.03})`, boxShadow: added ? '0 0 40px rgba(52,227,160,.18)' : undefined}}>
            <div style={{position: 'absolute', left: 14, top: 8, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,212,255,.22),transparent 68%)'}} />
            <div style={{position: 'absolute', left: 22, top: 20}}><FoodIcon kind={it.kind} size={120} /></div>
            <div style={{position: 'absolute', right: 26, top: 26, fontSize: 42, fontWeight: 800, color: C.cyan}}>{eur(it.price)}</div>
            <div style={{position: 'absolute', left: 26, top: 150, fontSize: 46, fontWeight: 800}}>{it.name}</div>
            <div style={{position: 'absolute', left: 26, top: 208, fontSize: 30, fontWeight: 500, color: C.dim}}>{it.desc}</div>
            <div style={{position: 'absolute', right: 24, bottom: 24, width: 68, height: 68, borderRadius: 34, background: added ? C.green : 'linear-gradient(135deg,#2DD4FF,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - pr * 0.18})`, boxShadow: added ? '0 0 30px rgba(52,227,160,.6)' : '0 8px 20px rgba(45,212,255,.3)'}}>
              {cnt > 0 ? <span style={{fontSize: 34, fontWeight: 900, color: '#062'}}>{cnt}</span> : <IconPlus size={38} />}
            </div>
          </div>
        );
      })}

      {/* Warenkorb */}
      <div style={{position: 'absolute', left: 872, top: 190, width: 296, height: 560, borderRadius: 30, background: 'linear-gradient(170deg,#1c2459,#111738)', border: '2px solid rgba(255,255,255,.08)', opacity: cartPop, transform: `translateX(${(1 - cartPop) * 60}px)`}}>
        <div style={{position: 'absolute', left: 26, top: 24, fontSize: 28, fontWeight: 800, color: C.dim, letterSpacing: 2}}>BESTELLUNG</div>
        {counts.length === 0 && <div style={{position: 'absolute', left: 26, right: 26, top: 120, fontSize: 32, color: 'rgba(156,166,208,.7)', fontWeight: 600, lineHeight: 1.35}}>Tippe auf <b style={{color: C.cyan}}>+</b> und wähle aus.</div>}
        {counts.map((x, i) => {
          const at = taps.find((t) => t.id === x.id)?.at ?? appearAt;
          const a = pop(frame, at + 0.02);
          return (
            <div key={x.id} style={{position: 'absolute', left: 22, right: 22, top: 72 + i * 70, height: 60, borderRadius: 18, background: 'rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontSize: 33, fontWeight: 800, opacity: a, transform: `translateX(${(1 - a) * 40}px)`}}>
              <span>{x.n > 1 ? `${x.n}× ` : ''}{MENU_ITEMS[x.id].short}</span>
              <span style={{color: C.cyan}}>{eur(x.n * MENU_ITEMS[x.id].price).replace(' €', '')}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 26, right: 26, bottom: 124, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <span style={{fontSize: 28, color: C.dim, fontWeight: 700}}>Summe</span>
          <span style={{fontSize: 42, fontWeight: 900, whiteSpace: 'nowrap'}}>{eur(total)}</span>
        </div>
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 20, height: 84, borderRadius: 24, background: total > 0 ? 'linear-gradient(120deg,#34E3A0,#2DD4FF)' : 'rgba(255,255,255,.1)', color: total > 0 ? '#04243a' : C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, letterSpacing: 1, transform: `scale(${1 - (orderTap ? press(sec, orderTap.at) : 0) * 0.05})`, boxShadow: total > 0 ? '0 10px 30px rgba(52,227,160,.35)' : undefined}}>
          BESTELLEN
        </div>
      </div>

      {taps.map((t, i) => {
        const tg = menuTarget(t.id);
        return <Ripple key={i} x={tg.x} y={tg.y} sec={sec} at={t.at} color={t.id === 'order' ? '#7CFFD0' : '#fff'} />;
      })}

      {showSent && <OrderSent sec={sec} at={sentAt} total={total} counts={counts.map((c) => `${c.n}× ${MENU_ITEMS[c.id].short}`)} />}
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
    <div style={{position: 'absolute', inset: 0, background: 'rgba(5,8,26,.9)', opacity: a, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22}}>
      <div style={{width: 170, height: 170, borderRadius: 85, background: 'linear-gradient(135deg,#34E3A0,#2DD4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + ring * 0.4})`, boxShadow: '0 0 90px rgba(52,227,160,.55)'}}>
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#04243a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="22" strokeDashoffset={22 * (1 - check)} />
        </svg>
      </div>
      <div style={{fontSize: 68, fontWeight: 900, letterSpacing: -1}}>Bestellung gesendet!</div>
      <div style={{fontSize: 34, color: C.dim, fontWeight: 600}}>{counts.join(' · ')} · {eur(total)}</div>
      <div style={{width: 520, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.12)', overflow: 'hidden', marginTop: 8}}>
        <div style={{width: `${clamp01(bar) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#34E3A0,#2DD4FF)'}} />
      </div>
      <div style={{fontSize: 30, color: C.green, fontWeight: 700}}>Wird direkt an Bar &amp; Küche übermittelt</div>
    </div>
  );
};
