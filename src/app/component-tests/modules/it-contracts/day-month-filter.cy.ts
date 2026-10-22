/// <reference types="cypress" />
// Include the existing global command typings for component compilation.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { Component, ElementRef, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DayMonthFilterComponent } from '../../../shared/components/grid/day-month-filter/day-month-filter.component';
import { ITContractActions } from '../../../store/it-contract/actions';

let popupContainer: ElementRef;

@Component({
  template: `<div class="k-grid-aria-root" style="position: relative; width: 120px; overflow: hidden">
    <app-day-month-filter [column]="column" [filter]="filter" entityType="it-contract"></app-day-month-filter>
  </div>`,
  imports: [DayMonthFilterComponent],
})
class DayMonthFilterHost {
  constructor(container: ElementRef) { popupContainer = container; }
  public column = { field: 'InvoiceDate1', title: 'Fakturadato 1' } as ColumnComponent;
  @Input() public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
}

function mountFilter(filter: CompositeFilterDescriptor = { logic: 'and', filters: [] }) {
  const actions = new Subject<Action>();
  const apply = cy.spy().as('applyFilter');
  let updateFilter: ((next: CompositeFilterDescriptor) => void) | undefined;
  return cy.mount(DayMonthFilterHost, {
    componentProperties: { filter },
    providers: [
      provideNoopAnimations(),
      { provide: POPUP_CONTAINER, useFactory: () => popupContainer },
      { provide: Actions, useValue: new Actions(actions) },
      { provide: FilterService, useValue: { filter: (next: CompositeFilterDescriptor) => {
        apply(JSON.parse(JSON.stringify(next)));
        updateFilter?.(next);
      } } },
    ],
  }).then(({ component: host, fixture }) => {
    fixture.detectChanges();
    updateFilter = (next) => { host.filter = next; };
    const component = fixture.debugElement.query(By.directive(DayMonthFilterComponent)).componentInstance as DayMonthFilterComponent;
    return { component, fixture, actions, apply };
  });
}

function selectPart(part: 'day' | 'month', value: string) {
  cy.get(`[data-cy="day-month-filter-${part}"] .ng-arrow-wrapper`).click();
  cy.get('.ng-option').contains(new RegExp(`^\\s*${value}\\s*$`)).click();
}

describe('Invoice day/month filter', () => {
  it('waits for a full value and resets a partial draft without sending a request', () => {
    mountFilter();
    cy.get('[data-cy="day-month-filter-toggle"] button').click();
    selectPart('month', '06');
    cy.get('[data-cy="day-month-filter-operator"] .ng-arrow-wrapper').click();
    cy.contains('.ng-option', 'Til og med').click();
    cy.get('@applyFilter').should('not.have.been.called');
    cy.get('[data-cy="day-month-filter-close"] button').click();
    cy.get('[data-cy="day-month-filter-toggle"] button').then(($opener) => {
      const opener = $opener[0].getBoundingClientRect();
      cy.get('[data-cy="day-month-filter-reset"] button').should(($reset) => {
        const reset = $reset[0].getBoundingClientRect();
        expect(reset.left).to.be.greaterThan(opener.left);
        expect(reset.right).to.be.lessThan(opener.right);
        expect(reset.top).to.be.greaterThan(opener.top);
        expect(reset.bottom).to.be.lessThan(opener.bottom);
      });
    });
    cy.get('[data-cy="day-month-filter-reset"] button').click();
    cy.get('@applyFilter').should('not.have.been.called');
    cy.get('[data-cy="day-month-filter-toggle"] button').click();
    cy.get('[data-cy="day-month-filter-month"] .ng-value-label').should('not.exist');
  });

  it('opens outside a narrow cell and closes with Escape or an outside click', () => {
    mountFilter();
    cy.get('[data-cy="day-month-filter-panel"]').should('not.exist');
    cy.get('[data-cy="day-month-filter-toggle"] button').should('have.class', 'mat-mdc-outlined-button');
    cy.get('[data-cy="day-month-filter-toggle"] app-calendar-icon').should('exist');
    cy.get('[data-cy="day-month-filter-toggle"] button svg').should(($icon) => {
      expect($icon[0].getBoundingClientRect().width).to.equal(20);
    });
    cy.get('[data-cy="day-month-filter-toggle"] button').should('have.attr', 'aria-expanded', 'false').click();
    cy.get('[data-cy="day-month-filter-panel"]').should('be.visible').and(($panel) => {
      expect($panel[0].getBoundingClientRect().width).to.be.greaterThan(120);
    });
    cy.get('[data-cy="day-month-filter-panel"]').should('have.css', 'font-family').and('contain', 'Mulish');
    cy.get('[data-cy="day-month-filter-day"] .ng-select-container').should('have.css', 'height', '56px');
    cy.get('[data-cy="day-month-filter-close"] button').should('have.class', 'mat-mdc-button-base');
    selectPart('day', '15');
    selectPart('month', '06');
    cy.get('[data-cy="day-month-filter-close"] button').focus().type('{esc}');
    cy.get('[data-cy="day-month-filter-panel"]').should('not.exist');
    cy.get('[data-cy="day-month-filter-toggle"] button').should('be.focused').and('contain.text', '≥ 15-06').click();
    cy.get('[data-cy="day-month-filter-day"] .ng-value-label').should('contain.text', '15');
    cy.get('.cdk-overlay-backdrop').click('bottomRight');
    cy.get('[data-cy="day-month-filter-panel"]').should('not.exist');
  });

  it('selects day and month, changes the inclusive operator, and clears the filter', () => {
    mountFilter();
    cy.get('[data-cy="day-month-filter-toggle"] button').click();
    selectPart('day', '31');
    cy.get('@applyFilter').should('not.have.been.called');
    selectPart('month', '03');
    cy.get('@applyFilter').should('have.been.calledWithMatch', {
      filters: [{ field: 'InvoiceDate1', operator: 'gte', value: { month: 3, day: 31 } }],
    });
    cy.get('[data-cy="day-month-filter-operator"] .ng-arrow-wrapper').click();
    cy.contains('.ng-option', 'Til og med').click();
    cy.get('@applyFilter').should('have.been.calledWithMatch', {
      filters: [{ field: 'InvoiceDate1', operator: 'lte', value: { month: 3, day: 31 } }],
    });
    cy.get('[data-cy="day-month-filter-day"] .ng-clear-wrapper').click();
    cy.get('@applyFilter').should('have.callCount', 2);
    cy.get('[data-cy="day-month-filter-close"] button').click();
    cy.get('[data-cy="day-month-filter-reset"] button').click();
    cy.get('@applyFilter').should('have.callCount', 3).and('have.been.calledWithMatch', { filters: [] });
    cy.get('[data-cy="day-month-filter-panel"]').should('not.exist');
    cy.get('[data-cy="day-month-filter-toggle"] button').should('contain.text', 'Dato').and('be.focused');
    cy.get('[data-cy="day-month-filter-reset"]').should('not.exist');
  });

  it('clears an invalid day when changing months and allows February 29', () => {
    mountFilter();
    cy.get('[data-cy="day-month-filter-toggle"] button').click();
    selectPart('day', '31');
    selectPart('month', '03');
    selectPart('month', '02');
    cy.get('@applyFilter').should('have.been.calledOnce');
    cy.get('[data-cy="day-month-filter-day"] .ng-value-label').should('not.exist');
    cy.get('[data-cy="day-month-filter-day"] .ng-arrow-wrapper').click();
    cy.get('.ng-option').should('have.length', 29);
    cy.get('.ng-option').contains(/^\s*29\s*$/).click();
    cy.get('@applyFilter').should('have.been.calledWithMatch', {
      filters: [{ field: 'InvoiceDate1', operator: 'gte', value: { month: 2, day: 29 } }],
    });
    cy.get('[data-cy="day-month-filter-month"] .ng-clear-wrapper').click();
    cy.get('@applyFilter').should('have.callCount', 2);
  });

  it('restores saved day, month and operator, and resets all controls', () => {
    const saved: CompositeFilterDescriptor = { logic: 'and', filters: [
      { field: 'InvoiceDate1', operator: 'lte', value: { month: 9, day: 30 } },
    ] };
    mountFilter(JSON.parse(JSON.stringify(saved))).then(({ component, fixture, actions }) => {
      expect(component.day?.value).to.equal(30);
      expect(component.month?.value).to.equal(9);
      expect(component.chosenOption.operator).to.equal('lte');
      actions.next(ITContractActions.applyITContractFilter({ filter: undefined, sort: undefined }));
      fixture.detectChanges();
      expect(component.day).to.equal(undefined);
      expect(component.month).to.equal(undefined);
      expect(component.chosenOption.operator).to.equal('gte');
      actions.next(ITContractActions.applyITContractFilter({ filter: saved, sort: undefined }));
      fixture.detectChanges();
      expect(component.day?.value).to.equal(30);
      expect(component.chosenOption.operator).to.equal('lte');
    });
    cy.get('[data-cy="day-month-filter-toggle"] button').should('contain.text', '≤ 30-09').click();
    cy.get('[data-cy="day-month-filter-day"] .ng-value-label').should('contain.text', '30');
    cy.get('[data-cy="day-month-filter-month"] .ng-value-label').should('contain.text', '09');
    cy.get('[data-cy="day-month-filter-panel"]').screenshot('day-month-filter-panel');
    cy.get('[data-cy="day-month-filter-close"] button').click();
    cy.get('[data-cy="day-month-filter-panel"]').should('not.exist');
    cy.get('[data-cy="day-month-filter-toggle"] button').should('be.focused').screenshot('day-month-filter-button');
  });
});

