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

const usersConnectionStatusUrl = /\/sts-organization-synchronization\/users\/connection-status$/;
const usersConnectionUrl = /\/sts-organization-synchronization\/users\/connection$/;

function interceptUsersConnectionStatus(fixture: string): void {
  cy.intercept('GET', usersConnectionStatusUrl, { fixture: `./local-admin/fk-org/${fixture}` }).as(
    'getUsersConnectionStatus',
  );
}

function setupTest(usersConnectionStatusFixture: string): void {
  cy.requireIntercept();
  cy.intercept('api/v2/internal/organization/*/users/permissions', {
    fixture: './organizations/users/org-users-permissions.json',
  });
  cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('GET', /\/users\/external-changes\?/, (request) => {
    request.reply({ body: { total: 2, pendingCount: 2, items: changes } });
  }).as('getExternalChanges');
  cy.intercept('GET', /\/sts-organization-synchronization\/connection-status$/, {
    fixture: './local-admin/fk-org/existing-connection-status.json',
  });
  cy.intercept('GET', /\/sts-organization-synchronization\/connection\/change-log\?numberOfChangeLogs=5$/, {
    fixture: './local-admin/fk-org/changelog.json',
  });
  interceptUsersConnectionStatus(usersConnectionStatusFixture);
  cy.setup(true, 'local-admin/import');
}

function openUsersTab(): void {
  cy.getByDataCy('import-users-tab').click();
  cy.wait('@getUsersConnectionStatus');
}

describe('external-user-changes', () => {
  const connectedTestRunner = new TestRunner(() => setupTest('users-connection-status-connected.json'));
  const notConnectedTestRunner = new TestRunner(() => setupTest('users-connection-status-not-connected.json'));
  const accessErrorTestRunner = new TestRunner(() => setupTest('users-connection-status-access-error.json'));

  it('shows the Excel import and FK Organisation cards with pending count when connected', () => {
    connectedTestRunner.runTestWithSetup('Shows two cards on the users sub-tab', () => {
      openUsersTab();
      cy.contains('Via Excel').should('be.visible');
      cy.wait('@getExternalChanges');
      cy.getByDataCy('fk-org-users-card-header').should('contain', 'Via FK Organisation (2 afventer)');
      cy.getByDataCy('fk-org-users-connected').should('be.visible');
      cy.getByDataCy('fk-org-users-connect').should('not.exist');
      cy.getByDataCy('fk-org-users-disconnect').should('be.visible');
    });
  });

  it('shows pending changes and displays per-item bulk resolution outcomes', () => {
    connectedTestRunner.runTestWithSetup('Can review external user deletions', () => {
      openUsersTab();
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

      cy.getByDataCy('select-all').click();
      cy.getByDataCy('selection-count').should('contain', '2');
      cy.getByDataCy('bulk-apply').click();
      cy.getByDataCy('confirm-button').click();

      cy.wait('@resolveChanges').then(({ request }) => {
        expect(request.body).to.deep.equal({ changeUuids: ['change-1', 'change-2'], apply: true });
      });
      cy.getByDataCy('bulk-results').should('contain', 'Adgang fjernet');
      cy.getByDataCy('bulk-results').should('contain', 'Ændringen afventer stadig behandling');
    });
  });

  it('loads resolved changes and shows an empty grid without errors', () => {
    connectedTestRunner.runTestWithSetup('Can view resolved changes', () => {
      openUsersTab();
      cy.wait('@getExternalChanges').then(({ request }) => {
        expect(request.query).to.have.property('status', 'Pending');
      });
      cy.intercept('GET', /\/users\/external-changes\?/, {
        body: { total: 0, pendingCount: 2, items: { $type: 'System.Linq.Enumerable', $values: [] } },
      }).as('getResolvedChanges');
      cy.getByDataCy('resolved-tab').click();
      cy.wait('@getResolvedChanges').then(({ request }) => {
        expect(request.query).to.have.property('resolvedOnly', 'true');
        expect(request.query).not.to.have.property('status');
      });
      cy.getByDataCy('external-changes-load-error').should('not.exist');
      cy.contains('Din søgning gav intet resultat').should('be.visible');
      cy.getByDataCy('bulk-apply').should('not.exist');
    });
  });

  it('can select a single change from the grid checkbox column', () => {
    connectedTestRunner.runTestWithSetup('Can select a single change', () => {
      openUsersTab();
      cy.wait('@getExternalChanges');
      cy.getByDataCy('grid-checkbox').first().click();
      cy.getByDataCy('selection-count').should('contain', '1');
      cy.getByDataCy('clear-selection').click();
      cy.getByDataCy('selection-count').should('contain', '0');
    });
  });

  it('hides external changes when not connected and can connect', () => {
    notConnectedTestRunner.runTestWithSetup('Can connect users to FK Organisation', () => {
      openUsersTab();
      cy.getByDataCy('fk-org-users-not-connected').should('be.visible');
      cy.getByDataCy('fk-org-users-disconnect').should('not.exist');
      cy.getByDataCy('external-changes-grid').should('not.exist');
      cy.get('@getExternalChanges.all').should('have.length', 0);

      cy.intercept('POST', usersConnectionUrl, { statusCode: 204 }).as('createUsersConnection');
      interceptUsersConnectionStatus('users-connection-status-connected.json');
      cy.getByDataCy('fk-org-users-connect').click();
      cy.getByDataCy('confirm-button').click();

      cy.wait('@createUsersConnection');
      cy.wait('@getUsersConnectionStatus');
      cy.wait('@getExternalChanges');
      cy.contains('Test Bruger').should('be.visible');
    });
  });

  it('can disconnect and hides external changes afterwards', () => {
    connectedTestRunner.runTestWithSetup('Can disconnect users from FK Organisation', () => {
      openUsersTab();
      cy.wait('@getExternalChanges');

      cy.intercept('DELETE', usersConnectionUrl, { statusCode: 204 }).as('deleteUsersConnection');
      interceptUsersConnectionStatus('users-connection-status-not-connected.json');
      cy.getByDataCy('fk-org-users-disconnect').click();
      cy.getByDataCy('confirm-button').click();

      cy.wait('@deleteUsersConnection');
      cy.wait('@getUsersConnectionStatus');
      cy.getByDataCy('fk-org-users-not-connected').should('be.visible');
      cy.getByDataCy('external-changes-grid').should('not.exist');
      cy.getByDataCy('fk-org-users-card-header').should('not.contain', 'afventer');
    });
  });

  it('shows the access error and prevents connecting when validation fails', () => {
    accessErrorTestRunner.runTestWithSetup('Cannot connect without access', () => {
      openUsersTab();
      cy.getByDataCy('fk-org-users-access-error').should('contain', 'serviceaftale');
      cy.getByDataCy('fk-org-users-connect').should('not.exist');
      cy.get('@getExternalChanges.all').should('have.length', 0);
    });
  });

  it('shows retry when the connection status cannot be loaded', () => {
    notConnectedTestRunner.runTestWithSetup('Can retry loading connection status', () => {
      cy.intercept('GET', usersConnectionStatusUrl, { statusCode: 500, body: {} }).as('failedUsersConnectionStatus');
      cy.getByDataCy('import-users-tab').click();
      cy.wait('@failedUsersConnectionStatus');
      cy.getByDataCy('fk-org-users-access-error').should('be.visible');

      interceptUsersConnectionStatus('users-connection-status-not-connected.json');
      cy.getByDataCy('fk-org-users-retry').click();
      cy.wait('@getUsersConnectionStatus');
      cy.getByDataCy('fk-org-users-not-connected').should('be.visible');
    });
  });
});
