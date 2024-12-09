import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { combineBooleansWithOr } from 'src/app/shared/helpers/observable-helpers';
import { selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableGdprPurpose,
  selectITSystemUsageEnableGdprBusinessCritical,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprLegalData,
  selectITSystemUsageEnableGdprNoPersonalData,
  selectITSystemUsageEnableGdprNormalPersonalData,
  selectITSystemUsageEnableGdprSensitivePersonalData,
  selectITSystemUsageEnableGdprTechnicalPrecautions,
  selectITSystemUsageEnableGdprUserSupervision,
  selectITSystemUsageEnabledRegisteredCategories,
} from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss'],
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent {
  @Output() disableLinkControls = new EventEmitter<void>();

  public constructor(private readonly store: Store) {
    super();
  }

  public readonly showGeneralInfoCard$ = combineBooleansWithOr([
    this.store.select(selectITSystemUsageEnableGdprPurpose),
    this.store.select(selectITSystemUsageEnableGdprBusinessCritical),
    this.store.select(selectITSystemUsageEnableGdprHostedAt),
    this.store.select(selectITSystemUsageEnableGdprDocumentation),
  ]);

  public readonly showDataSensitivityCard$ = combineBooleansWithOr([
    this.store.select(selectITSystemUsageEnableGdprNoPersonalData),
    this.store.select(selectITSystemUsageEnableGdprNormalPersonalData),
    this.store.select(selectITSystemUsageEnableGdprSensitivePersonalData),
    this.store.select(selectITSystemUsageEnableGdprLegalData),
  ]);

  public readonly registeredCategoriesEnabled$ = this.store.select(selectITSystemUsageEnabledRegisteredCategories);
  public readonly technicalPrecautionsEnabled$ = this.store.select(selectITSystemUsageEnableGdprTechnicalPrecautions);
  public readonly userSupervisionEnabled$ = this.store.select(selectITSystemUsageEnableGdprUserSupervision);

  public disableFormsIfNoPermissions(controls: AbstractControl[]) {
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          controls.forEach((control: AbstractControl) => control.disable());
          this.disableLinkControls.emit();
        })
    );
  }
}
