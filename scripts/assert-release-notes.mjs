import { createRequire } from 'node:module';
import releaseConfig from '../release.config.mjs';

const require = createRequire(import.meta.url);
const releaseRequire = createRequire(require.resolve('semantic-release'));
const { generateNotes } = await import(
  releaseRequire.resolve('@semantic-release/release-notes-generator')
);
const [, options] = releaseConfig.plugins.find(
  ([name]) => name === '@semantic-release/release-notes-generator'
);
const subject = 'correct chart totals and keep mobile legends readable';
const notes = await generateNotes(options, {
  cwd: process.cwd(),
  env: process.env,
  options: {
    repositoryUrl:
      'https://github.com/paradigm-publishing/operas-metrics-widget.git'
  },
  commits: [
    {
      hash: '71351a0dc4a510162666bff267c745fb5e40c378',
      message: `fix: ${subject}`
    }
  ],
  lastRelease: { version: '2.0.5', gitTag: 'v2.0.5' },
  nextRelease: { version: '2.0.6', gitTag: 'v2.0.6' },
  logger: console
});

if (!notes.includes(subject) || !notes.includes('2.0.6')) {
  throw new Error('Release notes must include the version and fix commits');
}
