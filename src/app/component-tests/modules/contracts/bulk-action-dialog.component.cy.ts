import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import {
  BulkActionDialogComponent,
  BulkActionOption,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';

describe('BulkActionDialog', () => {
  const exampleContract1: BulkActionOption = {
    id: '1',
    name: 'Contract 1',
  };
  const exampleContract2: BulkActionOption = {
    id: '2',
    name: 'Contract 2',
    secondaryName: 'Contract 1',
  };

  it('Can select and deselect all', () => {
    mountComponent(exampleContract1, exampleContract2);

    validateEachOption(false);
    cy.getByDataCy('select-all-bulk-action-button').click();
    validateEachOption(true);
    cy.getByDataCy('deselect-all-bulk-action-button').click();
    validateEachOption(false);

    cy.getByDataCy('select-all-bulk-action-checkbox').click();
    validateEachOption(true);
    cy.getByDataCy('deselect-all-bulk-action-button').should('not.be.disabled');
    cy.getByDataCy('select-all-bulk-action-checkbox').click();
    validateEachOption(false);
    cy.getByDataCy('select-all-bulk-action-button').should('not.be.disabled');

    cy.getByDataCy('bulk-action-checkbox').each(($checkbox) => {
      cy.wrap($checkbox).click();
    });

    cy.getByDataCy('deselect-all-bulk-action-button').should('not.be.disabled');
    cy.getByDataCy('select-all-bulk-action-button').find('button').should('be.disabled');
    cy.getByDataCy('select-all-bulk-action-checkbox').invoke('attr', 'ng-reflect-value').should('equal', 'true');
  });
});

function validateEachOption(shouldBeSelected: boolean) {
  cy.getByDataCy('bulk-action-checkbox').each(($checkbox) => {
    if (shouldBeSelected) {
      cy.wrap($checkbox).invoke('attr', 'ng-reflect-value').should('equal', 'true');
    } else {
      cy.wrap($checkbox).should('not.be.checked');
    }
  });
}

function mountComponent(exampleContract1: BulkActionOption, exampleContract2: BulkActionOption) {
  cy.mount(BulkActionDialogComponent, {
    componentProperties: {
      sections: [
        {
          options$: of([exampleContract1, exampleContract2]),
          entityType: 'it-contract',
          title: 'Test',
          primaryColumnTitle: 'Primary',
          secondaryColumnTitle: 'Secondary',
        },
      ],
      actionButtons: [{ text: 'Confirm test', color: 'secondary', buttonStyle: 'secondary', callback: () => {} }],
      dropdownDisabledUuids$: of([]),
      dropdownType: 'it-contract',
      allowEmptyDropdownSelection: true,
      isLoading$: of(false),
    },
    providers: [{ provide: MatDialogRef, useValue: { close: cy.spy().as('close') } }],
    imports: [ComponentsModule, AppModule],
  });
}
