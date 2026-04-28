import type { ChartConstructor } from '@/types';

declare global {
  /**
   * Requires the external script `Twitter` to be loaded.
   */
  var twttr: {
    widgets: {
      createTweet: (id: string, el: Element) => void;
    };
  };

  /**
   * Requires the external script `ChartJS` to be loaded.
   */
  var Chart: ChartConstructor;

  // Webpack runtime: require() is rewritten by the bundler; process.env is
  // injected via DefinePlugin/babel. Declared locally so we don't need the
  // full @types/node surface in browser code.
  function require<T = unknown>(id: string): T;
  var process: { env: { NODE_ENV?: string } };
}
