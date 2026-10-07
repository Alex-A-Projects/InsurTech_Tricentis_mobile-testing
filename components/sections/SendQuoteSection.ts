import { expect } from 'expect-webdriverio';
import { BasePage, MobileWebElement } from '../../pages/base/BasePage';
import type { SendQuoteData } from '../../utils/helpers/insuranceData';

/**
 * Component object for the "Send Quote" step of the Tricentis form.
 * Final step that captures contact credentials and submits the form.
 *
 * Mobile (WDI + Appium) adaptation: same selectors + interactions to
 * the desktop project. `clickSend` triggers the form's `#sendemail`
 * button via jQuery click (the delegated handler is more reliable
 * than a native tap on both Safari and Chrome).
 */
export class SendQuoteSection extends BasePage {
  readonly pageName = 'Send Quote Section';
  readonly url = '';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get email(): MobileWebElement {
    return this.byId('email');
  }
  get phone(): MobileWebElement {
    return this.byId('phone');
  }
  get username(): MobileWebElement {
    return this.byId('username');
  }
  get password(): MobileWebElement {
    return this.byId('password');
  }
  get confirmPassword(): MobileWebElement {
    return this.byId('confirmpassword');
  }
  get comments(): MobileWebElement {
    return this.byId('Comments');
  }

  get prevButton(): MobileWebElement {
    return this.byCss('.idealsteps-wrap > section:visible button:has-text("Prev")');
  }
  get sendButton(): MobileWebElement {
    // Use the CSS selector then `.first()` after first() returns an
    // element. `browser.$$('selector').first()` doesn't work because
    // WDI's ChainablePromiseArray doesn't expose `.first()`; we use
    // index access instead.
    const sel = '#sendemail, button:has-text("Send")';
    return this.byCss(sel);
  }

  // Confirmation modal - SweetAlert-style markup
  get confirmationModal(): MobileWebElement {
    return this.byCss('.sweet-alert, .sa-modal, [role="dialog"]');
  }
  get confirmationTitle(): MobileWebElement {
    return this.byCss('.sweet-alert h2, .sa-modal h2, h2');
  }
  get confirmationOkButton(): MobileWebElement {
    return this.byCss('button.confirm, button:has-text("OK")');
  }

  async fill(data: SendQuoteData): Promise<void> {
    await this.fillAndValidate(this.email, data.email);
    await this.fillAndValidate(this.phone, data.phone);
    await this.fillAndValidate(this.username, data.username);
    await this.fillAndValidate(this.password, data.password);
    await this.fillAndValidate(this.confirmPassword, data.confirmPassword);
    if (data.comments) {
      await this.fillAndValidate(this.comments, data.comments);
    }
  }

  async clickSend(): Promise<void> {
    // Trigger the delegated jQuery click on #sendemail directly. Plain
    // tap() works on most runs but the delegated handler occasionally
    // swallows the touch; invoking it via jQuery is deterministic.
    const id = await this.sendButton.getAttribute('id').catch(() => null);
    if (id) {
      await this.browser.execute((buttonId: string) => {
        const w = window as unknown as {
          $?: (sel: string) => { trigger: (e: string) => void };
        };
        if (w.$) {
          w.$('#' + buttonId).trigger('click');
        } else {
          document.getElementById(buttonId)?.click();
        }
      }, id);
    } else {
      await this.sendButton.click();
    }
    await this.browser.pause(500);
  }

  async clickPrev(): Promise<void> {
    await this.scrollIntoView(this.prevButton);
    await this.prevButton.click();
  }

  async expectConfirmationVisible(): Promise<void> {
    await expect(this.confirmationModal).toBeDisplayed({ wait: 15_000 });
  }

  async getConfirmationText(): Promise<string> {
    const text = await this.confirmationModal.getText().catch(() => '');
    return (text ?? '').trim();
  }
}
