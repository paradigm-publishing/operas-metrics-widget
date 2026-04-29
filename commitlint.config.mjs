/** Commit types that are allowed to land on `main` and feed semantic-release. */
const ALLOWED_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore'
];

/**
 * Restrict commitlint to the Conventional Commit types this repo supports for
 * release automation and PR-title linting.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ALLOWED_TYPES]
  }
};
