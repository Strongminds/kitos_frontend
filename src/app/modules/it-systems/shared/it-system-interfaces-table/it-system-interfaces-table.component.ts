import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemInterfacesTableComponentStore } from './it-system-interfaces-table.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { DetailsPageLinkComponent } from '../../../../shared/components/details-page-link/details-page-link.component';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { SelectedOptionTypeTextComponent } from '../../../../shared/components/selected-option-type-text/selected-option-type-text.component';
import { ExternalPageLinkComponent } from '../../../../shared/components/external-page-link/external-page-link.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';

@Component({
  selector: 'app-it-system-interfaces-table[systemUuid]',
  templateUrl: './it-system-interfaces-table.component.html',
  styleUrls: ['./it-system-interfaces-table.component.scss'],
  providers: [ItSystemInterfacesTableComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    NgIf,
    LoadingComponent,
    NativeTableComponent,
    NgFor,
    DetailsPageLinkComponent,
    StatusChipComponent,
    ParagraphComponent,
    SelectedOptionTypeTextComponent,
    ExternalPageLinkComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class ItSystemInterfacesTableComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.interfaceStore.itInterfacesIsLoading$;
  public readonly itInterfaces$ = this.interfaceStore.itInterfaces$;
  public readonly anyInterfaces$ = this.itInterfaces$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly availableInterfaceTypesDictionary$ = this.store
    .select(selectRegularOptionTypesDictionary('it-interface_interface-type'))
    .pipe(filterNullish());

  @Input() public systemUuid = '';
  @Input() public helpTextKey!: string;

  constructor(
    private store: Store,
    private interfaceStore: ItSystemInterfacesTableComponentStore,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.systemUuid === '') {
      console.error('systemUuid cannot be an empty value');
      return;
    }

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-interface_interface-type'));

    this.interfaceStore.getInterfacesExposedBySystemWithUuid(this.systemUuid);
  }
}
