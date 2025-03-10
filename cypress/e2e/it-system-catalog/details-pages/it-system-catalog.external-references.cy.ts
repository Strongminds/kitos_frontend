/// <reference types="cypress" />

describe('it-system-catalog', () => {
  const itSystemBaseUrl = '/api/v2/it-systems/*';
  const refsBaseUrl = '/api/v2/internal/external-references/it-systems/*';
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemCatalogIntercepts();
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('can show external references', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/normal-external-references.json',
    });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Referencer');

    cy.testCanShowExternalReferences();
  });

  it('can show no external references', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference and override master reference', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/normal-external-references.json',
    });
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsBaseUrl, {
      fixture: './it-system-catalog/external-references/extra-external-references2.json',
    });
    cy.externalReferencesSaveAndValidate(
      false,
      true,
      false,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-with-extra-external-reference.json'
    );
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsBaseUrl, {
      fixture: './external-references/single-added-reference.json',
    });

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      false,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-with-extra-external-reference.json'
    );
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/normal-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsBaseUrl, {
      fixture: './external-references/edited-extra-external-reference.json',
    });

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      true,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-with-edited-external-reference.json',
      'Valid url'
    );
  });
  it('can modify external reference master reference', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/normal-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsBaseUrl, {
      fixture: './external-references/edited-extra-external-reference.json',
    });

    cy.externalReferencesSaveAndValidate(
      false,
      false,
      true,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-modified-master-reference.json',
      'No url Master reference'
    );
  });

  it('can delete non master external reference', () => {
    cy.intercept(refsBaseUrl, {
      fixture: './external-references/normal-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    const referenceTitleToRemove = 'Valid url';

    cy.getRowForElementContent(referenceTitleToRemove)
      .first()
      .within(() => cy.get('app-trashcan-icon').click({ force: true }));

    cy.intercept(refsBaseUrl, { fixture: './external-references/with-deleted-external-references.json' });

    cy.verifyYesNoConfirmationDialogAndConfirm(
      'PATCH',
      '/api/v2/it-systems/*',
      { fixture: './it-system-catalog/external-references/it-system-external-references-removed-item.json' },
      'Er du sikker på at du vil fjerne referencen?'
    );
    cy.contains('Referencen blev slettet');

    cy.contains(referenceTitleToRemove).should('not.exist');
  });
});
