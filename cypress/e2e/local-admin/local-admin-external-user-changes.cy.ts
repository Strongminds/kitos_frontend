/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';

const firstUserUuid = 'd8a38b12-e702-48a8-962c-e97890b4be10';
const secondUserUuid = '6dabde89-3452-41f9-8b86-a6ffdbbfa361';
const recipientUuid = '7a2b9308-1e8f-4018-9250-760c847c4b53';
const unitRole = { uuid: '071119f8-6c30-4aac-9d2b-12f66d8490dc', name: 'Chef' };
const unitRights = [
  { Id: 11, Role: { Uuid: unitRole.uuid, Name: unitRole.name }, Object: { Uuid: 'unit-1', Name: 'Enhed 1' } },
  { Id: 12, Role: { Uuid: unitRole.uuid, Name: unitRole.name }, Object: { Uuid: 'unit-2', Name: 'Enhed 2' } },
];

const changes = [
  {
    uuid: 'change-1',
    externalMessageId: 'message-1',
    externalUserUuid: 'external-user-1',
    userUuid: firstUserUuid,
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
    userUuid: secondUserUuid,
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
  cy.intercept('GET', /\/api\/v2\/(it-system-usage|it-contract|data-processing-registration)-role-types\?/, {
    body: [],
  });
  cy.intercept('GET', '/api/v2/organization-unit-role-types*', { body: [unitRole] });
  interceptUsersConnectionStatus(usersConnectionStatusFixture);
  cy.setup(true, 'local-admin/import');
}

function openUsersTab(): void {
  cy.getByDataCy('import-users-tab').click();
  cy.wait('@getUsersConnectionStatus');
}

function openPendingChanges(): void {
  openUsersTab();
  cy.getByDataCy('external-changes-accordion').find('mat-expansion-panel-header').click();
  cy.wait('@getExternalChanges');
}

function interceptReviewUsers(
  firstUserRights: () => typeof unitRights,
  options: { blockedUserUuid?: string; waitForLookups?: Promise<void> } = {},
): void {
  cy.intercept('GET', /\/odata\/GetUsersByUuid\(/, async (request) => {
    await options.waitForLookups;
    expect(request.query['$expand']).to.include('OrganizationUnitRights')
      .and.to.include('ItSystemRights').and.to.include('ItContractRights')
      .and.to.include('DataProcessingRegistrationRights');
    const change = changes.find(({ userUuid }) => request.query['$filter'] === `Uuid eq ${userUuid}`);
    if (!change) throw new Error('Expected lookup by the selected local user UUID');
    if (change.userUuid === options.blockedUserUuid) {
      request.alias = 'blockedLookup';
      request.reply({ statusCode: 403, body: {} });
      return;
    }
    const [Name, LastName] = change.userName.split(' ');
    request.reply({
      body: {
        value: [{
          Uuid: change.userUuid, Name, LastName, OrganizationRights: [],
          OrganizationUnitRights: change.userUuid === firstUserUuid ? firstUserRights() : [],
          ItSystemRights: [], ItContractRights: [], DataProcessingRegistrationRights: [],
        }],
      },
    });
  }).as('lookupReviewUser');
}

function interceptRecipient(): void {
  cy.intercept('GET', /\/api\/v2\/organizations\/[^/]+\/users(?:\?|$)/, {
    body: [{ uuid: recipientUuid, name: 'Modtager Bruger', email: 'recipient@example.com' }],
  });
}

function transferSelectedRoles(): void {
  cy.get('app-user-dropdown ng-select').click();
  cy.get('ng-dropdown-panel').contains('Modtager Bruger').click();
  cy.getByDataCy('bulk-action-dialog').find('.perform-action-button').click();
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
      let firstUserRights = unitRights;
      let releaseLookups!: () => void;
      const waitForLookups = new Promise<void>((resolve) => { releaseLookups = resolve; });
      interceptReviewUsers(() => firstUserRights, { waitForLookups });
      interceptRecipient();
      cy.intercept('POST', `**/users/${firstUserUuid}/transfer-roles/${recipientUuid}`, (request) => {
        expect(request.body.unitRights.map((right: { roleId: number }) => right.roleId)).to.deep.equal([11]);
        firstUserRights = [unitRights[1]];
        request.reply({ statusCode: 200, body: {} });
      }).as('transferRoles');
      openPendingChanges();
      cy.contains('Test Bruger').should('be.visible');
      cy.contains('Eksempel Bruger').should('be.visible');

      cy.intercept('GET', /\/users\/external-changes\?/, {
        body: { total: 1, pendingCount: 1, items: [changes[1]] },
      }).as('refreshExternalChanges');
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
      cy.getByDataCy('dialog-title').should('contain', 'Gennemgå sletninger');
      cy.get('app-deletion-batch-review-dialog app-loading').should('be.visible');
      cy.getByDataCy('complete-batch-review').find('button').should('be.disabled');
      cy.then(() => releaseLookups());
      cy.getByDataCy('deletion-review-row').contains('tr', 'Eksempel Bruger')
        .find('app-chip .chip-success').should('contain', 'Klar');
      cy.getByDataCy('deletion-review-row').contains('tr', 'Test Bruger')
        .find('app-chip .chip-error').should('contain', 'Til gennemgang');
      cy.getByDataCy('complete-batch-review').find('button').should('be.disabled');
      cy.getByDataCy('deletion-review-row').contains('tr', 'Test Bruger').find('[data-cy="review-user"] button')
        .should(($button) => expect($button).to.have.attr('aria-label', 'Gennemgå')).click();
      cy.getByDataCy('bulk-action-dialog').should('contain', 'Overfør roller for Test Bruger');
      cy.get('app-delete-user-dialog').should('not.exist');
      cy.getByDataCy('bulk-action-checkbox').first().click();
      transferSelectedRoles();
      cy.wait('@transferRoles');
      cy.getByDataCy('bulk-action-dialog').should('not.contain', 'Enhed 1').and('contain', 'Enhed 2');
      cy.press(Cypress.Keyboard.Keys.ESC);
      cy.getByDataCy('bulk-action-dialog').should('not.exist');
      cy.focused().should('have.attr', 'aria-label', 'Gennemgå');
      cy.getByDataCy('complete-batch-review').find('button').should('be.disabled');
      cy.getByDataCy('skip-remaining-roles').find('button')
        .should(($button) => expect($button).to.have.attr('aria-label', 'Spring roller over'))
        .click();
      cy.getByDataCy('deletion-review-row').contains('tr', 'Test Bruger')
        .find('app-chip .chip-warning').should('contain', 'Roller fravalgt');
      cy.focused().should('have.attr', 'aria-label', 'Gennemgå');
      cy.getByDataCy('complete-batch-review').click();
      cy.getByDataCy('confirm-dialog').should('contain', 'Fjern brugernes adgang');
      cy.get('@resolveChanges.all').should('have.length', 0);
      cy.getByDataCy('confirm-button').click();

      cy.wait('@resolveChanges').then(({ request }) => {
        expect(request.body).to.deep.equal({ changeUuids: ['change-1', 'change-2'], apply: true });
      });
      cy.get('app-popup-message').should('contain', '1 af 2 ændringer blev behandlet.');
      cy.get('app-popup-message').should('contain', 'Ændringen afventer stadig behandling');
      cy.getByDataCy('bulk-results').should('not.exist');
      cy.wait('@refreshExternalChanges');
      cy.getByDataCy('fk-org-users-card-header').should('contain', 'Via FK Organisation (1 afventer)');
      cy.getByDataCy('external-changes-grid').should('not.contain', 'Test Bruger');
      cy.get('@resolveChanges.all').should('have.length', 1);
    });
  });

  it('reviews a single user directly and preserves a complete transfer when deletion is cancelled', () => {
    connectedTestRunner.runTestWithSetup('Cancelling access removal preserves transfers', () => {
      let firstUserRights = unitRights;
      interceptReviewUsers(() => firstUserRights);
      interceptRecipient();
      cy.intercept('POST', '**/users/external-changes/resolve', { body: {} }).as('resolveChanges');
      cy.intercept('POST', `**/users/${firstUserUuid}/transfer-roles/${recipientUuid}`, (request) => {
        expect(request.body.unitRights.map((right: { roleId: number }) => right.roleId)).to.have.members([11, 12]);
        firstUserRights = [];
        request.reply({ statusCode: 200, body: {} });
      }).as('transferRoles');
      openPendingChanges();
      cy.getByDataCy('grid-checkbox').first().click();
      cy.getByDataCy('bulk-apply').click();
      cy.getByDataCy('dialog-title').should('have.length', 1).and('contain', 'Slet bruger');
      cy.contains('Overførsler gemmes med det samme').should('be.visible');
      cy.getByDataCy('transfer-roles-button').click();
      cy.getByDataCy('select-all-bulk-action-button').click();
      transferSelectedRoles();
      cy.wait('@transferRoles');
      cy.getByDataCy('bulk-action-dialog').should('not.exist');
      cy.getByDataCy('transfer-roles-button').should('not.exist');
      cy.focused().should('contain.text', 'Annuller');
      cy.getByDataCy('complete-user-review').click();
      cy.getByDataCy('confirm-dialog').should('contain', 'Fjern brugernes adgang');
      cy.press(Cypress.Keyboard.Keys.ESC);
      cy.getByDataCy('confirm-dialog').should('not.exist');
      cy.get('@resolveChanges.all').should('have.length', 0);
      cy.getByDataCy('selection-count').should('contain', '1');
      cy.getByDataCy('external-changes-grid').contains('tr', 'Test Bruger').should('contain', 'Afventer');
      cy.getByDataCy('bulk-apply').click();
      cy.contains('Brugeren har ingen roller, der kan overføres.').should('be.visible');
      cy.get('@lookupReviewUser.all').should('have.length', 3);
    });
  });

  it('blocks the batch when a local user lookup fails', () => {
    connectedTestRunner.runTestWithSetup('A failed lookup prevents access removal', () => {
      interceptReviewUsers(() => [], { blockedUserUuid: secondUserUuid });
      cy.intercept('POST', '**/users/external-changes/resolve', { body: {} }).as('resolveChanges');
      openPendingChanges();
      cy.getByDataCy('select-all').click();
      cy.getByDataCy('bulk-apply').click();
      cy.wait('@blockedLookup');
      cy.getByDataCy('deletion-review-row').contains('tr', 'Eksempel Bruger')
        .find('app-chip .chip-error').should('contain', 'Blokeret');
      cy.getByDataCy('complete-batch-review').find('button').should('be.disabled');
      cy.getByDataCy('cancel-batch-review').click();
      cy.getByDataCy('selection-count').should('contain', '2');
      cy.get('@resolveChanges.all').should('have.length', 0);
    });
  });

  it('invalidates final confirmation when the active organization changes', () => {
    connectedTestRunner.runTestWithSetup('A review belongs to the active organization', () => {
      interceptReviewUsers(() => []);
      cy.intercept('POST', '**/users/external-changes/resolve', { body: {} }).as('resolveChanges');
      openPendingChanges();
      cy.getByDataCy('grid-checkbox').first().click();
      cy.getByDataCy('bulk-apply').click();
      cy.getByDataCy('complete-user-review').click();
      cy.getByDataCy('confirm-dialog').should('contain', 'Fjern brugernes adgang');

      cy.intercept('GET', '/api/v2/organizations?*', {
        body: [{ uuid: '41438997-c99e-460a-9602-6a1d105a1a18', name: 'Anden Kommune', organizationType: 'Municipality' }],
      });
      // Open the organization picker while the confirmation owns keyboard focus.
      cy.get('app-nav-bar').then(([element]) => {
        const appWindow = element.ownerDocument.defaultView as Window & typeof globalThis & {
          ng: { getComponent: (element: Element) => { showOrganizationDialog: () => void } };
        };
        appWindow.ng.getComponent(element).showOrganizationDialog();
      });
      cy.get('mat-dialog-container').last().find('app-dropdown ng-select').click();
      cy.get('ng-dropdown-panel').contains('Anden Kommune').click();

      cy.getByDataCy('confirm-dialog').should('not.exist');
      cy.get('@resolveChanges.all').should('have.length', 0);
      cy.getByDataCy('profile-menu').should('contain', 'Anden Kommune');
    });
  });

  it('leaves roles available after a failed transfer', () => {
    connectedTestRunner.runTestWithSetup('A failed transfer leaves the choice to the admin', () => {
      interceptReviewUsers(() => unitRights);
      interceptRecipient();
      cy.intercept('POST', `**/users/${firstUserUuid}/transfer-roles/${recipientUuid}`, {
        statusCode: 403, body: {},
      }).as('transferRoles');
      cy.intercept('POST', '**/users/external-changes/resolve', { body: {} }).as('resolveChanges');
      openPendingChanges();
      cy.getByDataCy('grid-checkbox').first().click();
      cy.getByDataCy('bulk-apply').click();
      cy.getByDataCy('transfer-roles-button').click();
      cy.getByDataCy('select-all-bulk-action-button').click();
      transferSelectedRoles();
      cy.wait('@transferRoles');
      cy.contains('Kunne ikke overføre roller').should('be.visible');
      cy.getByDataCy('bulk-action-dialog').should('contain', 'Enhed 1').and('contain', 'Enhed 2');
      cy.press(Cypress.Keyboard.Keys.ESC);
      cy.getByDataCy('bulk-action-dialog').should('not.exist');
      cy.getByDataCy('complete-user-review').should('contain', 'Fortsæt uden at overføre resterende roller');
      cy.getByDataCy('cancel-button').click();
      cy.get('@resolveChanges.all').should('have.length', 0);
      cy.get('@lookupReviewUser.all').should('have.length', 1);
      cy.getByDataCy('selection-count').should('contain', '1');
    });
  });

  it('returns to the previous page when the last pending row on the current page is dismissed', () => {
    connectedTestRunner.runTestWithSetup('Clamps the pending changes page after a dismissal', () => {
      const pageSize = 100;
      const firstPage = Array.from({ length: pageSize }, (_, index) => ({
        ...changes[0],
        uuid: `pending-${index}`,
        userName: `Afventende bruger ${index}`,
      }));
      const lastChange = changes[1];
      cy.intercept('GET', /\/users\/external-changes\?/, {
        body: { total: pageSize + 1, pendingCount: pageSize + 1, items: [...firstPage, lastChange] },
      }).as('getPaginatedChanges');
      openUsersTab();
      cy.getByDataCy('external-changes-accordion').find('mat-expansion-panel-header').click();
      cy.wait('@getPaginatedChanges');
      cy.getByDataCy('external-changes-grid').find('kendo-pager-next-buttons button').first().click();
      cy.getByDataCy('external-changes-grid').should('contain', lastChange.userName);

      cy.intercept('POST', '**/users/external-changes/resolve', { statusCode: 200, body: {} }).as('resolveChanges');
      cy.intercept('GET', `**/users/external-changes/${lastChange.uuid}`, {
        body: { ...lastChange, status: 'Dismissed' },
      });
      cy.intercept('GET', /\/users\/external-changes\?/, {
        body: { total: pageSize, pendingCount: pageSize, items: firstPage },
      }).as('refreshExternalChanges');

      cy.getByDataCy('grid-checkbox').click();
      cy.getByDataCy('bulk-dismiss').click();
      cy.wait('@resolveChanges').its('request.body').should('deep.equal', {
        changeUuids: [lastChange.uuid],
        apply: false,
      });
      cy.wait('@refreshExternalChanges');
      cy.getByDataCy('external-changes-grid').should('contain', firstPage[0].userName);
    });
  });

  it('loads resolved changes and shows an empty grid without errors', () => {
    connectedTestRunner.runTestWithSetup('Can view resolved changes', () => {
      openUsersTab();
      cy.getByDataCy('external-changes-accordion').find('mat-expansion-panel-header').click();
      cy.wait('@getExternalChanges').then(({ request }) => {
        expect(request.query).to.have.property('status', 'Pending');
      });
      cy.intercept('GET', /\/users\/external-changes\?/, {
        body: { total: 0, pendingCount: 2, items: { $type: 'System.Linq.Enumerable', $values: [] } },
      }).as('getResolvedChanges');
      cy.dropdownByCy('external-changes-view', 'Behandlede', true);
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
      cy.getByDataCy('external-changes-accordion').find('mat-expansion-panel-header').click();
      cy.wait('@getExternalChanges');
      cy.getByDataCy('grid-checkbox').first().click();
      cy.getByDataCy('selection-count').should('contain', '1');
      cy.getByDataCy('select-all').find('input').should('have.prop', 'indeterminate', true);
      cy.getByDataCy('select-all').click();
      cy.getByDataCy('selection-count').should('contain', '2');
      cy.getByDataCy('select-all').find('input').should('be.checked');
      cy.getByDataCy('select-all').click();
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
      cy.getByDataCy('external-changes-accordion').find('mat-expansion-panel-header').click();
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
