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

  it('Can not edit public messages if not global admin', () => {
    cy.setup(false);
    cy.login('./shared/authorize-no-rights.json');

    cy.getByDataCy('open-public-message').first().click();
    cy.getByDataCy('open-edit-public-message-dialog-button').should('not.exist');
  });

  it('Can edit public messages if global admin', () => {
    cy.setup(true);

    cy.getByDataCy('open-public-message').first().click();
    cy.getByDataCy('open-edit-public-message-dialog-button').click();

    const titleInput = 'Ny titel';
    const shortDescriptionInput = 'Kort beskrivelse.';
    const longDescriptionInput = 'Lang beskrivelse.';

    cy.getByDataCy('title').clear().type(titleInput);
    cy.getByDataCy('status').click();
    cy.get('.ng-option').eq(1).click();
    cy.getByDataCy('short-description').clear().type(shortDescriptionInput);

    cy.setTinyMceContent('rich-text-editor', longDescriptionInput);
    cy.getIframe().click({ force: true });

    cy.intercept('PATCH', '/api/v2/internal/public-messages/*', (req) => {
      expect(req.body.title).to.eq(titleInput);
      expect(req.body.status).to.eq('Inactive');
      expect(req.body.shortDescription).to.eq(shortDescriptionInput);
      expect(req.body.longDescription).to.eq('<p>' + longDescriptionInput + '</p>');
      req.reply({});
    });

    cy.intercept('GET', '/api/v2/internal/public-messages', { fixture: './shared/edited-public-messages.json' }).as(
      'getPublicMessages'
    );

    cy.getByDataCy('save-public-message-button').click();

    cy.wait('@getPublicMessages');

    cy.contains(titleInput);
    cy.contains(shortDescriptionInput);
    cy.contains(longDescriptionInput);
    cy.contains('Ustabil drift');

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
