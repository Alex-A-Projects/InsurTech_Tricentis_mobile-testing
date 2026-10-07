import { MobileQuotePageBase } from './MobileQuotePageBase';
import type { VehicleType } from '../../utils/helpers/insuranceData';

/**
 * Page object for the Motorcycle quote flow on mobile Safari/Chrome.
 *
 * Motorcycle is the only flow that keeps the Model field and the
 * Cylinder Capacity input. License Plate, Fuel Type, Payload, and
 * Total Weight are all removed.
 */
export class MobileMotorcycleQuotePage extends MobileQuotePageBase {
  readonly pageName = 'Mobile Motorcycle Quote';
  readonly vehicleType: VehicleType = 'motorcycle';
  readonly quoteType = 'Motorcycle';
}
