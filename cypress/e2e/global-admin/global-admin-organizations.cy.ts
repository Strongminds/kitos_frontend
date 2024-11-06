/// <reference types="Cypress" />

describe('global-admin-organizations', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.intercept('/odata/Organizations?$skip=0&$top=100&$count=true', { fixture: './global-admin/organizations.json' });
    cy.setup(true, 'global-admin/organizations');
  });

  it('Can create organization', () => {
    cy.intercept('POST', 'api/v2/internal/organizations/create', (req) => {
      expect(req.body.name).to.eq('Test Organization');
      expect(req.body.type).to.eq('Company');
      expect(req.body.cvr).to.eq('12345678');
      expect(req.body.foreignCvr).to.eq('ja');
      req.reply({ statusCode: 200, body: {} });
    }).as('createOrganization');

    cy.scrollTo('topRight');
    cy.wait(500);
    cy.getByDataCy('create-organization-button').click();
    cy.getByDataCy('org-name').type('Test Organization');
    cy.dropdownByCy('org-type', 'Virksomhed', true);
    cy.getByDataCy('org-cvr').type('12345678');
    cy.getByDataCy('org-foreign-cvr').type('ja');
    cy.getByDataCy('create-org-dialog-button').click();

    cy.wait('@createOrganization');
    cy.get('app-popup-message').should('exist');
  });

  it('Can edit organization', () => {
    cy.getByDataCy('grid-edit-button').first().click();

    cy.intercept('PATCH', 'api/v2/internal/organizations/*/patch', (req) => {
      expect(req.body.name).to.eq('Test Organization2');
      expect(req.body.type).to.eq('CommunityOfInterest');
      expect(req.body.cvr).to.eq('87654321');
      expect(req.body.foreignCvr).to.eq('nej');
      req.reply({ statusCode: 200, body: {} });
    }).as('editOrganization');

    cy.getByDataCy('org-name').clear().type('Test Organization2');
    cy.dropdownByCy('org-type', 'Interessefællesskab', true);
    cy.getByDataCy('org-cvr').clear().type('87654321');
    cy.getByDataCy('org-foreign-cvr').clear().type('nej');
    cy.getByDataCy('edit-org-dialog-button').click();

    cy.wait('@editOrganization');
    cy.get('app-popup-message').should('exist');
  });
});
