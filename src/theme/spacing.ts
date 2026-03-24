/**
 * Waggly iOS Spacing & Typography
 * Generous whitespace like Headspace/Calm.
 * SF Pro Rounded feel via system font weight.
 */

import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Generous spacing inspired by Calm
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
  huge: 48,
  massive: 64,
};

// Large rounded radii - organic, friendly
export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
};

// SF Pro inspired sizes - large and readable
export const Font = {
  xs: 11,
  sm: 13,
  body: 15,
  bodyLarge: 17,
  title3: 20,
  title2: 22,
  title1: 28,
  largeTitle: 34,
  hero: 48,
};

// iOS system font weights
export const Weight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Screen = { width, height };
export const isIOS = Platform.OS === 'ios';

// iOS safe shadow
export const Shadow = {
  soft: {
    shadowColor: '#2D2D3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#2D2D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  }),
};
