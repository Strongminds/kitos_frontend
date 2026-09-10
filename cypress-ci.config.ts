import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    reporter: 'teamcity',
    baseUrl: 'http://localhost:4200',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    // Root causes of flakiness (fixed waits, intercept-ordering races) have been fixed;
    // keep 1 retry as a safety net for genuine environment-level flakiness, not to mask bugs.
    retries: {
      runMode: 1,
    },

    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    reporter: 'teamcity',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
