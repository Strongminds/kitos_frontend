import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { combineLatestWith } from 'rxjs';
import {
  APIContractInvoiceDateDTO,
  APIIdentityNamePairResponseDTO,
  APIInvoiceFrequencyChoice,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectItContractExternalPayments,
  selectItContractHasModifyPermissions,
  selectItContractInternalPayments,
  selectItContractPaymentModel,
} from 'src/app/store/it-contract/selectors';
import {
  selectItContractsEnableAndRecommendedExternalPayment,
  selectItContractsEnableAndRecommendedInternalPayment,
  selectItContractsEnableAndRecommendedPaymentModel,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { mapUIConfigStatusToEnabled, mapUIConfigStatusToRecommended } from 'src/app/shared/helpers/observable-helpers';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DatePickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { FormGridComponent } from '../../../../shared/components/form-grid/form-grid.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';

interface InvoiceFrequencyOption {
  name: string;
  value: APIInvoiceFrequencyChoice;
}

interface InvoicePeriodRow {
  period: number;
  dateFilter: (date: moment.Moment | null) => boolean;
}

@Component({
  selector: 'app-it-contract-economy',
  templateUrl: './it-contract-economy.component.html',
  styleUrl: './it-contract-economy.component.scss',
  imports: [
    CardComponent,
    CardHeaderComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    DropdownComponent,
    TextBoxComponent,
    PaymentTableComponent,
    AsyncPipe,
  ],
})
export class ItContractEconomyComponent extends BaseComponent implements OnInit {
  public readonly paymentFrequencyOptions$ = this.store.select(
    selectRegularOptionTypes('it-contract-payment-frequency-types'),
  );
  public readonly paymentModelOptions$ = this.store.select(selectRegularOptionTypes('it-contract-payment-model-types'));
  public readonly priceRegulationOptions$ = this.store.select(
    selectRegularOptionTypes('it-contract-price-regulation-types'),
  );
  public readonly invoiceFrequencyOptions: InvoiceFrequencyOption[] = [
    { name: $localize`Årligt`, value: APIInvoiceFrequencyChoice.Yearly },
    { name: $localize`Halvårligt`, value: APIInvoiceFrequencyChoice.HalfYearly },
    { name: $localize`Kvartalvis`, value: APIInvoiceFrequencyChoice.Quarterly },
  ];
  public invoicePeriods: InvoicePeriodRow[] = [];

  public readonly externalPayments$ = this.store.select(selectItContractExternalPayments).pipe(filterNullish());
  public readonly anyExternalPayments$ = this.externalPayments$.pipe(matchNonEmptyArray());

  public readonly internalPayments$ = this.store.select(selectItContractInternalPayments).pipe(filterNullish());
  public readonly anyInternalPayments$ = this.internalPayments$.pipe(matchNonEmptyArray());

  public readonly economyFormGroup = new FormGroup({
    operationsRemunerationStartedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    paymentFrequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    paymentModel: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    priceRegulation: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    invoiceFrequency: new FormControl<InvoiceFrequencyOption | undefined>({ value: undefined, disabled: true }),
    invoicePeriod1: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    invoicePeriod2: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    invoicePeriod3: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    invoicePeriod4: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    invoiceDate1: new FormControl<Date | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDate2: new FormControl<Date | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDate3: new FormControl<Date | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDate4: new FormControl<Date | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
  });
  private readonly invoiceDateControls = [
    this.economyFormGroup.controls.invoiceDate1,
    this.economyFormGroup.controls.invoiceDate2,
    this.economyFormGroup.controls.invoiceDate3,
    this.economyFormGroup.controls.invoiceDate4,
  ];
  private readonly invoicePeriodControls = [
    this.economyFormGroup.controls.invoicePeriod1,
    this.economyFormGroup.controls.invoicePeriod2,
    this.economyFormGroup.controls.invoicePeriod3,
    this.economyFormGroup.controls.invoicePeriod4,
  ];

  public readonly paymentModelEnabled$ = this.store.select(selectItContractsEnableAndRecommendedPaymentModel).pipe(mapUIConfigStatusToEnabled());
  public readonly paymentModelRecommended$ = this.store
    .select(selectItContractsEnableAndRecommendedPaymentModel)
    .pipe(mapUIConfigStatusToRecommended());
  public readonly externalPaymentEnabled$ = this.store.select(selectItContractsEnableAndRecommendedExternalPayment).pipe(mapUIConfigStatusToEnabled());
  public readonly externalPaymentRecommended$ = this.store
    .select(selectItContractsEnableAndRecommendedExternalPayment)
    .pipe(mapUIConfigStatusToRecommended());
  public readonly internalPaymentEnabled$ = this.store.select(selectItContractsEnableAndRecommendedInternalPayment).pipe(mapUIConfigStatusToEnabled());
  public readonly internalPaymentRecommended$ = this.store
    .select(selectItContractsEnableAndRecommendedInternalPayment)
    .pipe(mapUIConfigStatusToRecommended());

  constructor(
    private store: Store,
    private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-payment-frequency-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-payment-model-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-price-regulation-types'));

    this.subscriptions.add(
      this.store
        .select(selectItContractPaymentModel)
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectItContractHasModifyPermissions)))
        .subscribe(([paymentModel, hasModifyPermission]) => {
          this.economyFormGroup.patchValue({
            operationsRemunerationStartedAt: optionalNewDate(
              paymentModel?.operationsRemunerationStartedAt ?? undefined,
            ),
            paymentFrequency: paymentModel?.paymentFrequency,
            paymentModel: paymentModel?.paymentModel,
            priceRegulation: paymentModel?.priceRegulation,
            invoiceFrequency: this.invoiceFrequencyOptions.find(
              (option) => option.value === paymentModel?.invoiceFrequency,
            ),
          });

          this.setInvoicePeriods(paymentModel?.invoiceFrequency);
          const invoiceDates = paymentModel?.invoiceDates ?? [];
          for (let period = 1; period <= 4; period++) {
            const invoiceDate = invoiceDates.find((date) => date.period === period)?.date;
            this.getInvoiceDateControl(period).setValue(optionalNewDate(invoiceDate), { emitEvent: false });
          }

          if (hasModifyPermission) {
            this.economyFormGroup.enable();
            this.disableInvoicePeriodLabels();
          } else {
            this.economyFormGroup.disable();
          }
        }),
    );
  }

  public patchEconomy(request: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(request));
    }
  }

  public onInvoiceFrequencyChange(frequency: APIInvoiceFrequencyChoice | undefined): void {
    if (!frequency) return;

    this.setInvoicePeriods(frequency);
    for (let period = 1; period <= 4; period++) {
      this.getInvoiceDateControl(period).setValue(undefined, { emitEvent: false });
    }

    this.patchEconomy({ paymentModel: { invoiceFrequency: frequency, invoiceDates: [] } });
  }

  public onInvoiceDateChange(period: number, date: Date | undefined): void {
    if (date && !this.isInvoiceDateValid(period, date.getMonth())) return;

    this.getInvoiceDateControl(period).setValue(date, { emitEvent: false });
    const frequency = this.economyFormGroup.controls.invoiceFrequency.value?.value;
    if (!frequency) return;

    const invoiceDates: APIContractInvoiceDateDTO[] = [];
    for (const invoicePeriod of this.invoicePeriods) {
      const invoiceDate = this.getInvoiceDateControl(invoicePeriod.period).value;
      if (invoiceDate) {
        invoiceDates.push({
          period: invoicePeriod.period,
          date: moment(invoiceDate).format('YYYY-MM-DD'),
        });
      }
    }

    this.patchEconomy({ paymentModel: { invoiceFrequency: frequency, invoiceDates } });
  }

  private setInvoicePeriods(frequency?: APIInvoiceFrequencyChoice): void {
    const labels =
      frequency === APIInvoiceFrequencyChoice.Yearly
        ? [$localize`Årligt`]
        : frequency === APIInvoiceFrequencyChoice.HalfYearly
          ? [$localize`1. halvår`, $localize`2. halvår`]
          : frequency === APIInvoiceFrequencyChoice.Quarterly
            ? [$localize`1. kvartal`, $localize`2. kvartal`, $localize`3. kvartal`, $localize`4. kvartal`]
            : [];

    this.invoicePeriods = labels.map((_, index) => ({
      period: index + 1,
      dateFilter: (date) => this.isInvoiceDateValid(index + 1, date?.month() ?? -1),
    }));

    for (let period = 1; period <= 4; period++) {
      this.getInvoicePeriodControl(period).setValue(labels[period - 1] ?? '', { emitEvent: false });
    }
    this.disableInvoicePeriodLabels();
  }

  private disableInvoicePeriodLabels(): void {
    for (let period = 1; period <= 4; period++) {
      this.getInvoicePeriodControl(period).disable({ emitEvent: false });
    }
  }

  private getInvoiceDateControl(period: number): FormControl<Date | undefined> {
    return this.invoiceDateControls[period - 1];
  }

  private getInvoicePeriodControl(period: number): FormControl<string> {
    return this.invoicePeriodControls[period - 1];
  }

  private isInvoiceDateValid(period: number, month: number): boolean {
    const frequency = this.economyFormGroup.controls.invoiceFrequency.value?.value;
    if (frequency === APIInvoiceFrequencyChoice.Yearly) return period === 1;
    if (frequency === APIInvoiceFrequencyChoice.HalfYearly) {
      return (period === 1 && month >= 0 && month <= 5) || (period === 2 && month >= 6 && month <= 11);
    }
    if (frequency === APIInvoiceFrequencyChoice.Quarterly) {
      return Math.floor(month / 3) + 1 === period;
    }
    return false;
  }
}
