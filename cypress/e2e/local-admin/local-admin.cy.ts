/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';
const regularOptionTypesSegment = 'Lokal tilpasning af udfaldsrum';

function setupTest() {
  cy.requireIntercept();
  cy.intercept('/api/v2/internal/organizations/*/permissions', {
    fixture: './organizations/organization-permissions-local-admin.json',
  });

  cy.intercept('api/v2/internal/data-processing/*/local-option-types/country-option-types', {
    fixture: './local-admin/dpr/local-country-option-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/basis-for-transfer-types', {
    fixture: './local-admin/dpr/local-basis-for-transfer-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/data-responsible-types', {
    fixture: './local-admin/dpr/local-data-responsible-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/oversight-option-types', {
    fixture: './local-admin/dpr/local-oversight-option-types.json',
  });

  cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/snapshot', {
    fixture: './local-admin/fk-org/snapshot.json',
  });
  cy.intercept(
    'api/v2/internal/organizations/*/sts-organization-synchronization/connection/change-log?numberOfChangeLogs=*',
    { fixture: './local-admin/fk-org/changelog.json' }
  );

  cy.intercept('api/v2/internal/it-systems/*/local-option-types/business-types', {
    fixture: './local-admin/it-system/business-types.json',
  });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-location-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-test-location-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/data-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/frequency-relation-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/interface-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/sensitive-personal-data-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/it-system-categories-types', { body: [] });
  cy.intercept('api/v2/internal/it-systems/*/local-option-types/local-register-types', { body: [] });

  cy.setup(true);
}

describe('local-admin', () => {
  const testRunner = new TestRunner(setupTest);

  it('Local admin', () => {
    testRunner.runTestWithSetup('Cannot toggle obligatory ui customization field', () => {
      goToItSystem();
      const targetTabCheckboxButtonText = 'Systemforside';
      cy.contains(targetTabCheckboxButtonText)
        .parents('[data-cy="accordion-header"]')
        .first()
        .getByDataCy('button-checkbox')
        .get('mat-checkbox input')
        .first()
        .should('be.checked');
    });

    testRunner.runTestWithSetup('Can toggle non-obligatory ui customization field', () => {
      goToItSystem();
      cy.intercept('api/v2/internal/organizations/*/ui-customization/ItSystemUsages', {
        fixture: './shared/it-system-usage-ui-customization-no-gdpr-and-lifecycle.json',
      });

      cy.intercept('PUT', 'api/v2/internal/organizations/*/ui-customization/ItSystemUsages').as('put');

      const targetFieldCheckboxButtonText = 'Dato for planlagt risikovurdering';
      cy.contains(targetFieldCheckboxButtonText).click();
      cy.wait('@put').then((interception) => {
        const nodes = interception.request.body.nodes;
        const gdprNode = nodes.find(
          (node: { key: string; enabled: boolean }) => node.key === 'ItSystemUsages.gdpr.plannedRiskAssessmentDate'
        );
        expect(gdprNode.enabled).to.equal(false);
      });

      cy.contains(targetFieldCheckboxButtonText).within(() => {
        cy.getByDataCy('button-checkbox').get('mat-checkbox input').first().should('not.be.checked');
      });
    });

    testRunner.runTestWithSetup('Can edit description of it system option type', () => {
      goToItSystem();
      cy.contains(regularOptionTypesSegment).click();

      cy.contains('Forretningstyper').click();
      cy.intercept('PATCH', 'api/v2/internal/it-systems/*/local-option-types/business-types/*', {});

      cy.contains('td', 'Desing, visualisering og grafik')
        .closest('tr')
        .within(() => {
          cy.get('app-icon-button').click();
        });
      cy.replaceTextByDataCy('description-text-area', 'New description');
      cy.contains('button', 'Gem').click();
    });

    testRunner.runTestWithSetup('Can deactivate active status of it system option type if not obligatory', () => {
      goToItSystem();
      cy.contains(regularOptionTypesSegment).click();

      cy.contains('Forretningstyper').click();
      cy.intercept('DELETE', 'api/v2/internal/it-systems/*/local-option-types/business-types/*', {}).as('delete');

      cy.getByDataCy('grid-checkbox').first().find('input').click();

      cy.wait('@delete');

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('Can activate active status of it system option type if not obligatory', () => {
      goToItSystem();
      cy.contains('Lokal tilpasning af udfaldsrum').click();

      cy.contains('Forretningstyper').click();
      cy.intercept('POST', 'api/v2/internal/it-systems/*/local-option-types/business-types', {}).as('post');

      cy.getByDataCy('grid-checkbox').eq(1).find('input').click();

      cy.wait('@post');

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('Can not edit active status of option type if obligatory', () => {
      goToItSystem();
      cy.contains(regularOptionTypesSegment).click();

      cy.contains('Forretningstyper').click();

      cy.getByDataCy('grid-checkbox').eq(2).find('input').should('be.disabled');
    });

    testRunner.runTestWithSetup('Can see non editable option type info text', () => {
      goToDpr();
      cy.getByDataCy('local-admin-regular-option-types').click();
      cy.getByDataCy('accordion-info').first().trigger('mouseenter');
      cy.contains('Dette udfaldsrum kan kun redigeres af OS2Kitos sekretariatet');
    });

    testRunner.runTestWithSetup('Can see obligatory option info text', () => {
      goToDpr();
      cy.getByDataCy('local-admin-regular-option-types').click();
      cy.getByDataCy('accordion-header').first().click();
      cy.getByDataCy('grid-checkbox').first().trigger('mouseenter');
      cy.contains('Dette udfald er obligatorisk og kan kun deaktiveres af OS2Kitos sekretariatet');
    });
    testRunner.runTestWithSetup('can create synchronization', () => {
      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
        fixture: './local-admin/fk-org/empty-connection-status.json',
      });
      goToImport();

      cy.contains('Adgang');
      cy.contains('KITOS har adgang til organisationens data via FK Organisation');
      cy.contains('Synkronisering');
      cy.contains('Organisationen er ikke forbundet til FK Organisation');

      cy.getByDataCy('create-sts-connection').click();

      cy.contains('Test Kommune Root');
      cy.contains('Test child 1');
      cy.contains('Test grandchild');

      cy.inputByCy('levels-input').type('2');
      cy.getByDataCy('auto-updates-checkbox').click();

      cy.contains('Test Kommune Root');
      cy.contains('Test child 1');
      cy.contains('Test grandchild').should('not.exist');

      cy.inputByCy('levels-input').clear().type('1');
      cy.getByDataCy('auto-updates-checkbox').click();

      cy.contains('Test Kommune Root');
      cy.contains('Test child 1').should('not.exist');
      cy.contains('Test grandchild').should('not.exist');
    });

    testRunner.runTestWithSetup('can update synchronization', () => {
      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
        fixture: './local-admin/fk-org/existing-connection-status.json',
      });
      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection/update*', {
        fixture: './local-admin/fk-org/consequences.json',
      });
      goToImport();

      cy.getByDataCy('edit-sts-connection').click();
      cy.getByDataCy('delete-connection').should('exist');
      cy.getByDataCy('proceed-button').click();

      cy.inputByCy('levels-input').should('be.disabled');

      cy.contains('Unit 1');

      cy.getByDataCy('cancel-button').should('exist');
      cy.getByDataCy('save-button').should('exist');
    });

    testRunner.runTestWithSetup('can delete auto synchronization', () => {
      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
        fixture: './local-admin/fk-org/existing-connection-status.json',
      });

      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection/subscription', {
        body: {},
      });

      goToImport();

      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
        fixture: './local-admin/fk-org/empty-connection-status.json',
      });

      cy.getByDataCy('delete-sts-auto-update').click();
      cy.getByDataCy('confirm-button').click();

      cy.getByDataCy('delete-sts-auto-update').should('not.exist');
    });

    testRunner.runTestWithSetup('can view changelog', () => {
      cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
        fixture: './local-admin/fk-org/existing-connection-status.json',
      });

      goToImport();

      cy.getByDataCy('changelog-accordion').click();

      cy.dropdownByCy('select-changelog-dropdown', '24-10-2024', true);

      cy.contains('Automatisk oprettet testbruger (GlobalAdmin)');
      cy.contains('test@kitos.dk');

      cy.get('app-local-grid').should('exist');
      cy.contains('Unit 1');
    });

    testRunner.runTestWithSetup('can edit just organization name if local admin', () => {
      const newName = 'someOrg';
      cy.intercept('/api/v2/internal/organizations/*/permissions', {
        fixture: './organizations/organization-permissions-local-admin.json',
      });
      cy.intercept('PATCH', '/api/v2/internal/organizations/*/patch', {
        statusCode: 200,
        body: {},
      }).as('patch');

      cy.hoverByDataCy('profile-menu');
      cy.getByDataCy('local-admin-menu-item').should('exist').click();

      cy.confirmTextboxStateByDataCy('name-input', true);
      cy.confirmTextboxStateByDataCy('cvr-input', false);
      cy.replaceTextByDataCy('name-input', newName);
      cy.getByDataCy('info-title').click();

      cy.wait('@patch', { timeout: 10000 }).then((interception) => {
        expect(interception.request.body.name).to.equal(newName);
      });
    });

    testRunner.runTestWithSetup('can edit cvr if global admin', () => {
      const newCvr = '12345678';
      cy.intercept('/api/v2/internal/organizations/*/permissions', {
        fixture: './organizations/organization-permissions-global-admin.json',
      });
      cy.intercept('PATCH', '/api/v2/internal/organizations/*/patch', {
        statusCode: 200,
        body: {},
      }).as('patch');

      cy.hoverByDataCy('profile-menu');
      cy.getByDataCy('local-admin-menu-item').should('exist').click();

      cy.confirmTextboxStateByDataCy('cvr-input', true);
      cy.replaceTextByDataCy('cvr-input', newCvr);
      cy.getByDataCy('info-title').click();

      cy.wait('@patch', { timeout: 10000 }).then((interception) => {
        expect(interception.request.body.cvr).to.equal(newCvr);
      });
    });
  });
});

function goToImport() {
  getMenuItem();
  cy.navigateToDetailsSubPage('Masseopret');
}

function goToDpr() {
  getMenuItem();
  cy.navigateToDetailsSubPage('Databehandling');
}

function goToItSystem() {
  getMenuItem();
  cy.navigateToDetailsSubPage('IT System');
}

function getMenuItem() {
  cy.hoverByDataCy('profile-menu');
  cy.getByDataCy('local-admin-menu-item').should('exist').click();
}
