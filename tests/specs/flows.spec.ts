import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { MobileTruckQuotePage } from '../../pages/mobile/MobileTruckQuotePage';
import { MobileMotorcycleQuotePage } from '../../pages/mobile/MobileMotorcycleQuotePage';
import { MobileCamperQuotePage } from '../../pages/mobile/MobileCamperQuotePage';
import {
  makeFullQuoteData,
  AUTOMOBILE_MAKES,
  PRICE_OPTIONS,
  COUNTRIES,
  OCCUPATIONS,
} from '../../utils/helpers/insuranceData';

/**
 * Cross-vehicle flow tests on mobile Safari/Chrome. Each test runs a
 * complete happy-path against one of the four quote forms, switching
 * one axis (vehicle type, make, country, etc.) per test.
 *
 * Non-automobile full submissions are blocked by Tricentis' price
 * table bug (idealforms still requires Merit Rating + Courtesy Car
 * for non-auto flows); those tests stop after filling the third step.
 */

async function newAutomobile(): Promise<MobileAutomobileQuotePage> {
  const p = new MobileAutomobileQuotePage(browser);
  await p.goto();
  await p.assertLoaded();
  return p;
}

async function newTruck(): Promise<MobileTruckQuotePage> {
  const p = new MobileTruckQuotePage(browser);
  await p.goto();
  await p.assertLoaded();
  return p;
}

async function newMotorcycle(): Promise<MobileMotorcycleQuotePage> {
  const p = new MobileMotorcycleQuotePage(browser);
  await p.goto();
  await p.assertLoaded();
  return p;
}

async function newCamper(): Promise<MobileCamperQuotePage> {
  const p = new MobileCamperQuotePage(browser);
  await p.goto();
  await p.assertLoaded();
  return p;
}

describe('Flows - All four price plans for automobile (Mobile)', () => {
  PRICE_OPTIONS.forEach((opt) => {
    it(`automobile completes end-to-end on ${opt} plan`, async () => {
      const page = await newAutomobile();
      const data = makeFullQuoteData('automobile');
      await page.fillAll({ ...data, priceOption: opt });
      await page.sendSection.clickSend();
      await page.sendSection.expectConfirmationVisible();
    });
  });
});

describe('Flows - All vehicle types for Silver plan (Mobile)', () => {
  // We don't include the automobile case here - it lives in the suite above.
  const nonAutoFlows: Array<
    () => Promise<MobileTruckQuotePage | MobileMotorcycleQuotePage | MobileCamperQuotePage>
  > = [newTruck, newMotorcycle, newCamper];

  nonAutoFlows.forEach((factory, idx) => {
    const label = ['truck', 'motorcycle', 'camper'][idx];
    it(`${label} fills Vehicle + Insurant + Product sections`, async () => {
      const page = await factory();
      const data = makeFullQuoteData(label as 'truck' | 'motorcycle' | 'camper');
      await page.vehicleSection.fill(data.vehicle, label as 'truck' | 'motorcycle' | 'camper');
      await page.vehicleSection.clickNext();
      await page.insurantSection.fill(data.insurant);
      await page.insurantSection.clickNext();
      await page.productSection.fill(data.product, label as 'truck' | 'motorcycle' | 'camper');
    });
  });
});

describe('Flows - Make variants (Mobile)', () => {
  // Spot-check a handful of makes to keep the suite fast.
  AUTOMOBILE_MAKES.slice(0, 6).forEach((make) => {
    it(`automobile accepts ${make} make`, async () => {
      const page = await newAutomobile();
      const data = makeFullQuoteData('automobile');
      await page.vehicleSection.fill({ ...data.vehicle, make });
      await page.vehicleSection.clickNext();
      const firstName = await page.insurantSection.firstName.getValue();
      // We filled Vehicle Data but haven't touched Insurant Data; the
      // page navigation should have happened because Make is a valid
      // string. The Insurant Data step should now be visible.
      await expect(page.insurantSection.firstName).toBeDisplayed();
      expect(typeof firstName).toBe('string');
    });
  });
});

describe('Flows - Country variants (Mobile)', () => {
  COUNTRIES.slice(0, 5).forEach((country) => {
    it(`automobile accepts ${country} country`, async () => {
      const page = await newAutomobile();
      const data = makeFullQuoteData('automobile');
      await page.vehicleSection.fill(data.vehicle);
      await page.vehicleSection.clickNext();
      await page.insurantSection.fill({ ...data.insurant, country });
      const value = await page.insurantSection.country.getValue();
      expect(value).toBe(country);
    });
  });
});

describe('Flows - Occupation variants (Mobile)', () => {
  OCCUPATIONS.forEach((occupation) => {
    it(`automobile accepts occupation "${occupation}"`, async () => {
      const page = await newAutomobile();
      const data = makeFullQuoteData('automobile');
      await page.vehicleSection.fill(data.vehicle);
      await page.vehicleSection.clickNext();
      await page.insurantSection.fill({ ...data.insurant, occupation });
      const value = await page.insurantSection.occupation.getValue();
      expect(value).toBe(occupation);
    });
  });
});
