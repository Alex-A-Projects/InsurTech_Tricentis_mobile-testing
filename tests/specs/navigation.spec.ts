import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Navigation tests verifying that stepping forward/back through the
 * multi-step quote form preserves user data and re-evaluates
 * validation correctly on mobile Safari/Chrome.
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Form Navigation (Mobile)', () => {
  it('Prev from Vehicle Data shows invalid (no Prev button on first step)', async () => {
    const page = await gotoAutomobile();
    // First section: no Prev button. Just check forward nav works.
    await page.vehicleSection.clickNext();
    await page.expectInvalidMessage();
  });

  it('Prev from Insurant Data goes back to Vehicle Data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickPrev();
    const make = await page.vehicleSection.make.getValue();
    expect(make).toBe(data.vehicle.make);
  });

  it('Prev from Product Data goes back to Insurant Data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickPrev();
    const firstName = await page.insurantSection.firstName.getValue();
    expect(firstName).toBe(data.insurant.firstName);
  });

  it('Prev from Send Quote goes back to Price Option', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll(data);
    await page.sendSection.clickPrev();
    // After Prev we should be on the price step; the radios must be
    // present in the DOM (visible:hidden is acceptable because the step
    // section may have just transitioned).
    await expect(page.priceSection.platinumRadio).toBeDisplayed();
  });

  it('forward navigation from Vehicle Data goes to Insurant Data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await expect(page.insurantSection.firstName).toBeDisplayed();
  });

  it('forward navigation from Insurant Data goes to Product Data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await expect(page.productSection.startDate).toBeDisplayed();
  });

  it('forward navigation from Product Data goes to Price Option', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickNext();
    await page.priceSection.expectPriceTableVisible();
    await expect(page.priceSection.silverRadio).toBeDisplayed();
  });

  it('forward navigation from Price Option goes to Send Quote', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickNext();
    await page.priceSection.expectPriceTableVisible();
    await page.priceSection.selectPriceOption('Silver');
    await page.priceSection.clickNext();
    await expect(page.sendSection.email).toBeDisplayed();
  });

  it('back-main link returns to home page', async () => {
    const page = await gotoAutomobile();
    await page.goBackToMain();
    await browser.waitUntil(async () => /index\.php/.test(await browser.getUrl()), {
      timeout: 30_000,
      timeoutMsg: 'Expected URL to contain index.php after clicking back-main',
    });
  });
});
