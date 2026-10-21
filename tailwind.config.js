/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', '"SolaimanLipi"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ecg: {
          grid: 'var(--ecg-grid)',
          gridBold: 'var(--ecg-grid-bold)',
          bg: 'var(--ecg-bg)',
          trace: 'var(--ecg-trace)',
          glow: 'var(--ecg-glow)',
          cursor: 'var(--ecg-cursor)',
        }
      }
    },
  },
  plugins: [],
}
