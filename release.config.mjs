// semantic-release config. cosmiconfig (which semantic-release uses to find
// its config) doesn't accept .jsonc, so this is .mjs to match the team
// convention in `frontends` and to allow real comments + conditional logic.

const NOTE_KEYWORDS = ['BREAKING CHANGE', 'BREAKING CHANGES'];

// These scopes represent operational work rather than deployable runtime
// changes, so they should never mint a semantic version on their own.
const NON_RELEASING_SCOPES = ['docs*', 'ci*', 'release*'];

const RELEASE_RULES = [
  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'perf', release: 'patch' },
  ...NON_RELEASING_SCOPES.map(scope => ({ scope, release: false }))
];

const isLocalDryRun = process.env.SEMANTIC_RELEASE_LOCAL_DRY_RUN === 'true';

const plugins = [
  [
    '@semantic-release/commit-analyzer',
    {
      preset: 'conventionalcommits',
      parserOpts: { noteKeywords: NOTE_KEYWORDS },
      releaseRules: RELEASE_RULES
    }
  ],
  [
    '@semantic-release/release-notes-generator',
    {
      preset: 'conventionalcommits',
      parserOpts: { noteKeywords: NOTE_KEYWORDS }
    }
  ]
];

if (!isLocalDryRun) {
  // CI-only side-effects — local dry-runs should be able to compute the
  // next version without npm/GitHub auth or touching the working tree.
  plugins.push(
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    // @semantic-release/npm bumps package.json + package-lock.json and
    // publishes. Provenance is enabled via NPM_CONFIG_PROVENANCE=true in
    // the release workflow (matches the trusted-publishing flow already
    // used by the existing publish_npm CI job).
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        failComment: false,
        releasedLabels: false,
        successComment: false
      }
    ],
    // Commit the version bump + CHANGELOG.md back to main. `[skip ci]`
    // prevents the resulting push from triggering another release run.
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        message:
          // biome-ignore lint/suspicious/noTemplateCurlyInString: semantic-release resolves these placeholders at release time
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  );
}

export default {
  branches: ['main'],
  // biome-ignore lint/suspicious/noTemplateCurlyInString: semantic-release resolves this placeholder at release time
  tagFormat: 'v${version}',
  plugins
};
