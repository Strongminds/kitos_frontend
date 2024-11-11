/// <reference types="cypress" />

describe('grid columns', () => {
  beforeEach(() => {
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });

    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
  });

  it('Doesnt invalidate columns when width, order and visibility has been changed', () => {
    cy.fixture('./shared/columns-with-width-order-and-visibility-changed.json').then((data) => {
      const json = JSON.stringify(data);
      localStorage.setItem('data-processing-grid-columns', JSON.stringify(data));

      cy.wrap(json).as('initialValue');
    });

    cy.setup(true, 'data-processing');

    cy.window().then((window) => {
      const newValue = window.localStorage.getItem('data-processing-grid-columns');
      cy.wrap(newValue).as('newValue');
    });

    cy.get('@initialValue').then((initialValue) => {
      cy.get('@newValue').then((newValue) => {
        expect(newValue).to.equal(initialValue);
      });
    });
  });

  it('Invalidates columns when field has changed', () => {
    cy.fixture('./shared/columns-with-different-title.json').then((data) => {
      const json = JSON.stringify(data);
      localStorage.setItem('data-processing-grid-columns', JSON.stringify(data));
      cy.wrap(json).as('initialValue');
    });

    cy.setup(true, 'data-processing');

    cy.window().then((window) => {
      const newValue = window.localStorage.getItem('data-processing-grid-columns');
      cy.wrap(newValue).as('newValue');
    });

    cy.get('@initialValue').then((initialValue) => {
      cy.get('@newValue').then((newValue) => {
        expect(newValue).to.not.equal(initialValue);
      });
    });
  });
});
