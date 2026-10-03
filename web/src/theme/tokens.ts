export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#00ffe9',
      hover: '#00e5d2',
      active: '#00ccbb',
      contrast: '#030404',
    },
    dark: {
      bg: '#050707',
      surface: '#0d1212',
      elevated: '#141c1c',
      border: '#1f2929',
      'border-light': '#2c3a3a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    status: {
      scheduled: '#00ffe9',
      sent: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
  },
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ],
} as const;
