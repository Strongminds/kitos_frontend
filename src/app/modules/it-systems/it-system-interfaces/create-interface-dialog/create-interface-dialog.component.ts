import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BaseCreateEntityDialogComponent } from 'src/app/shared/components/entity-creation/base-create-entity-dialog-component';
import { CreateEntityDialogComponentStore } from 'src/app/shared/components/entity-creation/create-entity-dialog.component-store';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { CreateEntityDialogActionButtonsComponent } from '../../../../shared/components/entity-creation/create-entity-dialog-action-buttons/create-entity-dialog-action-buttons.component';

@Component({
  selector: 'app-create-interface-dialog',
  templateUrl: './create-interface-dialog.component.html',
  styleUrl: './create-interface-dialog.component.scss',
  providers: [CreateEntityDialogComponentStore],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    NgIf,
    ParagraphComponent,
    CreateEntityDialogActionButtonsComponent,
    AsyncPipe,
  ],
})
export class CreateInterfaceDialogComponent extends BaseCreateEntityDialogComponent implements OnInit {
  override entityType = 'it-interface' as RegistrationEntityTypes;
  override title = $localize`Opret Snitflade`;
  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    interfaceId: new FormControl<string | undefined>(undefined),
  });

  override ngOnInit(): void {
    super.ngOnInit();

    const nameControl = this.createForm.get('name');
    const interfaceIdControl = this.createForm.get('interfaceId');

    this.subscriptions.add(
      nameControl?.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
        if (!value) return;

        this.componentStore.checkNameAvailability({
          searchObject: { nameEquals: value, extraSearchParameter: interfaceIdControl?.value ?? '' },
          entityType: this.entityType,
        });
      }),
    );

    this.subscriptions.add(
      interfaceIdControl?.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
        const nameValue = nameControl?.value;
        if (!nameValue) return;

        this.componentStore.checkNameAvailability({
          searchObject: { nameEquals: nameValue, extraSearchParameter: value ?? '' },
          entityType: this.entityType,
        });
      }),
    );
  }

  public createEntity(openAfterCreate: boolean): void {
    const name = this.createForm.controls.name.value;
    if (!name) {
      return;
    }
    const interfaceId = this.createForm.controls.interfaceId.value ?? '';

    this.store.dispatch(ITInterfaceActions.createITInterface(name, interfaceId, openAfterCreate));
  }
}
