import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import {
  selectOrganizationUnitHasValidCache,
  selectOrganizationUnits,
} from 'src/app/store/organization/organization-unit/selectors';
import { BaseComponent } from '../../base/base.component';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants';
import { createNode, TreeNodeModel } from '../../models/tree-node.model';

@Component({
  selector: 'app-org-unit-select',
  templateUrl: './org-unit-select.component.html',
  styleUrls: ['./org-unit-select.component.scss'],
})
export class OrgUnitSelectComponent extends BaseComponent implements OnInit {
  @Input() public disabledUnitsUuids?: string[] = [];
  @Input() public text = '';
  @Input() public showDescription = false;

  @Input() public formGroup?: FormGroup;
  @Input() public formName?: string;
  @Input() public appendTo: string = '';
  @Input() public value?: TreeNodeModel;

  @Output() public filterChange = new EventEmitter<string | undefined>();
  @Output() public valueChange = new EventEmitter<string | undefined>();

  public readonly nodes$ = this.store
    .select(selectOrganizationUnits)
    .pipe(map((organizationUnits) => organizationUnits.map((unit) => createNode(unit, this.disabledUnitsUuids))));
  public readonly isLoaded$ = this.store.select(selectOrganizationUnitHasValidCache);

  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(BOUNDED_PAGINATION_QUERY_MAX_SIZE));
  }

  public onSelectionChange(selectedValue: TreeNodeModel | null | undefined): void {
    this.valueChange.emit(selectedValue as string | undefined);
  }
}
