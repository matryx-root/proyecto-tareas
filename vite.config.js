import { defineConfig } from 'vite'; // Asegúrate de importar defineConfig
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html', // Cambia esto si usas otro archivo de entrada
      external: ["bootstrap"], // Excluye Bootstrap si se usa desde un CDN
    },
  },
  publicDir: 'public',
  base: './', // Asegura rutas relativas en producción
});
