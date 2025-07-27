import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is required for Electron to work with Vite
  base: './',
  build: {
    // Specifies the output directory for the built renderer process code
    outDir: 'dist/renderer',
  },
});
