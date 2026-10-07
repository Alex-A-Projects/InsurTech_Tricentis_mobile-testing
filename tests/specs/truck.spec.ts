import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileTruckQuotePage } from '../../pages/mobile/MobileTruckQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Truck quote flow coverage on mobile Safari/Chrome.
 *
 * The truck form keeps Payload + Total Weight fields but drops Model
 * and Cylinder Capacity. The full submission is blocked by the
 * Tricentis price-table bug for non-automobile vehicles (idealforms
 * still requires Merit Rating + Courtesy Car which are removed), so
 * the smoke-level tests stop after filling the third step.
 */

async function gotoTruck(): Promise<MobileTruckQuotePage> {
  const page = new MobileTruckQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Truck Quote - Happy Path (Mobile)', () => {
  it('fills Vehicle + Insurant + Product sections', async () => {
    const page = await gotoTruck();
    const data = makeFullQuoteData('truck');
    await page.vehicleSection.fill(data.vehicle, 'truck');
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product, 'truck');
  });
});

describe('Truck Quote - Vehicle Data Fields (Mobile)', () => {
  it('Payload field is present', async () => {
    const page = await gotoTruck();
    await expect(page.vehicleSection.payload).toBeDisplayed();
  });

  it('Total Weight field is present', async () => {
    const page = await gotoTruck();
    await expect(page.vehicleSection.totalWeight).toBeDisplayed();
  });

  it('Model field is hidden', async () => {
    const page = await gotoTruck();
    const exists = await page.vehicleSection.model.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });

  it('Cylinder Capacity field is hidden', async () => {
    const page = await gotoTruck();
    const exists = await page.vehicleSection.cylinderCapacity.isExisting().catch(() => false);
    expect(exists).toBe(false);
  });

  it('Ford make is selectable', async () => {
    const page = await gotoTruck();
    const makes = await page.vehicleSection.getAvailableMakes();
    expect(makes).toContain('Ford');
  });
});

describe('Truck Quote - Payload Validation (Mobile)', () => {
  it('payload < 1 marks field invalid', async () => {
    const page = await gotoTruck();
    await page.vehicleSection.payload.setValue('0');
    await browser.execute<void, [typeof page.vehicleSection.payload]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.payload,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#payload')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('payload > 1000 marks field invalid', async () => {
    const page = await gotoTruck();
    await page.vehicleSection.payload.setValue('1001');
    await browser.execute<void, [typeof page.vehicleSection.payload]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.payload,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#payload')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('total weight < 100 marks field invalid', async () => {
    const page = await gotoTruck();
    await page.vehicleSection.totalWeight.setValue('99');
    await browser.execute<void, [typeof page.vehicleSection.totalWeight]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.totalWeight,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#totalweight')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('total weight > 50000 marks field invalid', async () => {
    const page = await gotoTruck();
    await page.vehicleSection.totalWeight.setValue('50001');
    await browser.execute<void, [typeof page.vehicleSection.totalWeight]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.vehicleSection.totalWeight,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#totalweight')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });
});
