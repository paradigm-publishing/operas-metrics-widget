import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Embed bundle: a single IIFE script that publishers drop onto a page via
// <script src="widget.js"></script>. React is aliased to Preact to shave ~45
// KiB off every page load. The npm package config lives in vite.npm.config.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  css: {
    modules: {
      generateScopedName: 'mw__[local]'
    }
  },
  build: {
    outDir: 'dist',
    // Keep dist/index.html and dist/images/ in place across builds — both are
    // committed fixtures used as the CDN demo page.
    emptyOutDir: false,
    // IIFE can't split chunks anyway. The previous webpack setup emitted lazy
    // chunks for chart.js/auto + twitter-widgets; both are now inlined,
    // trading a slightly larger initial payload for one network request.
    codeSplitting: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/entry.tsx'),
      formats: ['iife'],
      name: 'operaswidget',
      fileName: () => 'widget.js',
      cssFileName: 'widget'
    },
    rollupOptions: {
      output: {
        // The consumer loader sets window.operaswidget = { eventQueue, ready }
        // before our script runs. `extend: true` makes the IIFE attach to that
        // global instead of clobbering it.
        extend: true,
        assetFileNames: assetInfo =>
          assetInfo.names?.[0]?.endsWith('.css')
            ? 'widget.css'
            : 'assets/[name][extname]'
      }
    }
  }
});
