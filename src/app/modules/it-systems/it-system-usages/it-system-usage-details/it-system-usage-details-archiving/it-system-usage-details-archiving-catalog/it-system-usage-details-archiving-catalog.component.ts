import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapRecommendedArchiveDutyComment, mapRecommendedArchiveDutyToString } from 'src/app/shared/models/recommended-archive-duty.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageSystemContextUuid } from 'src/app/store/it-system-usage/selectors';
import { selectItSystem } from 'src/app/store/it-system/selectors';
import { selectITSystemUsageEnableCatalogArchiveDuty, selectITSystemUsageEnableCatalogArchiveDutyComment } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-it-system-usage-details-archiving-catalog',
  templateUrl: './it-system-usage-details-archiving-catalog.component.html',
  styleUrl: './it-system-usage-details-archiving-catalog.component.scss',
})
export class ItSystemUsageDetailsArchivingCatalogComponent extends BaseComponent implements OnInit {
  public readonly itSystemCatalogItemUuid$ = this.store.select(selectItSystemUsageSystemContextUuid);
  public itSystem$ = this.store.select(selectItSystem);
  public readonly catalogArchiveDutyEnabled$ = this.store.select(selectITSystemUsageEnableCatalogArchiveDuty);
  public readonly catalogArchiveDutyCommentEnabled$ = this.store.select(selectITSystemUsageEnableCatalogArchiveDutyComment);


  public readonly catalogForm = new FormGroup({
    archiveDuty: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    archiveDutyComment: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

   constructor(
      private readonly store: Store,
    ) {
      super();
    }

  ngOnInit(): void {
    this.setupCatalogForm();
  }

  private setupCatalogForm() {
    this.subscriptions.add(
      this.itSystem$.pipe(filterNullish()).subscribe((itSystem) => {
        this.catalogForm.patchValue({
          archiveDuty: mapRecommendedArchiveDutyToString(itSystem.recommendedArchiveDuty),
          archiveDutyComment: mapRecommendedArchiveDutyComment(itSystem.recommendedArchiveDuty),
        });
      })
    );
  }
}
