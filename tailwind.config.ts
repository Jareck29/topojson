import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          foreground: '#ffffff'
        },
        secondary: '#5CD3A8',
        accent: '#A855F7',
        muted: '#F3F4F6'
      },
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans]
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
