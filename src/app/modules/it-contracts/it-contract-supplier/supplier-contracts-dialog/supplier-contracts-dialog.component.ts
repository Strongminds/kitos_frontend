import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DetailsPageLinkComponent } from 'src/app/shared/components/details-page-link/details-page-link.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { SupplierContract } from 'src/app/shared/models/it-contract/it-contract-supplier.model';


@Component({
  selector: 'app-supplier-contracts-dialog',
  imports: [DialogComponent, DialogActionsComponent, ButtonComponent, StandardVerticalContentGridComponent, DetailsPageLinkComponent, ParagraphComponent],
  templateUrl: './supplier-contracts-dialog.component.html',
  styleUrl: './supplier-contracts-dialog.component.scss',
})
export class SupplierContractsDialogComponent extends BaseComponent implements OnInit {
  @Input() supplierName: string = '';
  @Input() contracts: SupplierContract[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<SupplierContractsDialogComponent>,
    private readonly router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.router.events.subscribe(() => this.dialogRef.close())
    );
  }

  public getTitle() {
    return $localize`Kontrakter for leverandøren ${this.supplierName}`;
  }

  public onClose() {
    this.dialogRef.close();
  }
}
