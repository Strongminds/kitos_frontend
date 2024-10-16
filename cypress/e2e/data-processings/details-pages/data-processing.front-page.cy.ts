/// <reference types="Cypress" />

describe('data-processing-front-page', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });
    cy.intercept('api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('api/v2/data-processing-registrations/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('api/v2/data-processing-registrations/*', { fixture: './dpr/data-processing-registration.json' });
    cy.intercept('api/v2/data-processing-registration-basis-for-transfer-types*', {
      fixture: './dpr/choice-types/basis-for-transfer-types.json',
    });
    cy.intercept('api/v2/data-processing-registration-data-responsible-types*', {
      fixture: './dpr/choice-types/data-responsible-types.json',
    });

    cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', {
      fixture: './dpr/data-processing-registration-patch.json',
    });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup(true, 'data-processing');
  });

  it('Agreement conclusion date is enabled when agreement is concluded', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('be.disabled');
    cy.dropdownByCy('dpr-agreement-concluded', 'Ja', true);
    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('not.be.disabled');
  });
});
