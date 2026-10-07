import shared from './wdio.shared.conf';

/**
 * Android Chrome configuration - targets a Samsung Galaxy AVD via Appium 2's
 * UiAutomator2 driver. We drive mobile Chrome against the live Tricentis
 * sample app (mobile-web testing, not native-app testing).
 *
 * Requirements (see README):
 *   - Android Studio installed
 *   - A Galaxy-series AVD created and named exactly `Galaxy_S24_API_34`
 *     (or change deviceName below to match your AVD's name)
 *   - A matching system image installed (API 34, Google APIs / Play Store)
 *   - Appium 2 + UiAutomator2 driver installed (npm run appium:install-drivers)
 *   - Appium server running (npm run appium:start) before invoking wdio
 *
 * NOTE: Android SDK AVD Manager ships with Pixel/Nexus device profiles.
 * "Samsung Galaxy" AVDs must be created manually. The easiest path is to
 * pick the closest device class (e.g. "Phone" + 1080x2400 + 420dpi) and
 * rename it. This config uses `Galaxy_S24_API_34` as the conventional
 * name; substitute your own AVD name below if you chose a different one.
 *
 * `chromedriverAutodownload: true` lets Appium fetch the matching
 * ChromeDriver the first time the session is created.
 */
const androidConfig: Record<string, unknown> = {
  ...shared,

  capabilities: [
    {
      browserName: 'Chrome',
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Galaxy_S24_API_34',
      'appium:platformVersion': '14.0',
      'appium:newCommandTimeout': 120,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:autoGrantPermissions': true,
      'appium:chromedriverAutodownload': true,
      'appium:networkSpeed': 'full',
      'appium:isHeadless': false,
      'appium:skipDeviceInitialization': false,
      'appium:skipServerInstallation': false,
      // Identifies this capability set in Allure reports
      'appium:customGalaxyDevice': 'Samsung Galaxy S24 Emulator',
    },
  ],

  maxInstances: 1,
};

export default androidConfig;
