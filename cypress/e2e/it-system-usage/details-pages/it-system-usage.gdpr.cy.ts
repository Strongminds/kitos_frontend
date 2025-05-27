import { TestRunner } from 'cypress/support/test-runner';

const generalInformation = 'Generel information';
const purposeInput = 'Systemets overordnede formål';
const businessCriticalDropdown = 'Forretningskritisk IT-System';
const hostedAtDropdown = 'IT-systemet driftes';
const personDataCheckbox = 'Almindelige personoplysninger';
const dataSensitivityAccordion = 'data-sensitivity-accordion';
const registedCategoriesAccordion = 'registed-categories-accordion';
const technicalPrecautionsAccordion = 'technical-precautions-accordion';
const userSupervisionAccordion = 'user-supervision-accordion';
const riskAssessmentAccordion = 'risk-assessment-accordion';
const datepickerToggle = 'datepicker-toggle';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', {
    fixture: './it-system-usage/it-system-usage-sensitive-personal-data-types.json',
  });
  cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/gdpr/it-system-usage-full-gdpr.json' });
  cy.intercept('/api/v2/it-system-usage-registered-data-category-types?organizationUuid=*', {
    fixture: './it-system-usage/it-system-usage-registered-data-category-types.json',
  });
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage gdpr', () => {
  const testRunner = new TestRunner(setupTest);
  it('it-system-usage gdpr', () => {
    testRunner.runTestWithSetup('can show GDPR tab and existing data in general input fields', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('patch');

      cy.contains(generalInformation);
      cy.contains('Yderligere information');
      cy.input(purposeInput).should('have.value', 'Test purpose');
      cy.dropdown(businessCriticalDropdown).should('have.text', 'Ja');
      cy.dropdown(hostedAtDropdown).should('have.text', 'On-premise');

      verifyLinkTextbox('directory-documentation-link', 'newName: newUrl');
    });

    testRunner.runTestWithSetup('can edit purpose', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('purposePatch');

      const newPurpose = 'New purpose';
      cy.input(purposeInput).clear().type(newPurpose);
      cy.contains(generalInformation).click();

      cy.verifyRequestUsingDeepEq('purposePatch', 'request.body', { gdpr: { purpose: newPurpose } });
      cy.input(purposeInput).should('have.value', newPurpose);
    });

    testRunner.runTestWithSetup('can edit business critical status', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('businessCriticalPatch');
      const newBusinessCritical = 'Nej';
      cy.dropdown(businessCriticalDropdown, newBusinessCritical, true);
      cy.contains(generalInformation).click();

      verifyGdprPatchRequest({ businessCritical: 'No' }, 'businessCriticalPatch');
      cy.dropdown(businessCriticalDropdown).should('have.text', newBusinessCritical);
    });

    testRunner.runTestWithSetup('can edit hosted at status', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('hostedAtPatch');
      const newHostedAt = 'Eksternt';
      cy.dropdown(hostedAtDropdown, newHostedAt, true);
      cy.contains(generalInformation).click();

      verifyGdprPatchRequest({ hostedAt: 'External' }, 'hostedAtPatch');
      cy.dropdown(hostedAtDropdown).should('have.text', newHostedAt);
    });

    testRunner.runTestWithSetup('can edit data sensitivity levels', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('sensitivityLevelsPatch');
      cy.getByDataCy(dataSensitivityAccordion).click();

      cy.input('Straffedomme og lovovertrædelser').should('be.checked');
      cy.input(personDataCheckbox).should('not.be.checked');
      cy.input(personDataCheckbox).click();
      verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] }, 'sensitivityLevelsPatch');
    });

    testRunner.runTestWithSetup('can edit specific personal data, and sub-options when main option is selected', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.getByDataCy(dataSensitivityAccordion).click();
      const nestedCheckboxes = ['CPR-nr.', 'Væsentlige sociale problemer', 'Andre rent private forhold'];
      nestedCheckboxes.forEach((checkBox) => {
        cy.input(checkBox).should('be.disabled');
      });
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-full-gdpr.json',
      }).as('personalDataPatch');

      cy.input('Almindelige personoplysninger').click();
      verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] }, 'personalDataPatch');

      nestedCheckboxes.forEach((checkBox) => {
        cy.input(checkBox).should('be.enabled');
      });

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('patchSpecificPersonalData');
      cy.input('CPR-nr.').click({ force: true });
      cy.verifyRequestUsingDeepEq('patchSpecificPersonalData', 'request.body', {
        gdpr: { specificPersonalData: ['CprNumber'] },
      });
    });

    testRunner.runTestWithSetup(
      'can edit sensitive personal data, and sub-options when main option is selected',
      () => {
        cy.contains('System 3').click();
        cy.navigateToDetailsSubPage('GDPR');
        cy.getByDataCy(dataSensitivityAccordion).click();
        const nestedCheckboxes = ['data type 1', 'data type 2'];
        nestedCheckboxes.forEach((checkBox) => {
          cy.input(checkBox).should('be.disabled');
        });
        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-gdpr-sensitive-data.json',
        }).as('pesonalDataPatch2');

        cy.input('Følsomme personoplysninger').click();
        verifyGdprPatchRequest({ dataSensitivityLevels: ['SensitiveData', 'LegalData'] }, 'pesonalDataPatch2');

        nestedCheckboxes.forEach((checkBox) => {
          cy.input(checkBox).should('be.enabled');
        });

        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
        }).as('patchSensitivePersonalData');
        cy.input('data type 1').click({ force: true });
        verifyGdprPatchRequest(
          { sensitivePersonDataUuids: ['00000000-0000-0000-0000-000000000000'] },
          'patchSensitivePersonalData'
        );
      }
    );

    testRunner.runTestWithSetup('can edit registered categories of data', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      cy.getByDataCy(registedCategoriesAccordion).click();
      const checkBox = 'data category 1';

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
      }).as('categoriesPatch');
      cy.input(checkBox).click();
      verifyGdprPatchRequest(
        { registeredDataCategoryUuids: ['00000000-0000-0000-0000-000000000000'] },
        'categoriesPatch'
      );
    });

    testRunner.runTestWithSetup('cannot save directory documentation with unchanged url', () => {
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('GDPR');
      verifyLinkTextAndPressEdit('directory-documentation-link', 'newName: newUrl');

      cy.get('app-edit-url-dialog').within(() => {
        cy.verifyDialogConfirmButtonDisabledByReactiveForm('edit-url-save-button');
      });
    });
  });
});

function verifyGdprPatchRequest(gdprUpdate: object, requestAlias?: string) {
  const requestName = requestAlias ?? 'patch';
  cy.verifyRequestUsingDeepEq(requestName, 'request.body', { gdpr: gdprUpdate });
}

function verifyLinkTextbox(textboxSelector: string, textboxText: string) {
  verifyLinkTextAndPressEdit(textboxSelector, textboxText);

  verifyLinkEditDialogAndPerformEdit();
}

function verifyLinkTextAndPressEdit(textboxSelector: string, textboxText: string) {
  cy.getByDataCy(textboxSelector).within(() => {
    cy.getByDataCy('link-textbox-input').should('have.value', textboxText).getByDataCy('edit-link-button').click();
  });
}

function verifyLinkEditDialogAndPerformEdit() {
  cy.get('app-edit-url-dialog').within(() => {
    cy.getByDataCy('link-name-textbox').type('Test');
    cy.getByDataCy('link-url-textbox').type('https://test.dk');
    cy.getByDataCy('edit-url-cancel-button').should('exist');
    cy.getByDataCy('edit-url-save-button').click();
  });

  verifyAppNotification();
}

function verifyAppNotification() {
  cy.get('app-popup-message').should('exist');
}
