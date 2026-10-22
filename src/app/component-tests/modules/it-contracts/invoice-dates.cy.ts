/// <reference types="cypress" />
// Include existing global command typings in Cypress component compilation.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { Actions } from '@ngrx/effects';
import { firstValueFrom, of } from 'rxjs';
import { ITContractEffects } from '../../../store/it-contract/effects';
import { ITContractActions } from '../../../store/it-contract/actions';
import { selectOrganizationUuid } from '../../../store/user-store/selectors';
import { selectOverviewContractRoles } from '../../../store/it-contract/selectors';
import { GridDataCacheService } from '../../../shared/services/grid-data-cache.service';
import { filterBy } from '@progress/kendo-data-query';
import { GridCellComponent } from '../../../shared/components/grid/grid-cell/grid-cell.component';
import { formatInvoiceDate, prepareInvoiceDateQueryState } from '../../../shared/helpers/invoice-dates.helpers';
import { restoreGridFilterDates } from '../../../shared/helpers/grid-filter.helpers';
import { GridColumn } from '../../../shared/models/grid-column.model';
import { GridState, toODataString } from '../../../shared/models/grid-state.model';
import { adaptITContract } from '../../../shared/models/it-contract/it-contract.model';
import { AppDatePipe } from '../../../shared/pipes/app-date.pipe';
import { GridExportService } from '../../../shared/services/grid-export.service';

const baseContract = {
  SourceEntityUuid: 'contract', DataProcessingAgreements: [], ItSystemUsages: [], RoleAssignments: [],
};
const columns: GridColumn[] = [1, 2, 3, 4].map((period) => ({
  field: `InvoiceDate${period}`, title: `Faktureringsdato ${period}`, hidden: false, extraFilter: 'day-month',
}));

function adaptPeriods(values: Record<string, unknown>) {
  return adaptITContract({ ...baseContract, ...values });
}

describe('Contract overview invoice periods', () => {
  for (const frequency of ['Yearly', 'HalfYearly', 'Quarterly']) {
    it(`preserves the ${frequency} enum filter in nested OData queries`, () => {
      const state: GridState = { filter: { logic: 'and', filters: [
        { field: 'ByEnding', operator: 'eq', value: 'EndOfCalendarYear' },
        { logic: 'or', filters: [
          { field: 'InvoiceFrequency', operator: 'eq', value: frequency },
          { field: 'InvoiceFrequency', operator: 'isnull' },
        ] },
      ] } };
      const query = toODataString(prepareInvoiceDateQueryState(state));
      expect(query).to.contain(`ByEnding eq 'EndOfCalendarYear' and (InvoiceFrequency eq '${frequency}' or InvoiceFrequency eq null)`);
    });
  }

  it('restores saved full dates without converting day/month or numeric filter values', () => {
    const invoice = { field: 'InvoiceDate1', operator: 'gte', value: { month: 3, day: 31 } };
    const numeric = { field: 'AccumulatedOperationCost', operator: 'gte', value: 100 };
    const saved = JSON.parse(JSON.stringify({ logic: 'and', filters: [
      invoice, numeric, { logic: 'or', filters: [
        { field: 'Concluded', operator: 'lte', value: '2026-03-31T00:00:00.000Z' },
      ] },
    ] }));
    const restored = restoreGridFilterDates(saved);
    expect(restored?.filters[0]).to.deep.equal(invoice);
    expect(restored?.filters[1]).to.deep.equal(numeric);
    expect(restored?.filters[2]).to.deep.equal({ logic: 'or', filters: [
      { field: 'Concluded', operator: 'lte', value: new Date('2026-03-31T00:00:00.000Z') },
    ] });
    expect(toODataString(prepareInvoiceDateQueryState({ filter: restored }))).to.contain('InvoiceDate1Day ge 31');
  });
  it('renders a padded period date', () => {
    const dataItem = adaptPeriods({ InvoiceDate1Month: 3, InvoiceDate1Day: 1 });
    cy.mount(GridCellComponent, { componentProperties: { column: columns[0], dataItem } });
    cy.get('app-paragraph').should('have.text', '01-03');
  });

  it('renders a missing period as blank without shifting another period into it', () => {
    const dataItem = adaptPeriods({ InvoiceDate2Month: 9, InvoiceDate2Day: 30 });
    cy.mount(GridCellComponent, { componentProperties: { column: columns[0], dataItem } });
    cy.get('app-paragraph').should('have.text', '');
    expect(dataItem?.InvoiceDate2).to.equal('30-09');
  });

  it('adapts and exports one, two, or four periods', () => {
    const service = new GridExportService(new AppDatePipe('en-US'));
    for (const count of [1, 2, 4]) {
      const fields = Object.fromEntries(Array.from({ length: count }, (_, i) => [
        [`InvoiceDate${i + 1}Month`, (i + 1) * 3], [`InvoiceDate${i + 1}Day`, 1],
      ]).flat());
      const contract = adaptPeriods(fields);
      const exported = service.transformRow(contract, columns);
      for (let period = 1; period <= 4; period++) {
        expect(exported[`InvoiceDate${period}`]).to.equal(
          period <= count ? `01-${String(period * 3).padStart(2, '0')}` : '',
        );
      }
      expect(exported).not.to.equal(contract);
    }
  });

  it('handles empty and incomplete dates', () => {
    expect(formatInvoiceDate(null, null)).to.equal('');
    expect(formatInvoiceDate(3, undefined)).to.equal('');
    expect(formatInvoiceDate(undefined, 31)).to.equal('');
    const contract = adaptPeriods({});
    expect(contract?.InvoiceDate1).to.equal('');
    expect(contract?.InvoiceDate4Month).to.equal(null);
  });

  for (const period of [1, 2, 3, 4]) {
    for (const dir of ['asc', 'desc'] as const) {
      it(`sorts period ${period} by month then day ${dir}, without changing UI state`, () => {
        const state: GridState = { skip: 70, take: 70, sort: [{ field: `InvoiceDate${period}`, dir }] };
        const queryState = prepareInvoiceDateQueryState(state);
        expect(toODataString(queryState)).to.contain(
          `$orderby=InvoiceDate${period}Month${dir === 'desc' ? ' desc' : ''},InvoiceDate${period}Day${dir === 'desc' ? ' desc' : ''}`,
        );
        expect(queryState.skip).to.equal(70);
        expect(queryState.take).to.equal(70);
        expect(state.sort).to.deep.equal([{ field: `InvoiceDate${period}`, dir }]);
      });
    }
  }

  it('preserves other sorting and expands invoice sorting for all-row export', () => {
    const state: GridState = { all: true, sort: [
      { field: 'Name', dir: 'asc' }, { field: 'InvoiceDate2', dir: 'desc' },
    ] };
    const query = toODataString(prepareInvoiceDateQueryState(state));
    expect(query).to.contain('$orderby=Name,InvoiceDate2Month desc,InvoiceDate2Day desc');
    expect(query).not.to.contain('$top');
  });


  for (const period of [1, 2, 3, 4]) {
    for (const operator of ['gte', 'lte'] as const) {
      it(`filters period ${period} inclusively using month then day (${operator})`, () => {
        const field = `InvoiceDate${period}`;
        const state: GridState = { filter: { logic: 'and', filters: [
          { field, operator, value: { month: 3, day: 15 } },
        ] } };
        const mapped = prepareInvoiceDateQueryState(state);
        const query = toODataString(mapped);
        expect(query).to.contain(`${field}Month ${operator === 'gte' ? 'gt' : 'lt'} 3`);
        expect(query).to.contain(`${field}Month eq 3 and ${field}Day ${operator === 'gte' ? 'ge' : 'le'} 15`);
        expect(query).to.contain(`${field}Month ne null`);
        expect(query).to.contain(`${field}Day ne null`);
        const dates = [[2, 28], [3, 14], [3, 15], [3, 16], [4, 1], [null, null], [2, null], [null, 15]];
        const rows = dates.map(([month, day], id) => ({ id, [field + 'Month']: month, [field + 'Day']: day }));
        expect(filterBy(rows, mapped.filter!).map((row) => row.id))
          .to.deep.equal(operator === 'gte' ? [2, 3, 4] : [0, 1, 2]);
        expect(state.filter?.filters).to.deep.equal([{ field, operator, value: { month: 3, day: 15 } }]);
      });
    }
  }

  it('preserves nested filter logic and other fields for paginated and export queries', () => {
    const state: GridState = {
      all: true,
      sort: [{ field: 'InvoiceDate1', dir: 'desc' }],
      filter: { logic: 'and', filters: [
        { field: 'Name', operator: 'contains', value: 'Contract' },
        { logic: 'or', filters: [
          { field: 'InvoiceDate1', operator: 'gte', value: { month: 3, day: 31 } },
          { field: 'InvoiceDate2', operator: 'lte', value: { month: 9, day: 30 } },
        ] },
      ] },
    };
    const query = toODataString(prepareInvoiceDateQueryState(state));
    expect(query).to.contain("contains(Name,'Contract')");
    expect(query).to.contain('InvoiceDate1Month gt 3');
    expect(query).to.contain('InvoiceDate2Day le 30');
    expect(query).to.contain('$orderby=InvoiceDate1Month desc,InvoiceDate1Day desc');
    expect(query).not.to.contain('$top');
    expect(state.filter?.filters).to.have.length(2);
  });

  it('supports leap day and year boundaries without including missing dates', () => {
    for (const [month, day, operator] of [[1, 1, 'lte'], [12, 31, 'gte'], [2, 29, 'gte']] as const) {
      const mapped = prepareInvoiceDateQueryState({ filter: { logic: 'and', filters: [
        { field: 'InvoiceDate1', operator, value: { month, day } },
      ] } });
      const rows = [
        { InvoiceDate1Month: month, InvoiceDate1Day: day },
        { InvoiceDate1Month: null, InvoiceDate1Day: null },
      ];
      expect(filterBy(rows, mapped.filter!)).to.deep.equal([rows[0]]);
    }
  });
});

describe('Contract invoice filters in the effects request', () => {
  for (const all of [false, true]) {
    it(`expands day/month values in the HTTP request (all=${all})`, async () => {
      const state: GridState = {
        all, skip: 0, take: 70,
        filter: { logic: 'and', filters: [
          { field: 'InvoiceFrequency', operator: 'eq', value: 'Quarterly' },
          { field: 'InvoiceDate1', operator: 'gte', value: { month: 3, day: 15 } },
          { field: 'InvoiceDate4', operator: 'lte', value: { month: 9, day: 30 } },
        ] },
      };
      const get = cy.stub().returns(of({ value: [], '@odata.count': 0 }));
      const store = { select: (selector: unknown) => of(
        selector === selectOrganizationUuid ? 'organization' :
        selector === selectOverviewContractRoles ? [] : { skip: 0, take: 70 },
      ) };
      const dependencies = [
        new Actions(of(ITContractActions.getITContracts(state, undefined))),
        store, {}, {}, { get }, {}, {}, {}, {}, new GridDataCacheService(),
      ] as unknown as ConstructorParameters<typeof ITContractEffects>;
      const effects = new ITContractEffects(...dependencies);
      await firstValueFrom(effects.getItContracts$);
      expect(get).to.have.been.calledOnce;
      const url = decodeURIComponent(get.firstCall.args[0]);
      expect(url).to.contain("InvoiceFrequency eq 'Quarterly'");
      expect(url).to.contain('InvoiceDate1Month gt 3');
      expect(url).to.contain('InvoiceDate1Month eq 3 and InvoiceDate1Day ge 15');
      expect(url).to.contain('InvoiceDate4Month lt 9');
      expect(url).to.contain('InvoiceDate4Month eq 9 and InvoiceDate4Day le 30');
      expect(url).not.to.contain('[object Object]');
      if (all) expect(url).not.to.contain('$top');
    });
  }
});
