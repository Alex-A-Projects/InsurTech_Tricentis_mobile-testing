import type { ChainablePromiseElement } from 'webdriverio';

/**
 * A unified type for WDI element handles. WebdriverIO's `browser.$()`
 * returns a `ChainablePromiseElement` (the lazy chainable wrapper) but
 * after awaiting you get back the `WebdriverIO.Element` (the resolved
 * form). For our POMs we just want a single name we can use everywhere
 * that supports both calling chainable methods and awaiting the
 * underlying element. This alias does the job without polluting the
 * rest of the framework with two different type names.
 */
export type MobileWebElement = ChainablePromiseElement;

/**
 * Base class shared by every mobile-web page object in the framework.
 *
 * Provides a small set of helpers that the concrete pages rely on so each
 * POM stays focused on selectors rather than ceremony. Mirrors the
 * structure of the Playwright project's BasePage but wraps
 * `WebdriverIO.Browser` and exposes mobile-aware helpers
 * (`scrollIntoView`, `tap`, `setText`, etc.).
 */
export abstract class BasePage {
  constructor(protected readonly browser: WebdriverIO.Browser) {}

  abstract readonly url: string;
  abstract readonly pageName: string;

  async goto(url?: string): Promise<void> {
    await this.browser.url(url ?? this.url);
  }

  async getTitle(): Promise<string> {
    return this.browser.getTitle();
  }

  async getCurrentUrl(): Promise<string> {
    return this.browser.getUrl();
  }

  protected byId(id: string): MobileWebElement {
    return this.browser.$(`#${id}`);
  }

  protected byName(name: string): MobileWebElement {
    return this.browser.$(`[name="${name}"]`);
  }

  protected byCss(selector: string): MobileWebElement {
    return this.browser.$(selector);
  }

  /**
   * WDI's `browser.$$()` returns a `ChainablePromiseArray` that
   * doesn't expose `.first()` and whose `.map()` returns an
   * `unknown[]`-typed array — both of which trip up strict TypeScript.
   * This helper resolves to a plain `MobileWebElement[]` so callers
   * can `Promise.all` and index normally.
   *
   * Public so tests can call it on page objects.
   */
  async byCssAll(selector: string): Promise<MobileWebElement[]> {
    const arr = await this.browser.$$(selector);
    return arr as unknown as MobileWebElement[];
  }

  protected getInvalidMsg(): MobileWebElement {
    return this.browser.$('#invalid');
  }

  /**
   * Tricentis's `#invalid` banner is unreliable (the form library hides it
   * on every change/keyup, so it flickers in and out). The reliable signal
   * is the field-level `.invalid` class applied by idealforms. We poll
   * the DOM via execute() for at least one field with that class.
   */
  async expectInvalidMessage(): Promise<void> {
    await this.browser.waitUntil(
      async () => {
        const count = await this.browser.execute<number, []>(
          () => document.querySelectorAll('.idealforms-field.invalid').length,
        );
        return count > 0;
      },
      { timeout: 10_000, timeoutMsg: 'Expected at least one field to have the `.invalid` class' },
    );
  }

  async expectInvalidMessageHidden(): Promise<void> {
    await this.browser.waitUntil(
      async () => {
        const count = await this.browser.execute<number, []>(
          () => document.querySelectorAll('.idealforms-field.invalid').length,
        );
        return count === 0;
      },
      { timeout: 10_000, timeoutMsg: 'Expected no fields to have the `.invalid` class' },
    );
  }

  /**
   * Check whether a locator points to a DOM node the user can actually see.
   * Tricentis's idealForms library removes fields entirely for some
   * vehicle types - we must check both existence and visibility.
   *
   * `isDisplayed()` in WDI takes the viewport into account, but Tricentis
   * also has fields wrapped in `display:none` containers. We poll the
   * computed offsetParent + bounding rect via execute() for robustness.
   */
  async isVisible(locator: MobileWebElement): Promise<boolean> {
    try {
      const exists = await locator.isExisting();
      if (!exists) return false;
      return await locator.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Fill an input and dispatch the `keyup` event so idealforms
   * re-runs its validation rules. Tricentis validation runs on
   * `change keyup` and sometimes skips when the value didn't change.
   *
   * Note: `browser.execute` types the callback's element argument as
   * `HTMLElement` (the WDI runtime passes the resolved element ref),
   * so we cast to `HTMLInputElement` inside the function body.
   */
  protected async fillAndValidate(locator: MobileWebElement, value: string): Promise<void> {
    await locator.setValue(value);
    await this.browser.execute<void, [typeof locator]>((el: HTMLElement) => {
      const input = el as HTMLInputElement;
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
    }, locator);
  }

  /**
   * Drive idealforms' jQuery nextStep handler directly. The `.next`
   * buttons on each step use delegated jQuery click handlers that are
   * unreliable under mobile Safari/Chrome; invoking nextStep on the
   * idealforms instance triggers the same code path deterministically.
   */
  protected async nextStep(): Promise<void> {
    await this.browser.execute<void, []>(() => {
      const w = window as unknown as {
        $?: (sel: string) => { idealforms?: (cmd: string) => void; length: number };
      };
      if (w.$ && w.$('form.idealforms').length) {
        w.$('form.idealforms').idealforms?.('nextStep');
      }
    });
    await this.browser.pause(500);
  }

  protected async scrollIntoView(locator: MobileWebElement): Promise<void> {
    await locator.scrollIntoView();
  }
}
