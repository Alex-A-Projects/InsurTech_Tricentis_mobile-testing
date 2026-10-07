import shared from './wdio.shared.conf';

/**
 * iOS Safari configuration - targets an iPhone 17-series Simulator
 * via Appium 2's XCUITest driver. No app is installed: we drive Safari
 * against the live Tricentis sample app (mobile-web testing).
 *
 * Requirements (see README):
 *   - Xcode 16+ installed
 *   - iPhone 17 simulator created/available
 *   - Appium 2 + XCUITest driver installed (npm run appium:install-drivers)
 *   - Appium server running (npm run appium:start) before invoking wdio
 *
 * The iPhone 17 was announced September 2025 and requires Xcode 16+.
 * If you only have Xcode 15, change deviceName + platformVersion below
 * to match an available simulator (e.g. iPhone 15 / iOS 17).
 */
const iosConfig: Record<string, unknown> = {
  ...shared,

  capabilities: [
    {
      browserName: 'Safari',
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 17',
      'appium:platformVersion': '18.0',
      'appium:newCommandTimeout': 120,
      'appium:autoAcceptAlerts': true,
      'appium:autoDismissAlerts': false,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:webkitDebugProxyEnabled': false,
      'appium:safariAllowPopups': true,
      'appium:safariIgnoreFraudWarning': true,
      'appium:safariOpenLinksInBackground': false,
      // Identifies this capability set in Allure reports
      'appium:customSafariDevice': 'iPhone 17 Simulator',
    },
  ],

  maxInstances: 1,
};

export default iosConfig;
