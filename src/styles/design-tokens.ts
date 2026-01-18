// Quantaureum Design System - Based on UI UX Pro Max
// Style: Glassmorphism + Dark Mode (OLED)
// Typography: Space Grotesk (headings) + DM Sans (body)

export const colors = {
  // Primary palette - Fintech/Crypto
  primary: '#F59E0B', // Gold - trust, value
  primaryLight: '#FBBF24', // Light gold
  primaryDark: '#D97706', // Dark gold

  // Secondary/CTA
  secondary: '#8B5CF6', // Purple - innovation
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',

  // Accent colors
  accent: {
    cyan: '#06B6D4',
    green: '#10B981',
    red: '#EF4444',
    orange: '#F97316',
  },

  // Background - Dark Mode OLED
  background: {
    primary: '#0F172A', // Deep blue-black
    secondary: '#1E293B', // Slightly lighter
    tertiary: '#334155', // Card backgrounds
    elevated: '#0F172A',
  },

  // Glass effect backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.08)',
    heavy: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
  },

  // Text colors
  text: {
    primary: '#F8FAFC', // White
    secondary: '#CBD5E1', // Light gray
    muted: '#64748B', // Muted gray
    disabled: '#475569',
  },

  // Border colors
  border: {
    default: '#334155',
    light: 'rgba(255, 255, 255, 0.1)',
    focus: '#8B5CF6',
  },

  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
  },
};

export const typography = {
  fontFamily: {
    heading: "'Space Grotesk', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: {
    primary: '0 0 20px rgba(245, 158, 11, 0.3)',
    secondary: '0 0 20px rgba(139, 92, 246, 0.3)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.3)',
  },
};

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
};

// Glass card styles
export const glassCard = {
  background: colors.glass.light,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${colors.glass.border}`,
  borderRadius: borderRadius.xl,
};

// Gradient definitions
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`,
  background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
  card: `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)`,
};

// Google Fonts import
export const fontsImport = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;
