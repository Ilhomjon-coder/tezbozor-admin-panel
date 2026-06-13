import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite (no SSR — admin panel is a static SPA served behind auth).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
