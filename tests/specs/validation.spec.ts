import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Cross-cutting validation scenarios that exercise multiple sections
 * of the Tricentis form on mobile Safari/Chrome. Mirrors the
 * Playwright project's validation coverage with WDI + Appium equivalents.
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

describe('Form Validation - Insurant Data (Mobile)', () => {
  let page: MobileAutomobileQuotePage;

  beforeEach(async () => {
    page = await gotoAutomobile();
    await page.vehicleSection.fill(makeFullQuoteData('automobile').vehicle);
    await page.vehicleSection.clickNext();
  });

  it('empty first name marks field invalid', async () => {
    await page.insurantSection.firstName.setValue('John');
    await browser.execute<void, [typeof page.insurantSection.firstName]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.insurantSection.firstName,
    );
    await page.insurantSection.firstName.setValue('');
    await browser.execute<void, [typeof page.insurantSection.firstName]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.insurantSection.firstName,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#firstname')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('empty last name marks field invalid', async () => {
    await page.insurantSection.lastName.setValue('Doe');
    await browser.execute<void, [typeof page.insurantSection.lastName]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.insurantSection.lastName,
    );
    await page.insurantSection.lastName.setValue('');
    await browser.execute<void, [typeof page.insurantSection.lastName]>(
      (el: HTMLElement) =>
        (el as HTMLInputElement).dispatchEvent(new Event('keyup', { bubbles: true })),
      await page.insurantSection.lastName,
    );
    const isInvalid = await browser.execute<boolean, []>(
      () =>
        document
          .querySelector('#lastname')
          ?.closest('.idealforms-field')
          ?.classList.contains('invalid') ?? false,
    );
    expect(isInvalid).toBe(true);
  });

  it('future date of birth blocks Next', async () => {
    const data = makeFullQuoteData('automobile');
    await page.insurantSection.fill({ ...data.insurant, dateOfBirth: '01/01/3000' });
    await page.insurantSection.clickNext();
    await page.expectInvalidMessage();
  });

  it('street address shorter than 3 chars blocks Next', async () => {
    const data = makeFullQuoteData('automobile');
    await page.insurantSection.fill({ ...data.insurant, streetAddress: 'X' });
    await page.insurantSection.clickNext();
    await page.expectInvalidMessage();
  });

  it('invalid website URL blocks Next', async () => {
    const data = makeFullQuoteData('automobile');
    await page.insurantSection.fill({ ...data.insurant, website: 'not-a-url' });
    await page.insurantSection.clickNext();
    await page.expectInvalidMessage();
  });

  it('hobbies missing: selecting none marks hobbies invalid', async () => {
    const data = makeFullQuoteData('automobile');
    await page.insurantSection.fill({ ...data.insurant, hobbies: [] });
    const isInvalid = await browser.execute<boolean, []>(() => {
      const input = document.querySelector('input[name="Hobbies"]') as HTMLElement | null;
      const wrap = input?.closest('.idealforms-field');
      return wrap?.classList.contains('invalid') ?? false;
    });
    expect(isInvalid).toBe(true);
  });

  it('gender selecting radial group toggles', async () => {
    await browser.execute<void, [typeof page.insurantSection.genderMale]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.insurantSection.genderMale,
    );
    const maleChecked = await page.insurantSection.genderMale.isSelected();
    expect(maleChecked).toBe(true);

    await browser.execute<void, [typeof page.insurantSection.genderFemale]>(
      (el: HTMLElement) => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      await page.insurantSection.genderFemale,
    );
    const femaleChecked = await page.insurantSection.genderFemale.isSelected();
    expect(femaleChecked).toBe(true);
  });
});

describe('Form Validation - Product Data (Mobile)', () => {
  let page: MobileAutomobileQuotePage;

  beforeEach(async () => {
    const data = makeFullQuoteData('automobile');
    page = await gotoAutomobile();
    await page.vehicleSection.fill(data.vehicle);
    await page.vehicleSection.clickNext();
    await page.insurantSection.fill(data.insurant);
    await page.insurantSection.clickNext();
  });

  it('past start date blocks Next', async () => {
    await page.productSection.startDate.setValue('01/01/2000');
    await page.productSection.clickNext();
    await page.expectInvalidMessage();
  });

  it('unchecked optional products blocks Next', async () => {
    await page.productSection.fill({
      startDate: '01/01/2030',
      insuranceSum: '3.000.000,00',
      meritRating: 'Bonus 1',
      damageInsurance: 'No Coverage',
      optionalProducts: [],
      courtesyCar: 'No',
    });
    await page.productSection.clickNext();
    await page.expectInvalidMessage();
  });
});

describe('Form Validation - Send Quote (Mobile)', () => {
  let page: MobileAutomobileQuotePage;

  beforeEach(async () => {
    page = await gotoAutomobile();
    await page.fillAll(makeFullQuoteData('automobile'));
  });

  it('empty email blocks Send', async () => {
    await page.sendSection.email.setValue('');
    await page.sendSection.clickSend();
    await page.expectInvalidMessage();
  });

  it('phone with non-digits blocks Send', async () => {
    await page.sendSection.phone.setValue('+1-555-1234');
    await page.sendSection.clickSend();
    await page.expectInvalidMessage();
  });

  it('username shorter than 4 chars blocks Send', async () => {
    await page.sendSection.username.setValue('abc');
    await page.sendSection.clickSend();
    await page.expectInvalidMessage();
  });

  it('comments longer than 300 chars blocks Send', async () => {
    await page.sendSection.comments.setValue('a'.repeat(301));
    await page.sendSection.clickSend();
    await page.expectInvalidMessage();
  });
});
