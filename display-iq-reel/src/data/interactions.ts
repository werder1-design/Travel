import type {MenuTap} from '../screens/MenuScreen';

/** Tap-Zeitpunkte (Sekunden), synchron zum Voice-over. */
export const MENU1_TAPS: MenuTap[] = [
  {id: 'mojito', at: 17.8},   // „Getränke“
  {id: 'pils', at: 18.25},
  {id: 'nachos', at: 18.8},   // „Snacks“
  {id: 'order', at: 20.22},   // „Fingertipp“
];

export const HAPPY_TAP_AT = 30.5; // „… zusätzliche Bestellungen“

export const MENU2_TAPS: MenuTap[] = [
  {id: 'mojito', at: 48.2},   // „auswählen“
  {id: 'mojito', at: 48.5},
  {id: 'pils', at: 48.82},
  {id: 'order', at: 49.35},   // „bestellen“
];
