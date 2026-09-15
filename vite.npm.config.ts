import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const BROWSER_ONLY = ['chart.js', 'chart.js/auto', 'twitter-widgets'] as const;

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  css: {
    modules: {
      generateScopedName: 'mw__[local]'
    }
  },
  build: {
    outDir: 'dist/npm',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/react.tsx'),
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
      cssFileName: 'widget'
    },
    rollupOptions: {
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/, ...BROWSER_ONLY],
      output: {
        assetFileNames: assetInfo =>
          assetInfo.names?.[0]?.endsWith('.css')
            ? 'widget.css'
            : 'assets/[name][extname]'
      }
    }
  }
});
