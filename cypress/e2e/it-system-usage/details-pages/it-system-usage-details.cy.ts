/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';
function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();

  cy.setup(true, 'it-systems/it-system-usages', './shared/it-system-usage-ui-customization-no-gdpr-and-lifecycle.json');
}

describe('it-system-usage details', () => {
  const testRunner = new TestRunner(setupTest);

  it('it-system-usage details part 1', () => {
    testRunner.runTestWithSetup('does not show GDPR tab and lifecycle field disabled by local ui config', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
      cy.contains('System 3').click();

      const disbledTabName = 'GDPR';
      const disabledFieldName = 'Livscyklus';

      cy.getByDataCy('navigation-drawer').within(() => {
        cy.contains(disbledTabName).should('not.exist');
      });

      cy.getByDataCy('system-usage-section').within(() => {
        cy.contains(disabledFieldName).should('not.exist');
      });
    });

    testRunner.runTestWithSetup('can show DPR tab when no associated dprs', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/data-processing-registrations*', []);

      cy.navigateToDetailsSubPage('Databehandling');

      cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
    });

    testRunner.runTestWithSetup('can show DPR with two, known associated dprs', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/data-processing-registrations*', {
        fixture: './dpr/it-system-usage-data-processing-registrations.json',
      });

      cy.navigateToDetailsSubPage('Databehandling');

      const expectedRows = [
        {
          name: 'DPA 1 - INVALID',
          valid: false,
        },
        {
          name: 'DPA 2 - VALID',
          valid: true,
        },
      ];

      cy.get('tr').should('have.length', expectedRows.length);
      expectedRows.forEach((row) => {
        const rowElement = cy.contains(row.name);
        rowElement
          .parentsUntil('tr')
          .parent()
          .contains(row.valid ? 'Aktiv' : 'Ikke aktiv');
      });
    });

    testRunner.runTestWithSetup('shows help text dialog', () => {
      cy.intercept('api/v2/internal/help-texts/*', { fixture: './shared/help-text.json' });

      cy.contains('System 3').click();

      cy.get('[data-cy="help-button"]').first().click();
      cy.contains('IT-systemforsiden finder du');
      cy.get('.close-button').click();

      cy.intercept('api/v2/internal/help-texts/*', { value: [] });

      cy.get('[data-cy="help-button"]').first().click();
      cy.contains('Ingen hjælpetekst defineret');
      cy.get('.close-button').click();

      cy.intercept('api/v2/internal/help-texts/*', { statusCode: 404 });

      cy.get('[data-cy="help-button"]').first().click();
      cy.contains('Ingen hjælpetekst defineret');
    });
  });

  it('it-system-usage details part 2', () => {
    testRunner.runTestWithSetup('shows simple hierarchy', () => {
      cy.intercept('/api/v2/internal/organization/*/it-systems/*/hierarchy', {
        fixture: './it-system-usage/hierarchy.json',
      });

      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Hierarki');

      cy.get('app-it-system-hierarchy-table').within(() => {
        cy.contains('System 1');
        cy.contains('System 2');
      });
    });

    testRunner.runTestWithSetup('shows complex hierarchy', () => {
      cy.intercept('/api/v2/internal/organization/*/it-systems/*/hierarchy', {
        fixture: './it-system-usage/hierarchy-complex.json',
      });

      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Hierarki');

      cy.get('app-it-system-hierarchy-table').within(() => {
        cy.contains('System 1');
        cy.contains('System 2');
        cy.contains('System 4');
        cy.contains('System 6');
      });
    });

    testRunner.runTestWithSetup('can show interfaces when no associated interfaces', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-interfaces*includeDeactivated*', []);
      cy.intercept('/api/v2/it-interface-interface-types*', []);

      cy.navigateToDetailsSubPage('Udstillede snitflader');

      cy.contains('Systemet udstiller ingen snitflader');
    });

    testRunner.runTestWithSetup('can show interfaces with 2 associated interfaces', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-interfaces*includeDeactivated*', { fixture: './it-interfaces/it-interfaces.json' });
      cy.intercept('/api/v2/it-interface-interface-types*', { fixture: './it-interfaces/it-interfaces-types.json' });

      cy.navigateToDetailsSubPage('Udstillede snitflader');

      const expectedRows = [
        {
          name: 'Interface 1 - ACTIVE',
          deactivated: true,
          description: 'Test description 1',
          itInterfaceType: {
            name: 'InterfaceType1',
          },
          urlReference: 'http://www.kitos.dk',
        },
        {
          name: 'Interface 2 - INACTIVE',
          deactivated: false,
          description: 'Test description 2',
          itInterfaceType: {
            name: 'InterfaceType2 (udgået)',
          },
          urlReference: '', //since the url doesn't contain 'http' it should be invalid
        },
      ];

      cy.get('tr').should('have.length', expectedRows.length);
      expectedRows.forEach((row) => {
        const rowElement = cy.contains(row.name);
        rowElement
          .parentsUntil('tr')
          .parent('tr')
          .within(() => {
            cy.get('td')
              .eq(1)
              .contains(row.deactivated ? 'Ikke aktiv' : 'Aktiv');
            cy.get('td').eq(2).contains(row.itInterfaceType.name);
            cy.get('td').eq(3).contains(row.description);

            if (row.urlReference.includes('http')) {
              cy.get('td').eq(4).verifyExternalReferenceHrefValue('Læs mere', row.urlReference);
            }
          });
      });
    });

    testRunner.runTestWithSetup('can add Used units by search', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      cy.intercept('/api/v2/organizations/*/organization-units*', {
        fixture: './organizations/organization-units-hierarchy.json',
      });

      cy.dropdownByCy('org-unit-select', 'Test - 1', true);

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('can restrict number of levels', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      cy.intercept('/api/v2/organizations/*/organization-units*', {
        fixture: './organizations/organization-units-hierarchy.json',
      });

      cy.inputByCy('levels-input').type('1');

      cy.contains('Test - 1').should('not.exist');
    });

    testRunner.runTestWithSetup('can show Used units', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      const expectedRows = [
        { uuid: '803fd406-27e2-4785-b162-02ee6ea876d1', name: 'Direktørområde' },
        { uuid: 'f4db9743-41e3-4a7a-ad62-683d10abe418', name: 'Test - 1' },
        { uuid: '933765a9-dad5-4a22-8d71-55b6798a094c', name: 'Test' },
        { uuid: '02d53ea4-0ba2-4e01-86d2-9044a4e4c81e', name: 'Test_28_11_2018' },
        { uuid: '16bab5a5-cff2-417b-bdeb-cf6033646d21', name: 'Kitos sekretariatet' },
      ];

      for (const expectedRow of expectedRows) {
        cy.contains(expectedRow.name);
      }
    });

    testRunner.runTestWithSetup('can select Responsible unit', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      cy.intercept('patch', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/it-system-usage-new-responsible-unit.json',
      });

      //select responsible unit
      cy.dropdown('Vælg ansvarlig organisationsenhed', 'Test - 1');

      //validate selected unit was updated
      cy.getCardWithTitle('Ansvarlig organisationsenhed').should('contain', 'Test - 1');
    });
  });
});
