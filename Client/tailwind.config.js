/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens matching the 2026-ready dark theme specification
        bg: '#0B0D10',
        surface: '#0F131A',
        muted: '#161B22',
        border: '#222833',
        text: {
          primary: '#E6EAF2',
          secondary: '#A9B1C3',
          muted: '#7C8799',
        },
        brand: {
          DEFAULT: '#3AE6FF',
          600: '#14C2DF',
          700: '#0FA1BC',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#F05252',
        
        // Additional semantic colors for better component support
        background: {
          DEFAULT: '#0B0D10',
          secondary: '#0F131A',
          tertiary: '#161B22',
        },
        foreground: {
          DEFAULT: '#E6EAF2',
          secondary: '#A9B1C3',
          muted: '#7C8799',
        },
        primary: {
          DEFAULT: '#3AE6FF',
          foreground: '#0B0D10',
          50: '#F0FDFF',
          100: '#CCFBFF',
          200: '#99F6FF',
          300: '#66F0FF',
          400: '#3AE6FF',
          500: '#14C2DF',
          600: '#0FA1BC',
          700: '#0B8199',
          800: '#086176',
          900: '#054153',
        },
        secondary: {
          DEFAULT: '#A9B1C3',
          foreground: '#0B0D10',
        },
        destructive: {
          DEFAULT: '#F05252',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#161B22',
          foreground: '#7C8799',
        },
        accent: {
          DEFAULT: '#222833',
          foreground: '#E6EAF2',
        },
        popover: {
          DEFAULT: '#0F131A',
          foreground: '#E6EAF2',
        },
        card: {
          DEFAULT: '#0F131A',
          foreground: '#E6EAF2',
        },
        input: '#161B22',
        ring: '#3AE6FF',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.35), 0 10px 20px -2px rgba(0, 0, 0, 0.35)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.35), 0 20px 40px -2px rgba(0, 0, 0, 0.35)',
        'glow': '0 0 20px rgba(58, 230, 255, 0.15)',
        'glow-lg': '0 0 40px rgba(58, 230, 255, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDuration: {
        '120': '120ms',
        '160': '160ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
