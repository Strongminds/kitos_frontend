---
name: cypress-tests
description: Runs the KITOS frontend Cypress end-to-end or component tests, either as a full suite or for a selected spec. Use when asked to run, execute, or diagnose Cypress tests.
allowed-tools: shell
---

# Cypress Tests Skill

Run the Cypress tests requested by the developer and report the command, pass/fail status, and relevant failure details. Do not change application or test code unless asked.

## Choose the test run

### Full end-to-end suite

Run:

```bash
yarn e2e:ci
```

This starts the Angular app with the CI configuration and runs Cypress headlessly; do not start a separate app server first.

### One end-to-end spec

If a local app is not already running at `http://localhost:4200`, start it in a separate terminal:

```bash
yarn start
```

Then run the requested spec:

```bash
npx cypress run --spec "cypress/e2e/path/to/spec.cy.ts"
```

### Component tests

Run the component suite without starting the app separately:

```bash
npx cypress run --component
```

To run one component spec:

```bash
npx cypress run --component --spec "src/app/component-tests/path/to/spec.cy.ts"
```

## Diagnose failures

- Report the failing spec, test title, assertion or error, and useful stack/location details.
- Distinguish test failures from startup, browser, or dependency errors.
- Do not rerun a failing test repeatedly or change retry settings to hide a failure. Retry only when there is evidence of a transient environment issue.
- Do not install or restore dependencies unless the command fails because a required package or browser is missing.
