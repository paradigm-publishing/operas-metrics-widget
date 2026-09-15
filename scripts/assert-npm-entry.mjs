import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const esmUrl = new URL('../dist/npm/index.mjs', import.meta.url);
const cjsUrl = new URL('../dist/npm/index.cjs', import.meta.url);
const source = await readFile(esmUrl, 'utf8');

for (const needle of [
  'from "react";',
  'from "react/jsx-runtime"',
  'import("chart.js/auto")',
  'import("twitter-widgets")'
]) {
  if (!source.includes(needle)) {
    throw new Error(`npm ESM entry is missing ${needle}`);
  }
}

if (source.includes('require(')) {
  throw new Error('npm ESM entry contains require(');
}

const esm = await import(esmUrl);
if (typeof esm.MetricsWidget !== 'function') {
  throw new Error('npm ESM entry does not export MetricsWidget');
}

const cjs = createRequire(import.meta.url)(fileURLToPath(cjsUrl));
if (typeof cjs.MetricsWidget !== 'function') {
  throw new Error('npm CJS entry does not export MetricsWidget');
}
