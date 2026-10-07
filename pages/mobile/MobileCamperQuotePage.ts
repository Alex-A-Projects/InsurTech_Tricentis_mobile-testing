import { MobileQuotePageBase } from './MobileQuotePageBase';
import type { VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Page object for the Camper quote flow on mobile Safari/Chrome.
 *
 * Camper keeps Payload + Total Weight fields, but drops Model and
 * Cylinder Capacity.
 */
export class MobileCamperQuotePage extends MobileQuotePageBase {
  readonly pageName = 'Mobile Camper Quote';
  readonly vehicleType: VehicleType = 'camper';
  readonly quoteType = 'Camper';
}
