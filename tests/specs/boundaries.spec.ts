import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { MobileTruckQuotePage } from '../../pages/mobile/MobileTruckQuotePage';
import { MobileMotorcycleQuotePage } from '../../pages/mobile/MobileMotorcycleQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Boundary value tests on mobile Safari/Chrome. Mirrors the
 * boundaries.spec.ts from the Playwright project, adapted to WDI
 * selectors and the mobile browser context.
 *
 * The Tricentis idealForms library enforces numeric/text rules via
 * `data-idealforms-valid` / `.invalid` class toggling. We poll the
 * DOM after each boundary value to confirm whether the field is
 * considered valid.
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

async function gotoMotorcycle(): Promise<MobileMotorcycleQuotePage> {
  const page = new MobileMotorcycleQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

async function gotoTruck(): Promise<MobileTruckQuotePage> {
  const page = new MobileTruckQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

async function isFieldInvalid(selector: string): Promise<boolean> {
  return browser.execute<boolean, [string]>((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    const wrap = el?.closest('.idealforms-field');
    return wrap?.classList.contains('invalid') ?? false;
  }, selector);
}

async function fillAndCheck(selector: string, value: string): Promise<boolean> {
  const el = browser.$(selector);
  await el.setValue(value);
  await browser.execute<void, [typeof el]>(
    (e: HTMLElement) =>
      (e as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
    el,
  );
  return isFieldInvalid(selector);
}

describe('Boundary Values - Vehicle (Mobile)', () => {
  it('engine performance = 1 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, enginePerformance: 1 });
    expect(await isFieldInvalid('#engineperformance')).toBe(false);
  });

  it('engine performance = 2000 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, enginePerformance: 2000 });
    expect(await isFieldInvalid('#engineperformance')).toBe(false);
  });

  it('engine performance = 2001 is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, enginePerformance: 2001 });
    expect(await isFieldInvalid('#engineperformance')).toBe(true);
  });

  it('annual mileage = 100 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, annualMileage: 100 });
    expect(await isFieldInvalid('#annualmileage')).toBe(false);
  });

  it('annual mileage = 100000 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, annualMileage: 100000 });
    expect(await isFieldInvalid('#annualmileage')).toBe(false);
  });

  it('annual mileage = 100001 is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, annualMileage: 100001 });
    expect(await isFieldInvalid('#annualmileage')).toBe(true);
  });

  it('list price = 500 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, listPrice: 500 });
    expect(await isFieldInvalid('#listprice')).toBe(false);
  });

  it('list price = 499 is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, listPrice: 499 });
    expect(await isFieldInvalid('#listprice')).toBe(true);
  });

  it('license plate of 10 chars is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, licensePlateNumber: 'AB12-CDE-3' });
    expect(await isFieldInvalid('#licenseplatenumber')).toBe(false);
  });

  it('license plate of 11 chars is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, licensePlateNumber: 'AB12-CDE-34' });
    expect(await isFieldInvalid('#licenseplatenumber')).toBe(true);
  });
});

describe('Boundary Values - Motorcycle Cylinder Capacity (Mobile)', () => {
  it('cylinder capacity = 1 is valid', async () => {
    const page = await gotoMotorcycle();
    const data = makeFullQuoteData('motorcycle');
    await page.vehicleSection.fill({ ...data.vehicle, cylinderCapacity: 1 });
    expect(await isFieldInvalid('#cylindercapacity')).toBe(false);
  });

  it('cylinder capacity = 2000 is valid', async () => {
    const page = await gotoMotorcycle();
    const data = makeFullQuoteData('motorcycle');
    await page.vehicleSection.fill({ ...data.vehicle, cylinderCapacity: 2000 });
    expect(await isFieldInvalid('#cylindercapacity')).toBe(false);
  });

  it('cylinder capacity = 2001 is invalid', async () => {
    const page = await gotoMotorcycle();
    const data = makeFullQuoteData('motorcycle');
    await page.vehicleSection.fill({ ...data.vehicle, cylinderCapacity: 2001 });
    expect(await isFieldInvalid('#cylindercapacity')).toBe(true);
  });
});

describe('Boundary Values - Truck (Mobile)', () => {
  it('payload = 1 is valid', async () => {
    const page = await gotoTruck();
    const data = makeFullQuoteData('truck');
    await page.vehicleSection.fill({ ...data.vehicle, payload: 1 });
    expect(await isFieldInvalid('#payload')).toBe(false);
  });

  it('payload = 1000 is valid', async () => {
    const page = await gotoTruck();
    const data = makeFullQuoteData('truck');
    await page.vehicleSection.fill({ ...data.vehicle, payload: 1000 });
    expect(await isFieldInvalid('#payload')).toBe(false);
  });

  it('total weight = 100 is valid', async () => {
    const page = await gotoTruck();
    const data = makeFullQuoteData('truck');
    await page.vehicleSection.fill({ ...data.vehicle, totalWeight: 100 });
    expect(await isFieldInvalid('#totalweight')).toBe(false);
  });

  it('total weight = 50000 is valid', async () => {
    const page = await gotoTruck();
    const data = makeFullQuoteData('truck');
    await page.vehicleSection.fill({ ...data.vehicle, totalWeight: 50000 });
    expect(await isFieldInvalid('#totalweight')).toBe(false);
  });
});

describe('Boundary Values - Insurant Zip Code (Mobile)', () => {
  it('zip code 4 digits is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#zipcode', '1234')).toBe(false);
  });

  it('zip code 8 digits is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#zipcode', '12345678')).toBe(false);
  });

  it('zip code 9 digits is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#zipcode', '123456789')).toBe(true);
  });

  it('zip code with letters is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#zipcode', 'ABCDE')).toBe(true);
  });
});

describe('Boundary Values - Send Quote (Mobile)', () => {
  it('comments of exactly 300 chars is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, sendQuote: { ...data.sendQuote, comments: 'a'.repeat(300) } });
    expect(await isFieldInvalid('#Comments')).toBe(false);
  });

  it('comments of 301 chars is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, sendQuote: { ...data.sendQuote, comments: 'a'.repeat(301) } });
    expect(await isFieldInvalid('#Comments')).toBe(true);
  });

  it('username 4 chars is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, sendQuote: { ...data.sendQuote, username: 'abcd' } });
    expect(await isFieldInvalid('#username')).toBe(false);
  });

  it('username 3 chars is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, sendQuote: { ...data.sendQuote, username: 'abc' } });
    expect(await isFieldInvalid('#username')).toBe(true);
  });
});
