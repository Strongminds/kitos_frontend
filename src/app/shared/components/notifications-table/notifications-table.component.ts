import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIBaseNotificationPropertiesWriteRequestDTO, APINotificationResponseDTO, APIRoleRecipientWriteRequestDTO } from 'src/app/api/v2';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { notificationRepetitionFrequencyOptions } from '../../models/notification-repetition-frequency.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationsTableComponentStore } from './notifications-table.component-store';
import { NotificationsTableDialogComponent } from './notifications-table-dialog/notifications-table-dialog.component';
import { FormArray, FormGroup } from '@angular/forms';
import { notificationTypeOptions } from '../../models/notification-type.model';

@Component({
  selector: 'app-notifications-table[entityUuid][entityType][hasModifyPermission][organizationUuid]',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.scss'],
  providers: [NotificationsTableComponentStore]
})
export class NotificationsTableComponent extends BaseComponent implements OnInit{
  @Input() entityUuid!: string;
  @Input() entityType!: RoleOptionTypes
  @Input() hasModifyPermission!: boolean;
  @Input() organizationUuid!: string;

  public readonly notifications$ = this.componentStore.notifications$;
  public readonly anyNotifications$ = this.notifications$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly isLoading$ = this.componentStore.notificationsLoading$;
  public readonly systemUsageRolesOptions$ = this.store.select(selectRegularOptionTypes('it-system-usage-roles'))
  .pipe(filterNullish(),
    map(options => options.sort((a, b) => a.name.localeCompare(b.name)))
  );
  public readonly nullPlaceholder = "---";
  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  constructor(
    private readonly componentStore: NotificationsTableComponentStore,
    private readonly confirmationService: ConfirmActionService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    ){
      super()
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system-usage-roles'));
    this.getNotifications();
  }

  private getNotifications() {
    this.componentStore.getNotificationsByEntityUuid({ entityUuid: this.entityUuid, organizationUuid: this.organizationUuid })
  }

  public formatDate(date: string | undefined) {
    if (date) return new Date(date).toLocaleDateString();
    return this.nullPlaceholder;
  }


  public onDeactivate(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil deaktivere ${this.getSpecificNotificationWarning(notification.name)}?`,
      onConfirm: () => {
        if (notification.uuid) this.componentStore.deactivateNotification({
          notificationUuid: notification.uuid,
          ownerResourceUuid: this.entityUuid,
          organizationUuid: this.organizationUuid,
          onComplete: () => this.getNotifications()
        })
        else this.notificationService.showError($localize`Fejl: kan ikke deaktivere en advis uden uuid.`)
      }
    })
  }

  public onRemove(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne ${this.getSpecificNotificationWarning(notification.name)}?`,
      onConfirm: () => {
        if (notification.uuid) this.componentStore.deleteNotification({
          notificationUuid: notification.uuid,
          ownerResourceUuid: this.entityUuid,
          organizationUuid: this.organizationUuid,
          onComplete: () => this.getNotifications() })
        else this.notificationService.showError($localize`Fejl: kan ikke slette en advis uden uuid.`)
      }
    })
  }

  public onClickEdit(notification: APINotificationResponseDTO) {
    this.subscriptions.add(
      this.systemUsageRolesOptions$.subscribe((options) => {
        const dialogRef = this.dialog.open(NotificationsTableDialogComponent);
        const componentInstance = dialogRef.componentInstance;
        componentInstance.systemUsageRolesOptions = options;
        componentInstance.title = $localize`Redigér advis`,
        componentInstance.notificationRepetitionFrequencyOptions = notificationRepetitionFrequencyOptions;
        componentInstance.ownerEntityUuid = this.entityUuid;
        componentInstance.organizationUuid = this.organizationUuid;
        componentInstance.confirmText = $localize`Gem`
        //todo add preloaded data optionally here from the notification arg
        //todo add onEdit that patches

      })
    )
  }
  public onClickAddNew() {
    this.subscriptions.add(
      this.systemUsageRolesOptions$.subscribe((options) => {
        const dialogRef = this.dialog.open(NotificationsTableDialogComponent);
        const componentInstance = dialogRef.componentInstance;
        componentInstance.systemUsageRolesOptions = options;
        componentInstance.title = $localize`Tilføj advis`,
        componentInstance.notificationRepetitionFrequencyOptions = notificationRepetitionFrequencyOptions;
        componentInstance.ownerEntityUuid = this.entityUuid;
        componentInstance.organizationUuid = this.organizationUuid;
        componentInstance.confirmText = $localize`Tilføj`
        componentInstance.onConfirm = () => this.onSave(componentInstance.notificationForm,
        componentInstance.roleRecipientsForm, componentInstance.roleCcsForm,
        componentInstance.emailRecipientsFormArray, componentInstance.emailCcsFormArray);
      })
    )
  }

  public onSave(notificationForm: FormGroup, roleRecipientsForm: FormGroup, roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray, emailCcsFormArray: FormArray){
    if (!notificationForm.valid || !roleRecipientsForm.valid || !roleCcsForm.valid) return;

    const notificationControls = notificationForm.controls;
    const subject = notificationControls['subjectControl'].value;
    const body = notificationControls['bodyControl'].value;

    const roleRecipients = this.getRecipientDtosFromCheckboxes(roleRecipientsForm);
    const emailRecipients = emailRecipientsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {return { email: control.value }});

    const roleCcs = this.getRecipientDtosFromCheckboxes(roleCcsForm);
    const emailCcs = emailCcsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {return { email: control.value }});

    if (subject && body && (roleRecipients.length > 0 || emailRecipients.length > 0)){
      const basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO =  {
        subject: subject,
        body: body,
        receivers: {
          roleRecipients: roleRecipients,
          emailRecipients: emailRecipients
        },
        ccs: {
          roleRecipients: roleCcs,
          emailRecipients: emailCcs
        }
      }

      const notificationType = notificationControls['notificationTypeControl'].value;
      if (notificationType === this.notificationTypeRepeat) this.postScheduledNotification(basePropertiesDto, notificationForm);
      else this.postImmediateNotification(basePropertiesDto);
    }
  }

  private postScheduledNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO, notificationForm: FormGroup){
    const notificationControls = notificationForm.controls;
    const name = notificationControls['nameControl'].value;
    const fromDate = notificationControls['fromDateControl'].value?.toISOString();
    const toDate = notificationControls['toDateControl'].value?.toISOString();
    const repetitionFrequency = notificationControls['repetitionControl'].value?.value;
    if (fromDate && repetitionFrequency){
      this.componentStore.postScheduledNotification({
      ownerResourceUuid: this.entityUuid,
      organizationUuid: this.organizationUuid,
      requestBody: {
        baseProperties: basePropertiesDto,
        name: name ?? undefined,
        fromDate: fromDate,
        toDate: toDate ?? undefined,
        repetitionFrequency: repetitionFrequency
      },
      onComplete: () => this.onDialogActionComplete()
    })
    }
  }

  public onDialogActionComplete(){
    this.getNotifications();
    this.dialog.closeAll();
  }

  private postImmediateNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO){
    this.componentStore.postImmediateNotification({
      ownerResourceUuid: this.entityUuid,
      organizationUuid: this.organizationUuid,
      requestBody: {
        baseProperties: basePropertiesDto
      },
      onComplete: () => this.onDialogActionComplete()
    })
  }

  private getRecipientDtosFromCheckboxes(form: FormGroup){
    const recipients: APIRoleRecipientWriteRequestDTO[] = [];
    for (const controlKey in form.controls) {
      const control = form.get(controlKey);
      if (control?.value) recipients.push({roleUuid: controlKey})
    }
    return recipients;
  }

  private valueIsNotEmptyString(value: string | undefined){
    return value && value.trim() !== '';
  }

  private getSpecificNotificationWarning(name: string | undefined): string {
    return name ? $localize`advisen "${name}"` : $localize`denne advis`;
}
}

