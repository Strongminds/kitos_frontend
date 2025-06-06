import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIGeneralDataUpdateRequestDTO, APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import {
  dateGreaterThanOrEqualControlValidator,
  dateLessThanControlValidator,
} from 'src/app/shared/helpers/form.helpers';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import { toBulletPoints } from 'src/app/shared/helpers/string.helpers';
import {
  LifeCycleStatus,
  lifeCycleStatusOptions,
  mapLifeCycleStatus,
} from 'src/app/shared/models/life-cycle-status.model';
import {
  NumberOfExpectedUsers,
  mapNumberOfExpectedUsers,
  numberOfExpectedUsersOptions,
} from 'src/app/shared/models/number-of-expected-users.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { YesNoDontKnowOption } from 'src/app/shared/models/yes-no-dont-know.model';
import {
  YesNoPartiallyOption,
  mapToYesNoPartiallyEnum,
  yesNoPartiallyOptions,
} from 'src/app/shared/models/yes-no-partially.model';
import { mapToYesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsage,
  selectItSystemUsageGeneral,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableAmountOfUsers,
  selectITSystemUsageEnableContainsAITechnology,
  selectITSystemUsageEnableDataClassification,
  selectITSystemUsageEnableDescription,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableLastEditedAt,
  selectITSystemUsageEnableLastEditedBy,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableName,
  selectITSystemUsageEnableStatus,
  selectITSystemUsageEnableTakenIntoUsageBy,
  selectITSystemUsageEnableVersion,
  selectITSystemUsageEnableWebAccessibility,
  selectITSystemUsageEnabledSystemId,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { DatePickerComponent } from '../../../../../shared/components/datepicker/datepicker.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { TextAreaComponent } from '../../../../../shared/components/textarea/textarea.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';
@Component({
  selector: 'app-it-system-usage-details-frontpage-information',
  templateUrl: 'it-system-usage-details-frontpage-information.component.html',
  styleUrls: ['it-system-usage-details-frontpage-information.component.scss'],
  imports: [
    CardComponent,
    CardHeaderComponent,
    NgIf,
    StatusChipComponent,
    FormsModule,
    ReactiveFormsModule,
    TextBoxComponent,
    DropdownComponent,
    TextAreaComponent,
    DatePickerComponent,
    AsyncPipe,
  ],
})
export class ITSystemUsageDetailsFrontpageInformationComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup(
    {
      localCallName: new FormControl(''),
      localSystemId: new FormControl(''),
      systemVersion: new FormControl(''),
      numberOfExpectedUsers: new FormControl<NumberOfExpectedUsers | undefined>(undefined),
      dataClassification: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      notes: new FormControl<string | undefined>(undefined),
      aiTechnology: new FormControl<YesNoDontKnowOption | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );

  public readonly aiTechnologyOptions = yesNoOptions;
  public readonly nameEnabled$ = this.store.select(selectITSystemUsageEnableName);
  public readonly systemIdEnabled$ = this.store.select(selectITSystemUsageEnabledSystemId);
  public readonly versionEnabled$ = this.store.select(selectITSystemUsageEnableVersion);
  public readonly amountOfUsersEnabled$ = this.store.select(selectITSystemUsageEnableAmountOfUsers);
  public readonly dataClassificationEnabled$ = this.store.select(selectITSystemUsageEnableDataClassification);
  public readonly descriptionEnabled$ = this.store.select(selectITSystemUsageEnableDescription);
  public readonly takenIntoUsageByEnabled$ = this.store.select(selectITSystemUsageEnableTakenIntoUsageBy);
  public readonly lastEditedByEnabled$ = this.store.select(selectITSystemUsageEnableLastEditedBy);
  public readonly lastEditedAtEnabled$ = this.store.select(selectITSystemUsageEnableLastEditedAt);
  public readonly lifeCycleStatusEnabled$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
  public readonly usagePeriodEnabled$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
  public readonly statusEnabled$ = this.store.select(selectITSystemUsageEnableStatus);
  public readonly containsAITechnologyEnabled$ = this.store.select(selectITSystemUsageEnableContainsAITechnology);
  public readonly webAccessiblityEnabled$ = this.store.select(selectITSystemUsageEnableWebAccessibility);

  public readonly showSystemUsageCard$ = combineOR([
    this.takenIntoUsageByEnabled$,
    this.lastEditedByEnabled$,
    this.lastEditedAtEnabled$,
    this.lifeCycleStatusEnabled$,
    this.usagePeriodEnabled$,
    this.statusEnabled$,
  ]);

  public readonly itSystemApplicationForm = new FormGroup(
    {
      createdBy: new FormControl({ value: '', disabled: true }),
      lastModifiedBy: new FormControl({ value: '', disabled: true }),
      lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
      lifeCycleStatus: new FormControl<LifeCycleStatus | undefined>(undefined),
      validFrom: new FormControl<Date | undefined>(undefined),
      validTo: new FormControl<Date | undefined>(undefined),
      valid: new FormControl({ value: '', disabled: true }),
    },
    { updateOn: 'blur' },
  );

  public readonly webAccessibilityForm = new FormGroup({
    webAccessibilityCompliance: new FormControl<YesNoPartiallyOption | undefined>(undefined),
    lastWebAccessibilityCheck: new FormControl<Date | undefined>(undefined),
    webAccessibilityNotes: new FormControl(''),
  });

  public readonly numberOfExpectedUsersOptions = numberOfExpectedUsersOptions;
  public readonly lifeCycleStatusOptions = lifeCycleStatusOptions;
  public readonly yesNoPartiallyOptions = yesNoPartiallyOptions;

  public readonly itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);
  public readonly dataClassificationTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-data-classification-type'))
    .pipe(filterNullish());
  public readonly invalidReason$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) => {
      if (general?.validity.valid) return undefined;

      const reasonsForInactivity = [
        general?.validity.validAccordingToLifeCycle ? undefined : $localize`Livscyklus`,
        general?.validity.validAccordingToMainContract ? undefined : $localize`Den markerede kontrakt`,
        general?.validity.validAccordingToValidityPeriod ? undefined : $localize`Ibrugtagningsperiode`,
      ];

      return $localize`Følgende gør systemet 'ikke aktivt': ` + '\n' + toBulletPoints(reasonsForInactivity);
    }),
  );

  constructor(
    private store: Store,
    private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {
    // Add custom date validators
    this.itSystemApplicationForm.controls.validFrom.validator = dateLessThanControlValidator(
      this.itSystemApplicationForm.controls.validTo,
    );
    this.itSystemApplicationForm.controls.validTo.validator = dateGreaterThanOrEqualControlValidator(
      this.itSystemApplicationForm.controls.validFrom,
    );

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-data-classification-type'));
    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.itSystemInformationForm.disable();
          this.itSystemApplicationForm.disable();
          this.webAccessibilityForm.disable();
        }),
    );

    this.subscriptions.add(
      this.webAccessibilityForm.controls.webAccessibilityCompliance.valueChanges.subscribe((value) => {
        const hasValue = !!value;
        if (hasValue && !this.webAccessibilityForm.disabled) {
          this.webAccessibilityForm.controls.lastWebAccessibilityCheck.enable();
          this.webAccessibilityForm.controls.webAccessibilityNotes.enable();
        } else {
          this.webAccessibilityForm.controls.lastWebAccessibilityCheck.disable();
          this.webAccessibilityForm.controls.webAccessibilityNotes.disable();
        }
      }),
    );
    // Set initial state of information form
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageGeneral)
        .pipe(filterNullish())
        .subscribe((general) => {
          this.itSystemInformationForm.patchValue({
            localCallName: general.localCallName,
            localSystemId: general.localSystemId,
            systemVersion: general.systemVersion,
            numberOfExpectedUsers: mapNumberOfExpectedUsers(general.numberOfExpectedUsers),
            dataClassification: general.dataClassification,
            notes: general.notes,
            aiTechnology: mapToYesNoEnum(general.containsAITechnology),
          });

          this.webAccessibilityForm.patchValue({
            webAccessibilityCompliance: mapToYesNoPartiallyEnum(general.webAccessibilityCompliance),
            lastWebAccessibilityCheck: optionalNewDate(general.lastWebAccessibilityCheck),
            webAccessibilityNotes: general.webAccessibilityNotes,
          });
        }),
    );

    // Set initial state of application form
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsage)
        .pipe(filterNullish())
        .subscribe((itSystemUsage) =>
          this.itSystemApplicationForm.patchValue({
            createdBy: itSystemUsage.createdBy.name,
            lastModifiedBy: itSystemUsage.lastModifiedBy.name,
            lastModified: new Date(itSystemUsage.lastModified),
            lifeCycleStatus: mapLifeCycleStatus(itSystemUsage.general.validity.lifeCycleStatus),
            validFrom: optionalNewDate(itSystemUsage.general.validity.validFrom),
            validTo: optionalNewDate(itSystemUsage.general.validity.validTo),
            valid: itSystemUsage.general.validity.valid
              ? $localize`Systemet er aktivt`
              : $localize`Systemet er ikke aktivt`,
          }),
        ),
    );
  }

  public patchGeneral(general: APIGeneralDataUpdateRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ general }));
    }
  }
}
