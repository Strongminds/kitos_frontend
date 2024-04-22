/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItContract*', { fixture: './it-contracts/it-contracts.json' });
    cy.intercept('/api/v2/it-contracts/*', { fixture: './it-contracts/it-contract.json' });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/organizations?orderByProperty*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './it-contracts/choice-types/contract-types.json' });
    cy.intercept('/api/v2/it-contract-contract-template-types*', {
      fixture: './it-contracts/choice-types/contract-templates.json',
    });
    cy.intercept('/api/v2/it-contract-criticality-types*', {
      fixture: './it-contracts/choice-types/criticality-types.json',
    });
    cy.intercept('/api/v2/it-contract-procurement-strategy-types*', {
      fixture: './it-contracts/choice-types/procurement-strategies.json',
    });
    cy.intercept('/api/v2/it-contract-purchase-types*', { fixture: './it-contracts/choice-types/purchase-types.json' });
    cy.intercept('/api/v2/it-contract-agreement-extension-option-types*', {
      fixture: './it-contracts/choice-types/extension-options.json',
    });
    cy.intercept('/api/v2/it-contract-notice-period-month-types*', {
      fixture: './it-contracts/choice-types/notice-period-month-types.json',
    });
    cy.intercept('/api/v2/it-contracts/*/permissions', { fixture: './it-contracts/it-contract-permissions.json' });
    cy.intercept('api/v2/it-contracts?organizationUuid*', {
      fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json',
    });

    cy.setup(true, 'it-contracts');
  });

  it('shows simple hierarchy', () => {
    cy.intercept('/api/v2/internal/it-contracts/*/hierarchy', { fixture: './it-contracts/hierarchy.json' });

    goToHierarchy();

    cy.getByDataCy('contract-hierarchy').within(() => {
      cy.contains('Contract 1');
      cy.contains('Contract 2');
    });
  });

  it('shows complex hierarchy', () => {
    cy.intercept('/api/v2/internal/it-contracts/*/hierarchy', { fixture: './it-contracts/hierarchy-complex.json' });

    goToHierarchy();

    cy.getByDataCy('contract-hierarchy').within(() => {
      cy.contains('Contract 1');
      cy.contains('Contract 2');
      cy.contains('Contract 4');
      cy.contains('Contract 6');
    });
  });

  it('can select parent contract', () => {
    cy.intercept('/api/v2/internal/it-contracts/*/hierarchy', { fixture: './it-contracts/hierarchy.json' });

    goToHierarchy();

    cy.dropdownByCy('parent-contract', 'The valid contract', true);
    cy.get('app-popup-message').should('exist');
  });
});

function goToHierarchy() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Hierarki');
}
