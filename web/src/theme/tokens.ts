/**
 * Single Source of Truth for Design Tokens
 * Shared across Tailwind CSS and Material UI Theme
 */
export const tokens = {
  colors: {
    primary: {
      main: '#00ffe9',
      hover: '#00e5d2',
      active: '#00ccbb',
      glow: 'rgba(0, 255, 233, 0.25)',
      contrastText: '#030404',
      subtle: 'rgba(0, 255, 233, 0.10)',
      border: 'rgba(0, 255, 233, 0.25)',
    },
    dark: {
      bg: '#050707',
      surface: '#0d1212',
      elevated: '#141c1c',
      card: '#0f1515',
      border: '#1f2929',
      borderLight: '#2c3a3a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      muted: '#64748b',
      disabled: '#475569',
    },
    status: {
      scheduled: {
        main: '#00ffe9',
        bg: 'rgba(0, 255, 233, 0.12)',
        border: 'rgba(0, 255, 233, 0.3)',
      },
      sent: {
        main: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      },
      error: {
        main: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.3)',
      },
      warning: {
        main: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)',
      },
    },
  },
} as const;
