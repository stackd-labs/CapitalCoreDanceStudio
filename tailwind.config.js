/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#0d1b36',
          mid: '#1e3a6e',
        },
        brand: {
          red: '#c0392b',
        },
        surface: {
          light: '#f4f6fa',
          border: '#e0e6f0',
        },
        warm: {
          cream: '#f4ebe2',
          ivory: '#faf3eb',
          beige: '#e8dccc',
          mocha: '#a08574',
          taupe: '#9c7e6e',
          brown: '#6b4a3e',
          burgundy: '#7a3e42',
          rose: '#c9837e',
          gold: '#c9a868',
          ink: '#3d2828',
          border: '#d9c7b8',
        },
      },
      fontFamily: {
        script: ['"Allura"', 'cursive'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Anton"', '"Arial Narrow"', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
