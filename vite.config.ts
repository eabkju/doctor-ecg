import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // enables easy hosting on GitHub Pages, Netlify, Vercel, or custom subpaths
  server: {
    port: 3000,
    host: true
  }
});
