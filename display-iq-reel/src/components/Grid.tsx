import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, cam, polyPath} from '../camera';
import {keyCam} from '../camPath';
import {C, FPS, HEIGHT, WIDTH} from '../theme';
import {Plane, World3D} from './World3D';
import {HW, TableDisplay} from './TableDisplay';
import {MenuScreen} from '../screens/MenuScreen';
import {AdScreen, EventScreen, HappyHourScreen, PartnersScreen, ScreenSwitch} from '../screens/PromoScreens';

export const GRID_FLOOR = 520;
const K = 0.46;
const TILT = 78;
const DY = -(HW.h * K * 0.5) * Math.cos((TILT * Math.PI) / 180) - 5;

export const TABLES = [
  {x: -540, z: 0},
  {x: 540, z: 0},
  {x: -540, z: -880},
  {x: 540, z: -880},
  {x: -540, z: -1760},
  {x: 540, z: -1760},
];

const CLOSE_A = cam({x: -540, y: DY, z: 106, pitch: 61, zoom: 1.64});
const CLOSE_A2 = cam({x: -540, y: DY, z: 98, pitch: 58, zoom: 1.68, yaw: -1.5});
const MID_A = cam({x: -380, y: -60, z: -80, pitch: 52, zoom: 1.25});
const OVERVIEW = cam({x: 0, y: -240, z: -640, pitch: 54, zoom: 0.62});
const OVERVIEW_B = cam({x: 0, y: -240, z: -700, pitch: 50, zoom: 0.66, yaw: 3});

export const GRID_KEYS: readonly (readonly [number, Cam])[] = [
  [33.0, CLOSE_A],
  [40.2, CLOSE_A2],
  [41.4, MID_A],
  [44.2, OVERVIEW],
  [46.5, OVERVIEW_B],
];

const FloorGrid: React.FC<{cam: Cam}> = ({cam: c}) => {
  const els: React.ReactNode[] = [];
  const Z0 = -4200;
  const Z1 = 1800;
  for (let x = -3200; x <= 3200; x += 320) {
    els.push(<path key={`x${x}`} d={polyPath([[x - 3, GRID_FLOOR, Z0], [x + 3, GRID_FLOOR, Z0], [x + 3, GRID_FLOOR, Z1], [x - 3, GRID_FLOOR, Z1]], c)} fill={x % 640 === 0 ? 'rgba(45,212,255,.22)' : 'rgba(139,92,246,.18)'} />);
  }
  for (let z = Z0; z <= Z1; z += 320) {
    els.push(<path key={`z${z}`} d={polyPath([[-3200, GRID_FLOOR, z - 3], [3200, GRID_FLOOR, z - 3], [3200, GRID_FLOOR, z + 3], [-3200, GRID_FLOOR, z + 3]], c)} fill="rgba(139,92,246,.18)" />);
  }
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="gf-bg" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#14185a" />
          <stop offset="1" stopColor="#04051a" />
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#gf-bg)" />
      {els}
    </svg>
  );
};

export const GridShot: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const c = keyCam(t, GRID_KEYS);
  const screens: React.ReactNode[] = [
    <ScreenSwitch key="a" sec={t} items={[
      {from: 0, render: (s) => <EventScreen sec={s} appearAt={32.0} />},
      {from: 33.6, render: (s) => <PartnersScreen sec={s} appearAt={33.6} highlightAt={37.6} />},
      {from: 38.1, render: (s) => <AdScreen sec={s} appearAt={38.1} />},
    ]} />,
    <HappyHourScreen key="b" sec={t + 0.6} appearAt={0} />,
    <MenuScreen key="c" sec={t} appearAt={0} preset={['mojito', 'pizza', 'nachos']} showSent={false} />,
    <EventScreen key="d" sec={t + 1.1} appearAt={0} />,
    <PartnersScreen key="e" sec={t + 6} appearAt={0} highlightAt={0} />,
    <AdScreen key="f" sec={t + 2} appearAt={0} />,
  ];
  return (
    <AbsoluteFill>
      <FloorGrid cam={c} />
      <World3D cam={c}>
        {TABLES.map((tb, i) => (
          <React.Fragment key={i}>
            <Plane x={tb.x} y={0} z={tb.z} w={880} h={640} rotX={90} style={{borderRadius: 90, background: 'linear-gradient(180deg,#1b2370 0%,#0d1248 100%)', boxShadow: `inset 0 0 0 8px ${i % 2 ? 'rgba(255,61,154,.6)' : 'rgba(45,212,255,.6)'}, 0 0 90px ${i % 2 ? 'rgba(255,61,154,.35)' : 'rgba(45,212,255,.35)'}`}} />
            <Plane x={tb.x} y={-1} z={tb.z + 24} w={HW.w * K + 120} h={HW.h * K + 100} rotX={90} style={{background: 'radial-gradient(ellipse at center,rgba(0,0,0,.6),transparent 70%)'}} />
            <Plane x={tb.x} y={DY} z={tb.z + 10} w={HW.w} h={HW.h} rotX={TILT} scale={K}>
              <TableDisplay glow={0.8} accent={i % 2 ? C.magenta : C.cyan}>{screens[i]}</TableDisplay>
            </Plane>
          </React.Fragment>
        ))}
      </World3D>
    </AbsoluteFill>
  );
};
