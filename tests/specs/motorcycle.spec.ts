import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileMotorcycleQuotePage } from '../../pages/mobile/MobileMotorcycleQuotePage';
import {
  makeFullQuoteData,
  AUTOMOBILE_MAKES,
  NUMBER_OF_SEATS,
} from '../../utils/helpers/insuranceData';

/**
 * Motorcycle quote flow coverage on mobile Safari/Chrome.
 *
 * Motorcycle is the only flow that keeps the Model field and the
 * Cylinder Capacity input. License Plate, Fuel Type, Payload, and
 * Total Weight are all removed. Seats are 1-3 (smaller range).
 */

async function gotoMotorcycle(): Promise<MobileMotorcycleQuotePage> {
  const page = new MobileMotorcycleQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Motorcycle Quote - Happy Path (Mobile)', () => {
  it('fills Vehicle + Insurant + Product sections', async () => {
    const page = await gotoMotorcycle();
    const data = makeFullQuoteData('motorcycle');
    await page.vehicleSection.fill(data.vehicle, 'motorcycle');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'motorcycle');
  });
});

describe('Motorcycle Quote - Vehicle Data Fields (Mobile)', () => {
  it('Model field is present', async () => {
    const page = await gotoMotorcycle();
    await expect(page.vehicleSection.model).toBeDisplayed();
  });

  it('Cylinder Capacity field is present', async () => {
    const page = await gotoMotorcycle();
    await expect(page.vehicleSection.cylinderCapacity).toBeDisplayed();
  });

  it('Number of Seats Motorcycle variant is present', async () => {
    const page = await gotoMotorcycle();
    await expect(page.vehicleSection.numberOfSeatsMotorcycle).toBeDisplayed();
  });

  it('License Plate Number field is hidden', async () => {
    const page = await gotoMotorcycle();
    const exists = await page.vehicleSection.licensePlateNumber.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });

  it('Fuel Type field is hidden', async () => {
    const page = await gotoMotorcycle();
    const exists = await page.vehicleSection.fuelType.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });

  it('Payload field is hidden', async () => {
    const page = await gotoMotorcycle();
    const exists = await page.vehicleSection.payload.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });
});

describe('Motorcycle Quote - Make + Seat Range (Mobile)', () => {
  it('Honda make is selectable', async () => {
    const page = await gotoMotorcycle();
    const makes = await page.vehicleSection.getAvailableMakes();
    expect(makes).toContain('Honda');
    expect(makes).toContain('Audi');
    // Spot-check a couple of the 15 makes available
    for (const m of AUTOMOBILE_MAKES.slice(0, 3)) {
      expect(makes).toContain(m);
    }
  });

  it('seat range is restricted to 1-3', async () => {
    const page = await gotoMotorcycle();
    const opts = await page.vehicleSection.byCssAll('#numberofseatsmotorcycle option');
    const seats = await Promise.all(opts.map(async (o) => (await o.getText()).trim()));
    // Dropdown options should NOT include seats beyond 3
    for (const s of seats) {
      expect(['1', '2', '3', 'please select'].includes(s)).toBe(true);
    }
    // Sanity: the auto/truck/camper seat range goes up to 9.
    const fullRange = NUMBER_OF_SEATS.map(String);
    expect(fullRange.length).toBe(9);
  });
});

describe('Motorcycle Quote - Cylinder Capacity Boundaries (Mobile)', () => {
  it('cylinder capacity > 2000 marks field invalid', async () => {
    const page = await gotoMotorcycle();
    await page.vehicleSection.cylinderCapacity.setValue('2001');
    await browser.execute<void, [typeof page.vehicleSection.cylinderCapacity]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.cylinderCapacity,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#cylindercapacity')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('cylinder capacity exactly 2000 is valid', async () => {
    const page = await gotoMotorcycle();
    await page.vehicleSection.cylinderCapacity.setValue('2000');
    await browser.execute<void, [typeof page.vehicleSection.cylinderCapacity]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.cylinderCapacity,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#cylindercapacity')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(false);
  });
});
