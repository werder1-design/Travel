import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');

// In Sandbox-/CI-Umgebungen ist oft schon ein Chromium vorinstalliert.
const preinstalled =
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (existsSync(preinstalled)) {
  Config.setBrowserExecutable(preinstalled);
}
