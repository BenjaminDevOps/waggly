export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 36, huge: 48, massive: 64,
};

export const Radius = {
  sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, pill: 999,
};

export const Font = {
  xs: 11, sm: 13, body: 15, bodyLarge: 17, title3: 20, title2: 22, title1: 28, largeTitle: 34, hero: 48,
};

export const Weight = {
  regular: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const, heavy: '800' as const,
};

export const Shadow = {
  soft: '0 4px 12px rgba(45, 45, 58, 0.06)',
  medium: '0 8px 24px rgba(45, 45, 58, 0.1)',
  strong: '0 12px 32px rgba(45, 45, 58, 0.16)',
  elevated: '0 16px 40px rgba(45, 45, 58, 0.2)',
  glow: (color: string) => `0 6px 16px ${color}40`,
};

export const Transition = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '400ms ease',
  spring: '350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};
