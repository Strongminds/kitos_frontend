import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { compareKle } from 'src/app/shared/helpers/kle.helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { KLEActions } from 'src/app/store/kle/actions';
import { selectHasValidCache, selectKLEEntities } from 'src/app/store/kle/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { TableRowActionsComponent } from '../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { PlusIconComponent } from '../../../../shared/components/icons/plus-icon.component';

export type SelectedKleCommand =
  | 'delete-assignment'
  | 'toggle-assignment-relevance-off'
  | 'toggle-assignment-relevance-on';
export interface KleCommandEventArgs {
  command: SelectedKleCommand;
  kleUuid: string;
}

export interface SelectedKle {
  uuid: string;
  availableCommands?: Array<SelectedKleCommand>;
}

export interface SelectedKleDetails extends APIKLEDetailsDTO {
  availableCommands?: Array<SelectedKleCommand>;
  isIrrelevant: boolean;
}

@Component({
    selector: 'app-kle-table[selectedKles]',
    templateUrl: './kle-table.component.html',
    styleUrls: ['./kle-table.component.scss'],
    imports: [NgIf, LoadingComponent, NativeTableComponent, NgFor, ParagraphComponent, ContentSpaceBetweenComponent, TableRowActionsComponent, IconButtonComponent, TrashcanIconComponent, PlusIconComponent, AsyncPipe]
})
export class KleTableComponent extends BaseComponent implements OnInit {
  @Input() public hasModifyPermission = false;
  @Input() public selectedKles!: Observable<Array<SelectedKle>>;
  @Output() public kleCommandRequested = new EventEmitter<KleCommandEventArgs>();

  private readonly selectedKlesSubject = new BehaviorSubject<Array<SelectedKle> | undefined>(undefined);
  private readonly selectedKlesFromSubject = this.selectedKlesSubject.pipe(filterNullish());
  private readonly kleLookup$ = this.store.select(selectKLEEntities).pipe(filterNullish());
  public readonly loadingKle$ = this.store.select(selectHasValidCache).pipe(invertBooleanValue());

  public readonly selectedKleDetails$ = combineLatest([
    this.selectedKlesFromSubject,
    this.kleLookup$,
    this.loadingKle$,
  ]).pipe(
    map(([selectedKles, kles, loadingKle]) => {
      if (loadingKle) {
        return null;
      }
      return selectedKles
        .map((selectedKle) => {
          const details = <SelectedKleDetails>(kles[selectedKle.uuid] ?? {
            uuid: selectedKle,
            kleNumber: '0',
            description: $localize`ukendt - genindlæs KITOS for at få vist beskrivelsen`,
          });

          return <SelectedKleDetails>{
            ...details,
            availableCommands: selectedKle.availableCommands,
            isIrrelevant: selectedKle.availableCommands?.some((c) => c === 'toggle-assignment-relevance-on') === true,
          };
        })
        .sort(compareKle);
    }),
    filterNullish()
  );

  constructor(private readonly store: Store) {
    super();
  }

  public commandExecutionRequested(args: KleCommandEventArgs) {
    this.kleCommandRequested.emit(args);
  }

  ngOnInit(): void {
    //Load KLE options
    this.store.dispatch(KLEActions.getKLEs());

    this.subscriptions.add(this.selectedKles.subscribe((selectedKles) => this.selectedKlesSubject.next(selectedKles)));
  }
}
