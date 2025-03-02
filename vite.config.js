import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'assets/',
    rollupOptions: {
      input: "src/js/app.js",
      output: {
        assetFileNames: '[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
    hmr: false,
    watch: {
      usePolling: true,
      ignored: ['!**/*.liquid'], // Watch .liquid files
    },
  },
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
});
