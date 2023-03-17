import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { InterfaceTypeActions } from 'src/app/store/it-interface-type/actions';
import { selectInterfaceTypes } from 'src/app/store/it-interface-type/selectors';
import { ItSystemInterfacesTableComponentStore } from './it-system-interfaces-table.component-store';

@Component({
  selector: 'app-it-system-interfaces-table',
  templateUrl: './it-system-interfaces-table.component.html',
  styleUrls: ['./it-system-interfaces-table.component.scss'],
  providers: [ItSystemInterfacesTableComponentStore]
})
export class ItSystemInterfacesTableComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.interfaceStore.itInterfacesIsLoading$;
  readonly itInterfaces$ = this.interfaceStore.itInterfaces$;
  readonly anyInterfaces$ = this.itInterfaces$
    .pipe(matchEmptyArray(), invertBooleanValue());
  public readonly interfaceTypes$ = this.store.select(selectInterfaceTypes);


  @Input() systemUuid: string | undefined | null = '';

  constructor(private store: Store, private interfaceStore: ItSystemInterfacesTableComponentStore){
    super();
  }

  ngOnInit(): void {
    if(!this.systemUuid){
      throw "System uuid must be defined!";
    }

    this.subscriptions.add(
      this.interfaceStore.getInterfacesExposedBySystemWithUuid(this.systemUuid)
    );

    this.store.dispatch(InterfaceTypeActions.getInterfaceTypes());
  }
}
