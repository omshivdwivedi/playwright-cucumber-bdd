# Playwright Cucumber BDD Automation Framework

A Playwright Cucumber test automation framework built with **Playwright** and **Cucumber.js (BDD)**
for testing the [OrangeHRM demo site](https://opensource-demo.orangehrmlive.com), a public demo HR
application.

The framework follows a clean, layered design (Page Objects + step definitions + hooks + utilities),
supports data-driven testing from Excel, runs scenarios in parallel, and produces rich HTML reports
via cucumber-html-reporter — with optional Playwright traces and video capture on demand.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Tests](#running-the-tests)
- [Parallel Execution](#parallel-execution)
- [Browser Options](#browser-options)
- [Configuration](#configuration)
- [Test Data](#test-data)
- [Reports](#reports)
- [Test Coverage](#test-coverage)
- [Sample Report](#sample-report)

---

## Tech Stack

| Concern                    | Technology            | Version   |
| -------------------------- | --------------------- | --------- |
| Language / Runtime         | Node.js (CommonJS)    | 18+       |
| Browser automation         | Playwright            | 1.59.1    |
| BDD test runner            | Cucumber.js           | 12.7.0    |
| HTML reporting             | cucumber-html-reporter| 7.2.0     |
| Excel data-driven testing  | SheetJS (xlsx)        | 0.18.5    |
| Properties config          | properties-reader     | 2.3.0     |
| Type definitions           | @types/node           | 25.6.0    |

---

## Project Structure

```
playwright-cucumber-bdd/
├── package.json                # Dependencies & npm scripts
├── cucumber.js                 # Cucumber config (require/feature paths, formatters)
├── CucumberReporter.js         # Generates HTML reports from the JSON output
├── test.properties             # Environment / browser / report configuration
├── README.md
├── cucumber-report/            # Generated JSON + HTML reports (output)
└── tests/
    ├── base/
    │   └── CustomWorld.js       # Cucumber World: exposes page objects to steps
    ├── features/                # Gherkin feature files
    │   ├── LoginTest.feature
    │   └── DataDrivenLogin.feature
    ├── hooks/
    │   └── CucumberHooks.js      # Browser/context lifecycle + failure screenshots/traces/video
    ├── pages/                    # Page Objects (locators + actions)
    │   ├── LoginPage.js
    │   └── DashboardPage.js
    ├── steps/                    # Step definitions
    │   ├── LoginPageSteps.js
    │   └── DashboardSteps.js
    ├── testData/                 # Data-driven test input
    │   └── Invalid_Login_Test_Data.xlsx
    └── utils/
        └── DataReader.js         # Excel reader (SheetJS)
```

---

## Architecture

The framework is organized into distinct, single-responsibility layers:

- **Feature files (`tests/features`)** — Business-readable scenarios written in Gherkin. Tagged
  (`@TestLogin`, `@Smoke`, `@Test`) so subsets can be run selectively. `DataDrivenLogin.feature`
  uses a `Scenario Outline` with an `Examples` table to drive the same steps over multiple data rows.

- **Step definitions (`tests/steps`)** — The glue layer. Each `Given/When/Then` maps a Gherkin step
  to Page Object actions and Playwright assertions (`expect`). Screenshots are attached to the report
  at key steps via `this.attach(...)`.

- **Page Objects (`tests/pages`)** — Each class wraps a single page and exposes lazy-evaluated
  locators (getters) plus action methods (e.g. `login()`, `validateHeader()`). Tests interact through
  these methods instead of touching raw selectors.

- **Custom World (`tests/base/CustomWorld.js`)** — Extends Cucumber's `World` and exposes lazily
  instantiated page objects (`this.loginPage`, `this.dashboardPage`), each bound to the current
  Playwright `page`.

- **Hooks (`hooks/CucumberHooks.js`)** — Manage the browser lifecycle: launch the configured browser
  once (`BeforeAll`), create a fresh isolated context + page per scenario (`Before`), and on scenario
  end (`After`) capture a screenshot + Playwright trace on failure, then close the context; the
  browser is closed at the end (`AfterAll`). Trace and video capture are toggled from
  `test.properties`.

- **Utils (`utils/DataReader.js`)** — Reads data-driven inputs from Excel via SheetJS, returning an
  array of row objects consumed by `Scenario Outline` steps.

---

## Prerequisites

- **Node.js 18+**
- A supported browser installed for the channel you choose in `test.properties`:
  **Microsoft Edge** (default) or **Google Chrome**. Firefox/WebKit/bundled Chromium are supplied
  by Playwright.
- Internet access (tests run against the live public OrangeHRM demo site)

Verify your setup:

```powershell
node -v
npm -v
```

---

## Getting Started

Clone the repository and install dependencies:

```powershell
git clone <repository-url>
cd playwright-cucumber-bdd
npm install
npx playwright install
```

---

## Running the Tests

Run via the predefined npm scripts (each runs Cucumber with a tag filter, then generates the report):

```powershell
npm run test:custom      # @TestLogin scenario + HTML report
npm run test:smoke       # @Smoke E2E login/logout + HTML report
```

Run directly with any tag expression:

```powershell
npx cucumber-js --tags @Test      # data-driven invalid-login scenario
npx cucumber-js                   # run all scenarios
```

Generate the HTML report on demand (from the last `cucumber_report.json`):

```powershell
node CucumberReporter.js
```

---

## Parallel Execution

Cucumber.js runs each worker in its own process, so scenarios execute in fully isolated browser
contexts. Enable parallel execution with the `--parallel` flag (value = number of workers):

```powershell
npx cucumber-js --parallel 2
npx cucumber-js --tags @Test --parallel 3
```

To make it the default, add `parallel: 2` to the `default` profile in `cucumber.js`.

> **Note:** With `headless = false`, each worker opens a visible browser window. Set
> `headless = true` in `test.properties` for faster, cleaner parallel runs.

---

## Browser Options

The browser is **not hard-coded** — it is selected at runtime from the `browser` property in
`test.properties` and launched in `tests/hooks/CucumberHooks.js`. The `BeforeAll` hook maps the
property value to the matching Playwright launcher:

| `browser` value | Launcher                                         |
| --------------- | ------------------------------------------------ |
| `edge`          | Chromium with `channel: 'msedge'` (**default**)  |
| `chrome`        | Chromium with `channel: 'chrome'`                |
| `chromium`      | Playwright's bundled Chromium                    |
| `firefox`       | Firefox                                          |
| `webkit`        | WebKit                                           |

The Chromium-based channels launch with `--start-maximized`. Headless mode follows the `headless`
property. To switch browsers, just edit `test.properties`:

```properties
browser=chrome
headless=true
```

---

## Configuration

Environment, browser, and report settings live in `test.properties`:

| Property          | Description                                                    | Example    |
| ----------------- | -------------------------------------------------------------- | ---------- |
| `env`             | Environment label shown in the report metadata                 | `local`    |
| `browser`         | Browser to launch (`edge` / `chrome` / `chromium` / `firefox` / `webkit`) | `edge`     |
| `headless`        | Run the browser headless (`true` / `false`)                    | `false`    |
| `outputDirectory` | Sub-folder under `cucumber-report/` for HTML reports & artifacts| `test`     |
| `recordVideo`     | Record video per scenario (kept only on failure)               | `false`    |
| `enableTrace`     | Capture a Playwright trace (saved as a `.zip` on failure)      | `true`     |

Cucumber's require paths, feature paths, and JSON formatter are configured in `cucumber.js`.

---

## Test Data

Data-driven tests read from `tests/testData/Invalid_Login_Test_Data.xlsx` (`Sheet1`). The header row
maps directly to login fields:

```
Username, Password
```

The `DataDrivenLogin.feature` `Scenario Outline` selects a row by index from its `Examples` table;
`DataReader.data()` loads the workbook into an array of row objects and the chosen row supplies the
`Username` / `Password` for each login attempt.

Add rows to the workbook (and matching `Examples` entries) to expand coverage — no code changes to
the page objects required.

---

## Reports

Cucumber writes raw results to `cucumber-report/cucumber_report.json`, and `CucumberReporter.js`
converts them into HTML via cucumber-html-reporter:

- A **consolidated** report at `cucumber-report/<outputDirectory>/cucumber-html-report.html`
  (auto-opens in the browser after the run).
- **Per-scenario** reports split by feature and status under
  `cucumber-report/<outputDirectory>/feature_<n>/{passed,failed}/`.

Each report includes step-level screenshots and metadata (app version, environment, browser,
platform). On failure, a full-page screenshot is attached and — when `enableTrace=true` — a
Playwright trace is saved to `cucumber-report/<outputDirectory>/traces/`. With `recordVideo=true`,
a video of failing scenarios is kept under `cucumber-report/<outputDirectory>/video/`.

---

## Test Coverage

| Feature / Tag                        | What it validates                                                    |
| ------------------------------------ | -------------------------------------------------------------------- |
| `LoginTest.feature` — `@TestLogin`   | Valid login lands the user on the Dashboard page                     |
| `LoginTest.feature` — `@Smoke`       | End-to-end flow: login → open user dropdown → logout                 |
| `DataDrivenLogin.feature` — `@Test`  | 5 invalid logins from Excel data, each asserting the error alert     |

---

## Sample Report

A screenshot of the generated Cucumber HTML report:

<img width="1920" height="951" alt="report" src="https://github.com/user-attachments/assets/4d5b7ece-2df0-4a36-80f0-9b4944542889" />


---
