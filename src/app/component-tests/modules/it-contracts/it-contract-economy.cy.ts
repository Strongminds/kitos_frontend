import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, EMPTY } from 'rxjs';
import { APIInvoiceFrequencyChoice } from '../../../api/v2';
import { ItContractEconomyComponent } from '../../../modules/it-contracts/it-contract-details/it-contract-economy/it-contract-economy.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { DropdownComponent } from '../../../shared/components/dropdowns/dropdown/dropdown.component';
import { selectItContractHasModifyPermissions, selectItContractPaymentModel } from '../../../store/it-contract/selectors';
import { UIModuleConfigKey } from '../../../shared/enums/ui-module-config-key';
import { UIConfigService } from '../../../shared/services/ui-config-services/ui-config.service';
import {
  selectItContractsEnableAndRecommendedInvoiceFrequency,
  selectItContractsEnableAndRecommendedPaymentModel,
} from '../../../store/organization/ui-module-customization/selectors';

describe('Invoice UI customization', () => {
  it('configures invoice visibility and recommendation independently of the payment model', () => {
    const service = new UIConfigService();
    const module = UIModuleConfigKey.ItContract;
    const fullKey = `${module}.economy.invoiceFrequency`;
    expect(service.getAllNodesOfBlueprint(module).some(node => node.fullKey === fullKey)).to.equal(true);
    for (const enabled of [false, true]) {
      const config = service.buildUIModuleConfig([
        { fullKey, enabled, recommended: true },
        { fullKey: `${module}.economy.paymentModel`, enabled: false, recommended: false },
      ], module);
      expect(selectItContractsEnableAndRecommendedInvoiceFrequency.projector(config))
        .to.deep.equal({ enabled, recommended: true });
      expect(selectItContractsEnableAndRecommendedPaymentModel.projector(config))
        .to.deep.equal({ enabled: false, recommended: false });
    }
  });
});

describe('Contract invoice dates', () => {
  let store: MockStore;
  let component: ItContractEconomyComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore()] });
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectItContractHasModifyPermissions, true);
    component = new ItContractEconomyComponent(store, new NotificationService(new Actions(EMPTY), store));
  });

  afterEach(() => {
    component.ngOnDestroy();
    store.resetSelectors();
    TestBed.resetTestingModule();
  });

  it('does not combine a pending month with a persisted day after a store refresh', () => {
    const model = store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Yearly,
      invoiceDates: [{ period: 1, month: 1, day: 31 }],
    });
    component.ngOnInit();
    component.onInvoiceMonthChange(1, 2);
    expect(component.economyFormGroup.controls.invoiceDay1.value).to.equal(undefined);

    // A second draft month permits the old day, but it must still remain unsaved.
    component.onInvoiceMonthChange(1, 3);
    model.setResult({
      invoiceFrequency: APIInvoiceFrequencyChoice.Yearly,
      invoiceDates: [{ period: 1, month: 1, day: 31 }],
      priceRegulation: { uuid: 'regulation', name: 'Updated' },
    });
    store.refreshState();
    expect(component.economyFormGroup.controls.invoiceMonth1.value?.value).to.equal(3);
    expect(component.economyFormGroup.controls.invoiceDay1.value).to.equal(undefined);

    const save = cy.spy(component, 'patchEconomy');
    component.onInvoiceDayChange(1, 15);
    expect(save).to.have.been.calledWith({ paymentModel: {
      invoiceFrequency: APIInvoiceFrequencyChoice.Yearly,
      invoiceDates: [{ period: 1, month: 3, day: 15 }],
    } });
  });

  it('marks the date collection filled with one saved date, regardless of empty periods', async () => {
    const model = store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [],
    });
    component.ngOnInit();
    component.onInvoiceMonthChange(1, 2);
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(false);
    model.setResult({
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 2, month: 4, day: 10 }],
    });
    store.refreshState();
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(true);
    expect(component.economyFormGroup.controls.invoiceDay1.value).to.equal(undefined);
  });
});

describe('Invoice calendar dropdowns', () => {
  for (const [label, previousValue, allowedValues] of [
    ['January to February', 31, [1, 28, 29]],
    ['Yearly to Quarterly', 12, [1, 2, 3]],
  ] as const) {
    it(`does not restore an excluded selection after changing ${label}`, () => {
      const selected = { name: String(previousValue), value: previousValue };
      const control = new FormControl<typeof selected | undefined>(selected, { nonNullable: true });
      cy.mount(DropdownComponent, {
        componentProperties: {
          formGroup: new FormGroup({ date: control }),
          formName: 'date',
          valueField: 'value',
          data: [selected],
          considerCurrentValueObsoleteIfNotPresentInData: false,
        },
      }).then(({ fixture }) => {
        control.setValue(undefined, { emitEvent: false });
        fixture.componentRef.setInput('data', allowedValues.map(value => ({ name: String(value), value })));
        fixture.detectChanges();
        expect(control.value).to.equal(undefined);
      });
    });
  }
});
