/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
  });

  it('opens link edit dialog when clicking empty link textbox', () => {
    cy.setupItSystemUsageIntercepts();
    cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', {
      fixture: './it-system-usage/it-system-usage-sensitive-personal-data-types.json',
    });
    cy.intercept('/api/v2/it-system-usage-registered-data-category-types?organizationUuid=*', {
      fixture: './it-system-usage/it-system-usage-registered-data-category-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/9001db5c-0de0-46dd-a7e3-57b5566131de', {
      fixture: './it-system-usage/gdpr/it-system-usage-gdpr-no-link.json',
    });

    cy.setup(true, 'it-systems/it-system-usages');
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');

    cy.getByDataCy('empty-link-textbox').click();
    cy.contains('Redigér link');
  });
});
