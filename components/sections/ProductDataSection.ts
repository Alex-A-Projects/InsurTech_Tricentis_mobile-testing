import { BasePage, MobileWebElement } from '../../pages/base/BasePage';
import type { ProductData, VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Component object for the "Enter Product Data" step of the Tricentis
 * form. This step collects the policy parameters (start date,
 * insurance sum, merit rating, optional products, courtesy car).
 *
 * Note: Merit Rating + Courtesy Car are removed for truck, motorcycle,
 * and camper (the cookie decides which fields appear).
 *
 * Mobile (WDI + Appium) adaptation: same as VehicleDataSection.
 * Additionally, after clicking Next we re-invoke `initcalculation()`
 * twice with 300 ms pauses - this is the price-table render workaround
 * that survives porting to mobile Safari/Chrome because both browsers
 * run the same jQuery code.
 */
export class ProductDataSection extends BasePage {
  readonly pageName = 'Product Data Section';
  readonly url = '';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get startDate(): MobileWebElement {
    return this.byId('startdate');
  }
  get insuranceSum(): MobileWebElement {
    return this.byId('insurancesum');
  }
  get meritRating(): MobileWebElement {
    return this.byId('meritrating');
  }
  get damageInsurance(): MobileWebElement {
    return this.byId('damageinsurance');
  }
  get euroProtection(): MobileWebElement {
    return this.byId('EuroProtection');
  }
  get legalDefenseInsurance(): MobileWebElement {
    return this.byId('LegalDefenseInsurance');
  }
  get courtesyCar(): MobileWebElement {
    return this.byId('courtesycar');
  }

  get prevButton(): MobileWebElement {
    return this.byCss('.idealsteps-wrap > section:visible button:has-text("Prev")');
  }
  get nextButton(): MobileWebElement {
    return this.byId('nextselectpriceoption');
  }

  private async setCheckbox(locator: MobileWebElement, checked: boolean): Promise<void> {
    await this.browser.execute(
      (el: HTMLElement, c: boolean) => {
        const input = el as HTMLInputElement;
        input.checked = c;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      locator,
      checked,
    );
  }

  async fill(data: ProductData, _vehicleType: VehicleType = 'automobile'): Promise<void> {
    await this.fillAndValidate(this.startDate, data.startDate);
    await this.insuranceSum.selectByVisibleText(data.insuranceSum);

    // Merit Rating is only shown for automobile
    if (await this.isVisible(this.meritRating)) {
      await this.meritRating.selectByVisibleText(data.meritRating);
    }

    await this.damageInsurance.selectByVisibleText(data.damageInsurance);

    // Optional products: always dispatch a change event so idealforms re-runs
    // the `minoption:1` rule. Without it, an uncheck that doesn't change the
    // state (already unchecked) skips validation and leaves no `.invalid`.
    await this.setCheckbox(this.euroProtection, false);
    await this.setCheckbox(this.legalDefenseInsurance, false);

    for (const product of data.optionalProducts) {
      if (product === 'Euro Protection') {
        await this.setCheckbox(this.euroProtection, true);
      } else if (product === 'Legal Defense Insurance') {
        await this.setCheckbox(this.legalDefenseInsurance, true);
      }
    }

    // Courtesy car only for automobile
    if (await this.isVisible(this.courtesyCar)) {
      await this.courtesyCar.selectByVisibleText(data.courtesyCar);
    }
  }

  async clickPrev(): Promise<void> {
    await this.scrollIntoView(this.prevButton);
    await this.prevButton.click();
  }

  /**
   * Move to the Price Option step. After invoking idealforms' nextStep
   * we re-run `initcalculation()` twice with a 300 ms pause - this is
   * the workaround for Tricentis' jQuery show/primehide animations that
   * sometimes leave the price table un-rendered.
   */
  async clickNext(): Promise<void> {
    await this.nextStep();
    await this.browser.pause(800);

    // Manually run calculation in case the navigation event lost the hook.
    await this.browser
      .execute(() => {
        const w = window as unknown as { initcalculation?: () => void };
        if (typeof w.initcalculation === 'function') w.initcalculation();
      })
      .catch(() => undefined);
    await this.browser.pause(300);

    await this.browser
      .execute(() => {
        const w = window as unknown as { initcalculation?: () => void };
        if (typeof w.initcalculation === 'function') w.initcalculation();
      })
      .catch(() => undefined);
  }
}
