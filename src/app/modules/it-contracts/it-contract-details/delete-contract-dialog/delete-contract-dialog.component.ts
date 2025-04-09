import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIRegistrationHierarchyNodeWithActivationStatusResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  BulkActionButton,
  BulkActionDialogComponent,
  BulkActionSection,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from '../it-contract-hierarchy/it-contract-hierarchy.component-store';

@Component({
  selector: 'app-delete-contract-dialog',
  templateUrl: './delete-contract-dialog.component.html',
  styleUrl: './delete-contract-dialog.component.scss',
  providers: [ItContractHierarchyComponentStore],
})
export class DeleteContractDialogComponent extends BaseComponent implements OnInit {
  public readonly hierarchy$ = this.componentStore.hierarchy$;
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItContractHierarchyComponentStore,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getHierarchy(this.contractUuid$);
  }
  public openTransferDialog(
    contractUuid: string,
    hierarchy: APIRegistrationHierarchyNodeWithActivationStatusResponseDTO[]
  ): void {
    const dialogActions = [
      {
        text: $localize`Transfer`,
        color: 'secondary',
        buttonStyle: 'secondary',
        callback: (result) => console.log(result),
      },
    ] as BulkActionButton[];

    const dialogSections = [
      {
        options: hierarchy
          .filter((node) => node.node.uuid !== contractUuid)
          .map((node) => ({
            id: node.node.uuid,
            name: node.node.name,
            secondaryName: node.parent?.name,
          })),
        entityType: 'it-contract',
        title: $localize`Children contracts`,
        primaryColumnTitle: $localize`Kontrakt`,
        secondaryColumnTitle: $localize`Overordnet kontrakt`,
      },
    ] as BulkActionSection[];

    const dialogRef = this.dialog.open(BulkActionDialogComponent, {
      width: '50%',
      minWidth: '600px',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh%',
    });
    const instance = dialogRef.componentInstance;
    instance.title = $localize`Transfer contracts`;
    instance.snackbarText = $localize`Choose how to handle the contracts`;
    instance.sections = dialogSections;
    instance.actionButtons = dialogActions;
    instance.dropdownTitle = $localize`Overordnet kontrakt`;
    instance.dropdownDisabledUuids$ = this.hierarchy$.pipe(map((hierarchy) => hierarchy.map((node) => node.node.uuid)));
    instance.dropdownType = 'it-contract';
    instance.allowEmptyDropdownSelection = true;
    //instance.successActionTypes = OrganizationUserActions.copyRolesSuccess;
    //instance.errorActionTypes = OrganizationUserActions.copyRolesError;
  }
}
