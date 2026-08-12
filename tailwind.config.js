/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── 2026-08-11 redesign tokens ────────────────────────────────────────
        // From the studio's "Capital Core Site" mockups. `core` is the accent set —
        // five brand accents (red/orange/gold/teal/pink) that appear together as the
        // signature stripe, plus purple and green which are page accents only and
        // never appear in the stripe. `ink` is the navy field, `mist` the text ramp
        // on top of it. The older navy/brand/surface/warm groups below are still in
        // use by pages not yet converted — do not delete them until the last page is.
        core: {
          red: '#e01b22',
          orange: '#ff8c2b',
          gold: '#f5c518',
          teal: '#2ed3c8',
          pink: '#ff54a8',
          purple: '#9b3df0',
          green: '#3ad46f',
        },
        ink: {
          base: '#0d1b34', // page field
          deep: '#0a1529', // alternating band + footer
          panel: '#101d38', // cards, photo wells
        },
        mist: {
          100: '#d3ddec', // body copy on navy
          200: '#c4d1e4', // nav idle, default text
          300: '#c0cddf',
          400: '#a9b8cf', // secondary copy
          500: '#8fa5c6', // labels, meta
          600: '#7f9bc4', // logo subtitle
        },
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
        // Body face for the 2026-08-11 redesign. Pages not yet converted still
        // inherit Inter from the `body` rule in index.css.
        body: ['"Barlow"', 'Inter', 'system-ui', 'sans-serif'],
        condensed: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
