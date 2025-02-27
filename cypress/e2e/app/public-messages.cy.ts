/// <reference types="cypress" />

describe('public messages', () => {
  beforeEach(() => {
    cy.requireIntercept();
  });

  it('Can see public messages', () => {
    cy.setup(false);
    assertPublicMessageIsCorrect();

    cy.setup(true);
    assertPublicMessageIsCorrect();
  });

  it.only('Can not edit public messages if not global admin', () => {
    cy.setup(false);
    cy.login('./shared/authorize-no-rights.json');

    cy.getByDataCy('open-public-message').first().click();
    cy.getByDataCy('open-edit-public-message-dialog-button').should('not.exist');
  });

  it('Can edit public messages if global admin', () => {
    cy.setup(true);

    cy.getByDataCy('open-public-message').first().click();
    cy.getByDataCy('open-edit-public-message-dialog-button').click();

    cy.intercept('PATCH', '/api/v2/internal/public-messages').as('editPublicMessages');

    cy.getByDataCy('save-public-message-button').click();

    cy.wait('@editPublicMessages');

    cy.get('app-popup-message').should('exist');
  });
});

function assertPublicMessageIsCorrect() {
  cy.contains('Vejledninger');
  cy.contains('Normal drift');
  cy.contains('Skabeloner til brug ved oprettelse af IT-Systemer, leverandører og snitflader finder du her.');

  cy.getByDataCy('open-public-message').first().click();
  cy.contains('Tilslut din kommune til Kitos');
}
