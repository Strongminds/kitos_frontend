import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  selectOrganizationName,
  selectOrganizationUuid,
  selectUserIsGlobalAdmin,
} from 'src/app/store/user-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { GridUsagesDropdownDialogComponent } from '../grid-usages-dropdown-dialog/grid-usages-dropdown-dialog.component';

@Component({
  selector: 'app-usages',
  templateUrl: './grid-usages-dialog.component.html',
  styleUrls: ['./grid-usages-dialog.component.scss'],
})
export class GridUsagesDialogComponent extends BaseComponent {
  @Input() type!: RegistrationEntityTypes | undefined;

  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { usages: string[]; title: string },
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {
    super();
  }

  public isItSystemDialog(): boolean {
    return this.type === 'it-system';
  }

  public clickMigrateUsage() {
    const dialogRef = this.dialog.open(GridUsagesDropdownDialogComponent, {
      width: '1000px',
    });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.organizationName$ = this.organizationName$;
    componentInstance.organizationUuid$ = this.organizationUuid$;
  }
}
