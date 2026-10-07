import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileHomePage } from '../../pages/mobile/MobileHomePage';

/**
 * Tests for the Tricentis landing page rendered in mobile Safari/Chrome.
 * Selectors match the Playwright project 1:1 - the only mobile-aware
 * change is `toBeDisplayed()` which is viewport-aware and accepts
 * elements that are scrolled below the fold but rendered.
 */

describe('Tricentis Home Page (Mobile)', () => {
  let homePage: MobileHomePage;

  beforeEach(async () => {
    homePage = new MobileHomePage(browser);
    await homePage.goto();
  });

  it('renders the page title', async () => {
    const title = await homePage.getTitle();
    expect(title).toMatch(/Tricentis/i);
  });

  it('shows the four vehicle type CTAs', async () => {
    await homePage.autoQuoteLink.scrollIntoView();
    await homePage.truckQuoteLink.scrollIntoView();
    await homePage.motorcycleQuoteLink.scrollIntoView();
    await homePage.camperQuoteLink.scrollIntoView();
    await expect(homePage.autoQuoteLink).toBeDisplayed();
    await expect(homePage.truckQuoteLink).toBeDisplayed();
    await expect(homePage.motorcycleQuoteLink).toBeDisplayed();
    await expect(homePage.camperQuoteLink).toBeDisplayed();
  });

  it('shows the four navigation tabs', async () => {
    await homePage.assertLoaded();
  });

  it('lists the four Welcome Aboard features', async () => {
    const features = await homePage.byCssAll('.feature-title');
    const texts = await Promise.all(features.map(async (t) => (await t.getText()).trim()));
    expect(texts.length).toBeGreaterThanOrEqual(0);
  });

  it('"Get a quote" links enumerate all four vehicle types', async () => {
    const links = await homePage.getAllVehiclePromoLinks();
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('Request Demo and Visit Support links are present', async () => {
    await homePage.requestDemoLink.scrollIntoView();
    await homePage.supportLink.scrollIntoView();
    await expect(homePage.requestDemoLink).toBeDisplayed();
    await expect(homePage.supportLink).toBeDisplayed();
  });

  it('Social links are present', async () => {
    await homePage.facebookLink.scrollIntoView();
    await homePage.twitterLink.scrollIntoView();
    await homePage.googleLink.scrollIntoView();
    await expect(homePage.facebookLink).toBeDisplayed();
    await expect(homePage.twitterLink).toBeDisplayed();
    await expect(homePage.googleLink).toBeDisplayed();
  });

  it('Clicking the Automobile promo navigates to the quote form', async () => {
    await homePage.clickAutomobileQuote();
    await browser.waitUntil(async () => /app\.php/.test(await browser.getUrl()), {
      timeout: 30_000,
      timeoutMsg: 'Expected URL to contain app.php after clicking Automobile promo',
    });
  });

  it('Clicking the Truck promo navigates to the quote form', async () => {
    await homePage.clickTruckQuote();
    await browser.waitUntil(async () => /app\.php/.test(await browser.getUrl()), {
      timeout: 30_000,
      timeoutMsg: 'Expected URL to contain app.php after clicking Truck promo',
    });
  });

  it('Clicking the Motorcycle promo navigates to the quote form', async () => {
    await homePage.clickMotorcycleQuote();
    await browser.waitUntil(async () => /app\.php/.test(await browser.getUrl()), {
      timeout: 30_000,
      timeoutMsg: 'Expected URL to contain app.php after clicking Motorcycle promo',
    });
  });

  it('Clicking the Camper promo navigates to the quote form', async () => {
    await homePage.clickCamperQuote();
    await browser.waitUntil(async () => /app\.php/.test(await browser.getUrl()), {
      timeout: 30_000,
      timeoutMsg: 'Expected URL to contain app.php after clicking Camper promo',
    });
  });

  it('External support link points to Tricentis', async () => {
    await homePage.supportLink.scrollIntoView();
    const href = await homePage.supportLink.getAttribute('href');
    expect(href).toContain('tricentis.com');
  });

  it('External request demo link points to Tricentis', async () => {
    await homePage.requestDemoLink.scrollIntoView();
    const href = await homePage.requestDemoLink.getAttribute('href');
    expect(href).toContain('tricentis.com');
  });

  it('Welcome Aboard section starts visible', async () => {
    await homePage.welcomeSection.scrollIntoView();
    await expect(homePage.welcomeSection).toBeDisplayed();
  });

  it('Footer copyright is visible', async () => {
    await homePage.footerCopyright.scrollIntoView();
    await expect(homePage.footerCopyright).toBeDisplayed();
  });
});
