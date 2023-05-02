/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');
  });

  function getKleRow(kleNumber: string) {
    return cy.contains(kleNumber).parentsUntil('tr').parent();
  }

  function verifyKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
  }

  function verifyLocallyAddedKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
    getKleRow(kleNumber).find('app-trashcan-icon').should('exist');
  }

  function verifyInheritedKle(kleNumber: string, name: string, irrelevant: boolean) {
    verifyKle(kleNumber, name);
    if (irrelevant) {
      getKleRow(kleNumber).find('app-plus-icon').should('exist');
    } else {
      getKleRow(kleNumber).find('app-trashcan-icon').should('exist');
    }
  }

  function toggleKle(kleNumber: string) {
    getKleRow(kleNumber).find('app-button').click();
  }

  function confirmAction(message: string, confirmationButtonText?: string, title?: string) {
    cy.contains(title ? title : 'Bekræft handling')
      .parentsUntil('app-confirmation-dialog')
      .first()
      .parent()
      .within(() => {
        cy.contains(message);
        cy.contains(confirmationButtonText ? confirmationButtonText : 'Ja').click();
      });
  }

  function withinKleSection(title: string, within: () => void) {
    cy.contains(title)
      .parentsUntil('app-card')
      .parent()
      .within(() => {
        within();
      });
  }

  // it('can show IT system usage grid', () => {
  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

  //   cy.contains('System 1');
  //   cy.contains('System 2');
  //   cy.contains('System 3');
  // });

  // it('can show IT system usage details', () => {
  //   cy.contains('System 3').click();

  //   cy.contains('Systeminformation');
  //   cy.input('Systemnavn').should('have.value', 'kaldenavn');
  //   cy.dropdown('Antal brugere').should('have.text', '>100');
  //   cy.dropdown('Klassifikation af data').should('have.text', 'Almindelige oplysninger');
  //   cy.contains('Informationer, hvor offentliggørelse er naturlig eller ikke ');

  //   cy.contains('Systemanvendelse');
  //   cy.input('Sidst redigeret (bruger)').should('have.value', 'Martin');
  //   cy.dropdown('Livscyklus').should('have.text', 'I drift');
  //   cy.input('Ibrugtagningsdato').should('have.value', '10-05-2022');

  //   cy.intercept('/api/v2/business-types*', { fixture: 'business-types.json' });
  //   cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });

  //   cy.contains('Data fra IT Systemkataloget').click();

  //   cy.contains('Ikke tilgængeligt');

  //   // Test parent system deactivated
  //   cy.input('Overordnet system').should('have.value', 'System 3 (ikke tilgængeligt)');

  //   // Test obselete option
  //   cy.dropdown('Forretningstype').should('have.text', 'Test (udgået)');

  //   cy.contains('Tilknyttede opgaver')
  //     .parentsUntil('app-card')
  //     .parent()
  //     .within(() => {
  //       verifyKle('83.01.02', 'IT-udstyr, anskaffelse');
  //     });
  // });

  // it('can refresh page on IT system usage details', () => {
  //   cy.contains('System 3').click();

  //   cy.contains('Systeminformation');
  //   cy.input('Systemnavn').should('have.value', 'kaldenavn');

  //   cy.reload(true);

  //   cy.contains('Systeminformation');
  //   cy.input('Systemnavn').should('have.value', 'kaldenavn');
  // });

  // it('redirects if missing read permission', () => {
  //   cy.intercept('/api/v2/it-system-usages/*/permissions', { read: false, modify: false, delete: false });

  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  //   cy.contains('System 3').click();

  //   cy.contains('Du har ikke læseadgang til dette IT System');
  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

  //   // Also works if IT System Usage returns forbidden
  //   cy.intercept('/api/v2/it-system-usages/*', { statusCode: 403 });

  //   cy.contains('System 3').click();

  //   cy.contains('Du har ikke læseadgang til dette IT System');
  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  // });

  // it('redirects if ressource is missing', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { statusCode: 404 });

  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  //   cy.contains('System 3').click();

  //   cy.contains('IT System findes ikke');
  //   cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  // });

  // it('can remove IT system usage', () => {
  //   cy.contains('System 3').click();

  //   cy.contains('Fjern anvendelse').click();

  //   cy.get('app-dialog').within(() => {
  //     cy.contains('Fortryd');
  //     cy.contains('Fjern anvendelse').click();
  //   });

  //   cy.contains('IT Systemer i Fælles Kommune');
  //   cy.contains('Systemanvendelsen er slettet');
  // });

  // it('hides and disables input for IT system usage when user does not have rights', () => {
  //   cy.intercept('/api/v2/it-system-usages/*/permissions', { read: true, modify: false, delete: false });

  //   cy.contains('System 3').click();
  //   cy.contains('Fjern anvendelse').should('not.exist');

  //   cy.input('Systemnavn (lokalt)').should('be.disabled');
  //   cy.input('Livscyklus').should('be.disabled');
  // });

  // it('can modify IT system usage', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' }).as('patch');

  //   cy.input('Systemnavn (lokalt)').clear().type('TEST');
  //   cy.input('Systemnavn ID').click();
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { localCallName: 'TEST' } });

  //   cy.contains('Feltet er opdateret');

  //   cy.dropdown('Antal brugere', '50-100');
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { numberOfExpectedUsers: { lowerBound: 50, upperBound: 100 } } });

  //   cy.dropdown('Livscyklus', 'Ikke i drift');
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { validity: { lifeCycleStatus: 'NotInUse' } } });

  //   cy.clock().then((clock) => {
  //     clock.setSystemTime(new Date('10/10/2022'));
  //   });

  //   cy.datepicker('Ibrugtagningsdato', '30');
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { validity: { validFrom: '2022-05-30T00:00:00.000Z' } } });

  //   cy.input('Ibrugtagningsdato').clear().type('31052022');
  //   cy.input('Systemnavn ID').click({ force: true });
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { validity: { validFrom: '2022-05-31T00:00:00.000Z' } } });

  //   cy.contains('Feltet er opdateret');
  // });

  // it('does not override focused form fields', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json', delay: 500 }).as('patch');

  //   cy.input('Systemnavn (lokalt)').clear().type('TEST');
  //   cy.input('Systemnavn ID').clear().type('123');
  //   cy.wait('@patch');

  //   cy.contains('Feltet er opdateret');

  //   cy.input('Systemnavn ID').type('456');
  //   cy.input('Version').click();
  //   cy.wait('@patch')
  //     .its('request.body')
  //     .should('deep.eq', { general: { localSystemId: '123456' } });
  // });

  // it('shows error on invalid form', () => {
  //   cy.contains('System 3').click();

  //   cy.input('Slutdato for anvendelse').clear().type('01012000');
  //   cy.input('Systemnavn ID').click();
  //   cy.contains('"Slutdato for anvendelse" er ugyldig');
  // });

  // it('can show DPR tab when no associated dprs', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/data-processing-registrations*', []);

  //   cy.navigateToDetailsSubPage('Databehandling');

  //   cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
  // });

  // it('can show DPR with two, known associated dprs', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/data-processing-registrations*', { fixture: 'data-processing-registrations.json' });

  //   cy.navigateToDetailsSubPage('Databehandling');

  //   const expectedRows = [
  //     {
  //       name: 'DPA 1 - INVALID',
  //       valid: false,
  //     },
  //     {
  //       name: 'DPA 2 - VALID',
  //       valid: true,
  //     },
  //   ];

  //   cy.get('tr').should('have.length', expectedRows.length);
  //   expectedRows.forEach((row) => {
  //     const rowElement = cy.contains(row.name);
  //     rowElement
  //       .parentsUntil('tr')
  //       .parent()
  //       .contains(row.valid ? 'Aktiv' : 'Ikke aktiv');
  //   });
  // });

  // it('can show interfaces when no associated interfaces', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-interfaces*includeDeactivated*', []);
  //   cy.intercept('/api/v2/it-interface-interface-types*', []);

  //   cy.navigateToDetailsSubPage('Udstillede snitflader');

  //   cy.contains('Systemet udstiller ingen snitflader');
  // });

  // it('can show interfaces with 2 associated interfaces', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-interfaces*includeDeactivated*', { fixture: 'it-interfaces.json' });
  //   cy.intercept('/api/v2/it-interface-interface-types*', { fixture: 'it-interfaces-types.json' });

  //   cy.navigateToDetailsSubPage('Udstillede snitflader');

  //   const expectedRows = [
  //     {
  //       name: 'Interface 1 - ACTIVE',
  //       deactivated: true,
  //       description: 'Test description 1',
  //       itInterfaceType: {
  //         name: 'InterfaceType1',
  //       },
  //       urlReference: 'http://www.kitos.dk',
  //     },
  //     {
  //       name: 'Interface 2 - INACTIVE',
  //       deactivated: false,
  //       description: 'Test description 2',
  //       itInterfaceType: {
  //         name: 'InterfaceType2 (udgået)',
  //       },
  //       urlReference: '', //since the url doesn't contain 'http' it should be invalid
  //     },
  //   ];

  //   cy.get('tr').should('have.length', expectedRows.length);
  //   expectedRows.forEach((row) => {
  //     const rowElement = cy.contains(row.name);
  //     rowElement
  //       .parentsUntil('tr')
  //       .parent('tr')
  //       .within(() => {
  //         cy.get('td')
  //           .eq(1)
  //           .contains(row.deactivated ? 'Ikke aktiv' : 'Aktiv');
  //         cy.get('td').eq(2).contains(row.itInterfaceType.name);
  //         cy.get('td').eq(3).contains(row.description);

  //         if (row.urlReference.includes('http')) {
  //           cy.get('td').eq(4).contains('Læs mere').should('have.attr', 'href').and('include', row.urlReference);
  //         }
  //       });
  //   });
  // });

  // it('shows help text dialog', () => {
  //   cy.intercept('/odata/HelpTexts*', { fixture: 'help-text.json' });

  //   cy.contains('System 3').click();

  //   cy.get('[data-cy="help-button"]').first().click();
  //   cy.contains('IT-systemforsiden finder du');
  //   cy.get('.close-button').click();

  //   cy.intercept('/odata/HelpTexts*', { value: [] });

  //   cy.get('[data-cy="help-button"]').first().click();
  //   cy.contains('Ingen hjælpetekst defineret');
  // });

  // it('can show Contracts tab when no associated contracts', () => {
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-contract-contract-types*', { fixture: 'contract-types.json' });
  //   cy.intercept('/api/v2/it-contracts*', []);

  //   cy.navigateToDetailsSubPage('Kontrakter');

  //   cy.contains('Systemet er ikke omfattet af registreringer i modulet "IT Kontrakter"');
  // });

  // it('can show Contracts tab associated contracts and no main contract selected', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-no-main-contract.json' });

  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-contract-contract-types*', { fixture: 'contract-types.json' });
  //   cy.intercept('/api/v2/it-contracts*', { fixture: 'it-contracts-by-it-system-usage-uuid.json' });

  //   cy.navigateToDetailsSubPage('Kontrakter');

  //   const expectedRows = [
  //     {
  //       name: 'The valid contract',
  //       valid: true,
  //       contractType: 'Tillægskontrakt',
  //       contractTypeObsoleted: false,
  //       supplier: 'Ballerup kommune',
  //       operation: 'Nej',
  //       validFrom: '28-02-2023',
  //       validTo: '09-04-2023',
  //       terminated: '10-06-2023',
  //     },
  //     {
  //       name: 'The invalid contract',
  //       valid: false,
  //       contractType: 'Expected obsoleted contract type',
  //       contractTypeObsoleted: true,
  //       supplier: 'Fælles Kommune',
  //       operation: 'Ja',
  //       validFrom: '02-01-2023',
  //       validTo: '27-02-2023',
  //     },
  //   ];

  //   cy.contains('Kontrakt der gør systemet aktivt').parentsUntil('app-card').parent().contains('Vælg kontrakt');

  //   for (const expectedRow of expectedRows) {
  //     const nameCell = cy.contains(expectedRow.name);
  //     const row = () => nameCell.parentsUntil('tr').parent();
  //     row().contains(expectedRow.name);
  //     row().contains(expectedRow.operation);
  //     row().contains(expectedRow.validFrom);
  //     row().contains(expectedRow.validTo);
  //     if (expectedRow.terminated) {
  //       row().contains(expectedRow.terminated);
  //     }
  //     row().contains(expectedRow.valid ? 'Gyldig' : 'Ikke gyldig');
  //     row().contains(expectedRow.contractType + (expectedRow.contractTypeObsoleted ? ' (udgået)' : ''));
  //   }
  // });

  // it('can change selected contract', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-no-main-contract.json' });
  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-contract-contract-types*', { fixture: 'contract-types.json' });
  //   cy.intercept('/api/v2/it-contracts?*', { fixture: 'it-contracts-by-it-system-usage-uuid.json' });

  //   cy.navigateToDetailsSubPage('Kontrakter');

  //   cy.contains('Kontrakt der gør systemet aktivt').parentsUntil('card').contains('Vælg kontrakt');

  //   cy.contains('Kontrakt der gør systemet aktivt')
  //     .parentsUntil('app-card')
  //     .parent()
  //     .within(() => {
  //       //Try the valid contract
  //       cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage-valid-main-contract.json' });
  //       cy.dropdown('Vælg kontrakt', 'The valid contract', true);
  //       cy.contains('Gyldig');
  //       cy.contains('Ikke gyldig').should('not.exist');

  //       //Try the invalid contract
  //       cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage-invalid-main-contract.json' });
  //       cy.dropdown('Vælg kontrakt', 'The invalid contract', true);
  //       cy.contains('Ikke gyldig');
  //     });
  // });

  // it('can show Organizations tab when no used by unit is set', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-no-organization.json' });

  //   cy.contains('System 3').click();

  //   cy.navigateToDetailsSubPage('Organisation');

  //   cy.contains('Systemet udstiller ingen ansvarlig organisationsenhed')
  //     .parentsUntil('app-it-system-usage-details-organization')
  //     .parent()
  //     .contains('Ingen relevante organisationsenheder tilføjet endnu');
  // });

  // it('can add Used units', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-no-organization.json' });

  //   cy.contains('System 3').click();

  //   cy.navigateToDetailsSubPage('Organisation');

  //   cy.intercept('/api/v2/organizations/*/organization-units*', { fixture: 'organization-units-hierarchy.json' });

  //   //open "add new using unit" dialog
  //   cy.contains('Tilføj relevant organisationsenhed').click();

  //   //select unit from the dropdown
  //   cy.dropdown('Vælg relevante organisationsenheder', 'Direktørområde', true);

  //   //validate can click the 'save' button
  //   cy.get('app-usage-organization').contains('Tilføj').click();
  // });

  // it('can show Used units', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

  //   cy.contains('System 3').click();

  //   cy.navigateToDetailsSubPage('Organisation');

  //   const expectedRows = [
  //     { uuid: '803fd406-27e2-4785-b162-02ee6ea876d1', name: 'Direktørområde' },
  //     { uuid: 'f4db9743-41e3-4a7a-ad62-683d10abe418', name: 'Test - 1' },
  //     { uuid: '933765a9-dad5-4a22-8d71-55b6798a094c', name: 'Test' },
  //     { uuid: '02d53ea4-0ba2-4e01-86d2-9044a4e4c81e', name: 'Test_28_11_2018' },
  //     { uuid: '16bab5a5-cff2-417b-bdeb-cf6033646d21', name: 'Kitos sekretariatet' },
  //   ];

  //   for (const expectedRow of expectedRows) {
  //     cy.contains(expectedRow.name);
  //   }
  // });

  // it('can select Responsible unit', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

  //   cy.contains('System 3').click();

  //   cy.navigateToDetailsSubPage('Organisation');

  //   cy.intercept('patch', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage-new-responsible-unit.json' });

  //   //select responsible unit
  //   cy.dropdown('Vælg ansvarlig organisationsenhed', 'Test - 1');

  //   //validate selected unit was updated
  //   cy.contains('Ansvarlig organisationsenhed').parentsUntil('app-card').parent().should('contain', 'Test - 1');
  // });

  // it('can show System roles', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-system-usage-role-types*', { fixture: 'it-system-usage-available-roles.json' });
  //   cy.intercept('/api/v2/**/roles', { fixture: 'it-system-usage-roles.json' });

  //   cy.navigateToDetailsSubPage('Systemroller');

  //   const expectedRows = [
  //     {
  //       user: {
  //         email: 'local-global-admin-user@kitos.dk',
  //         name: 'Automatisk oprettet testbruger (GlobalAdmin)',
  //       },
  //       role: { name: 'Changemanager' },
  //       writeAccess: true,
  //       description: 'test text',
  //     },
  //     {
  //       user: {
  //         email: 'local-global-admin-user@kitos.dk',
  //         name: 'Automatisk oprettet testbruger (GlobalAdmin)',
  //       },
  //       role: { name: 'Dataejer' },
  //       writeAccess: false,
  //       description: null,
  //     },
  //     {
  //       user: {
  //         email: 'local-global-admin-user@kitos.dk',
  //         name: 'Automatisk oprettet testbruger (GlobalAdmin)',
  //       },
  //       role: { name: 'Unavailable role (udgået)' },
  //       writeAccess: false,
  //       description: null,
  //     },
  //   ];

  //   for (const expectedRow of expectedRows) {
  //     const nameCell = cy.contains(expectedRow.role.name);
  //     const row = () => nameCell.parentsUntil('tr').parent();
  //     row().contains(expectedRow.user.email);
  //     row().contains(expectedRow.user.name);
  //     row().contains(expectedRow.writeAccess ? 'Ja' : 'Nej');

  //     if (expectedRow.description) {
  //       row()
  //         .get('td')
  //         .first()
  //         .within(() => {
  //           cy.get('app-tooltip').should('have.attr', 'ng-reflect-text', expectedRow.description);
  //         });
  //     }
  //   }
  // });

  // it('can show empty System roles', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-system-usage-role-types*', []);
  //   cy.intercept('/api/v2/**/roles', []);

  //   cy.navigateToDetailsSubPage('Systemroller');

  //   cy.contains('Ingen systemroller tilføjet endnu');
  //   cy.contains('Tilføj systemrolle');
  // });

  // it('can add new System role', () => {
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

  //   cy.contains('System 3').click();

  //   cy.intercept('/api/v2/it-system-usage-role-types*', { fixture: 'it-system-usage-available-roles.json' });
  //   cy.intercept('/api/v2/**/roles', { fixture: 'it-system-usage-roles.json' });

  //   cy.navigateToDetailsSubPage('Systemroller');

  //   cy.intercept('/api/v2/**/users*', { fixture: 'users.json' });
  //   cy.contains('Tilføj systemrolle').click();

  //   //select user from the dropdown
  //   cy.dropdown('Vælg bruger', 'Automatisk oprettet testbruger (GlobalAdmin)', true);

  //   //select role from the dropdown
  //   cy.dropdown('Vælg rolle', 'TestRole', true);

  //   //validate can click the 'save' button
  //   cy.intercept('/api/v2/it-system-usages/**/add', {});
  //   cy.get('app-dialog').contains('Tilføj').click();
  // });

  // it('shows simple hierarchy', () => {
  //   cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: 'hierarchy.json' });

  //   cy.contains('System 3').click();
  //   cy.navigateToDetailsSubPage('Hierarki');

  //   cy.get('app-it-system-hierarchy-table').within(() => {
  //     cy.contains('System 1');
  //     cy.contains('System 2');
  //   });
  // });

  // it('shows complex hierarchy', () => {
  //   cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: 'hierarchy-complex.json' });

  //   cy.contains('System 3').click();
  //   cy.navigateToDetailsSubPage('Hierarki');

  //   cy.get('app-it-system-hierarchy-table').within(() => {
  //     cy.contains('System 1');
  //     cy.contains('System 2');
  //     cy.contains('System 4');
  //     cy.contains('System 6');
  //   });
  // });

  it('shows KLE page with neither inherited nor local KLE', () => {
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-no-kle.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-no-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      cy.contains('Der er ikke registreret tilknyttede opgaver i IT Systemkataloget');
    });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret lokalt tilknyttede opgaver');
    });
  });

  it('shows KLE page inherited and local KLE for both opt-in and opt-out of inherited', () => {
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-kle-opt-in-and-opt-out.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      verifyInheritedKle('00.30.12', 'Decentrale budgetter', false);
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', true);
    });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      verifyLocallyAddedKle('00.30.18', 'Tillægsbevillinger');
    });
  });

  it('Can restore inherited KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-kle-opt-in-and-opt-out.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      toggleKle('00.30.14');
    });

    confirmAction('Er du sikker på, at du vil gendanne den nedarvede opgave?');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-no-kle.json' });

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      //Verify that the toggled KLE is now shown as relevant
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', false);
    });

    cy.contains('Den nedarvede opgave blev gendannet');
  });

  it('Can remove inherited KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-no-kle.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      toggleKle('00.30.14');
    });

    confirmAction('Er du sikker på, at du vil fjerne den nedarvede opgave?');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './kle/it-system-usage-kle-opt-in-and-opt-out.json',
    });

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      //Verify that the toggled KLE is now shown as irrelevant
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', true);
    });

    cy.contains('Den nedarvede opgave blev fjernet');
  });

  it('Can remove local KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-kle-opt-in-and-opt-out.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      toggleKle('00.30.18');
    });

    confirmAction('Er du sikker på, at du vil fjerne den lokale tilknytning?');
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-no-kle.json' });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret lokalt tilknyttede opgaver');
    });
  });

  // it('Can add local KLE option', () => {
  //   cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });
  //   cy.intercept('/api/v2/it-system-usages/*', { fixture: './kle/it-system-usage-kle-opt-in-and-opt-out.json' });
  //   cy.intercept('/api/v2/it-systems/*', { fixture: './kle/it-system-with-kle.json' });

  //   cy.contains('System 3').click();
  //   cy.navigateToDetailsSubPage('Lokale KLE');
  // });
});
