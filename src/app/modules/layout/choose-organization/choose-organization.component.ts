import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { ChooseOrganizationComponentStore } from './choose-organization.component-store';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { DialogComponent } from '../../../shared/components/dialogs/dialog/dialog.component';
import { DropdownComponent } from '../../../shared/components/dropdowns/dropdown/dropdown.component';
import { AsyncPipe } from '@angular/common';

@Component({
  templateUrl: 'choose-organization.component.html',
  styleUrls: ['choose-organization.component.scss'],
  providers: [ChooseOrganizationComponentStore],
  imports: [DialogComponent, DropdownComponent, AsyncPipe],
})
export class ChooseOrganizationComponent implements OnInit {
  public closable = true;

  public readonly organizations$ = this.componentStore.organizations$;
  public readonly isLoading$ = this.componentStore.loading$;
  public readonly showSearchHelpText$ = this.componentStore.organizations$.pipe(
    filterNullish(),
    map((organizations) => organizations.length >= this.componentStore.PAGE_SIZE),
  );

  constructor(
    private dialog: MatDialogRef<ChooseOrganizationComponent>,
    private store: Store,
    private componentStore: ChooseOrganizationComponentStore,
  ) {
    this.closable = dialog.disableClose !== true;
  }

  ngOnInit() {
    this.componentStore.getOrganizations(undefined);
  }

  public didChange(organization?: APIOrganizationResponseDTO | null) {
    if (!organization) return;

    this.store
      .select(selectOrganizationUuid)
      .pipe(first())
      .subscribe((organizationUuid) => {
        if (organization.uuid !== organizationUuid) {
          this.store.dispatch(UserActions.getUserDefaultUnit(organization.uuid));
          this.store.dispatch(UserActions.resetOnOrganizationUpdate(organization));
          this.store.dispatch(OrganizationActions.getUIRootConfig());
        }
        this.dialog.close();
      });
  }

  public filterChange(filter?: string) {
    this.componentStore.getOrganizations(filter);
  }
}
