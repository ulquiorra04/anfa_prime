/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./pages/**/*.{js,ts,jsx,tsx}", 
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {

        // ─── Page backgrounds ───────────────────────────────
        'page-bg':        '#f4f9fd', // light page background
        'page-bg-dark':   '#0a1520', // dark page background

        // ─── Card / surface ─────────────────────────────────
        'card-bg':        '#0d1e2d', // dark card background
        'card-border':    '#ccdfe9', // light card border
        'card-border-dark': '#1a2d3e', // dark card border

        // ─── Primary brand (blue) ────────────────────────────
        'brand':          '#2a7db5', // primary blue — buttons, accents, focus ring
        'brand-light':    '#56b4e9', // brand gradient end / icon highlight
        'brand-bg':       '#eaf4fb', // light hover / icon bg (light mode)
        'brand-bg-dark':  '#0d2233', // icon bg (dark mode)
        'brand-border':   '#b3d6ed', // icon border (light mode)
        'brand-border-dark': '#1a3a52', // icon border (dark mode)

        // ─── Text ────────────────────────────────────────────
        'text-heading':   '#0d2233', // main headings (light)
        'text-heading-dark': '#ddeef7', // main headings (dark)
        'text-muted':     '#5c85a0', // muted / secondary text (light)
        'text-muted-dark': '#7a9baf', // muted / secondary text (dark)

        // ─── Button / item row ───────────────────────────────
        'row-bg':         '#f8fbfd', // item button background (light)
        'row-border':     '#e2edf5', // item button border (light)
        'row-bg-dark':    '#0d1a26', // item button background (dark)
        'row-hover-bg':   '#eef6fc', // item button hover bg (light)
        'row-hover-bg-dark': '#0f2235', // item button hover bg (dark)
        'row-pressed-bg': '#e4f1f9', // item button pressed bg (light)
        'row-pressed-bg-dark': '#0c1e30', // item button pressed bg (dark)

        // ─── Divider ─────────────────────────────────────────
        'divider':        '#dde8f0', // horizontal rule (light)

        // ─── Skeleton ────────────────────────────────────────
        'skeleton':       '#e6f0f8', // skeleton loader (light)
        'skeleton-dark':  '#0e1e2d', // skeleton loader (dark)

        // ─── Back button ─────────────────────────────────────
        'back-btn-bg-dark': '#0d1a26', // back button dark hover bg

        // ─── Accent palette (card gradients & icons) ─────────
        'accent-orange':        '#e07b39',
        'accent-orange-light':  '#f5b87a',
        'accent-orange-bg':     '#fdf3eb',
        'accent-orange-bg-dark':'#2a1500',
        'accent-orange-border': '#f0c89a',
        'accent-orange-border-dark': '#4a2800',

        'accent-green':         '#3aaa7e',
        'accent-green-light':   '#74d4ab',
        'accent-green-bg':      '#eaf7f2',
        'accent-green-bg-dark': '#001f12',
        'accent-green-border':  '#a3dfc6',
        'accent-green-border-dark': '#0a3d24',

        'accent-purple':        '#9b59b6',
        'accent-purple-light':  '#c39bd3',
        'accent-purple-bg':     '#f5edfb',
        'accent-purple-bg-dark':'#1a0028',
        'accent-purple-border': '#d7b8eb',
        'accent-purple-border-dark': '#3a0060',

        'accent-red':           '#e74c3c',
        'accent-red-light':     '#f1948a',
        'accent-red-bg':        '#fdf0ef',
        'accent-red-bg-dark':   '#2a0000',
        'accent-red-border':    '#f5b7b1',
        'accent-red-border-dark': '#5a0000',
      },
    },
  },
  plugins: [],
}
