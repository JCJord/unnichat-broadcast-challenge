import type { Config } from 'tailwindcss';
import { tokens } from './tokens';

export default {
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: {
        sans: [...tokens.fontFamily],
      },
    },
  },
} satisfies Config;
