import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ITContractActions } from 'src/app/store/it-contract/actions';

@Component({
  selector: 'app-create-and-associate-contract-dialog',
  templateUrl: './create-and-associate-contract-dialog.component.html',
  styleUrl: './create-and-associate-contract-dialog.component.scss',
})
export class CreateAndAssociateContractDialogComponent {
  @Input() public usageToAssociateUuid!: string;

  public readonly formGroup = new FormGroup({
    contractName: new FormControl<string>('', Validators.required),
  });

  constructor(private store: Store, private dialogRef: MatDialogRef<CreateAndAssociateContractDialogComponent>) {}

  public createAndRegisterContract() {
    const contractName = this.formGroup.controls.contractName.value;
    if (!contractName) throw new Error('No  name is required');
    this.store.dispatch(ITContractActions.createAndAssociateContract(contractName, this.usageToAssociateUuid));
    this.closeDialog();
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
