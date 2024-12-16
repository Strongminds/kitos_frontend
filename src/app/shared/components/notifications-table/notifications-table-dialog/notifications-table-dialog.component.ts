import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APINotificationResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  dateGreaterThanOrEqualControlValidator,
  dateGreaterThanOrEqualToDateValidator,
} from 'src/app/shared/helpers/form.helpers';
import {
  MultiSelectDropdownItem,
  mapRegularOptionToMultiSelectItem,
} from 'src/app/shared/models/dropdown-option.model';
import {
  NotificationRepetitionFrequency,
  mapNotificationRepetitionFrequency,
} from 'src/app/shared/models/notification-repetition-frequency.model';
import {
  NotificationType,
  mapNotificationType,
  notificationTypeOptions,
} from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { AppRootUrlResolverService } from 'src/app/shared/services/app-root-url-resolver.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';

@Component({
  selector: 'app-notifications-table-dialog',
  templateUrl: './notifications-table-dialog.component.html',
  styleUrl: './notifications-table-dialog.component.scss',
  providers: [NotificationsTableComponentStore],
})
export class NotificationsTableDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public rolesOptions!: Array<APIRegularOptionResponseDTO>;
  @Input() public notificationRepetitionFrequencyOptions!: Array<NotificationRepetitionFrequency>;
  @Input() public ownerEntityUuid!: string;
  @Input() public onConfirm!: (emailRecepientsForm: FormGroup, notificationUuid?: string) => void;
  @Input() public confirmText!: string;

  public receiverOptions: MultiSelectDropdownItem<string>[] = [];
  public ccOptions: MultiSelectDropdownItem<string>[] = [];

  public isRepeated: boolean = false;

  public readonly notificationForm = new FormGroup({
    subjectControl: new FormControl<string | undefined>(undefined, Validators.required),
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined, Validators.required),
    receivers: new FormControl<string[] | undefined>(undefined, Validators.required),
    ccs: new FormControl<string[] | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined),
    fromDateControl: new FormControl<Date | undefined>(undefined),
    toDateControl: new FormControl<Date | undefined>(undefined),
    bodyControl: new FormControl<string | undefined>(undefined, Validators.required),
  });

  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeImmediate = this.notificationTypeOptions[0];
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  public showDateOver28Tooltip: boolean = false;
  public notification: APINotificationResponseDTO | undefined;
  public currentNotificationSent$ = this.componentStore.currentNotificationSent$;

  public rootUrl: string;
  public canEdit = true;

  constructor(
    private readonly appRootUrlResolverService: AppRootUrlResolverService,
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableDialogComponent>,
    private readonly componentStore: NotificationsTableComponentStore,
    @Inject(MAT_DIALOG_DATA) public data: APINotificationResponseDTO
  ) {
    super();
    if (data) this.notification = data;
    this.rootUrl = this.appRootUrlResolverService.resolveRootUrl();
  }

  ngOnInit(): void {
    this.setupNotificationControls();

    if (this.hasImmediateNotification()) {
      this.canEdit = false;
      this.disableForms();
    }

    if (this.notification && this.notification.notificationType === this.notificationTypeRepeat.value) {
      this.toggleRepetitionFields(true);
      this.notificationForm.controls.notificationTypeControl.disable();
      this.notificationForm.controls.repetitionControl.disable();
      this.notificationForm.controls.fromDateControl.disable();
      this.notificationForm.controls.fromDateControl.setValidators([]);
    } else {
      this.toggleRepetitionFields(false);
      const notificationControls = this.notificationForm.controls;
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notificationTypeImmediate.value));
    }

    if (this.notification && !this.notification?.active) {
      this.canEdit = false;
      this.disableForms();
    }
    this.receiverOptions = this.rolesOptions.map((option: APIRegularOptionResponseDTO) =>
      mapRegularOptionToMultiSelectItem(option)
    );
    this.ccOptions = this.rolesOptions.map((option: APIRegularOptionResponseDTO) =>
      mapRegularOptionToMultiSelectItem(option)
    );
  }

  public receipientsChanged(roles: string[], isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).setValue(roles);
  }

  public receipientsCleared(isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).setValue([]);
  }

  public receipientsAdded(receipient: MultiSelectDropdownItem<string>, isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).value.push(receipient.value);
  }

  public hasImmediateNotification = () =>
    this.notification && this.notification.notificationType !== this.notificationTypeRepeat.value;

  public handleClickConfirm() {
    this.onConfirm(this.notificationForm);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public changeNotificationType(newValue: string, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.toggleRepetitionFields(newValue === this.notificationTypeRepeat.value);
    }
  }

  public repeatIsSelected() {
    return this.notificationForm.controls.notificationTypeControl.value === this.notificationTypeRepeat;
  }

  private getReceipientsControl(isReceivers: boolean): FormControl {
    return isReceivers ? this.notificationForm.controls.receivers : this.notificationForm.controls.ccs;
  }

  private setupNotificationControls() {
    const notificationControls = this.notificationForm.controls;

    this.subscriptions.add(
      notificationControls.fromDateControl.valueChanges.subscribe(() => this.toggleShowDateOver28Tooltip())
    );
    this.subscriptions.add(
      notificationControls.repetitionControl.valueChanges.subscribe(() => this.toggleShowDateOver28Tooltip())
    );
    notificationControls.toDateControl.validator = dateGreaterThanOrEqualControlValidator(
      this.notificationForm.controls.fromDateControl
    );

    if (this.notification) {
      const fromDate = this.notification.fromDate;
      if (fromDate) notificationControls.fromDateControl.setValue(new Date(fromDate));
      const toDate = this.notification.toDate;
      if (toDate) notificationControls.toDateControl.setValue(new Date(toDate));
      notificationControls.subjectControl.setValue(this.notification.subject);
      notificationControls.nameControl.setValue(this.notification.name);
      notificationControls.bodyControl.setValue(this.notification.body);
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notification.notificationType));
      notificationControls.repetitionControl.setValue(
        mapNotificationRepetitionFrequency(this.notification.repetitionFrequency)
      );
    } else {
      // 20240528: HACK: Validation behaviour should be determined by permissions instead
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      notificationControls.fromDateControl.addValidators(dateGreaterThanOrEqualToDateValidator(today));
      notificationControls.fromDateControl.updateValueAndValidity();
    }
  }

  private toggleRepetitionFields(isRepeated: boolean) {
    this.isRepeated = isRepeated;

    if (isRepeated) {
      this.notificationForm.controls.repetitionControl.setValidators([Validators.required]);
      this.notificationForm.controls.fromDateControl.setValidators([Validators.required]);
    } else {
      this.notificationForm.controls.repetitionControl.setValidators([]);
      this.notificationForm.controls.fromDateControl.setValidators([]);
      this.notificationForm.controls.fromDateControl.patchValue(undefined);
      this.notificationForm.controls.toDateControl.patchValue(undefined);
    }
  }

  private toggleShowDateOver28Tooltip() {
    const notificationControls = this.notificationForm.controls;
    const fromDate = notificationControls.fromDateControl.value;
    if (fromDate) {
      const dayOfMonth = new Date(fromDate).getDate();
      const repetition = notificationControls.repetitionControl.value;
      const repetitionIsMonthOrMore =
        this.notificationRepetitionFrequencyOptions.findIndex((option) => option.value === repetition?.value) > 2;

      this.showDateOver28Tooltip = dayOfMonth > 28 && repetitionIsMonthOrMore;
    }
  }

  private disableForms() {
    this.notificationForm.disable();
  }
}
