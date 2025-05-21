import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import {
  getRights,
  getRoleTypeNameByEntityType,
  getTypeTitleNameByType,
} from 'src/app/shared/helpers/user-role.helpers';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';

import { CommonModule } from '@angular/common';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { AccordionHeaderComponent } from '../../../../../shared/components/accordion-header/accordion-header.component';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { BooleanCircleComponent } from '../../../../../shared/components/boolean-circle/boolean-circle.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { NumberCircleComponent } from '../../../../../shared/components/number-circle/number-circle.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { TableRowActionsComponent } from '../../../../../shared/components/table-row-actions/table-row-actions.component';

@Component({
  selector: 'app-user-role-table',
  templateUrl: './user-role-table.component.html',
  styleUrl: './user-role-table.component.scss',
  imports: [
    CommonModule,
    AccordionComponent,
    AccordionHeaderComponent,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    NumberCircleComponent,
    NativeTableComponent,
    BooleanCircleComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    TrashcanIconComponent,
  ],
})
export class UserRoleTableComponent implements OnInit {
  @Input() user!: ODataOrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasModifyPermission$!: Observable<boolean | undefined>;
  @Input() availableRoles$!: Observable<APIRoleOptionResponseDTO[]>;

  public userRightsWithExpired$: Observable<Right[]> = new Observable<Right[]>();

  constructor(private store: Store, private confirmService: ConfirmActionService) {}

  ngOnInit(): void {
    this.userRightsWithExpired$ = this.availableRoles$.pipe(
      map((roles) => {
        const availableRoleUuids = new Set(roles.map((r) => r.uuid));
        return this.getUserRights().map((right) => {
          if (!availableRoleUuids.has(right.role.uuid)) {
            return this.mapRightToExpiredRight(right);
          }
          return right;
        });
      })
    );
  }

  public getUserRights(): Right[] {
    return getRights(this.user, this.entityType);
  }

  public getTitle(): string {
    return getTypeTitleNameByType(this.entityType);
  }

  public getRoleTypeName(): string {
    return getRoleTypeNameByEntityType(this.entityType);
  }

  public onRemove(right: Right): void {
    this.confirmService.confirmAction({
      title: $localize`Fjern rolle`,
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på, at du vil fjerne rollen?`,
      onConfirm: () => this.removeHandler(right),
    });
  }

  private removeHandler(right: Right): void {
    const action = this.getDeleteEntityRoleAction();
    const actionWithPayload = action(this.user.Uuid, right.role.uuid, right.entity.uuid);
    this.store.dispatch(actionWithPayload);
  }

  private getDeleteEntityRoleAction() {
    switch (this.entityType) {
      case 'organization-unit':
        return OrganizationUnitActions.deleteOrganizationUnitRole;
      case 'it-system':
        return ITSystemUsageActions.removeItSystemUsageRole;
      case 'it-contract':
        return ITContractActions.removeItContractRole;
      case 'data-processing-registration':
        return DataProcessingActions.removeDataProcessingRole;
      default:
        throw new Error(`This component does not support entity type: ${this.entityType}`);
    }
  }

  private mapRightToExpiredRight(right: Right): Right {
    return {
      ...right,
      role: {
        ...right.role,
        name: `${right.role.name} (${$localize`udløbet`})`,
      },
    };
  }
}
