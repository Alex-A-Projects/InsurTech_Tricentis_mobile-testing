import { browser } from '@wdio/globals';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Shared WebdriverIO configuration for the Tricentis mobile-web framework.
 *
 * Both the iOS Safari and Android Chrome configurations extend this file
 * and only override capabilities + platform-specific behaviour. The base
 * file is also useful as a single source of truth for reporters, suites,
 * timeouts, and the screenshot-on-failure hook.
 *
 * Usage:
 *   npm run test:ios          → wdio.ios.conf.ts     (extends this)
 *   npm run test:android      → wdio.android.conf.ts (extends this)
 *   npm run test:both         → runs both sequentially
 *
 * Note: this file is exported as `Record<string, unknown>` because
 * WDI's strict `Config` type doesn't include `autoCompileOpts` in v9;
 * spreading via `Object.assign` at the consumer side keeps the type
 * system happy while preserving all the runtime behaviour.
 */
const baseConfig: Record<string, unknown> = {
  runner: 'local',
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 90_000, // 90s per test - mobile Appium is slower than desktop
  },

  specs: ['./tests/specs/**/*.spec.ts'],
  exclude: [],

  suites: {
    smoke: ['./tests/specs/smoke.spec.ts'],
    e2e: ['./tests/specs/**/*.spec.ts'],
  },

  // Run tests serially - only one Appium session per simulator/emulator.
  maxInstances: 1,

  reporters: [
    ['spec', { outputDir: './reports/spec-output' }],
    [
      'allure',
      {
        outputDir: './allure-results',
        useCucumberStepReporter: false,
        disableWebdriverScreenshotsReporting: false,
        addConsoleLogs: true,
      },
    ],
  ],

  // Per-spec files load via wdio's TS pipeline (esbuild under the hood)
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
    esbuildOpts: {
      target: 'node20',
      loader: { '.ts': 'ts' },
    },
  },

  // Don't bail on the first failure - keep diagnostic noise high
  // so the Allure report has more detail per run. CI can override via
  // WDIO_BAIL=1 if needed.
  bail: 0,

  // WebdriverIO / Appium command timeouts.
  // Mobile Appium over WDA/UIA2 has higher inherent latency than desktop.
  waitforTimeout: 15_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  // Don't use a Selenium or local-driver path - Appium handles session boot.
  hostname: '127.0.0.1',
  port: 4723, // Appium default

  // Logging
  logLevel: 'info',
  outputDir: './reports/wdio-output',

  // Hooks - we only attach screenshots on failure and add to Allure.
  before: async () => {
    // Nothing global to set up here; POMs are constructed inside
    // describe.before() blocks in each spec.
  },

  beforeSession: async (_config: unknown, capabilities: unknown) => {
    // eslint-disable-next-line no-console
    console.log(`[wdio] Booting session for: ${JSON.stringify(capabilities)}`);
  },

  afterTest: async (
    test: { parent?: string; title?: string },
    _context: unknown,
    { error }: { error?: unknown },
  ) => {
    if (error) {
      try {
        const png = await browser.takeScreenshot();
        const safeName = `${test.parent}-${test.title}`.replace(/[^a-z0-9-]/gi, '_').toLowerCase();
        const dir = path.resolve('./screenshots');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${safeName}.png`), png, 'base64');

        // eslint-disable-next-line no-console
        console.log(`[wdio] Screenshot saved: ./screenshots/${safeName}.png`);
      } catch (screenshotErr) {
        // eslint-disable-next-line no-console
        console.error('[wdio] Failed to capture screenshot:', screenshotErr);
      }
    }
  },

  onComplete: () => {
    // eslint-disable-next-line no-console
    console.log('[wdio] Run complete. View the Allure report with: npm run report');
  },
};

export default baseConfig;
