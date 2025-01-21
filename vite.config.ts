import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: {
      timeout: 5000,
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html', // Explicitement définir le fichier d'entrée
    },
  },
});