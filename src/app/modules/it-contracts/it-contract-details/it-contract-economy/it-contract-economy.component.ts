import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
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

interface InvoiceDateOption {
  name: string;
  value: number;
}

interface InvoicePeriodRow {
  period: number;
  monthOptions: InvoiceDateOption[];
  dayOptions: InvoiceDateOption[];
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
  public readonly invoiceMonthOptions: InvoiceDateOption[] = [
    { name: $localize`Januar`, value: 1 },
    { name: $localize`Februar`, value: 2 },
    { name: $localize`Marts`, value: 3 },
    { name: $localize`April`, value: 4 },
    { name: $localize`Maj`, value: 5 },
    { name: $localize`Juni`, value: 6 },
    { name: $localize`Juli`, value: 7 },
    { name: $localize`August`, value: 8 },
    { name: $localize`September`, value: 9 },
    { name: $localize`Oktober`, value: 10 },
    { name: $localize`November`, value: 11 },
    { name: $localize`December`, value: 12 },
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
    invoiceMonth1: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceMonth2: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceMonth3: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceMonth4: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDay1: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDay2: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDay3: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
    invoiceDay4: new FormControl<InvoiceDateOption | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
  });
  private readonly invoiceMonthControls = [
    this.economyFormGroup.controls.invoiceMonth1,
    this.economyFormGroup.controls.invoiceMonth2,
    this.economyFormGroup.controls.invoiceMonth3,
    this.economyFormGroup.controls.invoiceMonth4,
  ];
  private readonly invoiceDayControls = [
    this.economyFormGroup.controls.invoiceDay1,
    this.economyFormGroup.controls.invoiceDay2,
    this.economyFormGroup.controls.invoiceDay3,
    this.economyFormGroup.controls.invoiceDay4,
  ];
  private readonly pendingInvoiceMonths: (number | undefined)[] = [undefined, undefined, undefined, undefined];
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
          if (hasModifyPermission) {
            this.economyFormGroup.enable();
          } else {
            this.economyFormGroup.disable();
          }

          const invoiceDates = paymentModel?.invoiceDates ?? [];
          for (let period = 1; period <= 4; period++) {
            const invoiceDate = invoiceDates.find((date) => date.period === period);
            const month = this.invoicePeriods
              .find((invoicePeriod) => invoicePeriod.period === period)
              ?.monthOptions.find(
                (option) => option.value === (this.pendingInvoiceMonths[period - 1] ?? invoiceDate?.month),
              );
            const day = this.getDayOptions(month?.value).find((option) => option.value === invoiceDate?.day);
            this.setPeriodDayOptions(period, month?.value);
            this.getInvoiceMonthControl(period).setValue(month, { emitEvent: false });
            this.getInvoiceDayControl(period).setValue(day, { emitEvent: false });
            if (!hasModifyPermission || !month) {
              this.getInvoiceDayControl(period).disable({ emitEvent: false });
            } else {
              this.getInvoiceDayControl(period).enable({ emitEvent: false });
            }
          }

          this.disableInvoicePeriodLabels();
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
      this.pendingInvoiceMonths[period - 1] = undefined;
      this.getInvoiceMonthControl(period).setValue(undefined, { emitEvent: false });
      this.getInvoiceDayControl(period).setValue(undefined, { emitEvent: false });
      this.getInvoiceDayControl(period).disable({ emitEvent: false });
      this.setPeriodDayOptions(period, undefined);
    }

    this.patchEconomy({ paymentModel: { invoiceFrequency: frequency, invoiceDates: [] } });
  }

  public onInvoiceMonthChange(period: number, month: number | undefined): void {
    const monthOption = this.invoicePeriods
      .find((invoicePeriod) => invoicePeriod.period === period)
      ?.monthOptions.find((option) => option.value === month);
    const dayControl = this.getInvoiceDayControl(period);
    const selectedDay = dayControl.value;
    const dayOptions = this.getDayOptions(monthOption?.value);
    const day = selectedDay && dayOptions.some((option) => option.value === selectedDay.value) ? selectedDay : undefined;

    this.getInvoiceMonthControl(period).setValue(monthOption, { emitEvent: false });
    dayControl.setValue(day, { emitEvent: false });
    this.setPeriodDayOptions(period, monthOption?.value);
    this.pendingInvoiceMonths[period - 1] = monthOption?.value;
    if (monthOption) {
      dayControl.enable({ emitEvent: false });
    } else {
      dayControl.disable({ emitEvent: false });
    }
    if (day) {
      this.pendingInvoiceMonths[period - 1] = undefined;
      this.saveInvoiceDates();
    }
  }

  public onInvoiceDayChange(period: number, day: number | undefined): void {
    const dayOption = this.getDayOptions(this.getInvoiceMonthControl(period).value?.value)
      .find((option) => option.value === day);
    this.getInvoiceDayControl(period).setValue(dayOption, { emitEvent: false });
    if (dayOption) this.pendingInvoiceMonths[period - 1] = undefined;
    this.saveInvoiceDates();
  }

  private saveInvoiceDates(): void {
    const frequency = this.economyFormGroup.controls.invoiceFrequency.value?.value;
    if (!frequency) return;

    const invoiceDates: APIContractInvoiceDateDTO[] = [];
    for (const invoicePeriod of this.invoicePeriods) {
      const month = this.getInvoiceMonthControl(invoicePeriod.period).value?.value;
      const day = this.getInvoiceDayControl(invoicePeriod.period).value?.value;
      if (month !== undefined && day !== undefined) {
        invoiceDates.push({
          period: invoicePeriod.period,
          month,
          day,
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
      monthOptions: this.invoiceMonthOptions.filter((option) =>
        this.isInvoiceMonthValid(index + 1, option.value, frequency),
      ),
      dayOptions: [],
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

  private getInvoiceMonthControl(period: number): FormControl<InvoiceDateOption | undefined> {
    return this.invoiceMonthControls[period - 1];
  }

  private getInvoiceDayControl(period: number): FormControl<InvoiceDateOption | undefined> {
    return this.invoiceDayControls[period - 1];
  }

  private getInvoicePeriodControl(period: number): FormControl<string> {
    return this.invoicePeriodControls[period - 1];
  }

  private isInvoiceMonthValid(period: number, month: number, frequency?: APIInvoiceFrequencyChoice): boolean {
    if (frequency === APIInvoiceFrequencyChoice.Yearly) return period === 1 && month >= 1 && month <= 12;
    if (frequency === APIInvoiceFrequencyChoice.HalfYearly) {
      return (period === 1 && month >= 1 && month <= 6) || (period === 2 && month >= 7 && month <= 12);
    }
    if (frequency === APIInvoiceFrequencyChoice.Quarterly) {
      return Math.ceil(month / 3) === period;
    }
    return false;
  }

  private getDayOptions(month?: number): InvoiceDateOption[] {
    if (month === undefined) return [];
    const daysInMonth = month === 2 ? 29 : [4, 6, 9, 11].includes(month) ? 30 : 31;
    return Array.from({ length: daysInMonth }, (_, index) => ({
      name: String(index + 1),
      value: index + 1,
    }));
  }

  private setPeriodDayOptions(period: number, month?: number): void {
    const row = this.invoicePeriods.find((invoicePeriod) => invoicePeriod.period === period);
    if (row) row.dayOptions = this.getDayOptions(month);
  }
}
