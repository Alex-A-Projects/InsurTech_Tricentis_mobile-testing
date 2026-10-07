import { BasePage, MobileWebElement } from '../../pages/base/BasePage';
import type { InsurantData } from '../../utils/helpers/insuranceData';

/**
 * Component object for the "Enter Insurant Data" step of the Tricentis
 * form. This step collects the policy holder's personal details and
 * preferences, then advances to the Product Data step.
 *
 * Mobile (WDI + Appium) adaptation:
 *   - Fill events dispatch a `keyup` after `setValue` for idealforms.
 *   - Gender + hobby checkboxes use the same manual `.checked = true`
 *     + dispatch change pattern (Tricentis' idealForms overlays block
 *     plain clicks).
 */
export class InsurantDataSection extends BasePage {
  readonly pageName = 'Insurant Data Section';
  readonly url = '';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get firstName(): MobileWebElement {
    return this.byId('firstname');
  }
  get lastName(): MobileWebElement {
    return this.byId('lastname');
  }
  get dateOfBirth(): MobileWebElement {
    return this.byId('birthdate');
  }
  get genderMale(): MobileWebElement {
    return this.byId('gendermale');
  }
  get genderFemale(): MobileWebElement {
    return this.byId('genderfemale');
  }
  get streetAddress(): MobileWebElement {
    return this.byId('streetaddress');
  }
  get country(): MobileWebElement {
    return this.byId('country');
  }
  get zipCode(): MobileWebElement {
    return this.byId('zipcode');
  }
  get city(): MobileWebElement {
    return this.byId('city');
  }
  get occupation(): MobileWebElement {
    return this.byId('occupation');
  }
  get hobbySpeeding(): MobileWebElement {
    return this.byId('speeding');
  }
  get hobbyBungeeJumping(): MobileWebElement {
    return this.byId('bungeejumping');
  }
  get hobbyCliffDiving(): MobileWebElement {
    return this.byId('cliffdiving');
  }
  get hobbySkydiving(): MobileWebElement {
    return this.byId('skydiving');
  }
  get hobbyOther(): MobileWebElement {
    return this.byId('other');
  }
  get website(): MobileWebElement {
    return this.byId('website');
  }
  get pictureInput(): MobileWebElement {
    return this.byCss('input[type="file"]#picture');
  }

  // Scope to the visible step section: every step renders its own Prev
  // button, but only the active step's is visible (others live inside a
  // `display:none` section). `:visible` works in WDI's CSS selectors
  // and matches the desktop project's behaviour exactly.
  get prevButton(): MobileWebElement {
    return this.byCss('.idealsteps-wrap > section:visible button:has-text("Prev")');
  }
  get nextButton(): MobileWebElement {
    return this.byId('nextenterproductdata');
  }

  /**
   * Programmatically set a checkbox's `checked` property and dispatch
   * the `change` event. Tricentis' idealForms wraps radios/checkboxes
   * with `<span>` overlays that intercept pointer events, so a plain
   * click/tap is unreliable on both desktop and mobile browsers.
   *
   * `browser.execute` types the element arg as `HTMLElement`; we cast
   * to `HTMLInputElement` inside the function.
   */
  private async setCheckbox(locator: MobileWebElement, checked: boolean): Promise<void> {
    await this.browser.execute(
      (el: HTMLElement, c: boolean) => {
        const input = el as HTMLInputElement;
        if (input.checked !== c) {
          input.checked = c;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (c) {
          // Already checked but idealforms' `minoption:1` rule may
          // still need a re-trigger after a clear-then-fill sequence.
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      locator,
      checked,
    );
  }

  async fill(data: InsurantData): Promise<void> {
    await this.fillAndValidate(this.firstName, data.firstName);
    await this.fillAndValidate(this.lastName, data.lastName);
    await this.fillAndValidate(this.dateOfBirth, data.dateOfBirth);

    if (data.gender === 'Male') {
      await this.setCheckbox(this.genderMale, true);
    } else {
      await this.setCheckbox(this.genderFemale, true);
    }

    await this.fillAndValidate(this.streetAddress, data.streetAddress);
    await this.country.selectByVisibleText(data.country);
    await this.fillAndValidate(this.zipCode, data.zipCode);
    await this.fillAndValidate(this.city, data.city);
    await this.occupation.selectByVisibleText(data.occupation);

    // Uncheck all hobbies first so the final state matches `data.hobbies`.
    // idealforms' `minoption:1` rule only re-runs when the checked count
    // changes, so force one check first to make sure the unchecked-then-zero
    // transition is observed.
    const allHobbies = [
      this.hobbySpeeding,
      this.hobbyBungeeJumping,
      this.hobbyCliffDiving,
      this.hobbySkydiving,
      this.hobbyOther,
    ];

    await this.setCheckbox(this.hobbySpeeding, true);
    for (const h of allHobbies) {
      await this.setCheckbox(h, false);
    }

    for (const hobby of data.hobbies) {
      switch (hobby) {
        case 'Speeding':
          await this.setCheckbox(this.hobbySpeeding, true);
          break;
        case 'Bungee Jumping':
          await this.setCheckbox(this.hobbyBungeeJumping, true);
          break;
        case 'Cliff Diving':
          await this.setCheckbox(this.hobbyCliffDiving, true);
          break;
        case 'Skydiving':
          await this.setCheckbox(this.hobbySkydiving, true);
          break;
        case 'Other':
          await this.setCheckbox(this.hobbyOther, true);
          break;
      }
    }

    if (data.website) {
      await this.fillAndValidate(this.website, data.website);
    }
  }

  async clickPrev(): Promise<void> {
    await this.scrollIntoView(this.prevButton);
    await this.prevButton.click();
  }

  async clickNext(): Promise<void> {
    await this.nextStep();
  }
}
