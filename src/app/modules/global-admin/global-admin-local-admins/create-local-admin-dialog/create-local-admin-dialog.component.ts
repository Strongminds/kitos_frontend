import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIUserReferenceResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-create-local-admin-dialog',
  templateUrl: './create-local-admin-dialog.component.html',
  styleUrl: './create-local-admin-dialog.component.scss',
})
export class CreateLocalAdminDialogComponent {
  public formGroup: FormGroup = new FormGroup(
    { user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined) },
    Validators.required
  );
}
