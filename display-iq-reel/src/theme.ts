export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
/** Voice-over läuft bis 60,5 s, danach hält die Endcard. */
export const DURATION_SEC = 62;
export const DURATION = DURATION_SEC * FPS;

export const sec = (s: number) => Math.round(s * FPS);

export const C = {
  bg: '#05071a',
  bg2: '#0b1030',
  panel: '#121839',
  panel2: '#1a2150',
  ink: '#F5F7FF',
  dim: '#9CA6D0',
  cyan: '#2DD4FF',
  violet: '#8B5CF6',
  magenta: '#FF3D9A',
  amber: '#FFB627',
  green: '#34E3A0',
  red: '#FF4D5E',
};

export const FONT =
  'Inter, "Inter Display", "Helvetica Neue", Arial, sans-serif';

/**
 * Instagram-Sicherheitszonen (1080×1920): oben ~14 %, unten ~22 % werden von der UI verdeckt.
 */
export const SAFE = {top: 270, bottom: 1500, side: 60};
export const SUBTITLE_BOTTOM = 1470; // Unterkante der Untertitel (≈ 450 px Abstand zum unteren Rand)
