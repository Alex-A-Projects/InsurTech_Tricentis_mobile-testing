import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileCamperQuotePage } from '../../pages/mobile/MobileCamperQuotePage';
import { makeFullQuoteData, PRICE_OPTIONS } from '../../utils/helpers/insuranceData';

/**
 * Camper quote flow coverage on mobile Safari/Chrome.
 *
 * Camper keeps Payload + Total Weight fields, but drops Model and
 * Cylinder Capacity.
 */

async function gotoCamper(): Promise<MobileCamperQuotePage> {
  const page = new MobileCamperQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Camper Quote - Happy Path (Mobile)', () => {
  it('fills Vehicle + Insurant + Product sections', async () => {
    const page = await gotoCamper();
    const data = makeFullQuoteData('camper');
    await page.vehicleSection.fill(data.vehicle, 'camper');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'camper');
  });
});

describe('Camper Quote - Vehicle Data Fields (Mobile)', () => {
  it('Payload field is present', async () => {
    const page = await gotoCamper();
    await expect(page.vehicleSection.payload).toBeDisplayed();
  });

  it('Total Weight field is present', async () => {
    const page = await gotoCamper();
    await expect(page.vehicleSection.totalWeight).toBeDisplayed();
  });

  it('Model field is hidden', async () => {
    const page = await gotoCamper();
    const exists = await page.vehicleSection.model.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });

  it('Cylinder Capacity field is hidden', async () => {
    const page = await gotoCamper();
    const exists = await page.vehicleSection.cylinderCapacity.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });
});

describe('Camper Quote - Make dropdown (Mobile)', () => {
  it('Volkswagen, Ford, Toyota are selectable', async () => {
    const page = await gotoCamper();
    const makes = await page.vehicleSection.getAvailableMakes();
    expect(makes).toContain('Volkswagen');
    expect(makes).toContain('Ford');
    expect(makes).toContain('Toyota');
  });
});

describe('Camper Quote - Price Plans (Mobile)', () => {
  // The Tricentis app bug means the price table does not render for
  // non-automobile vehicles. These tests assert that the radio
  // elements are NOT visible on the camper flow (documenting the
  // documented bug) rather than exercising price-option submission.
  PRICE_OPTIONS.forEach((opt) => {
    it(`price plan radio "${opt}" is not rendered for camper (app bug)`, async () => {
      const page = await gotoCamper();
      const data = makeFullQuoteData('camper');
      await page.vehicleSection.fill(data.vehicle, 'camper');
      await page.vehicleSection.clickNext();
      await page.insurantSection.fill(data.insurant);
      await page.insurantSection.clickNext();
      await page.productSection.fill(data.product, 'camper');
      await page.productSection.clickNext();
      // Give the page a moment, then check that no price radios
      // are visible. If any are visible the bug has been fixed.
      await browser.pause(500);
      const visible = await browser.execute((value) => {
        const el = document.querySelector(
          `input[name="Select Option"][value="${value}"]`,
        ) as HTMLInputElement | null;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, opt);
      expect(visible).toBe(false);
    });
  });
});
