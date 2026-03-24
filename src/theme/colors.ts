/**
 * Waggly iOS Design System
 * Inspired by Headspace & Calm: warm, organic, calming palette
 * with generous whitespace and soft shapes.
 */

export const Colors = {
  // Core brand - warm, friendly, not corporate
  primary: '#5B5EA6',       // Soft indigo (Calm-like)
  primaryLight: '#7B7FCC',
  primaryPale: '#EDEDF7',
  primaryDark: '#44478A',

  secondary: '#E8985E',     // Warm terracotta
  secondaryLight: '#F2B886',
  secondaryPale: '#FDF2E9',

  accent: '#D4726A',        // Dusty rose
  accentPale: '#FBEAE9',

  // Nature-inspired palette (Headspace feel)
  mint: '#7EC8B0',
  mintPale: '#E8F5F0',
  sky: '#7DB8D4',
  skyPale: '#E5F1F7',
  lavender: '#A594C9',
  lavenderPale: '#EDE8F5',
  sand: '#D4C5A9',
  sandPale: '#F5F0E6',
  coral: '#E8836E',
  coralPale: '#FDE9E5',

  // Semantic
  success: '#6EAF7B',
  successPale: '#E7F4EA',
  warning: '#E5A84B',
  warningPale: '#FDF3E1',
  error: '#D4605A',
  errorPale: '#FBEAE9',

  // Surfaces - warm cream tones (not cold gray)
  background: '#FAF8F5',      // Warm cream (Calm's signature)
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F3F0EB', // Warm off-white

  // Text
  ink: '#2D2D3A',             // Soft black
  inkSecondary: '#6B6B80',
  inkTertiary: '#9D9DAF',
  inkInverse: '#FFFFFF',

  // Borders
  hairline: '#E8E4DF',
  hairlineLight: '#F0EDE8',

  // Overlay
  overlay: 'rgba(45, 45, 58, 0.4)',
  overlayLight: 'rgba(45, 45, 58, 0.08)',

  // Pet type organic colors
  dog: '#5B5EA6',
  cat: '#D4726A',
  bird: '#6EAF7B',
  rabbit: '#E8985E',
  other: '#A594C9',
};

export const Gradients = {
  // Soft, Headspace-like gradients
  primary: ['#5B5EA6', '#7B7FCC'] as const,
  warmSunset: ['#E8985E', '#D4726A'] as const,
  calmSky: ['#7DB8D4', '#5B5EA6'] as const,
  forest: ['#6EAF7B', '#7EC8B0'] as const,
  dawn: ['#F2B886', '#D4726A'] as const,
  night: ['#44478A', '#2D2D3A'] as const,
  gold: ['#E5A84B', '#E8985E'] as const,
};
