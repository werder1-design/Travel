#!/usr/bin/env node
/**
 * Vorschau: rendert einzelne Frames (oder Sekunden) als PNG nach out/stills.
 * Nutzung: node scripts/stills.mjs 1.0 3.3 8.5   (Sekunden)  |  node scripts/stills.mjs --contact (Kontaktbogen)
 */
import {existsSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out', 'stills');
mkdirSync(out, {recursive: true});
const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const compId = flags.id ?? 'DisplayIQ';
const inputProps = flags.props ? JSON.parse(flags.props) : {};
const outName = flags.name ?? 't';
const FPS = 30;
const secs = args.length ? args.map(Number) : [1, 3.2, 5.5, 8.6, 12, 16];
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

const serveUrl = await bundle({entryPoint: join(root, 'src', 'index.ts'), webpackOverride: (c) => c});
const comp = await selectComposition({serveUrl, id: compId, inputProps, browserExecutable});
for (const s of secs) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(s * FPS));
  const file = join(out, `${outName}${String(s).replace('.', '_')}.png`);
  await renderStill({composition: comp, serveUrl, inputProps, output: file, frame, browserExecutable: existsSync(browserExecutable) ? browserExecutable : undefined, imageFormat: 'png'});
  console.log('still', s, '->', file);
}
