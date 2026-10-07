import { BasePage, MobileWebElement } from '../../pages/base/BasePage';
import type { VehicleData, VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Component object for the "Enter Vehicle Data" step of the Tricentis form.
 * Exposes the form fields for every vehicle type and the shared
 * "Next »" button that advances to the Insurant Data step.
 *
 * Note: Tricentis uses a cookie to decide which fields the form renders
 * for each vehicle type. We fill only the fields actually present.
 *
 * Mobile (WDI + Appium) adaptation:
 *   - `selectOption` → `selectByVisibleText`
 *   - `fill()` → `setValue()` + dispatched `keyup` (for idealforms)
 *   - `evaluate()` → `browser.execute(fn, el)`
 *   - `clickNext()` → still drives idealforms('nextStep') via execute()
 */
export class VehicleDataSection extends BasePage {
  readonly pageName = 'Vehicle Data Section';
  readonly url = ''; // Sections don't navigate on their own

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  // Form fields
  get make(): MobileWebElement {
    return this.byId('make');
  }
  get model(): MobileWebElement {
    return this.byId('model');
  }
  get cylinderCapacity(): MobileWebElement {
    return this.byId('cylindercapacity');
  }
  get enginePerformance(): MobileWebElement {
    return this.byId('engineperformance');
  }
  get dateOfManufacture(): MobileWebElement {
    return this.byId('dateofmanufacture');
  }
  get numberOfSeats(): MobileWebElement {
    return this.byId('numberofseats');
  }
  get numberOfSeatsMotorcycle(): MobileWebElement {
    return this.byId('numberofseatsmotorcycle');
  }
  get rightHandDriveYes(): MobileWebElement {
    return this.byCss('input[name="Right Hand Drive"][value="Yes"]');
  }
  get rightHandDriveNo(): MobileWebElement {
    return this.byCss('input[name="Right Hand Drive"][value="No"]');
  }
  get fuelType(): MobileWebElement {
    return this.byId('fuel');
  }
  get payload(): MobileWebElement {
    return this.byId('payload');
  }
  get totalWeight(): MobileWebElement {
    return this.byId('totalweight');
  }
  get listPrice(): MobileWebElement {
    return this.byId('listprice');
  }
  get licensePlateNumber(): MobileWebElement {
    return this.byId('licenseplatenumber');
  }
  get annualMileage(): MobileWebElement {
    return this.byId('annualmileage');
  }

  get nextButton(): MobileWebElement {
    return this.byId('nextenterinsurantdata');
  }

  async selectMake(make: string): Promise<void> {
    await this.make.selectByVisibleText(make);
  }

  async selectModel(model: string): Promise<void> {
    await this.model.selectByVisibleText(model);
  }

  async getAvailableMakes(): Promise<string[]> {
    const opts = await this.byCssAll('#make option');
    return Promise.all(opts.map(async (o) => (await o.getText()).trim()));
  }

  async getAvailableModels(): Promise<string[]> {
    const opts = await this.byCssAll('#model option');
    return Promise.all(opts.map(async (o) => (await o.getText()).trim()));
  }

  async getAvailableFuelTypes(): Promise<string[]> {
    const opts = await this.byCssAll('#fuel option');
    return Promise.all(opts.map(async (o) => (await o.getText()).trim()));
  }

  async fill(data: VehicleData, vehicleType: VehicleType = 'automobile'): Promise<void> {
    // Make is always present
    await this.make.selectByVisibleText(data.make);
    await this.make.scrollIntoView().catch(() => undefined);

    // Model only present for MOTORCYCLE (other vehicles have it removed)
    if (await this.isVisible(this.model)) {
      await this.model.selectByVisibleText(data.model);
    }

    // Cylinder capacity only present for MOTORCYCLE
    if (await this.isVisible(this.cylinderCapacity)) {
      await this.fillAndValidate(this.cylinderCapacity, String(data.cylinderCapacity));
    }

    await this.fillAndValidate(this.enginePerformance, String(data.enginePerformance));
    await this.fillAndValidate(this.dateOfManufacture, data.dateOfManufacture);

    // Fuel type: NOT shown for motorcycle
    if (await this.isVisible(this.fuelType)) {
      await this.fuelType.selectByVisibleText(data.fuelType);
    }

    // Number of seats: standard for auto/truck/camper; motorcycle variant for motorcycle
    if (vehicleType === 'motorcycle' && (await this.isVisible(this.numberOfSeatsMotorcycle))) {
      await this.numberOfSeatsMotorcycle.selectByVisibleText(data.numberOfSeats);
    } else if (await this.isVisible(this.numberOfSeats)) {
      await this.numberOfSeats.selectByVisibleText(data.numberOfSeats);
    }

    // Payload + Total Weight: only for truck + camper
    if ((await this.isVisible(this.payload)) && data.payload !== undefined) {
      await this.fillAndValidate(this.payload, String(data.payload));
    }
    if ((await this.isVisible(this.totalWeight)) && data.totalWeight !== undefined) {
      await this.fillAndValidate(this.totalWeight, String(data.totalWeight));
    }

    await this.fillAndValidate(this.listPrice, String(data.listPrice));

    // License plate: removed for motorcycle
    if (await this.isVisible(this.licensePlateNumber)) {
      await this.fillAndValidate(this.licensePlateNumber, data.licensePlateNumber);
    }

    await this.fillAndValidate(this.annualMileage, String(data.annualMileage));
  }

  async clickNext(): Promise<void> {
    await this.nextStep();
  }
}
