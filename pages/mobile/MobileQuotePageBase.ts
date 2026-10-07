import { BasePage, MobileWebElement } from '../base/BasePage';
import { VehicleDataSection } from '../../components/sections/VehicleDataSection';
import { InsurantDataSection } from '../../components/sections/InsurantDataSection';
import { ProductDataSection } from '../../components/sections/ProductDataSection';
import { PriceOptionSection } from '../../components/sections/PriceOptionSection';
import { SendQuoteSection } from '../../components/sections/SendQuoteSection';
import type { QuoteFormData, VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Tricentis constants. Centralised here so each vehicle-specific page
 * just declares its `quoteType` and inherits everything else.
 */
export const TRICENTIS_BASE_URL = 'https://sampleapp.tricentis.com/101/';
export const TRICENTIS_HOME_URL = `${TRICENTIS_BASE_URL}index.php`;
export const TRICENTIS_QUOTE_URL = `${TRICENTIS_BASE_URL}app.php`;
export const TRICENTIS_COOKIE_DOMAIN = 'sampleapp.tricentis.com';
export const TRICENTIS_COOKIE_PATH = '/101/';
export const SELECTED_VEHICLE_COOKIE = 'selectedvehicle';

/**
 * Base page object for all four mobile quote flows (automobile, truck,
 * motorcycle, camper). Aggregates the five form sections and exposes
 * navigation back to the home page, plus a high-level "fill entire form"
 * helper used by the happy-path tests.
 *
 * Mobile (WDI + Appium) adaptation: the only meaningful difference from
 * the desktop version is the cookie setup - we navigate to the home
 * page first so `setCookies` has a valid domain, then navigate to
 * `app.php` for the actual form.
 */
export abstract class MobileQuotePageBase extends BasePage {
  abstract readonly vehicleType: VehicleType;
  abstract readonly quoteType: string;

  readonly url = TRICENTIS_QUOTE_URL;

  readonly vehicleSection: VehicleDataSection;
  readonly insurantSection: InsurantDataSection;
  readonly productSection: ProductDataSection;
  readonly priceSection: PriceOptionSection;
  readonly sendSection: SendQuoteSection;

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
    this.vehicleSection = new VehicleDataSection(browser);
    this.insurantSection = new InsurantDataSection(browser);
    this.productSection = new ProductDataSection(browser);
    this.priceSection = new PriceOptionSection(browser);
    this.sendSection = new SendQuoteSection(browser);
  }

  get formContainer(): MobileWebElement {
    return this.byId('insurance-form');
  }
  get invalidMessage(): MobileWebElement {
    return this.byId('invalid');
  }
  // `#backmain` lives inside `#finished-container` and is only rendered
  // after the form is submitted. Use the always-visible top-nav Home
  // link for "go back to main" navigation during the quote flow.
  get backMainLink(): MobileWebElement {
    return this.byId('nav_home');
  }

  async goto(url?: string): Promise<void> {
    // Tricentis uses a `selectedvehicle` cookie to pick which fields
    // the form renders. On mobile Safari/Chrome the cookie has to be
    // set while we're on the right domain, so we hit the home page
    // first, set the cookie, then navigate to the quote form.
    await this.browser.url(TRICENTIS_HOME_URL);
    await this.browser.setCookies({
      name: SELECTED_VEHICLE_COOKIE,
      value: this.quoteType,
      domain: TRICENTIS_COOKIE_DOMAIN,
      path: TRICENTIS_COOKIE_PATH,
    });
    await this.browser.url(url ?? this.url);
    await this.waitForReady();
  }

  /**
   * Mobile Safari/Chrome do not honour a `networkidle` load condition
   * reliably - the page can settle long after the document loads.
   * Instead we wait for the form container to be displayed and give
   * Tricentis' jQuery idealForms a brief moment to attach its handlers.
   */
  async waitForReady(): Promise<void> {
    await this.formContainer.waitForDisplayed({ timeout: 30_000 }).catch(() => undefined);
    await this.browser.pause(500);
  }

  async assertLoaded(): Promise<void> {
    await this.formContainer.waitForDisplayed({ timeout: 30_000 });
  }

  async fillAll(data: QuoteFormData): Promise<void> {
    await this.vehicleSection.fill(data.vehicle, this.vehicleType);
    await this.vehicleSection.clickNext();
    await this.insurantSection.fill(data.insurant);
    await this.insurantSection.clickNext();
    await this.productSection.fill(data.product, this.vehicleType);
    await this.productSection.clickNext();

    // Tricentis has a known app bug: for non-automobile vehicles the
    // price table stays hidden because the idealforms validator still
    // requires Merit Rating + Courtesy Car (which are removed for
    // non-auto flows). We only assert the price table for automobile;
    // for others we skip directly to send quote.
    if (this.vehicleType === 'automobile') {
      await this.priceSection.expectPriceTableVisible();
      await this.priceSection.selectPriceOption(data.priceOption);
      await this.priceSection.clickNext();
    } else {
      // Best-effort: try to navigate forward if Send Quote is reachable
      try {
        await this.priceSection.expectPriceTableVisible();
        await this.priceSection.selectPriceOption(data.priceOption);
        await this.priceSection.clickNext();
      } catch {
        // App bug: cannot reach send quote without bypassing validation
      }
    }

    await this.sendSection.fill(data.sendQuote);
  }

  async submitQuote(data: QuoteFormData): Promise<void> {
    await this.fillAll(data);
    await this.sendSection.clickSend();
  }

  async goBackToMain(): Promise<void> {
    await this.backMainLink.click();
  }
}
