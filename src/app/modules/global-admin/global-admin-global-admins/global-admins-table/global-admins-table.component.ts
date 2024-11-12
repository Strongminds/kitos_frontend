import { Component } from '@angular/core';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';

@Component({
  selector: 'app-global-admins-table',
  templateUrl: './global-admins-table.component.html',
  styleUrl: './global-admins-table.component.scss',
})
export class GlobalAdminsTableComponent {
  constructor(private confirmActionService: ConfirmActionService) {}

  public readonly globalAdmins: object[] = [{}];

  public removeGlobalAdmin(globalAdmin: object) {
    console.log(globalAdmin);
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Fjern ${globalAdmin} som global administrator`,
      onConfirm: () => this.deleteGlobalAdmin(globalAdmin),
    });
  }

  private deleteGlobalAdmin(globalAdmin: object) {}
}
