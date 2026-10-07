import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { makeFullQuoteData, PRICE_OPTIONS } from '../../utils/helpers/insuranceData';
import type { MobileWebElement } from '../../pages/base/BasePage';

/**
 * Price table coverage on mobile Safari/Chrome. Mirrors the desktop
 * price-table.spec.ts. The price table only renders for the
 * automobile flow (the documented Tricentis bug keeps the table
 * hidden for truck / motorcycle / camper).
 */

async function gotoAutomobile(): Promise<MobileAutomobileQuotePage> {
  const page = new MobileAutomobileQuotePage(browser);
  await page.goto();
  await page.assertLoaded();
  return page;
}

async function stepThroughToPrice(): Promise<MobileAutomobileQuotePage> {
  const page = await gotoAutomobile();
  const data = makeFullQuoteData('automobile');
  await page.vehicleSection.fill(data.vehicle);
  await page.vehicleSection.clickNext();
  await page.insurantSection.fill(data.insurant);
  await page.insurantSection.clickNext();
  await page.productSection.fill(data.product);
  await page.productSection.clickNext();
  await page.priceSection.expectPriceTableVisible();
  return page;
}

async function selectRadio(value: string): Promise<void> {
  const radio = browser.$(
    `input[name="Select Option"][value="${value}"]`,
  ) as unknown as MobileWebElement;
  await browser.execute<void, [MobileWebElement]>((el: HTMLElement) => {
    const input = el as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, radio);
}

describe('Price Table - Layout (Mobile)', () => {
  it('renders the price table with four plan columns', async () => {
    await stepThroughToPrice();
    const tableRoot = browser.$('#priceTable') as unknown as MobileAutomobileQuotePage;
    // `byCssAll` is defined on BasePage; we use a fresh page object
    // and reuse it to access the helper.
    const headers = await (
      tableRoot as unknown as {
        byCssAll: (s: string) => Promise<MobileWebElement[]>;
      }
    ).byCssAll('thead th');
    const headerTexts = await Promise.all(
      headers.map(async (h: MobileWebElement) => (await h.getText()).trim()),
    );
    expect(headerTexts).toContain('Silver');
    expect(headerTexts).toContain('Gold');
    expect(headerTexts).toContain('Platinum');
    expect(headerTexts).toContain('Ultimate');
  });

  it('price table has 4 radios named "Select Option"', async () => {
    await stepThroughToPrice();
    const tableRoot = browser.$('#priceTable') as unknown as {
      byCssAll: (s: string) => Promise<MobileWebElement[]>;
    };
    const radios = await tableRoot.byCssAll('input[name="Select Option"]');
    expect(radios.length).toBe(4);
  });

  it('all four radios are unchecked by default', async () => {
    await stepThroughToPrice();
    for (const opt of PRICE_OPTIONS) {
      const radio = browser.$(`input[name="Select Option"][value="${opt}"]`);
      const checked = await radio.isSelected();
      expect(checked).toBe(false);
    }
  });
});

describe('Price Table - Radio behaviour (Mobile)', () => {
  it('Silver plan radio can be selected', async () => {
    await stepThroughToPrice();
    await selectRadio('Silver');
    const checked = await browser.$('input[name="Select Option"][value="Silver"]').isSelected();
    expect(checked).toBe(true);
  });

  it('Gold plan radio can be selected', async () => {
    await stepThroughToPrice();
    await selectRadio('Gold');
    const checked = await browser.$('input[name="Select Option"][value="Gold"]').isSelected();
    expect(checked).toBe(true);
  });

  it('Platinum plan radio can be selected', async () => {
    await stepThroughToPrice();
    await selectRadio('Platinum');
    const checked = await browser.$('input[name="Select Option"][value="Platinum"]').isSelected();
    expect(checked).toBe(true);
  });

  it('Ultimate plan radio can be selected', async () => {
    await stepThroughToPrice();
    await selectRadio('Ultimate');
    const checked = await browser.$('input[name="Select Option"][value="Ultimate"]').isSelected();
    expect(checked).toBe(true);
  });

  it('switching plans deselects the previous one', async () => {
    await stepThroughToPrice();
    await selectRadio('Silver');
    await selectRadio('Gold');
    const silverChecked = await browser
      .$('input[name="Select Option"][value="Silver"]')
      .isSelected();
    const goldChecked = await browser.$('input[name="Select Option"][value="Gold"]').isSelected();
    expect(silverChecked).toBe(false);
    expect(goldChecked).toBe(true);
  });
});

describe('Price Table - Price column ordering (Mobile)', () => {
  it('prices ascend Silver < Gold < Platinum < Ultimate', async () => {
    await stepThroughToPrice();
    // Find the row whose first cell text starts with "Price".
    const prices = await browser.execute<number[], []>(() => {
      const rows = Array.from(document.querySelectorAll('#priceTable tbody tr')) as HTMLElement[];
      const priceRow = rows.find((r) => r.textContent?.includes('Price'));
      if (!priceRow) return [];
      // Skip first cell (label); collect the 4 price cells.
      const cells = Array.from(priceRow.querySelectorAll('td')).slice(1);
      return cells.map((c) => {
        const n = parseFloat((c.textContent || '').replace(/[^0-9.]/g, ''));
        return Number.isFinite(n) ? n : NaN;
      });
    });
    expect(prices.length).toBe(4);
    expect(prices[0]).toBeLessThan(prices[1]);
    expect(prices[1]).toBeLessThan(prices[2]);
    expect(prices[2]).toBeLessThan(prices[3]);
  });
});
