import type { Config } from 'tailwindcss'

export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.tsx',
    './resources/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        // Core dark backgrounds
        void:     '#0a0a0a',
        onyx:     '#111111',
        charcoal: '#1a1a1a',
        graphite: '#252525',
        // Metallic copper/orange accent system
        copper: {
          300: '#e8a87c',
          400: '#cd7f32',
          500: '#b87333',
          600: '#9a5f1e',
          700: '#7a4a14',
        },
        // Warm neutrals
        bone:   '#e8e0d5',
        ash:    '#9ca3af',
        steel:  '#6b7280',
        // Semantic
        surface:   '#161616',
        border:    '#2a2a2a',
        'border-subtle': '#1f1f1f',
      },
      fontFamily: {
        sans:    ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem',  { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl':  ['8rem',   { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter:  '-0.04em',
        tight:    '-0.02em',
        widest:   '0.3em',
        ultra:    '0.5em',
      },
      animation: {
        'spin-slow':   'spin 8s linear infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'grain':       'grain 8s steps(1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':  { transform: 'translate(-5%, -10%)' },
          '20%':  { transform: 'translate(-15%, 5%)' },
          '30%':  { transform: 'translate(7%, -25%)' },
          '40%':  { transform: 'translate(-5%, 25%)' },
          '50%':  { transform: 'translate(-15%, 10%)' },
          '60%':  { transform: 'translate(15%, 0%)' },
          '70%':  { transform: 'translate(0%, 15%)' },
          '80%':  { transform: 'translate(3%, 35%)' },
          '90%':  { transform: 'translate(-10%, 10%)' },
        },
      },
      backgroundImage: {
        'copper-gradient': 'linear-gradient(135deg, #cd7f32 0%, #e8a87c 50%, #b87333 100%)',
        'dark-gradient':   'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        'radial-copper':   'radial-gradient(ellipse at center, rgba(205,127,50,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'copper':     '0 0 30px rgba(205,127,50,0.3)',
        'copper-lg':  '0 0 60px rgba(205,127,50,0.2)',
        'inner-dark': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass':      '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
