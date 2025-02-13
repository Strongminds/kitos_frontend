/// <reference types="Cypress" />

describe('data-processing-front-page', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupDataProcessingIntercepts();

    cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', {
      fixture: './dpr/data-processing-registration-patch.json',
    });
    cy.setup(true, 'data-processing');
  });

  it('Agreement conclusion date is enabled when agreement is concluded', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('be.disabled');
    cy.dropdownByCy('dpr-agreement-concluded', 'Ja', true);
    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('not.be.disabled');
  });

  it('Can show responsible unit on startup', () => {
    const responsibleUnit = { name: 'En enhed', uuid: '0c2c1b3b-0b1b-4b3b-8b3b-0b1b3b0b1b3b' };
    cy.intercept('api/v2/organizations/*/organization-units?pageSize=*', { body: [responsibleUnit] });
    cy.contains('Dpa 1').click();

    cy.contains('En enhed').should('exist');
  });

  it('Can patch and clear responsible unit', () => {
    const responsibleUnitToSelect = { name: 'En anden enhed', uuid: '0c2c1b3b-0b1b-4b3b-8b3b-0b1b3b0b1b3b' };
    cy.intercept('api/v2/organizations/*/organization-units?pageSize=*', { body: [responsibleUnitToSelect] });
    cy.contains('Dpa 1').click();

    cy.getByDataCy('responsible-unit-select').click();

    cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', (req) => {
      expect(req.body.general.responsibleOrganizationUnitUuid).to.be.equal(responsibleUnitToSelect.uuid);
      req.reply({ body: { general: { responsibleOrganizationUnit: responsibleUnitToSelect } } });
    }).as('patchResponsibleUnit');

    cy.contains(responsibleUnitToSelect.name).click();

    cy.contains(responsibleUnitToSelect.name).should('exist');

    cy.get('app-popup-message').should('exist');

    cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', (req) => {
      expect(req.body.general.responsibleOrganizationUnitUuid).to.be.equal(null);
      req.reply({ body: { general: { responsibleOrganizationUnit: null } } });
    }).as('patchResponsibleUnit');

    cy.getByDataCy('responsible-unit-select').find('.ng-clear-wrapper').click();

    cy.contains(responsibleUnitToSelect.name).should('not.exist');
  });
});
