import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { first, map, Observable } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TreeNodeModel } from 'src/app/shared/components/tree-node-select/tree-node-select.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageUsingOrganizationUnits } from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-usage-organization.create-dialog',
  templateUrl: './usage-organization.create-dialog.component.html',
  styleUrls: ['./usage-organization.create-dialog.component.scss'],
})
export class UsageOrganizationCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly usingUnitForm = new FormGroup({
    unit: new FormControl<TreeNodeModel | undefined>({ value: undefined, disabled: false }),
  });

  public readonly usedUnitUuids$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(
    filterNullish(),
    map((units) => {
      return units.map((x) => x.uuid);
    })
  );
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits).pipe(filterNullish());

  constructor(private readonly store: Store, private readonly dialog: DialogRef) {
    super();
  }

  ngOnInit(): void {
    //Get organization units
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish())
        .subscribe((organizationUuid) =>
          this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(organizationUuid))
        )
    );

    //add unit validation
    this.usingUnitForm.controls.unit.validator = this.uuidAlreadySelectedValidator(this.usedUnitUuids$);
  }

  onSave() {
    if (!this.usingUnitForm.valid) return;

    this.usedUnitUuids$.pipe(first()).subscribe((unitUuids) => {
      const selectedUnit = this.usingUnitForm.get('unit')?.value;
      if (!selectedUnit) return;

      const uuids = unitUuids.map((uuid) => uuid);

      uuids.push(selectedUnit.id);

      this.store.dispatch(
        ITSystemUsageActions.patchItSystemUsage({
          organizationUsage: {
            usingOrganizationUnitUuids: uuids,
          },
        })
      );
    });

    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }

  private uuidAlreadySelectedValidator(uuids$: Observable<string[]>): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const selectedUnit: APIOrganizationUnitResponseDTO = endControl.value;
      if (!selectedUnit) {
        return { empty: true };
      }
      let result: ValidationErrors | null = null;
      uuids$.pipe(first()).subscribe((uuids) => {
        if (uuids.find((x) => x === selectedUnit.uuid)) {
          result = { alreadyContains: true };
        }
      });
      return result;
    };
  }
}
