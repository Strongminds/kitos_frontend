/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';

const changes = [
  {
    uuid: 'change-1',
    externalMessageId: 'message-1',
    externalUserUuid: 'external-user-1',
    userUuid: 'user-1',
    userName: 'Test Bruger',
    email: 'test@example.com',
    changeType: 'Deleted',
    status: 'Pending',
    occurredAt: '2026-09-28T12:00:00Z',
    receivedAt: '2026-09-29T12:00:00Z',
  },
  {
    uuid: 'change-2',
    externalMessageId: 'message-2',
    externalUserUuid: 'external-user-2',
    userUuid: 'user-2',
    userName: 'Eksempel Bruger',
    email: 'example@example.com',
    changeType: 'Deleted',
    status: 'Pending',
    occurredAt: '2026-09-28T13:00:00Z',
    receivedAt: '2026-09-29T13:00:00Z',
  },
];

function setupTest(connectionStatusFixture = 'existing-connection-status.json'): void {
  cy.requireIntercept();
  cy.intercept('api/v2/internal/organization/*/users/permissions', {
    fixture: './organizations/users/org-users-permissions.json',
  });
  cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('GET', /\/users\/external-changes\/pending-count$/, { body: { pendingCount: 2 } }).as(
    'getPendingExternalChangeCount',
  );
  cy.intercept('GET', /\/users\/external-changes\?/, (request) => {
    request.reply({ body: { total: 2, pendingCount: 2, items: changes } });
  }).as('getExternalChanges');
  cy.intercept(
    'GET',
    /\/sts-organization-synchronization\/connection-status$/,
    { fixture: `./local-admin/fk-org/${connectionStatusFixture}` },
  );
  cy.intercept(
    'GET',
    /\/sts-organization-synchronization\/connection\/change-log\?numberOfChangeLogs=5$/,
    { fixture: './local-admin/fk-org/changelog.json' },
  );
  cy.setup(true, 'local-admin/import');
}

describe('external-user-changes', () => {
  const testRunner = new TestRunner(setupTest);
  const disconnectedTestRunner = new TestRunner(() => setupTest('empty-connection-status.json'));

  it('shows pending changes and displays per-item bulk resolution outcomes', () => {
    testRunner.runTestWithSetup('Can review external user deletions', () => {
      cy.getByDataCy('import-users-tab').click();
      cy.getByDataCy('external-user-changes-tab').click();
      cy.wait('@getExternalChanges');
      cy.contains('Test Bruger').should('be.visible');
      cy.contains('Eksempel Bruger').should('be.visible');

      cy.intercept('POST', '**/users/external-changes/resolve', {
        statusCode: 200,
        body: {},
      }).as('resolveChanges');
      cy.intercept('GET', /\/users\/external-changes\/change-[12]$/, (request) => {
        const isFirstChange = request.url.endsWith('/change-1');
        request.reply({
          body: {
            ...changes[isFirstChange ? 0 : 1],
            status: isFirstChange ? 'Applied' : 'Pending',
          },
        });
      });

      cy.get('thead input[type="checkbox"]').click();
      cy.getByDataCy('bulk-apply').click();
      cy.getByDataCy('confirm-button').click();

      cy.wait('@resolveChanges').then(({ request }) => {
        expect(request.body).to.deep.equal({ changeUuids: ['change-1', 'change-2'], apply: true });
      });
      cy.getByDataCy('bulk-results').should('contain', 'Adgang fjernet');
      cy.getByDataCy('bulk-results').should('contain', 'Ændringen afventer stadig behandling');
    });
  });

  it('searches and loads resolved changes using the supported query parameters', () => {
    testRunner.runTestWithSetup('Can search and view resolved changes', () => {
      cy.getByDataCy('import-users-tab').click();
      cy.getByDataCy('external-user-changes-tab').click();
      cy.wait('@getExternalChanges');
      cy.getByDataCy('external-change-search').type('example');
      cy.wait('@getExternalChanges').its('request.url').should('contain', 'search=example');
      cy.getByDataCy('resolved-tab').click();
      cy.wait('@getExternalChanges').then(({ request }) => {
        expect(request.query).to.have.property('resolvedOnly', 'true');
        expect(request.query).not.to.have.property('status');
      });
    });
  });

  it('does not request external changes when the organization is not connected to FK Org', () => {
    disconnectedTestRunner.runTestWithSetup('Checks FK Org connection before loading user changes', () => {
      cy.getByDataCy('import-users-tab').click();
      cy.getByDataCy('external-user-changes-tab').click();
      cy.contains('Organisationen er ikke forbundet til FK Organisation').should('be.visible');
      cy.get('@getPendingExternalChangeCount.all').should('have.length', 0);
    });
  });
});
