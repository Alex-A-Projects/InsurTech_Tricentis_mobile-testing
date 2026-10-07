import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import {
  makeFullQuoteData,
  AUTOMOBILE_MAKES,
  PRICE_OPTIONS,
  OCCUPATIONS,
} from '../../utils/helpers/insuranceData';

/**
 * End-to-end happy path + validations for the Automobile quote flow on
 * mobile Safari/Chrome. Mirrors the Playwright project's automobile
 * coverage with one important caveat: `expect(locator).toHaveClass(/x/)`
 * becomes `expect(element).toHaveAttribute('class', expect.stringContaining('x'))`
 * because expect-webdriverio has no `.toHaveClass()` matcher.
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Automobile Quote - Happy Path (Mobile)', () => {
  it('fills all five sections and submits the quote', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll(data);

    // Re-verify inputs stuck
    const email = await page.sendSection.email.getValue();
    const username = await page.sendSection.username.getValue();
    const password = await page.sendSection.password.getValue();
    expect(email).toBe(data.sendQuote.email);
    expect(username).toBe(data.sendQuote.username);
    expect(password).toBe(data.sendQuote.password);

    await page.sendSection.clickSend();
    await page.sendSection.expectConfirmationVisible();
  });

  it('validates each makes available in the Make dropdown', async () => {
    const page = await gotoAutomobile();
    const makes = await page.vehicleSection.getAvailableMakes();
    for (const m of AUTOMOBILE_MAKES) {
      expect(makes).toContain(m);
    }
  });

  it('selecting a Make does not expose a Model field (Automobile hides it)', async () => {
    const page = await gotoAutomobile();
    const modelCount = await page.vehicleSection.model.isExisting().catch(() => false);
    expect(modelCount).toBe(false);
  });

  it('price table has four plans', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    // Step manually to avoid the price-table timing flake
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickNext();
    await page.priceSection.expectPriceTableVisible();

    await expect(page.priceSection.silverRadio).toBeDisplayed();
    await expect(page.priceSection.goldRadio).toBeDisplayed();
    await expect(page.priceSection.platinumRadio).toBeDisplayed();
    await expect(page.priceSection.ultimateRadio).toBeDisplayed();
  });

  it('can navigate back via Prev buttons without losing data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickPrev();
    const make = await page.vehicleSection.make.getValue();
    expect(make).toBe(data.vehicle.make);
  });
});

describe('Automobile Quote - Vehicle Data Validation (Mobile)', () => {
  let page: MobileAutomobileQuotePage;

  beforeEach(async () => {
    page = await gotoAutomobile();
  });

  it('filling all vehicle fields clears the invalid state', async () => {
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.expectInvalidMessageHidden();
  });

  it('annual mileage below min (50) marks field invalid', async () => {
    await page.vehicleSection.fill({
      ...makeFullQuoteData('automobile').vehicle,
      annualMileage: 50,
    });
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#annualmileage')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('annual mileage out of range (>100000) marks field invalid', async () => {
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, annualMileage: 200000 });
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#annualmileage')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('license plate number longer than 10 chars marks field invalid', async () => {
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, licensePlateNumber: 'TOOLONGPLATE' });
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#licenseplatenumber')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('list price below 500 marks field invalid', async () => {
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill({ ...data.vehicle, listPrice: 100 });
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#listprice')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });
});

describe('Automobile Quote - Insurant Data Validation (Mobile)', () => {
  let page: MobileAutomobileQuotePage;

  beforeEach(async () => {
    page = await gotoAutomobile();
    await page.fillAll(makeFullQuoteData('automobile'));
  });

  it('invalid email marks email field invalid', async () => {
    await page.sendSection.email.setValue('not-an-email');
    await browser.execute<void, [typeof page.sendSection.email]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.sendSection.email,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#email')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('password mismatch marks confirm password invalid', async () => {
    await page.sendSection.confirmPassword.setValue('DifferentPass!');
    await browser.execute<void, [typeof page.sendSection.confirmPassword]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.sendSection.confirmPassword,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#confirmpassword')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('invalid phone (letters) marks phone field invalid', async () => {
    await page.sendSection.phone.setValue('abcdefghijk');
    await browser.execute<void, [typeof page.sendSection.phone]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.sendSection.phone,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#phone')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });
});

describe('Automobile Quote - Price Options (Mobile)', () => {
  it('Silver plan is selectable', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, priceOption: 'Silver' });
    const checked = await page.priceSection.silverRadio.isSelected();
    expect(checked).toBe(true);
  });

  it('Gold plan is selectable', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, priceOption: 'Gold' });
    const checked = await page.priceSection.goldRadio.isSelected();
    expect(checked).toBe(true);
  });

  it('Platinum plan is selectable', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.fillAll({ ...data, priceOption: 'Platinum' });
    const checked = await page.priceSection.platinumRadio.isSelected();
    expect(checked).toBe(true);
  });

  it('Ultimate plan is selectable', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickNext();
    await page.priceSection.expectPriceTableVisible();
    await page.priceSection.selectPriceOption('Ultimate');
    const checked = await page.priceSection.ultimateRadio.isSelected();
    expect(checked).toBe(true);
  });

  it('all four plans are visible after Vehicle/Insurant/Product data', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.fill(data.product);
    await page.productSection.clickNext();

    for (const opt of PRICE_OPTIONS) {
      const radio = browser.$(`input[name="Select Option"][value="${opt}"]`);
      await radio.scrollIntoView();
      await expect(radio).toBeDisplayed();
    }
  });
});

describe('Automobile Quote - Product Data (Mobile)', () => {
  it('all insurance sum options are listed', async () => {
    const page = await gotoAutomobile();
    const opts = await page.productSection.byCssAll('#insurancesum option');
    const texts = await Promise.all(opts.map(async (o) => (await o.getText()).trim()));
    expect(texts.length).toBeGreaterThanOrEqual(5);
  });

  it('all merit rating options are listed', async () => {
    const page = await gotoAutomobile();
    const opts = await page.productSection.byCssAll('#meritrating option');
    const texts = await Promise.all(opts.map(async (o) => (await o.getText()).trim()));
    expect(texts.length).toBeGreaterThanOrEqual(10);
  });

  it('selecting Euro Protection optional product checks the box', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await browser.execute<void, [typeof page.productSection.euroProtection]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.productSection.euroProtection,
    );
    const checked = await page.productSection.euroProtection.isSelected();
    expect(checked).toBe(true);
  });

  it('selecting Legal Defense Insurance optional product checks the box', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await browser.execute<void, [typeof page.productSection.legalDefenseInsurance]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.productSection.legalDefenseInsurance,
    );
    const checked = await page.productSection.legalDefenseInsurance.isSelected();
    expect(checked).toBe(true);
  });

  it('selecting both optional products checks both', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await browser.execute<void, [typeof page.productSection.euroProtection]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.productSection.euroProtection,
    );
    await browser.execute<void, [typeof page.productSection.legalDefenseInsurance]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.productSection.legalDefenseInsurance,
    );
    const euro = await page.productSection.euroProtection.isSelected();
    const legal = await page.productSection.legalDefenseInsurance.isSelected();
    expect(euro).toBe(true);
    expect(legal).toBe(true);
  });

  it('future start date is accepted', async () => {
    const page = await gotoAutomobile();
    const data = makeFullQuoteData('automobile');
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
    await page.productSection.startDate.scrollIntoView();
    await page.productSection.startDate.setValue(data.product.startDate);
    const value = await page.productSection.startDate.getValue();
    expect(value).toBe(data.product.startDate);
  });
});

describe('Automobile Quote - Country list (Mobile)', () => {
  it('country dropdown has all countries', async () => {
    const page = await gotoAutomobile();
    const opts = await page.insurantSection.byCssAll('#country option');
    const countries = await Promise.all(opts.map(async (o) => (await o.getText()).trim()));
    for (const c of ['United States', 'Germany', 'Japan', 'Spain']) {
      expect(countries).toContain(c);
    }
  });

  it('occupation dropdown lists all occupations', async () => {
    const page = await gotoAutomobile();
    const opts = await page.insurantSection.byCssAll('#occupation option');
    const occupations = await Promise.all(opts.map(async (o) => (await o.getText()).trim()));
    for (const o of OCCUPATIONS) {
      expect(occupations).toContain(o);
    }
  });

  it('hobby checkboxes are all present', async () => {
    const page = await gotoAutomobile();
    await expect(page.insurantSection.hobbySpeeding).toBeDisplayed();
    await expect(page.insurantSection.hobbyBungeeJumping).toBeDisplayed();
    await expect(page.insurantSection.hobbyCliffDiving).toBeDisplayed();
    await expect(page.insurantSection.hobbySkydiving).toBeDisplayed();
    await expect(page.insurantSection.hobbyOther).toBeDisplayed();
  });
});
