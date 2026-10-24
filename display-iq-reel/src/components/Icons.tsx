import React from 'react';

type P = {size?: number; color?: string; stroke?: number};
const base = (size: number) => ({width: size, height: size, viewBox: '0 0 24 24', fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

export const IconCheck: React.FC<P> = ({size = 40, color = '#fff', stroke = 3}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const IconPlus: React.FC<P> = ({size = 40, color = '#fff', stroke = 3}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconClock: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconPin: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IconCar: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M5 16V12l2-5h10l2 5v4M3 16h18M5 16v2.5M19 16v2.5" /><circle cx="8" cy="14" r="1" fill={color} /><circle cx="16" cy="14" r="1" fill={color} /></svg>
);
export const IconCoffee: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M5 9h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v3M12 3v3" /></svg>
);
export const IconScissors: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8l12 9M8 16L20 7" /></svg>
);
export const IconDumbbell: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12" /></svg>
);
export const IconWrench: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M14.5 6.5a4 4 0 0 0 5 5l-9.2 9.2a2.1 2.1 0 0 1-3-3L16.5 8.5a4 4 0 0 0-2-2z" /></svg>
);
export const IconUsers: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M16 5.2a3.2 3.2 0 0 1 0 5.6M18 15c2 .6 3.2 2.2 3.5 5" /></svg>
);
export const IconTrend: React.FC<P> = ({size = 40, color = '#fff', stroke = 2.4}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></svg>
);
export const IconBag: React.FC<P> = ({size = 40, color = '#fff', stroke = 2}) => (
  <svg {...base(size)} stroke={color} strokeWidth={stroke}><path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0" /></svg>
);
