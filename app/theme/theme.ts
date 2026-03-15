export const theme = {
  colors: {
    black: '#0a0a0a',
    darkGray: '#1a1a1a',
    gray: '#2d2d2d',
    white: '#ffffff',
    gradientStart: '#e63946',
    gradientEnd: '#ff6b6b',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 12,
    lg: 24,
    pill: 9999,
  },
  shadow: {
    glow: '0 0 20px rgba(230, 57, 70, 0.3)',
    button: '0 6px 20px rgba(0, 0, 0, 0.4)',
  },
} as const;

export type Theme = typeof theme;
