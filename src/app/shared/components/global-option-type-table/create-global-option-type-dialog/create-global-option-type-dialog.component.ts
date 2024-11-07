import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIGlobalRoleOptionCreateRequestDTO } from 'src/app/api/v2';
import { GlobalAdminOptionType } from 'src/app/shared/models/options/global-admin-option-type.model';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/actions';
import { EditGlobalOptionTypeDialogComponent } from '../edit-global-option-type-dialog/edit-global-option-type-dialog.component';
import { isRoleOptionType } from 'src/app/shared/models/options/role-option-types.model';

@Component({
  selector: 'app-create-global-option-type-dialog',
  templateUrl: './create-global-option-type-dialog.component.html',
  styleUrl: './create-global-option-type-dialog.component.scss',
})
export class CreateGlobalOptionTypeDialogComponent {
  @Input() optionType!: GlobalAdminOptionType;

  public form = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    name: new FormControl<string | undefined>(undefined, Validators.required),
    obligatory: new FormControl<boolean | undefined>(undefined),
    writeAccess: new FormControl<boolean | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<EditGlobalOptionTypeDialogComponent>, private store: Store) {}

  public onSave(): void {
    const formValue = this.form.value;
    const description = formValue.description ?? undefined;
    const name = formValue.name ?? undefined;
    const isObligatory = formValue.obligatory ?? undefined;
    const request: APIGlobalRoleOptionCreateRequestDTO = {
      description,
      name,
      isObligatory,
    };
    if (this.isRoleOption()) {
      const writeAccess = formValue.writeAccess ?? undefined;
      request.writeAccess = writeAccess;
    }

    this.store.dispatch(GlobalOptionTypeActions.createOptionType(this.optionType, request));
    this.dialogRef.close();
  }

  public isRoleOption(){
    return isRoleOptionType(this.optionType);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableCreateButton(): boolean {
    return !this.form.valid;
  }
}
