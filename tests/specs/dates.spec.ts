import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';
import { toTricentisDate, yearsAgo } from '../../utils/helpers/dateHelpers';

/**
 * Date picker coverage for the Tricentis mobile-web form.
 *
 * Tricentis uses MM/DD/YYYY in three places:
 *   - Vehicle: date of manufacture (must be in the past)
 *   - Insurant: date of birth (18..70 years old inclusive)
 *   - Product: start date (>= 1 month in the future)
 *
 * Tricentis may render the date fields with or without a jQuery UI
 * date-picker trigger button; the inputs themselves accept MM/DD/YYYY
 * regardless.
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
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

describe('Date Picker - Date of Manufacture (Mobile)', () => {
  it('past date (1 year ago) is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, dateOfManufacture: yearsAgo(1) });
    expect(await isFieldInvalid('#dateofmanufacture')).toBe(false);
  });

  it('past date (10 years ago) is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, dateOfManufacture: yearsAgo(10) });
    expect(await isFieldInvalid('#dateofmanufacture')).toBe(false);
  });

  it('today is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({
      ...data.vehicle,
      dateOfManufacture: toTricentisDate(new Date()),
    });
    expect(await isFieldInvalid('#dateofmanufacture')).toBe(true);
  });

  it('future date is invalid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    const fiveYearsAhead = yearsAgo(0).replace(/(\d{4})$/, (m: string) => String(Number(m) + 5));
    await page.vehicleSection.fill({ ...data.vehicle, dateOfManufacture: fiveYearsAhead });
    expect(await isFieldInvalid('#dateofmanufacture')).toBe(true);
  });
});

describe('Date Picker - Date of Birth (Mobile)', () => {
  it('DOB 2000-01-01 is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill({ ...data.insurant, dateOfBirth: '01/01/2000' });
    expect(await isFieldInvalid('#birthdate')).toBe(false);
  });

  it('DOB 17 years ago is invalid (too young)', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#birthdate', yearsAgo(17))).toBe(true);
  });

  it('DOB 18 years ago is valid (lower bound)', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#birthdate', yearsAgo(18))).toBe(false);
  });

  it('DOB 70 years ago is valid (upper bound)', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#birthdate', yearsAgo(70))).toBe(false);
  });

  it('DOB 71 years ago is invalid (too old)', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    expect(await fillAndCheck('#birthdate', yearsAgo(71))).toBe(true);
  });
});

describe('Date Picker - Start Date (Mobile)', () => {
  it('start date 1 month out is invalid (< 35 days)', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    await fillAndCheck('#startdate', toTricentisDate(today));
    expect(await isFieldInvalid('#startdate')).toBe(true);
  });

  it('start date 2 months out is valid', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    const future = new Date();
    future.setMonth(future.getMonth() + 2);
    await page.productSection.fill({ ...data.product, startDate: toTricentisDate(future) });
    expect(await isFieldInvalid('#startdate')).toBe(false);
  });
});
