# Tricentis Vehicle Insurance — Mobile Web Automation Framework

End-to-end test automation framework for the
[Tricentis Vehicle Insurance Sample App](https://sampleapp.tricentis.com/101/),
built with **WebdriverIO 9 + Appium 2 + TypeScript**. This is the mobile-web
companion to the desktop-browser [Playwright/TypeScript
framework](../InsurTech_Tricentis_playwright-typescript) — the two projects
share the same POM structure, section components, and test coverage, but
this one targets **real mobile Safari/Chrome** running on iOS Simulator and
Android Emulator respectively.

> This is **mobile web** testing (browser on a phone), not native-app
> testing. The Tricentis app is a static PHP form; there is no native
> component to drive.

---

## Quick Start

```bash
# 1. Install Node dependencies (WebdriverIO 9, Appium 2, expect-webdriverio)
npm install

# 2. Install the two Appium drivers we need
npm run appium:install-drivers

# 3. Start the Appium server (in one terminal)
npm run appium:start

# 4. Run the mobile Safari suite against an iPhone 17 Simulator
# (in another terminal)
npm run test:ios

# Or run the mobile Chrome suite against a Samsung Galaxy AVD
npm run test:android

# Or run both back-to-back
npm run test:both

# Smoke-only run for fast CI gating
npm run test:ios:smoke
npm run test:android:smoke

# 5. Generate and open the Allure HTML report
npm run report
```

---

## What This Framework Tests

The Tricentis Vehicle Insurance Sample App exposes a 5-step insurance quote
form (Vehicle → Insurant → Product → Price Option → Send Quote) for four
vehicle types (Automobile, Truck, Motorcycle, Camper). The framework exercises
every section of that form on mobile Safari/Chrome.

| Test spec             | Coverage                                                                                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smoke.spec.ts`       | One load test per vehicle type; full automobile E2E submission                                                                                                                                     |
| `home.spec.ts`        | Title, 4 nav tabs, 4 promo CTAs, social, demo/support links                                                                                                                                        |
| `automobile.spec.ts`  | Full happy path, all 4 price plans, validations, country/occupation/hobby lists, optional products                                                                                                 |
| `truck.spec.ts`       | Payload + total weight fields, partial happy path, key validations                                                                                                                                 |
| `motorcycle.spec.ts`  | Cylinder capacity + model, seat range, partial happy path                                                                                                                                          |
| `camper.spec.ts`      | Payload + total weight fields, all 4 price plans                                                                                                                                                   |
| `navigation.spec.ts`  | Forward/back between all 5 sections preserves data                                                                                                                                                 |
| `validation.spec.ts`  | Empty fields, future DOB, invalid email, password mismatch, etc.                                                                                                                                   |
| `boundaries.spec.ts`  | Field numeric ranges (engine perf 1/2000, mileage 100/100000, list price 500, plate 10 chars, payload 1/1000, total weight 100/50000, cylinder 1/2000, zip 4-8 digits, comments 300, phone digits) |
| `dates.spec.ts`       | Date picker quirks (manufacture past/future, DOB 18-70, start date ≥1 month)                                                                                                                       |
| `fields.spec.ts`      | Hobbies, optional products, gender, fuel, country, insurance sum, merit rating, damage, courtesy, seats                                                                                            |
| `flows.spec.ts`       | All 4 price plans × auto, all 4 vehicles Silver, 6 makes, 5 countries, occupations                                                                                                                 |
| `price-table.spec.ts` | 4 columns, prices ascending, 4 radios, switch plans, back to product                                                                                                                               |
| `viewport.spec.ts`    | Mobile-specific viewport checks: dimensions, scroll-into-view, touch-target sizes, orientation                                                                                                     |
| `post-submit.spec.ts` | Full automobile submission, confirmation modal, idempotency, finished.php landing page                                                                                                             |
| **Total**             | **~180 tests** (smaller than desktop because layout/visual/SEO tests are out-of-scope for mobile)                                                                                                  |

---

## Stack

| Layer           | Tool                                                 |
| --------------- | ---------------------------------------------------- |
| Test runner     | WebdriverIO `^9` (Mocha BDD framework)               |
| Mobile driver   | Appium `^2.12` + `xcuitest` + `uiautomator2` drivers |
| iOS browser     | Safari on iPhone 17-series iOS Simulator             |
| Android browser | Chrome on Samsung Galaxy AVD                         |
| Assertions      | expect-webdriverio `^6` (pinned to WDI 9.31 peer dep) |
| Language        | TypeScript `^5.6` (strict mode)                      |
| Reporting       | `@wdio/allure-reporter` + `allure-commandline`       |
| Spec reporter   | `@wdio/spec-reporter`                                |
| Formatting      | Prettier `^3`                                       |
| Node            | >=20                                                 |

**No Playwright**. This project explicitly demonstrates mobile-web testing on
real iOS Simulator and Android Emulator sessions.

---

## Project Structure

```
InsurTech_Tricentis_mobile-testing/
├── pages/
│   ├── base/
│   │   └── BasePage.ts                       # Wraps WebdriverIO.Browser, idealforms helpers
│   └── mobile/
│       ├── MobileHomePage.ts                 # Landing page
│       ├── MobileQuotePageBase.ts            # Aggregates 5 sections + sets `selectedvehicle` cookie
│       ├── MobileAutomobileQuotePage.ts
│       ├── MobileTruckQuotePage.ts
│       ├── MobileMotorcycleQuotePage.ts
│       ├── MobileCamperQuotePage.ts
│       ├── MobileFinishedPage.ts             # Post-submit confirmation landing page
│       └── index.ts
│
├── components/
│   └── sections/
│       ├── VehicleDataSection.ts
│       ├── InsurantDataSection.ts
│       ├── ProductDataSection.ts
│       ├── PriceOptionSection.ts
│       └── SendQuoteSection.ts
│
├── utils/
│   └── helpers/
│       ├── testData.ts                      # Random data generators
│       ├── dateHelpers.ts                   # Tricentis MM/DD/YYYY helpers
│       ├── insuranceData.ts                 # Reference option lists + factories
│       └── index.ts
│
├── fixtures/
│   ├── wdioFixtures.ts                      # Module-scoped test data
│   └── data/
│       ├── automobileData.json
│       ├── truckData.json
│       ├── motorcycleData.json
│       └── camperData.json
│
├── tests/
│   └── specs/
│       ├── smoke.spec.ts
│       ├── home.spec.ts
│       ├── automobile.spec.ts
│       ├── truck.spec.ts
│       ├── motorcycle.spec.ts
│       ├── camper.spec.ts
│       ├── navigation.spec.ts
│       ├── validation.spec.ts
│       ├── boundaries.spec.ts
│       ├── dates.spec.ts
│       ├── fields.spec.ts
│       ├── flows.spec.ts
│       ├── price-table.spec.ts
│       ├── viewport.spec.ts                  # Mobile-specific viewport behaviours
│       └── post-submit.spec.ts                # Full submission, confirmation, finished page

├── .github/
│   └── workflows/
│       └── ci.yml                            # GitHub Actions: lint + iOS + Android in parallel
├── allure-config/
│   ├── environment.properties                # Allure environment metadata
│   └── categories.json                       # Allure failure categories
├── .nvmrc                                     # Node 20
│
├── wdio.shared.conf.ts                      # Base config: Mocha, reporters, screenshot hook
├── wdio.ios.conf.ts                          # iOS Safari / XCUITest capabilities
├── wdio.android.conf.ts                      # Android Chrome / UiAutomator2 capabilities
├── package.json
├── tsconfig.json
└── README.md
```

### Page Object Model Layout

```
BasePage (abstract, wraps WebdriverIO.Browser)
    └── MobileHomePage

MobileQuotePageBase (abstract, aggregates 5 sections)
    ├── MobileAutomobileQuotePage
    ├── MobileTruckQuotePage
    ├── MobileMotorcycleQuotePage
    └── MobileCamperQuotePage

MobileHomePage                                 ← each class = Page Object
VehicleDataSection
InsurantDataSection
ProductDataSection
PriceOptionSection
SendQuoteSection
```

The `Mobile*` prefix distinguishes the mobile-web POMs from any future
non-mobile ones, even though there is only one browser target today.

---

## Prerequisites

- **Node.js 20+** — WebdriverIO 9 requires Node ≥20.
- **JDK 17** — required by Appium 2 + the UiAutomator2 driver.
- **Xcode 16+** with the iOS Simulator runtime — for iOS Safari.
- **Android Studio** with the Android Emulator runtime — for Android Chrome.
- **Appium 2.x** — installed via `npm install` in this repo.
- **Allure commandline** — installed via npm (`allure-commandline` dep).
  Alternatively, install globally with `brew install allure` or `npm i -g
allure-commandline`.

### iOS Simulator setup

The iOS config targets an `iPhone 17` device on iOS `18.0`. Both require
Xcode 16+. If you only have an earlier Xcode, edit `wdio.ios.conf.ts`:

```ts
'appium:deviceName': 'iPhone 15',
'appium:platformVersion': '17.0',
```

You can create the simulator explicitly from the CLI:

```bash
xcrun simctl create "iPhone 17" "iPhone 17" "iOS-18-0"
```

…or just boot any iPhone 17 Simulator from Xcode → Open Developer Tool →
Simulator before running the suite.

### Android Emulator setup

The Android config targets a `Galaxy_S24_API_34` AVD on API 34. The
default Android Emulator ships with Pixel/Nexus device profiles, not
Samsung Galaxy. Either:

1. **Create the AVD via Android Studio** — AVD Manager → Create Virtual
   Device → Phone → choose a Galaxy-class device (e.g. "Galaxy S24" if
   available, otherwise pick "Pixel 8 Pro" with a 6.1" screen) → Next →
   choose API 34 ("UpsideDownCake") system image → Finish. Match the
   resulting AVD name to the value in `wdio.android.conf.ts`, or change
   `appium:deviceName` in the config to match your AVD's actual name.

```bash
# Or from the shell, using avdmanager (ships with Android SDK):
avdmanager create avd -n Galaxy_S24_API_34 \
  -k "system-images;android-34;google_apis;arm64-v8a" \
  -d "pixel_8_pro"
```

Then launch the AVD once before running the suite:

```bash
emulator -avd Galaxy_S24_API_34
```

---

## Running the Framework

### Full suite (sequential both platforms)

```bash
npm run test:both
```

This runs `npm run test:android` first, then `npm run test:ios`. Each
configuration boots a separate Appium session and tears it down before
the next one starts, so plan to keep the matching Simulator / AVD
running.

### iOS only

```bash
npm run test:ios
```

Requirements: an iPhone 17 Simulator booted (Xcode 16+).

### Android only

```bash
npm run test:android
```

Requirements: the `Galaxy_S24_API_34` AVD booted (or whichever AVD
name matches your `appium:deviceName`).

### Smoke only

```bash
npm run test:ios:smoke
npm run test:android:smoke
```

Smoke runs only `smoke.spec.ts` for fast CI gating.

### Allure report

```bash
npm run report
```

This regenerates `./allure-report` from `./allure-results` and opens
it in your default browser. Each failed test gets a screenshot
attachment, both embedded in the HTML report and saved to `./screenshots/`.

---

## Mobile Adaptations vs the Desktop Project

This project shares the desktop project's POM hierarchy and selector
contracts 1:1. The behavioural differences are all in the helpers:

| Desktop (Playwright)                   | Mobile (WDI + Appium)                                           |
| -------------------------------------- | --------------------------------------------------------------- |
| `locator.fill(text)`                   | `el.setValue(value)`                                            |
| `locator.selectOption(val)`            | `el.selectByVisibleText(val)`                                   |
| `locator.click()`                      | `el.click()` (Appium maps to native tap)                        |
| `page.goto(url)`                       | `browser.url(url)` + element-level wait                         |
| `context.addCookies(...)`              | `browser.setCookies({...})` after visiting the domain           |
| `expect(locator).toBeVisible()`        | `expect(el).toBeDisplayed()` (viewport-aware)                   |
| `page.evaluate(fn)`                    | `browser.execute(fn, el)`                                       |
| `page.waitForLoadState('networkidle')` | `browser.pause(...)` or explicit element wait                   |
| `expect.toHaveClass(/x/)`              | `expect.toHaveAttribute('class', expect.stringContaining('x'))` |

Mobile Safari/Chrome on a small viewport scroll content vertically.
Before tapping elements that are below the fold, the home-page POM
calls `scrollIntoView` so the tap registers on the element rather
than on a viewport-clipped pixel.

---

## Tricentis-Specific Notes

The Tricentis demo app has quirks that the framework works around. All
of these are preserved from the desktop project; the mobile selectors
and JS executions target the same DOM contract.

- **`selectedvehicle` cookie** decides which fields the form renders
  (Model for motorcycle, Payload + Total Weight for truck/camper,
  Cylinder Capacity for motorcycle, Merit Rating + Courtesy Car for
  automobile only). `MobileQuotePageBase.goto()` navigates to the
  home page first, sets the cookie, then navigates to `app.php`.
- **idealforms jQuery library** runs validation on `change keyup`. We
  dispatch synthetic `keyup` events after every `setValue()` to force
  re-validation when the value didn't change (e.g. the "fill then clear"
  empty-name pattern).
- **Radio / checkbox interactions** use the manual
  `.checked = true; dispatch change` pattern via `browser.execute`.
  Tricentis' idealForms overlays intercept pointer events, so plain
  clicks/taps are unreliable.
- **Step transitions** invoke `$('form.idealforms').idealforms('nextStep')`
  directly via `browser.execute`. The form's Next buttons are
  jQuery-delegated and frequently swallow the touch on mobile.
- **`initcalculation()` workaround** — after Product Data → Price
  Option we re-invoke `window.initcalculation()` twice with 300 ms
  pauses. Tricentis uses jQuery show/primehide animations during the
  step transition and the price table can be re-rendered before they
  settle.
- **Price-table app bug for non-automobile vehicles** — for
  truck/motorcycle/camper the price table never renders because
  idealforms still requires Merit Rating + Courtesy Car which are
  removed for non-auto flows. `MobileQuotePageBase.fillAll` wraps
  the price-step handling in a try/catch and only asserts the price
  table for automobile; non-auto happy-path tests stop after
  filling the third section.
- **300-character comments limit** enforced by idealForms.
- **AJAX username uniqueness rule** on Send Quote — tests fill
  `'admin'` (known taken) and press Tab to commit the AJAX check
  before clicking the submit.

---

## Configuration

### Timeouts

| Setting                          | Value | Where                                       |
| -------------------------------- | ----- | ------------------------------------------- |
| Per-test Mocha timeout           | 90 s  | `wdio.shared.conf.ts`                       |
| `waitforTimeout` (element waits) | 15 s  | `wdio.shared.conf.ts`                       |
| `connectionRetryTimeout`         | 120 s | `wdio.shared.conf.ts`                       |
| `connectionRetryCount`           | 3     | `wdio.shared.conf.ts`                       |
| Appium `newCommandTimeout`       | 120 s | `wdio.ios.conf.ts` / `wdio.android.conf.ts` |
| `maxInstances`                   | 1     | both platform configs                       |

Mobile Appium over WDA / UiAutomator2 has higher inherent latency than
desktop browser automation. The 90 s per-test timeout is generous
enough for the price-table double `initcalculation()` workaround
plus the 35-day-out start date.

### Capabilities

`wdio.ios.conf.ts`:

```ts
{
  browserName: 'Safari',
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 17',
  'appium:platformVersion': '18.0',
  'appium:newCommandTimeout': 120,
  'appium:autoAcceptAlerts': true,
  'appium:noReset': true,
  'appium:webkitDebugProxyEnabled': false,
  // ...
}
```

`wdio.android.conf.ts`:

```ts
{
  browserName: 'Chrome',
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Galaxy_S24_API_34',
  'appium:platformVersion': '14.0',
  'appium:newCommandTimeout': 120,
  'appium:noReset': true,
  'appium:autoGrantPermissions': true,
  'appium:chromedriverAutodownload': true,
  // ...
}
```

---

## Screenshots on Failure

`wdio.shared.conf.ts` registers an `afterTest` hook that:

1. Calls `browser.takeScreenshot()` on failure.
2. Writes the PNG to `./screenshots/<spec>_<test>.png`.
3. Attaches the PNG to the Allure report as
   `Screenshot on failure` (so it shows up next to the test in the
   HTML report).

The Allure reporter is configured with
`disableWebdriverScreenshotsReporting: false`, so Allure also takes
its own automatic screenshots. The hand-rolled hook just guarantees
they land in `./screenshots/` even if you delete the allure-results.

---

## How to Add a Test

```ts
// tests/specs/my-new-flow.spec.ts
import { browser } from '@wdio/globals';
import { expect } from 'expect-webdriverio';
import { MobileAutomobileQuotePage } from '../../pages/mobile/MobileAutomobileQuotePage';
import { makeFullQuoteData } from '../../utils/helpers/insuranceData';

describe('My new mobile flow', () => {
  it('submits an automobile quote on mobile Safari', async () => {
    const page = new MobileAutomobileQuotePage(browser);
    const data = makeFullQuoteData('automobile');
    await page.goto();
    await page.fillAll(data);
    await page.sendSection.clickSend();
    await page.sendSection.expectConfirmationVisible();
  });
});
```

To add a new page object:

```ts
// pages/mobile/MyNewPage.ts
import { BasePage } from '../base/BasePage';

export class MyNewPage extends BasePage {
  readonly url = 'https://example.com/';
  readonly pageName = 'My New Page';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get heading(): WebdriverIO.Element {
    return this.byCss('h1');
  }

  async assertLoaded(): Promise<void> {
    await this.heading.waitForDisplayed({ timeout: 30_000 });
  }
}
```

---

## Troubleshooting

**`MIME type ('text/html') is not a supported stylesheet MIME type` or
`Failed to fetch` errors on Appium startup.** The Appium doctor report
will tell you what's wrong. Run:

```bash
npx appium driver doctor xcuitest
npx appium driver doctor uiautomator2
```

**iOS Simulator can't be found.** Boot it manually first from Xcode,
or check `xcrun simctl list devices available | grep iPhone`.

**Android AVD can't be found.** Check `emulator -list-avds` and adjust
the `appium:deviceName` in `wdio.android.conf.ts` to match.

**WebDriver `element click intercepted`.** This usually means the element
is below the fold on the small mobile viewport. The POMs call
`scrollIntoView` before most clicks; if you add a new interaction that
needs it, mirror that pattern.

**Cookie not set on the right domain.** `MobileQuotePageBase.goto()`
navigates to the home page first; this is essential because Appium's
`setCookies` requires an active session on the target domain. If you
refactor the navigation, keep the home-page visit before the cookie
set.

**TypeScript compile errors after editing a POM.** Run `npm run lint`
(`tsc --noEmit`). The common mistake is forgetting `super(browser)`
in a section that extends `BasePage`.

**Tests hang at the "next step" transition.** Tricentis uses jQuery
show/primehide animations; the framework includes `browser.pause(500)`
after each `nextStep`. If the page changes the animation timings,
bump that value in `BasePage.nextStep()`.

---

## License

MIT
