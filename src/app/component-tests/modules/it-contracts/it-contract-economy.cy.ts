import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, EMPTY } from 'rxjs';
import { APIInvoiceFrequencyChoice } from '../../../api/v2';
import { ItContractEconomyComponent } from '../../../modules/it-contracts/it-contract-details/it-contract-economy/it-contract-economy.component';
import { NotificationService } from '../../../shared/services/notification.service';
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

  it('loads and saves full dates outside the selected calendar period and preserves other periods', () => {
    store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 2, date: '2026-04-10' }],
    });
    component.ngOnInit();
    expect(component.economyFormGroup.controls.invoiceDate2.value).to.deep.equal(new Date('2026-04-10'));
    const save = cy.spy(component, 'patchEconomy');
    const date = new Date(2028, 11, 31);
    component.onInvoiceDateChange(1, date);
    expect(save).to.have.been.calledWith({ paymentModel: {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [
        { period: 1, date: date.toDateString() },
        { period: 2, date: new Date('2026-04-10').toDateString() },
      ],
    } });
    component.onInvoiceDateChange(2, undefined);
    expect(save.lastCall.args[0].paymentModel?.invoiceDates).to.deep.equal([{ period: 1, date: date.toDateString() }]);
    component.onInvoiceFrequencyChange(APIInvoiceFrequencyChoice.Yearly);
    expect(save.lastCall.args[0].paymentModel?.invoiceDates).to.deep.equal([]);
    expect(component.economyFormGroup.controls.invoiceDate1.value).to.equal(undefined);
  });

  it('keeps invoice date controls disabled without modify permission', () => {
    store.overrideSelector(selectItContractHasModifyPermissions, false);
    store.overrideSelector(selectItContractPaymentModel, { invoiceFrequency: APIInvoiceFrequencyChoice.Yearly });
    component.ngOnInit();
    expect(component.economyFormGroup.controls.invoiceDate1.disabled).to.equal(true);
  });

  it('marks the date collection filled with one saved date, regardless of empty periods', async () => {
    const model = store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [],
    });
    component.ngOnInit();
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(false);
    model.setResult({
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 2, date: '2026-04-10' }],
    });
    store.refreshState();
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(true);
    expect(component.economyFormGroup.controls.invoiceDate1.value).to.equal(undefined);
  });
});
