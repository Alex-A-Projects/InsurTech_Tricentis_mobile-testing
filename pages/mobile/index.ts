/**
 * Barrel export for the mobile-web page objects.
 *
 * Consumers should reach the POMs through this barrel rather than
 * reaching into individual files, so renames stay local.
 */
export { BasePage } from '../base/BasePage';
export { MobileHomePage } from './MobileHomePage';
export {
  MobileQuotePageBase,
  TRICENTIS_BASE_URL,
  TRICENTIS_HOME_URL,
  TRICENTIS_QUOTE_URL,
  TRICENTIS_COOKIE_DOMAIN,
  TRICENTIS_COOKIE_PATH,
  SELECTED_VEHICLE_COOKIE,
} from './MobileQuotePageBase';
export { MobileAutomobileQuotePage } from './MobileAutomobileQuotePage';
export { MobileTruckQuotePage } from './MobileTruckQuotePage';
export { MobileMotorcycleQuotePage } from './MobileMotorcycleQuotePage';
export { MobileCamperQuotePage } from './MobileCamperQuotePage';
export { MobileFinishedPage } from './MobileFinishedPage';
