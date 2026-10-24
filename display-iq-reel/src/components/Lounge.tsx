import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, cam} from '../camera';
import {keyCam} from '../camPath';
import {C, FPS} from '../theme';
import {Alley} from './Alley';
import {SeatedPerson, SKIN} from './People';
import {TableDisplay, HW} from './TableDisplay';
import {Plane, World3D} from './World3D';
import {MENU1_TAPS, MENU2_TAPS, HAPPY_TAP_AT} from '../data/interactions';
import {MenuScreen, menuTarget} from '../screens/MenuScreen';
import {AdScreen, EventScreen, HappyHourScreen, HAPPY_CTA, WelcomeScreen, ScreenSwitch} from '../screens/PromoScreens';
import {TouchLayer} from './TouchHand';

export const LOUNGE_FLOOR = 640;
export const DISPLAY_K = 0.5;
const TILT = 78;
const DISPLAY_Z = 170;
const DISPLAY_Y = -(HW.h * DISPLAY_K * 0.5) * Math.cos((TILT * Math.PI) / 180) - 5;

const WIDE = cam({x: 0, y: -60, z: -40, pitch: 14, zoom: 0.92});
const WIDE_B = cam({x: 30, y: -70, z: -30, pitch: 15, zoom: 0.96});
const MID = cam({x: 0, y: -20, z: 60, pitch: 32, zoom: 1.2});
const CLOSE = cam({x: 0, y: DISPLAY_Y, z: DISPLAY_Z + 96, pitch: 61, zoom: 1.56});
const CLOSE_B = cam({x: 0, y: DISPLAY_Y, z: DISPLAY_Z + 88, pitch: 58, zoom: 1.6, yaw: -1.5});
const CLOSE_C = cam({x: 0, y: DISPLAY_Y, z: DISPLAY_Z + 104, pitch: 63, zoom: 1.54, yaw: 1.5});

export const LOUNGE_KEYS: readonly (readonly [number, Cam])[] = [
  [7.7, MID],
  [8.75, CLOSE],
  [10.3, CLOSE_B],
  [12.2, WIDE],
  [13.9, WIDE_B],
  [15.4, CLOSE],
  [22.5, CLOSE_B],
  [24.2, CLOSE_C],
  [29.5, CLOSE_B],
  [33.1, CLOSE],
  [46.4, CLOSE_B],
  [50.9, CLOSE_C],
];

const FRIENDS = [
  {x: -570, skin: SKIN[0], hair: '#2B1E1A', hairStyle: 'short' as const, shirt: '#2DD4FF', phase: 0, beard: false, glasses: false},
  {x: -190, skin: SKIN[2], hair: '#171717', hairStyle: 'long' as const, shirt: '#FF3D9A', phase: 1.3, beard: false, glasses: true},
  {x: 190, skin: SKIN[1], hair: '#5B3A24', hairStyle: 'cap' as const, shirt: '#FFB627', phase: 2.1, beard: true, glasses: false},
  {x: 570, skin: SKIN[4], hair: '#8A4B2A', hairStyle: 'bun' as const, shirt: '#8B5CF6', phase: 0.7, beard: false, glasses: false},
];

export const LoungeShot: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const c = keyCam(t, LOUNGE_KEYS);
  const focus = Math.min(1, Math.max(0, (c.pitch - 26) / 18));
  const cheer = t > 20.5 && t < 22.6 ? 'cheer' : t > 30.6 && t < 33 ? 'laugh' : 'laugh';

  const screenItems = [
    {from: 0, render: (s: number) => <WelcomeScreen sec={s} appearAt={7.7} />},
    {from: 14.45, render: (s: number) => <MenuScreen sec={s} appearAt={14.45} taps={MENU1_TAPS} />},
    {from: 23.0, render: (s: number) => <MenuScreen sec={s} appearAt={22.0} />},
    {from: 25.3, render: (s: number) => <HappyHourScreen sec={s} appearAt={25.3} />},
    {from: 28.1, render: (s: number) => <EventScreen sec={s} appearAt={28.1} />},
    {from: 29.8, render: (s: number) => <HappyHourScreen sec={s} appearAt={29.8} tapAt={HAPPY_TAP_AT} />},
    {from: 45.5, render: (s: number) => <MenuScreen sec={s} appearAt={45.5} taps={MENU2_TAPS} />},
  ];
  const handGroups = [
    MENU1_TAPS.map((x) => ({...menuTarget(x.id), at: x.at})),
    [{...HAPPY_CTA, at: HAPPY_TAP_AT}],
    MENU2_TAPS.map((x) => ({...menuTarget(x.id), at: x.at})),
  ];

  return (
    <AbsoluteFill>
      <Alley cam={c} sec={t} floorY={LOUNGE_FLOOR} ceilY={-1000} tables={false} glow={0.9} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%,#0b1038,#04051a)', opacity: focus}} />
      <World3D cam={c}>
        {/* Sitzbank-Rückwand */}
        <Plane x={0} y={-330} z={-700} w={2300} h={760} style={{opacity: 1 - focus, borderRadius: 60, background: 'linear-gradient(180deg,#1b1556,#0c0f33)', boxShadow: `inset 0 0 0 4px rgba(139,92,246,.35), 0 0 120px rgba(139,92,246,.25)`}} />
        <Plane x={0} y={-690} z={-698} w={2300} h={14} style={{opacity: 1 - focus, background: C.magenta, boxShadow: `0 0 50px 14px ${C.magenta}`}} />
        {/* Freunde */}
        {FRIENDS.map((f, i) => (
          <Plane key={i} x={f.x} y={-264 + 2 - (i % 2 ? 14 : 0)} z={-560 + (i % 2) * 20} w={360} h={528} rotX={c.pitch} style={{transformOrigin: '50% 100%', opacity: 1 - focus}}>
            <SeatedPerson skin={f.skin} hair={f.hair} hairStyle={f.hairStyle} shirt={f.shirt} pose={i === 0 || i === 3 ? (cheer === 'cheer' ? 'cheer' : 'laugh') : cheer === 'cheer' ? 'cheer' : 'idle'} frame={frame} phase={f.phase} beard={f.beard} glasses={f.glasses} />
          </Plane>
        ))}
        {/* Tisch */}
        <Plane x={0} y={0} z={0} w={2200} h={1500} rotX={90} style={{borderRadius: 90, background: 'linear-gradient(180deg,#1b2370 0%,#0f1550 55%,#0a0e38 100%)', boxShadow: `inset 0 0 0 8px rgba(45,212,255,.55), inset 0 0 140px rgba(45,212,255,.12)`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 70, background: 'linear-gradient(115deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 32%)'}} />
        </Plane>
        <Plane x={0} y={320} z={750} w={2200} h={640} style={{background: 'linear-gradient(180deg,#0b0f3a,#04051a)'}} />
        {[-640, -230, 230, 640].map((cx, i) => (
          <Plane key={i} x={cx} y={-1} z={330 + (i % 2) * 40} w={150} h={150} rotX={90} style={{borderRadius: '50%', border: `5px solid ${i % 2 ? 'rgba(255,61,154,.7)' : 'rgba(45,212,255,.7)'}`, boxShadow: `0 0 30px ${i % 2 ? 'rgba(255,61,154,.5)' : 'rgba(45,212,255,.5)'}`, background: 'radial-gradient(circle,rgba(255,255,255,.08),transparent 70%)'}} />
        ))}
        {/* Kontaktschatten + Display */}
        <Plane x={0} y={-1} z={DISPLAY_Z + 30} w={HW.w * DISPLAY_K + 160} h={HW.h * DISPLAY_K + 120} rotX={90} style={{background: 'radial-gradient(ellipse at center,rgba(0,0,0,.65),transparent 70%)'}} />
        <Plane x={0} y={DISPLAY_Y} z={DISPLAY_Z} w={HW.w} h={HW.h} rotX={TILT} scale={DISPLAY_K}>
          <TableDisplay glow={0.9} overlay={handGroups.map((g, i) => <TouchLayer key={i} taps={g} sec={t} />)}>
            <ScreenSwitch sec={t} items={screenItems} />
          </TableDisplay>
        </Plane>
      </World3D>
    </AbsoluteFill>
  );
};
