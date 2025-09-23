import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';

@Component({
  selector: 'app-local-admin-isms-suppliers',
  imports: [CardComponent, LocalGridComponent, NgFor],
  templateUrl: './local-admin-isms-suppliers.component.html',
  styleUrl: './local-admin-isms-suppliers.component.scss'
})
export class LocalAdminIsmsSuppliersComponent {


  constructor(private store: Store) {
    }
  
    public suppliers = [
    { Name: 'Supplier A', Cvr: '12345678' },
    { Name: 'Supplier B', Cvr: '87654321' },
    { Name: 'Supplier C', Cvr: '11223344' }
  ]

  public gridColumns = [
    { title: 'Navn', field: 'Name', hidden: false },
    { title: 'CVR', field: 'Cvr', hidden: false },
    createGridActionColumn(['delete'])
  ];

  //public canModifyOrganization = this.store.select();

  public removeSupplier($event: any){
    console.log($event)
  }
}
