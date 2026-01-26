import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/BBMAP/' : '/',
  server: {
    open: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
