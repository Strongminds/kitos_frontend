/// <reference types="cypress" />

describe('it-contracts.external-references', () => {
  const itContractBaseUrl = '/api/v2/it-contracts/*';
  const refsUrl = '/api/v2/internal/external-references/it-contracts/*';
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('can show external references', () => {
    cy.intercept(refsUrl, {
      fixture: './external-references/normal-external-references.json',
    });
    cy.contains('Contract 1').click();

    cy.navigateToDetailsSubPage('Referencer');

    cy.testCanShowExternalReferences();
  });

  it('can show no external references', () => {
    cy.intercept(refsUrl, {
      fixture: './external-references/no-external-references.json',
    });
    cy.contains('Contract').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.intercept(refsUrl, {
      fixture: './external-references/no-external-references.json',
    });
    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsUrl, {
      fixture: './external-references/single-added-reference.json',
    });

    cy.externalReferencesSaveAndValidate(true, false, false, itContractBaseUrl, './it-contracts/it-contract.json');
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.intercept(refsUrl, {
      fixture: './external-references/normal-external-references.json',
    });
    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.intercept(refsUrl, {
      fixture: './external-references/edited-extra-external-reference.json',
    });

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      true,
      itContractBaseUrl,
      './it-contracts/it-contract-with-external-references.json',
      'Valid url',
    );
  });
});
