import { expect } from 'expect-webdriverio';
import { BasePage, MobileWebElement } from '../base/BasePage';

/**
 * Page object for the post-submit "Finished" page on mobile Safari/Chrome.
 *
 * When a quote is successfully submitted on the Tricentis form, the
 * server-side handler redirects to `#/finished.php` (a static page
 * with a "Send" confirmation, a download link, and a "back to main"
 * button). This page object models that screen and is reachable via
 * `browser.url()` after the automobile submission step succeeds.
 */
export class MobileFinishedPage extends BasePage {
  readonly url = 'https://sampleapp.tricentis.com/101/finished.php';
  readonly pageName = 'Mobile Finished';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get successHeading(): MobileWebElement {
    return this.byCss('h1, h2');
  }
  get bodyText(): MobileWebElement {
    return this.byCss('body');
  }
  get backToMainLink(): MobileWebElement {
    return this.byCss('a[href*="index"], #backmain');
  }
  get downloadLink(): MobileWebElement {
    return this.byCss('a[href*=".pdf"], a:has-text("Download")');
  }
  get emailBadge(): MobileWebElement {
    return this.byCss('.sa-icon, .check-icon');
  }

  async assertLoaded(): Promise<void> {
    await this.successHeading.waitForDisplayed({ timeout: 30_000 });
    await expect(this.successHeading).toBeDisplayed();
  }

  async getHeadingText(): Promise<string> {
    return (await this.successHeading.getText()).trim();
  }

  async getBodyText(): Promise<string> {
    return (await this.bodyText.getText()).trim();
  }

  async clickBackToMain(): Promise<void> {
    await this.backToMainLink.click();
  }
}
