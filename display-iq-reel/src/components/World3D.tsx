import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, camTransform} from '../camera';

/** CSS-3D-Welt. Kinder positionieren sich relativ zur Bildmitte (Weltursprung). */
export const World3D: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
  <AbsoluteFill style={{perspective: cam.P, perspectiveOrigin: '50% 50%', overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        transform: camTransform(cam),
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** Platziert ein Element mittig am Weltpunkt, liegend (rotateX) oder stehend. */
export const Plane: React.FC<{
  x: number; y: number; z: number; w: number; h: number;
  rotX?: number; rotY?: number; rotZ?: number; scale?: number;
  style?: React.CSSProperties; children?: React.ReactNode;
}> = ({x, y, z, w, h, rotX = 0, rotY = 0, rotZ = 0, scale = 1, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: -w / 2,
      top: -h / 2,
      width: w,
      height: h,
      backfaceVisibility: 'hidden',
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
      ...style,
    }}
  >
    {children}
  </div>
);
