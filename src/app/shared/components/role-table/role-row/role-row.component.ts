import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { ContentWithTooltipComponent } from '../../content-with-tooltip/content-with-tooltip.component';
import { SelectedOptionTypeTextComponent } from '../../selected-option-type-text/selected-option-type-text.component';
import { BooleanCircleComponent } from '../../boolean-circle/boolean-circle.component';
import { ContentSpaceBetweenComponent } from '../../content-space-between/content-space-between.component';
import { NgIf } from '@angular/common';
import { TableRowActionsComponent } from '../../table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../icons/trashcan-icon.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[role-row]',
    templateUrl: './role-row.component.html',
    styleUrl: './role-row.component.scss',
    imports: [ParagraphComponent, ContentWithTooltipComponent, SelectedOptionTypeTextComponent, BooleanCircleComponent, ContentSpaceBetweenComponent, NgIf, TableRowActionsComponent, IconButtonComponent, TrashcanIconComponent]
})
export class RoleRowComponent {
  @Input() role!: IRoleAssignment;
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;
  @Input() entityName!: string;

  @Output() removeRole = new EventEmitter<IRoleAssignment>();

  public onRemoveClick(): void {
    this.removeRole.emit(this.role);
  }
}
