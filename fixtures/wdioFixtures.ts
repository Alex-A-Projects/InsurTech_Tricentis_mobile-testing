import automobileFixture from './data/automobileData.json';
import truckFixture from './data/truckData.json';
import motorcycleFixture from './data/motorcycleData.json';
import camperFixture from './data/camperData.json';

/**
 * Static reference data loaded once at module-eval time. Mirrors the
 * structure of the Playwright project's `testData` export. The actual
 * generated random data is produced by the helpers in
 * `utils/helpers/insuranceData.ts`.
 *
 * Tests use these fixtures for explicit / deterministic coverage (e.g.
 * "an Audi with these exact values") while the factories are used for
 * randomized coverage (happy-path submissions).
 */
export const testData = {
  automobile: automobileFixture as { make: string; [k: string]: unknown },
  truck: truckFixture as { make: string; [k: string]: unknown },
  motorcycle: motorcycleFixture as { make: string; [k: string]: unknown },
  camper: camperFixture as { make: string; [k: string]: unknown },
};
