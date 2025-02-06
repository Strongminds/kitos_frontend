import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { APIExternalReferenceDataResponseDTO, APIExternalReferenceWithLastChangedResponseDTO } from 'src/app/api/v2';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';
import { BaseComponent } from '../../base/base.component';
import { ExternalReferenceCommandsViewModel } from '../../models/external-references/external-reference-commands-view.model';
import { ExternalReferenceViewModel } from '../../models/external-references/external-reference-view.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { CreateExternalReferenceDialogComponent } from './create-external-reference-dialog/create-external-reference-dialog.component';
import { EditExternalReferenceDialogComponent } from './edit-external-reference-dialog/edit-external-reference-dialog.component';
import { ExternalReferencesComponentStore } from './external-references.component-store';
import { selectItSystemUsage } from 'src/app/store/it-system-usage/selectors';
import { selectItSystem } from 'src/app/store/it-system/selectors';
import { selectContract } from 'src/app/store/it-contract/selectors';
import { selectDataProcessing } from 'src/app/store/data-processing/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { HasUuid } from '../../models/has-uuid';

@Component({
  selector: 'app-external-references-management[entityType][hasModifyPermission]',
  templateUrl: './external-references-management.component.html',
  styleUrls: ['./external-references-management.component.scss'],
  providers: [ExternalReferencesComponentStore],
})
export class ExternalReferencesManagementComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public hasModifyPermission!: boolean;

  public loading = false;
  public readonly externalReferences$ = this.externalReferencesComponentStore.externalReferences$.pipe(
    map((externalReferences) =>
      externalReferences
        .map((externalReference) => this.mapExternalReferenceToViewModel(externalReference, externalReferences))
        .sort((a, b) => a.title.localeCompare(b.title))
    )
  );

  constructor(
    private readonly confirmationService: ConfirmActionService,
    private readonly dialogService: MatDialog,
    private readonly store: Store,
    private readonly externalReferencesComponentStore: ExternalReferencesComponentStore
  ) {
    super();
  }

  public editReference(externalReference: ExternalReferenceViewModel): void {
    this.externalReferences$.pipe(first()).subscribe((externalReferences) => {
      const createDialogComponent = this.dialogService.open(EditExternalReferenceDialogComponent).componentInstance;
      const enforceLockedMaster = this.shouldEnforceMaster(externalReferences, externalReference);
      createDialogComponent.entityType = this.entityType;
      createDialogComponent.masterReferenceIsReadOnly = enforceLockedMaster;
      createDialogComponent.initialModel = {
        ...externalReference,
        masterReference: enforceLockedMaster,
      };
      createDialogComponent.referenceUuid = externalReference.uuid;
    });
  }

  private shouldEnforceMaster(
    externalReferences: ExternalReferenceViewModel[],
    externalReference?: ExternalReferenceViewModel
  ) {
    const noMaster = externalReferences.filter((x) => x.masterReference).length === 0;
    const enforceLockedMaster = externalReference?.masterReference || noMaster;
    return enforceLockedMaster;
  }

  public removeReference(referenceUuid: string): void {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne referencen?`,
      onConfirm: () => {
        this.store.dispatch(ExternalReferencesManagmentActions.delete(this.entityType, referenceUuid));
      },
    });
  }

  public createReference(): void {
    this.externalReferences$.pipe(first()).subscribe((externalReferences) => {
      const createDialogComponent = this.dialogService.open(CreateExternalReferenceDialogComponent).componentInstance;
      const enforceLockedMaster = this.shouldEnforceMaster(externalReferences);
      createDialogComponent.entityType = this.entityType;
      createDialogComponent.masterReferenceIsReadOnly = enforceLockedMaster;
      createDialogComponent.initialModel = {
        title: ``,
        masterReference: enforceLockedMaster,
      };
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.getEntititySelector()
        .pipe(filterNullish())
        .subscribe((entityWithUuid) => {
          this.externalReferencesComponentStore.getExternalReferences(this.entityType)(entityWithUuid.uuid);
        })
    );
  }

  getCommands(
    externalReference: APIExternalReferenceDataResponseDTO,
    allReferences: Array<APIExternalReferenceDataResponseDTO>
  ): ExternalReferenceCommandsViewModel | null {
    if (!this.hasModifyPermission) return null;
    return {
      edit: true,
      delete: !externalReference.masterReference || allReferences.length === 1,
    };
  }

  private mapExternalReferenceToViewModel(
    externalReference: APIExternalReferenceWithLastChangedResponseDTO,
    externalReferences: Array<APIExternalReferenceWithLastChangedResponseDTO>
  ): ExternalReferenceViewModel {
    return {
      uuid: externalReference.uuid ?? '',
      documentId: externalReference.documentId,
      title: externalReference.title,
      url: externalReference.url,
      masterReference: externalReference.masterReference,
      commands: this.getCommands(externalReference, externalReferences),
      lastChangedBy: externalReference.lastChangedByUsername,
      lastChangedDate: externalReference.lastChangedDate,
    };
  }

  private getEntititySelector(): Observable<HasUuid | undefined> {
    switch (this.entityType) {
      case 'it-system':
        return this.store.select(selectItSystem);
      case 'it-system-usage':
        return this.store.select(selectItSystemUsage);
      case 'it-contract':
        return this.store.select(selectContract);
      case 'data-processing-registration':
        return this.store.select(selectDataProcessing);
      default:
        throw new Error('Unsupported entity type');
    }
  }
}
