import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileHomePage } from '../../pages/mobile/MobileHomePage';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { MobileTruckQuotePage } from '../../pages/mobile/MobileTruckQuotePage';
import { MobileMotorcycleQuotePage } from '../../pages/mobile/MobileMotorcycleQuotePage';
import { MobileCamperQuotePage } from '../../pages/mobile/MobileCamperQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Smoke tests for the most critical paths on mobile Safari/Chrome:
 * one per vehicle type loads, and the full automobile submission
 * confirms the framework can complete the end-to-end happy path.
 *
 * Non-automobile smoke tests stop after filling vehicle/insurant/
 * product - the price-table bug in Tricentis's app blocks non-auto
 * submissions (the idealforms validator still requires Merit Rating
 * + Courtesy Car which are removed for non-auto flows).
 */

describe('Smoke - Quick sanity (Mobile)', () => {
  let homePage: MobileHomePage;

  before(async () => {
    homePage = new MobileHomePage(browser);
    await homePage.goto();
  });

  it('home page loads on mobile', async () => {
    await homePage.assertLoaded();
    const title = await homePage.getTitle();
    expect(title).toMatch(/Tricentis/i);
  });
});

describe('Smoke - Quote forms load on mobile', () => {
  it('automobile quote loads', async () => {
    const page = new MobileAutomobileQuotePage(browser);
    await page.goto();
    await page.assertLoaded();
  });

  it('truck quote loads', async () => {
    const page = new MobileTruckQuotePage(browser);
    await page.goto();
    await page.assertLoaded();
  });

  it('motorcycle quote loads', async () => {
    const page = new MobileMotorcycleQuotePage(browser);
    await page.goto();
    await page.assertLoaded();
  });

  it('camper quote loads', async () => {
    const page = new MobileCamperQuotePage(browser);
    await page.goto();
    await page.assertLoaded();
  });
});

describe('Smoke - Full submission paths (Mobile)', () => {
  it('automobile full submission works end-to-end on mobile', async () => {
    const page = new MobileAutomobileQuotePage(browser);
    const data = makeFullQuoteData('automobile');
    await page.goto();
    await page.fillAll(data);
    await page.sendSection.clickSend();
    await page.sendSection.expectConfirmationVisible();
  });

  it('truck fills vehicle/insurant/product sections on mobile', async () => {
    const page = new MobileTruckQuotePage(browser);
    const data = makeFullQuoteData('truck');
    await page.goto();
    await page.vehicleSection.fill(data.vehicle, 'truck');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'truck');
  });

  it('motorcycle fills vehicle/insurant/product sections on mobile', async () => {
    const page = new MobileMotorcycleQuotePage(browser);
    const data = makeFullQuoteData('motorcycle');
    await page.goto();
    await page.vehicleSection.fill(data.vehicle, 'motorcycle');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'motorcycle');
  });

  it('camper fills vehicle/insurant/product sections on mobile', async () => {
    const page = new MobileCamperQuotePage(browser);
    const data = makeFullQuoteData('camper');
    await page.goto();
    await page.vehicleSection.fill(data.vehicle, 'camper');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'camper');
  });
});
