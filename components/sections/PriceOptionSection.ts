import { expect } from 'expect-webdriverio';
import { BasePage, MobileWebElement } from '../../pages/base/BasePage';
import { PRICE_OPTIONS } from '../../utils/helpers/insuranceData';

/**
 * Component object for the "Select Price Option" step of the Tricentis
 * form. The price table is read-only (Silver/Gold/Platinum/Ultimate);
 * the user picks a plan via radio buttons.
 *
 * Mobile (WDI + Appium) adaptation: identical selectors + interactions
 * to the desktop project. `setChecked` mirrors the manual `.checked +
 * dispatch change` workaround idealforms expects.
 */
export class PriceOptionSection extends BasePage {
  readonly pageName = 'Price Option Section';
  readonly url = '';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get priceTable(): MobileWebElement {
    // WDI's `$$('selector1, selector2').first()` doesn't exist on the
    // returned chainable - we use a CSS selector that matches either
    // `#priceTable` or `table` and pick the first match.
    return this.byCss('#priceTable, table');
  }
  get silverRadio(): MobileWebElement {
    return this.byCss(`input[name="Select Option"][value="${PRICE_OPTIONS[0]}"]`);
  }
  get goldRadio(): MobileWebElement {
    return this.byCss(`input[name="Select Option"][value="${PRICE_OPTIONS[1]}"]`);
  }
  get platinumRadio(): MobileWebElement {
    return this.byCss(`input[name="Select Option"][value="${PRICE_OPTIONS[2]}"]`);
  }
  get ultimateRadio(): MobileWebElement {
    return this.byCss(`input[name="Select Option"][value="${PRICE_OPTIONS[3]}"]`);
  }
  get viewQuoteButton(): MobileWebElement {
    return this.byCss('#viewquote, button:has-text("View Quote")');
  }
  get downloadQuoteButton(): MobileWebElement {
    return this.byId('downloadquote');
  }
  get prevButton(): MobileWebElement {
    return this.byCss('.idealsteps-wrap > section:visible button:has-text("Prev")');
  }
  get nextButton(): MobileWebElement {
    return this.byId('nextsendquote');
  }

  async isPriceTableRendered(): Promise<boolean> {
    return this.priceTable.isDisplayed().catch(() => false);
  }

  async selectPriceOption(option: string): Promise<void> {
    const radios: Record<string, MobileWebElement> = {
      Silver: this.silverRadio,
      Gold: this.goldRadio,
      Platinum: this.platinumRadio,
      Ultimate: this.ultimateRadio,
    };
    const radio = radios[option];
    if (!radio) throw new Error(`Unknown price option: ${option}`);

    await this.browser.execute((el: HTMLElement) => {
      const input = el as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, radio);
  }

  async clickNext(): Promise<void> {
    await this.nextStep();
  }

  async clickPrev(): Promise<void> {
    await this.scrollIntoView(this.prevButton);
    await this.prevButton.click();
  }

  async expectPriceTableVisible(): Promise<void> {
    // Tricentis manages step visibility via idealforms - wait for the
    // price table element itself to be visible (not just its parent section
    // display property to briefly flicker through `block`).
    await this.priceTable.waitForDisplayed({ timeout: 30_000 });
    await expect(this.priceTable).toBeDisplayed({ wait: 30_000 });
  }
}
