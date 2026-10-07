import { expect } from 'expect-webdriverio';
import { BasePage, MobileWebElement } from '../base/BasePage';
import { TRICENTIS_HOME_URL } from './MobileQuotePageBase';

/**
 * Page object for the Tricentis landing page
 * https://sampleapp.tricentis.com/101/index.php (mobile web).
 *
 * The home page is a marketing page with four "Get your <vehicle>
 * Insurance" promo blocks (Automobile, Truck, Motorcycle, Camper) and
 * image tiles linking to the same quote forms. The selectors below
 * match the Playwright project's HomePage 1:1 - the Tricentis DOM
 * contract is identical on mobile Safari/Chrome.
 */
export class MobileHomePage extends BasePage {
  readonly url = TRICENTIS_HOME_URL;
  readonly pageName = 'Tricentis Home (Mobile)';

  // Headings
  get headingTitle(): MobileWebElement {
    return this.byCss('h1');
  }

  // Navigation
  get navAutomobile(): MobileWebElement {
    return this.byId('nav_automobile');
  }
  get navTruck(): MobileWebElement {
    return this.byId('nav_truck');
  }
  get navMotorcycle(): MobileWebElement {
    return this.byId('nav_motorcycle');
  }
  get navCamper(): MobileWebElement {
    return this.byId('nav_camper');
  }

  // Promo "Get a quote" links
  get autoQuoteLink(): MobileWebElement {
    return this.byId('get_automobile');
  }
  get truckQuoteLink(): MobileWebElement {
    return this.byId('get_truck');
  }
  get motorcycleQuoteLink(): MobileWebElement {
    return this.byId('get_motorcycle');
  }
  get camperQuoteLink(): MobileWebElement {
    return this.byId('get_camper');
  }

  // Image offer tiles
  get autoOfferLink(): MobileWebElement {
    return this.byId('offer_automobile');
  }
  get truckOfferLink(): MobileWebElement {
    return this.byId('offer_truck');
  }
  get motorcycleOfferLink(): MobileWebElement {
    return this.byId('offer_motorcycle');
  }
  get camperOfferLink(): MobileWebElement {
    return this.byId('offer_camper');
  }

  // Hero / sections - the new layout uses `.section-title` headings inside divs
  get welcomeSection(): MobileWebElement {
    return this.byCss('.greet-section');
  }
  // Pick the first `.section-title` element (matches the headline
  // "Our Insane Insurance Offer" container on the home page).
  get offersSection(): MobileWebElement {
    return this.byCss('.section-title');
  }
  get featuresList(): MobileWebElement {
    return this.byCss('.feature-title');
  }

  // Footer
  get footerCopyright(): MobileWebElement {
    return this.byCss('.site-footer');
  }
  get footerLinks(): MobileWebElement {
    return this.byCss('.footer-navigation a');
  }
  get facebookLink(): MobileWebElement {
    return this.byId('nav_facebook');
  }
  get twitterLink(): MobileWebElement {
    return this.byId('nav_twitter');
  }
  get googleLink(): MobileWebElement {
    return this.byId('nav_google');
  }

  // Support / demo
  get requestDemoLink(): MobileWebElement {
    return this.byCss('a:has-text("Request Demo")');
  }
  get supportLink(): MobileWebElement {
    return this.byCss('a:has-text("Visit Support")');
  }

  async assertLoaded(): Promise<void> {
    await this.headingTitle.waitForDisplayed({ timeout: 30_000 });
    // Mobile viewports may stack nav tabs vertically; `toBeDisplayed`
    // is viewport-aware so we tolerate them being scrolled below the fold.
    await expect(this.navAutomobile).toBeDisplayed();
    await expect(this.navTruck).toBeDisplayed();
    await expect(this.navMotorcycle).toBeDisplayed();
    await expect(this.navCamper).toBeDisplayed();
  }

  async getAllVehiclePromoLinks(): Promise<string[]> {
    const links = await this.byCssAll('.slide-title');
    return Promise.all(links.map(async (l) => (await l.getText()).trim()));
  }

  /**
   * Mobile home page is vertically long; scroll each promo link into
   * view before tapping so the tap registers on the element rather
   * than on a viewport-clipped offscreen pixel.
   */
  private async safeClick(el: MobileWebElement): Promise<void> {
    await el.scrollIntoView();
    await el.click();
  }

  async clickAutomobileQuote(): Promise<void> {
    await this.safeClick(this.autoQuoteLink);
  }

  async clickTruckQuote(): Promise<void> {
    await this.safeClick(this.truckQuoteLink);
  }

  async clickMotorcycleQuote(): Promise<void> {
    await this.safeClick(this.motorcycleQuoteLink);
  }

  async clickCamperQuote(): Promise<void> {
    await this.safeClick(this.camperQuoteLink);
  }
}
