// src/theme/tokens.ts
export const colors = {
  background: '#ffffffff',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F4F7',
  border: '#E5E7EB',
  text: '#000000ff',
  muted: '#6B7280',
  success: '#16A34A',
  danger: '#EF4444',
  primaryStart: '#04BF7B',
  primaryEnd:   '#0396A6',
  primaryTextOn: '#FFFFFF',
};
export const gradients = {
  primary: {
    colors: [colors.primaryStart, colors.primaryEnd] as const,
    start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
  },
};
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };
export const spacing = { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
