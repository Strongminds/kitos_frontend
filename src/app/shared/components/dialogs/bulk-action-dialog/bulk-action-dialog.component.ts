import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { combineLatest, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { EntitySelectionService } from 'src/app/shared/services/entity-selector-service';
import { ExtendedThemePalette } from '../../buttons/button/button.component';

export interface BulkActionOption {
  id: string | number;
  name: string;
  secondaryName?: string;
}
export interface BulkActionButton {
  text: string;
  color: ExtendedThemePalette;
  buttonStyle: ButtonStyle;
  callback: (result: BulkActionResult) => void;
}
export interface BulkActionSection {
  options$: Observable<BulkActionOption[]>;
  entityType: RegistrationEntityTypes;
  title: string;
  primaryColumnTitle: string;
  secondaryColumnTitle?: string;
}
export interface BulkActionResult {
  selectedOptions: Record<string, BulkActionOption[]>;
  selectedEntityId?: string;
}

@Component({
  selector: 'app-bulk-action-dialog',
  templateUrl: './bulk-action-dialog.component.html',
  styleUrl: './bulk-action-dialog.component.scss',
  providers: [EntitySelectionService],
})
export class BulkActionDialogComponent<TDropdownOption extends { uuid: string }>
  extends BaseComponent
  implements OnInit
{
  @Input() public title = $localize`Bekræft handling`;
  @Input() public emptyStateText = $localize`Ingen data`;
  @Input() public snackbarText = $localize``;
  @Input() public sections!: BulkActionSection[];
  @Input() public actionButtons!: BulkActionButton[];
  @Input() public dropdownType!: 'user' | 'it-contract';
  @Input() public dropdownDisabledUuids$!: Observable<string[]>;
  @Input() public dropdownTitle!: string;
  @Input() public dropdownOptions?: TDropdownOption[];
  @Input() public allowEmptyDropdownSelection = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public successActionTypes!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public errorActionTypes!: any;
  @Input() public isLoading$?: Observable<boolean>;

  public formGroup = new FormGroup({
    option: new FormControl<TDropdownOption | undefined>(undefined),
  });
  public isLoading = false;

  constructor(
    public readonly selectionService: EntitySelectionService<BulkActionOption, RegistrationEntityTypes>,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    // Subscriptions support 2 cases: Actions and a Component Store
    this.subscriptions.add(
      this.actions$.pipe(ofType(this.successActionTypes)).subscribe(() => {
        this.selectionService.deselectAll();
        this.formGroup.reset();
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(this.successActionTypes, this.errorActionTypes)).subscribe(() => {
        this.isLoading = false;
      })
    );
    this.subscriptions.add(
      this.isLoading$?.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );

    // Dynamically update the validator based on allowEmptyDropdownSelection
    if (!this.allowEmptyDropdownSelection) {
      this.formGroup.get('option')?.setValidators(Validators.required); // Add required validator
    }
  }

  public isAllSelected$(): Observable<boolean> {
    // Combine all section.options observables
    const optionsObservables = this.sections.map((section) =>
      section.options$.pipe(map((options) => this.selectionService.isAllOfTypeSelected(section.entityType, options)))
    );

    // Combine the results of all observables and check if all are true
    return combineLatest(optionsObservables).pipe(map((results) => results.every((isSelected) => isSelected)));
  }

  public isAnySelected(): boolean {
    return this.selectionService.isAnySelected();
  }

  public deselectAll(): void {
    this.selectionService.deselectAll();
  }

  public selectAll(): void {
    this.sections.forEach((section) => {
      this.subscriptions.add(
        section.options$.subscribe((options) => {
          this.selectionService.selectAllOfType(section.entityType, options);
        })
      );
    });
  }

  public emitSelectedOptionsResult(button: BulkActionButton): void {
    const selectedOptions: Record<string, BulkActionOption[]> = {};

    this.sections.forEach((section) => {
      selectedOptions[section.entityType] = this.selectionService.getSelectedItemsOfType(section.entityType);
    });

    const selectedEntityId = this.formGroup.value.option?.uuid;

    const result: BulkActionResult = {
      selectedOptions,
      selectedEntityId: selectedEntityId?.toString(),
    };

    this.isLoading = true;
    button.callback(result);
  }

  public getSnackbarText(): string {
    return $localize`${this.snackbarText} ${this.buttonNumberText()}`;
  }

  public checkIfContainsData$(): Observable<boolean> {
    // Combine all section.options$ observables
    const optionsObservables = this.sections.map(
      (section) => section.options$.pipe(map((options) => options.length > 0)) // Check if options array is not empty
    );

    // Combine the results of all observables and check if any are true
    return combineLatest(optionsObservables).pipe(
      map((results) => results.some((hasData) => hasData)) // Check if any section contains data
    );
  }

  private buttonNumberText(): string {
    const numberOfSelectedOptions = this.selectionService.getSelectedItems().length;
    return numberOfSelectedOptions > 0 ? `(${numberOfSelectedOptions})` : '';
  }
}
