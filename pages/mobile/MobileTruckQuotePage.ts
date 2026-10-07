import { MobileQuotePageBase } from './MobileQuotePageBase';
import type { VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Page object for the Truck quote flow on mobile Safari/Chrome.
 *
 * Truck keeps Payload + Total Weight fields, but drops Model and
 * Cylinder Capacity (Tricentis' idealForms config decides which fields
 * render based on the `selectedvehicle` cookie).
 */
export class MobileTruckQuotePage extends MobileQuotePageBase {
  readonly pageName = 'Mobile Truck Quote';
  readonly vehicleType: VehicleType = 'truck';
  readonly quoteType = 'Truck';
}
