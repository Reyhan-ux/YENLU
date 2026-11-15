/** YENLU design tokens: one dark accent (ink), leaf greens, mint canvas. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        logo: ["'Bricolage Grotesque'", "'Figtree'", "'Raleway'", 'sans-serif'],
        gopher: ["'Bricolage Grotesque'", "'Figtree'", "'Raleway'", 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        african: ['Fraunces', 'Inter', 'serif'],
        serif: ['Fraunces', 'Calistoga', 'serif'],
      },
      colors: {
        ink: { DEFAULT: '#1F2421', soft: '#2D3530' },
        forest: { DEFAULT: '#184A2C', dark: '#0F331E', light: '#236940', hover: '#123821' },
        sand: { 50: '#FAF5EE', 100: '#F2ECE1', 200: '#E6DAC8', 300: '#D4C2AA' },
        volcanic: { DEFAULT: '#261B16', card: '#FAF5EE', border: '#E3D9CC', dark: '#140E0C' },
        gold: {
          light: '#F8D063',  // Option C shade (lightest)
          medium: '#F5BE27', // Option A shade (medium)
          dark: '#F4B60B',   // Option B shade (darkest / best option)
        },
        leaf: {
          50: '#F2F8F4', 100: '#E1EFE6', 200: '#C2DFCB', 300: '#97CAA7',
          400: '#58AB78', 500: '#236B43', 600: '#1B5634', 700: '#144328',
        },
        canvas: { DEFAULT: '#F4EFEA', dark: '#140E0C' },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,42,29,.04), 0 8px 24px -8px rgba(15,42,29,.10)',
        lift: '0 2px 4px rgba(15,42,29,.05), 0 18px 40px -12px rgba(15,42,29,.25)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        pop: { '0%': { opacity: 0, transform: 'scale(.97)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        sheet: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { pop: 'pop .18s ease-out', sheet: 'sheet .24s ease-out' },
    },
  },
  plugins: [],
};
