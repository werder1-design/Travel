import React from 'react';

export type FoodKind = 'mojito' | 'sunset' | 'beer' | 'pizza' | 'nachos';

const Mojito: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="mj-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9BFFD6" />
        <stop offset="1" stopColor="#14B58A" />
      </linearGradient>
      <clipPath id="mj-c">
        <path d="M62 44H138L128 178Q127 186 118 186H82Q73 186 72 178Z" />
      </clipPath>
    </defs>
    <g transform="rotate(-6 100 110)">
      <path d="M62 44H138L128 178Q127 186 118 186H82Q73 186 72 178Z" fill="rgba(255,255,255,.12)" />
      <g clipPath="url(#mj-c)">
        <rect x="50" y="64" width="100" height="130" fill="url(#mj-l)" />
        {[[84, 90, 12], [112, 104, -8], [92, 130, 6], [118, 146, -14], [88, 160, 20]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width="26" height="26" rx="6" fill="rgba(255,255,255,.38)" transform={`rotate(${r} ${x + 13} ${y + 13})`} />
        ))}
        <path d="M50 64Q100 54 150 64V78Q100 68 50 78Z" fill="rgba(255,255,255,.35)" />
      </g>
      <path d="M62 44H138L128 178Q127 186 118 186H82Q73 186 72 178Z" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="3" />
      <path d="M72 52L80 172" stroke="rgba(255,255,255,.5)" strokeWidth="5" strokeLinecap="round" />
      {/* Minze */}
      {[[84, 40, -30], [104, 32, 10], [122, 42, 40], [96, 46, -8]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="14" ry="8" fill={i % 2 ? '#37D67A' : '#22B866'} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {/* Strohhalm */}
      <path d="M116 30L128 150" stroke="#FF3D9A" strokeWidth="9" strokeLinecap="round" />
      <path d="M116 30L128 150" stroke="#fff" strokeWidth="9" strokeLinecap="butt" strokeDasharray="8 16" />
      {/* Limette */}
      <g transform="translate(140 52)">
        <circle r="22" fill="#9BE564" />
        <circle r="17" fill="#D8F7A0" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d="M0 0L0 -15" stroke="#9BE564" strokeWidth="3" transform={`rotate(${a})`} />
        ))}
      </g>
    </g>
  </svg>
);

const Sunset: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="ss-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFC13D" />
        <stop offset="0.55" stopColor="#FF6A3D" />
        <stop offset="1" stopColor="#FF3D9A" />
      </linearGradient>
      <clipPath id="ss-c">
        <path d="M34 54H166L108 120V160H92V120Z" />
      </clipPath>
    </defs>
    <path d="M34 54H166L108 120V160H92V120Z" fill="rgba(255,255,255,.12)" />
    <g clipPath="url(#ss-c)">
      <rect x="30" y="70" width="140" height="70" fill="url(#ss-l)" />
      <path d="M30 70Q100 60 170 70V80Q100 70 30 80Z" fill="rgba(255,255,255,.3)" />
    </g>
    <path d="M34 54H166L108 120V160H92V120Z" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M62 150Q100 166 138 150" fill="none" stroke="rgba(255,255,255,.0)" />
    <rect x="66" y="162" width="68" height="8" rx="4" fill="rgba(255,255,255,.6)" />
    <path d="M44 62L88 104" stroke="rgba(255,255,255,.45)" strokeWidth="5" strokeLinecap="round" />
    <g transform="translate(150 52)">
      <circle r="21" fill="#FF9F1C" />
      <circle r="16" fill="#FFD27A" />
      {[0, 45, 90, 135].map((a) => (
        <path key={a} d="M0 -16V16" stroke="#FF9F1C" strokeWidth="3" transform={`rotate(${a})`} />
      ))}
    </g>
    <path d="M118 26L96 96" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".85" />
    <circle cx="118" cy="26" r="9" fill="#E11D48" />
  </svg>
);

const Beer: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="br-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFD35A" />
        <stop offset="1" stopColor="#E88400" />
      </linearGradient>
    </defs>
    <path d="M140 74H168Q184 74 184 92V126Q184 144 168 144H140" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="12" strokeLinecap="round" />
    <rect x="46" y="52" width="100" height="134" rx="14" fill="rgba(255,255,255,.14)" />
    <rect x="50" y="64" width="92" height="118" rx="10" fill="url(#br-l)" />
    {[[70, 150], [96, 130], [118, 156], [82, 110], [112, 100]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill="rgba(255,255,255,.45)" />
    ))}
    <path d="M60 70V176" stroke="rgba(255,255,255,.5)" strokeWidth="6" strokeLinecap="round" />
    <g fill="#fff">
      <circle cx="62" cy="52" r="20" />
      <circle cx="88" cy="42" r="24" />
      <circle cx="116" cy="46" r="22" />
      <circle cx="136" cy="56" r="14" />
      <rect x="48" y="52" width="96" height="16" rx="8" />
    </g>
    <path d="M70 40Q86 28 104 36" fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Pizza: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <radialGradient id="pz-ch" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#FFE27A" />
        <stop offset="1" stopColor="#F5A524" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="104" r="92" fill="rgba(0,0,0,.25)" />
    <circle cx="100" cy="100" r="90" fill="#E0A056" />
    <circle cx="100" cy="100" r="80" fill="#D6402B" />
    <circle cx="100" cy="100" r="76" fill="url(#pz-ch)" />
    {[[70, 70], [118, 66], [138, 106], [104, 128], [64, 118], [96, 96], [150, 76], [78, 150], [128, 148]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="13" fill="#B3262E" />
        <circle cx={x - 3} cy={y - 3} r="4" fill="#D94452" opacity=".8" />
      </g>
    ))}
    {[[88, 58, 20], [140, 128, -30], [60, 96, 60], [112, 84, 10]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="#2FB45A" transform={`rotate(${r} ${x} ${y})`} />
    ))}
    {[0, 45, 90, 135].map((a) => (
      <path key={a} d="M100 14V186" stroke="rgba(150,70,20,.55)" strokeWidth="2.5" transform={`rotate(${a} 100 100)`} />
    ))}
  </svg>
);

const Nachos: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="nc-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFD560" />
        <stop offset="1" stopColor="#F29A1F" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="150" rx="88" ry="30" fill="rgba(0,0,0,.28)" />
    <ellipse cx="100" cy="140" rx="86" ry="30" fill="#2B3262" />
    <ellipse cx="100" cy="134" rx="80" ry="26" fill="#3A4380" />
    {[[40, 120, -30], [160, 118, 24], [70, 96, 12], [130, 94, -18], [100, 80, 4], [58, 128, 50], [142, 130, -44]].map(([x, y, r], i) => (
      <path key={i} d="M-26 18L0 -28L26 18Z" fill="url(#nc-c)" stroke="#D9821A" strokeWidth="2" strokeLinejoin="round" transform={`translate(${x} ${y}) rotate(${r})`} />
    ))}
    <path d="M52 104Q72 96 92 106T132 100Q150 108 156 122Q130 130 100 128T48 122Z" fill="#FFB020" opacity=".92" />
    <path d="M70 108V122M104 106V132M128 106V120" stroke="#FFB020" strokeWidth="9" strokeLinecap="round" />
    {[[78, 106], [112, 100], [130, 116], [60, 118]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="7" fill="#43C462" stroke="#2A8C42" strokeWidth="2" />
    ))}
    <circle cx="96" cy="90" r="9" fill="#E24B3B" />
  </svg>
);

export const FoodIcon: React.FC<{kind: FoodKind; size?: number}> = ({kind, size = 160}) => (
  <div style={{width: size, height: size}}>
    {kind === 'mojito' && <Mojito />}
    {kind === 'sunset' && <Sunset />}
    {kind === 'beer' && <Beer />}
    {kind === 'pizza' && <Pizza />}
    {kind === 'nachos' && <Nachos />}
  </div>
);
