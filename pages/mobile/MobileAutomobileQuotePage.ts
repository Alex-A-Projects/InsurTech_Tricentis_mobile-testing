import { MobileQuotePageBase } from './MobileQuotePageBase';
import type { VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Page object for the Automobile quote flow on mobile Safari/Chrome.
 *
 * All four vehicle types share the same URL (the form dynamically
 * hides/shows fields based on the `selectedvehicle` cookie). The
 * concrete subclasses just declare which vehicle they target.
 */
export class MobileAutomobileQuotePage extends MobileQuotePageBase {
  readonly pageName = 'Mobile Automobile Quote';
  readonly vehicleType: VehicleType = 'automobile';
  readonly quoteType = 'Automobile';
}
