import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FONTS = [
  {family: 'Anton', file: 'fonts/anton.woff2', weight: '400', style: 'normal'},
  {family: 'Playfair Display', file: 'fonts/playfair-bolditalic.woff2', weight: '700', style: 'italic'},
] as const;

/** Lädt die lokalen Schriften, bevor ein Frame gerendert wird (Anton für Headlines, Playfair kursiv für Akzente). */
export const Fonts: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FONTS.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {weight: f.weight, style: f.style});
        await face.load();
        (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
      }),
    )
      .catch((e) => console.error('Font-Fehler', e))
      .finally(() => continueRender(handle));
  }, [handle]);
  return null;
};
