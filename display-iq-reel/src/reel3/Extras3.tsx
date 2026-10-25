import React from 'react';
import {C, FONT, FPS} from '../theme';
import {IN_OUT, clamp01, lerp, pop, prog} from '../ease';
import {LogoMark} from '../components/Logo';
import {SLOT_COLORS, clockLabel, daylight, h24} from './timeline';

/** Schwebende Analoguhr mit Digitalanzeige – die Zeiger folgen der Zeiger-/Lichtzeit. */
export const Clock: React.FC<{h: number; size?: number; appear: number}> = ({h, size = 240, appear}) => {
  const x = h24(h);
  const hourA = (x % 12) * 30;
  const minA = (x % 1) * 360;
  const d = daylight(h);
  const r = size / 2;
  const ticks = Array.from({length: 12}, (_, i) => i);
  return (
    <div style={{width: size, textAlign: 'center', opacity: appear, transform: `scale(${0.7 + appear * 0.3})`, fontFamily: FONT}}>
      <svg width={size} height={size} viewBox="-100 -100 200 200" style={{overflow: 'visible', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.45))'}}>
        <circle r="96" fill="#0d1440" stroke={d > 0.5 ? '#ffc247' : '#2dd4ff'} strokeWidth="7" />
        <circle r="84" fill="#141c58" />
        {ticks.map((i) => <line key={i} x1="0" y1="-76" x2="0" y2={i % 3 === 0 ? -62 : -68} stroke="#cfd6ff" strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
        <line x1="0" y1="8" x2="0" y2="-46" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" transform={`rotate(${hourA})`} />
        <line x1="0" y1="10" x2="0" y2="-68" stroke="#2dd4ff" strokeWidth="5.5" strokeLinecap="round" transform={`rotate(${minA})`} />
        <circle r="7" fill="#ffc247" />
        {/* Sonne / Mond */}
        {d > 0.5 ? (
          <g transform="translate(0 38)"><circle r="9" fill="#ffc247" />{Array.from({length: 8}, (_, i) => <line key={i} x1="0" y1="-14" x2="0" y2="-19" stroke="#ffc247" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45})`} />)}</g>
        ) : (
          <g transform="translate(0 38)"><path d="M6 -9 A10 10 0 1 0 6 9 A8 8 0 1 1 6 -9Z" fill="#cfd6ff" /></g>
        )}
      </svg>
      <div style={{marginTop: -4, fontFamily: 'Anton', fontSize: size * 0.3, letterSpacing: 2, color: '#fff', textShadow: '0 6px 20px rgba(0,0,0,.6)'}}>{clockLabel(h)}</div>
      <span style={{display: 'none'}}>{r}</span>
    </div>
  );
};

export const SCHEDULE = [
  {time: '09:00', name: 'Frühstück', price: '9,90 €', icon: '☕'},
  {time: '12:30', name: 'Lunch', price: '12,90 €', icon: '🍝'},
  {time: '15:30', name: 'Kaffee & Kuchen', price: '7,90 €', icon: '🍰'},
  {time: '19:00', name: 'Happy Hour', price: '2 für 1', icon: '🍹'},
] as const;

export const DASH3 = {w: 940, h: 640, btn: {x: 470, y: 540}};

/** Display-IQ-Dashboard mit Tagesplan: ein Klick auf „Zeitplan aktivieren“ schaltet alle Standorte. */
export const Dashboard3: React.FC<{frame: number; appearAt: number; clickAt: number; publishAt: number}> = ({frame, appearAt, clickAt, publishAt}) => {
  const t = frame / FPS;
  const a = pop(frame, appearAt);
  const done = t > clickAt + 0.45;
  const active = t > publishAt ? Math.floor((t - publishAt) / 0.95) % 4 : -1;
  const cm = clamp01((t - (clickAt - 1.3)) / 1.1);
  const cx = lerp(760, DASH3.btn.x + 70, IN_OUT(cm));
  const cyv = lerp(160, DASH3.btn.y + 10, IN_OUT(cm));
  const press = t > clickAt - 0.05 && t < clickAt + 0.15 ? 0.95 : 1;
  const sent = prog(frame, publishAt, 1.6, (x) => x);
  return (
    <div style={{position: 'relative', width: DASH3.w, height: DASH3.h, borderRadius: 36, background: 'linear-gradient(160deg,#10173f,#080b22)', border: '2px solid rgba(255,255,255,.14)', boxShadow: '0 40px 100px rgba(0,0,0,.6), 0 0 80px rgba(45,212,255,.18)', fontFamily: FONT, color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 80}px) scale(${0.9 + a * 0.1})`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><LogoMark size={50} glow={false} /><div style={{fontSize: 30, fontWeight: 900, whiteSpace: 'nowrap'}}>Display IQ <span style={{color: C.cyan}}>Tagesplan</span></div></div>
        <div style={{padding: '8px 18px', borderRadius: 999, background: 'rgba(52,227,160,.15)', color: C.green, fontSize: 23, fontWeight: 800, whiteSpace: 'nowrap'}}>● 20 Standorte online</div>
      </div>
      <div style={{position: 'absolute', left: 28, top: 108, width: 600}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.dim, marginBottom: 14}}>WERBEZEITRÄUME</div>
        {SCHEDULE.map((r, i) => {
          const on = active === i;
          const col = SLOT_COLORS[i];
          return (
            <div key={r.time} style={{height: 72, marginBottom: 10, borderRadius: 18, background: on ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.06)', border: `2px solid ${on ? col : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', opacity: pop(frame, appearAt + 0.3 + i * 0.1), boxShadow: on ? `0 0 30px ${col}66` : 'none'}}>
              <div style={{width: 18, height: 18, borderRadius: 9, background: col, boxShadow: `0 0 14px ${col}`}} />
              <div style={{fontFamily: 'Anton', fontSize: 36, letterSpacing: 1, width: 100}}>{r.time}</div>
              <div style={{fontSize: 24, fontWeight: 800, flex: 1, whiteSpace: 'nowrap'}}>{r.name}</div>
              <div style={{padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,.1)', fontSize: 21, fontWeight: 800, whiteSpace: 'nowrap'}}>{r.price}</div>
              <div style={{width: 96, textAlign: 'right', fontSize: 19, fontWeight: 800, color: done ? C.green : C.dim, whiteSpace: 'nowrap'}}>{done ? (on ? '● läuft' : 'aktiv ✓') : 'geplant'}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 646, top: 108, width: 270}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.dim, marginBottom: 14}}>ALLE STANDORTE</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10}}>
          {Array.from({length: 20}).map((_, i) => {
            const hit = t > publishAt + 0.1 + i * 0.05;
            const col = active >= 0 ? SLOT_COLORS[active] : '#2dd4ff';
            return <div key={i} style={{height: 46, borderRadius: 12, background: hit ? col : 'rgba(45,212,255,.18)', border: `2px solid ${hit ? 'rgba(255,255,255,.6)' : 'rgba(45,212,255,.4)'}`, opacity: pop(frame, appearAt + 0.4 + i * 0.03)}} />;
          })}
        </div>
        <div style={{marginTop: 20, fontSize: 24, fontWeight: 700, color: done ? '#ffd0e6' : C.dim, whiteSpace: 'nowrap'}}>{done ? `${Math.round(sent * 20)} / 20 synchron ✓` : '0 / 20'}</div>
        <div style={{marginTop: 10, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.1)', overflow: 'hidden'}}><div style={{width: `${sent * 100}%`, height: '100%', background: 'linear-gradient(90deg,#2dd4ff,#ff3d9a)'}} /></div>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 520, height: 80, borderRadius: 40, background: done ? C.green : 'linear-gradient(120deg,#2DD4FF,#7C4DFF)', color: done ? '#04241a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, letterSpacing: 1, whiteSpace: 'nowrap', transform: `scale(${press})`, boxShadow: '0 12px 30px rgba(45,212,255,.35)'}}>{done ? 'ZEITPLAN AKTIV ✓' : 'ZEITPLAN AKTIVIEREN'}</div>
      <svg width="40" height="40" viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cyv, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.5))', opacity: cm > 0 ? 1 : 0}}>
        <path d="M5 3 L5 19 L9.2 15.2 L12 21 L14.4 19.9 L11.6 14.2 L17 14 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
