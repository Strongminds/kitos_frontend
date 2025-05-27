import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();

  cy.setup(true, 'it-systems/it-system-usages');

  cy.intercept('/api/v2/organization*', { fixture: './organizations/organizations-multiple.json' });
  cy.intercept('/api/v2/it-system-usage-archive-types*', {
    fixture: './it-system-usage/archiving/it-system-usage-archive-types.json',
  });
  cy.intercept('/api/v2/it-system-usage-archive-location-types*', {
    fixture: './it-system-usage/archiving/it-system-usage-archive-location-types.json',
  });
  cy.intercept('/api/v2/it-system-usage-archive-test-location-types*', {
    fixture: './it-system-usage/archiving/it-system-usage-archive-test-location-types.json',
  });
}
describe('it-system-usage archiving', () => {
  const testRunner = new TestRunner(setupTest);

  it('it-system usage archiving', () => {
    testRunner.runTestWithSetup('can view but not edit information from catalog', () => {
      cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' });
      openArchiveTab();

      cy.getByDataCy('catalog-segment').click();
      cy.contains('B').get('input').should('be.disabled');
      cy.getByDataCy('catalog-archive-duty-comment-textarea')
        .get('textarea')
        .should('be.disabled')
        .should('have.value', 'Old comment');
    });

    testRunner.runTestWithSetup('fields are disabled if archiveDuty is not selected ', () => {
      cy.intercept('/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/archiving/it-system-usage-no-archiving.json',
      });
      openArchiveTab();

      verifyFieldsHaveCorrectState(true);

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/archiving/it-system-usage-archiving-duty-only.json',
      });
      cy.dropdown('Arkiveringspligt', 'K', true);

      verifyFieldsHaveCorrectState(false);
    });

    testRunner.runTestWithSetup('can modify archiving data', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage' });
      openArchiveTab();

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
        'patch'
      );

      cy.dropdown('Arkiveringspligt', 'K', true);
      verifyArchivePatchRequest({ archiveDuty: 'K' });

      cy.contains('Feltet blev opdateret');

      cy.dropdown('Arkivtype', 'Other type', true);
      verifyArchivePatchRequest({ typeUuid: 'aaad266c-3b84-49a0-8dc4-9d57b5dbc26b' });

      cy.dropdown('Arkiveringssted', 'Other location', true);
      verifyArchivePatchRequest({ locationUuid: 'abc3266c-3b84-49a0-8dc4-9d57b5dbc26b' });

      cy.dropdown('Arkiveringsleverandør', 'Organisation 2', true);
      verifyArchivePatchRequest({ supplierOrganizationUuid: '4dc52c64-3706-40f4-bf58-45035bb376da' });

      cy.dropdown('Arkiveringsteststed', 'Other test location', true);
      verifyArchivePatchRequest({ testLocationUuid: 'agd3266c-3b84-49a0-8dc4-9d57b5dbc26b' });

      cy.input('Arkiveringsfrekvens (antal år)').clear().type('2');
      cy.contains('Arkiveringsbemærkninger').click();
      verifyArchivePatchRequest({ frequencyInMonths: 2 });

      cy.get('textarea').clear().type('new description');
      cy.input('Arkiveringsfrekvens (antal år)').click();
      verifyArchivePatchRequest({ notes: 'new description' });

      cy.input('Dokumentbærende').uncheck();
      verifyArchivePatchRequest({ documentBearing: false });

      cy.input('Nej').click();
      verifyArchivePatchRequest({ active: false });
    });
  });

  it('can follow catalog link from archiving catalog segment', () => {
    setupTest();
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' });
    cy.intercept('/api/v2/it-system-usages?organizationUuid=*', { fixture: './it-system-usage/it-system-usage' });
    cy.intercept('/api/v2/it-systems/*/permissions', { fixture: './it-system-catalog/it-system-permissions.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage' });
    openArchiveTab();

    cy.getByDataCy('catalog-segment').click();
    cy.contains('Gå til IT Systemkataloget').click();
    cy.contains('IT Systemkatalog');
    cy.url().should('contain', 'it-system-catalog');
  });
});

function openArchiveTab() {
  cy.contains('System 3').click();

  cy.navigateToDetailsSubPage('Arkivering');
}

function verifyFieldsHaveCorrectState(shouldBeDisabled: boolean) {
  cy.contains('Læs mere hos Rigsarkivet');

  const disableOrEnableText = shouldBeDisabled ? 'be.disabled' : 'be.enabled';

  cy.input('Arkivtype').should(disableOrEnableText);
  cy.input('Arkiveringssted').should(disableOrEnableText);

  cy.input('Arkiveringsleverandør').should(disableOrEnableText);
  cy.input('Arkiveringsteststed').should(disableOrEnableText);

  cy.input('Arkiveringsfrekvens (antal år)').should(disableOrEnableText);
  cy.contains('Dokumentbærende').parent().find('input').should(disableOrEnableText);
  cy.contains('Er der arkiveret fra systemet?').parent().find('input').should(disableOrEnableText);
  cy.get('textarea').should(disableOrEnableText);

  cy.contains('Tilføj journalperiode').should(shouldBeDisabled ? 'not.exist' : 'exist');
}

function verifyArchivePatchRequest(archiveUpdate: object) {
  cy.verifyRequestUsingDeepEq('patch', 'request.body', { archiving: archiveUpdate });
}
