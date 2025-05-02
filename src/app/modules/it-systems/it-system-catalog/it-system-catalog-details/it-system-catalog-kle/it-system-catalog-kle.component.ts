import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SelectKleDialogComponent } from 'src/app/shared/components/select-kle-dialog/select-kle-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectITSystemHasModifyPermission, selectItSystemKleUuids } from 'src/app/store/it-system/selectors';
import { KleCommandEventArgs, SelectedKle, KleTableComponent } from '../../../shared/kle-table/kle-table.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { TextBoxInfoComponent } from '../../../../../shared/components/textbox-info/textbox-info.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
    selector: 'app-it-system-catalog-kle',
    templateUrl: './it-system-catalog-kle.component.html',
    styleUrl: './it-system-catalog-kle.component.scss',
    imports: [CardComponent, CardHeaderComponent, StandardVerticalContentGridComponent, NgIf, KleTableComponent, TextBoxInfoComponent, ParagraphComponent, EmptyStateComponent, CollectionExtensionButtonComponent, AsyncPipe]
})
export class ItSystemCatalogKleComponent extends BaseComponent implements OnInit {
  private disabledKleUuids: Array<string> = [];
  public readonly hasModifyPermission$ = this.store.select(selectITSystemHasModifyPermission);
  private readonly localKleUuids$ = this.store.select(selectItSystemKleUuids).pipe(filterNullish());
  public readonly localKleUuidsWithActions$ = this.localKleUuids$.pipe(
    map((uuids) => uuids.map<SelectedKle>((uuid) => ({ uuid: uuid, availableCommands: ['delete-assignment'] })))
  );
  public readonly anyLocalKleUuids$ = this.store
    .select(selectItSystemKleUuids)
    .pipe(filterNullish(), matchNonEmptyArray());

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly confirmActionService: ConfirmActionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.localKleUuids$.subscribe((systemKleUuids) => (this.disabledKleUuids = [...systemKleUuids]))
    );
  }

  public onAddNew() {
    const selectkleRef = this.dialog.open<SelectKleDialogComponent, string | undefined>(SelectKleDialogComponent);
    selectkleRef.componentInstance.disabledKleUuids = this.disabledKleUuids;
    this.subscriptions.add(
      selectkleRef
        .afterClosed()
        .pipe(first())
        .pipe(combineLatestWith(this.store.select(selectItSystemKleUuids).pipe(first(), filterNullish())))
        .subscribe(([addedKleUuid, kles]) => {
          if (addedKleUuid) {
            const patchKles = [...kles, addedKleUuid];
            this.store.dispatch(
              ITSystemActions.patchITSystem(
                { kleUuids: patchKles },
                $localize`Opgaven blev tilknyttet`,
                $localize`Opgaven kunne ikke oprettes`
              )
            );
          }
        })
    );
  }

  public onRemoveLocalKleRequested(args: KleCommandEventArgs) {
    if (args.command === 'delete-assignment') {
      this.confirmActionService.confirmAction({
        category: ConfirmActionCategory.Warning,
        onConfirm: () =>
          this.subscriptions.add(
            this.store
              .select(selectItSystemKleUuids)
              .pipe(first(), filterNullish())
              .subscribe((kles) => {
                const patchKles = kles.filter((kle: string) => kle !== args.kleUuid);
                this.store.dispatch(ITSystemActions.patchITSystem({ kleUuids: patchKles }));
              })
          ),
        message: $localize`Er du sikker på, at du vil fjerne denne tilknytning?`,
      });
    }
  }
}
