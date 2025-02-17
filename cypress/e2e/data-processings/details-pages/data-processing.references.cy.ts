/// <reference types="cypress" />

describe('data-processing-references', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.setupDataProcessingIntercepts();
    cy.setup(true, 'data-processing');
  });

  it('Can show empty references page', () => {
    cy.intercept('/api/v2/internal/external-references/data-processing/*', {
      fixture: './external-references/no-external-references.json',
    });

    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('Referencer');
  });
});
