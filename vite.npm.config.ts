import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// npm package bundle: CJS output with React kept external as a peer dep, so
// consumers bring their own. Matches the previous webpack.npm.config.js shape
// (commonjs2 + react/react-dom externals + a single inlined file).
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
      formats: ['cjs'],
      fileName: () => 'index.js',
      cssFileName: 'widget'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        // `build.codeSplitting: false` is IIFE/ESM-only; for CJS we still
        // need this (deprecated) Rollup flag to inline dynamic imports
        // into a single file. Without it Rollup emits chart.js/auto and
        // twitter-widgets as separate chunks that the npm consumer can't
        // resolve.
        inlineDynamicImports: true,
        assetFileNames: assetInfo =>
          assetInfo.names?.[0]?.endsWith('.css')
            ? 'widget.css'
            : 'assets/[name][extname]'
      }
    }
  }
});
