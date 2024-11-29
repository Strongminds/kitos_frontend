import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GdprReportActions } from 'src/app/store/it-system-usage/gdpr-report/actions';
import { selectGdprReports } from 'src/app/store/it-system-usage/gdpr-report/selectors';

@Component({
  selector: 'app-gdpr-overview',
  templateUrl: './gdpr-overview.component.html',
  styleUrl: './gdpr-overview.component.scss',
})
export class GdprOverviewComponent {
  public readonly gridColumns: GridColumn[] = [
    {
      field: '',
      title: 'test',
      hidden: false,
    },
    {
      field: '',
      title: 'test 2',
      hidden: false,
    },
  ];

  public readonly gdprReports$ = this.store.select(selectGdprReports);

  constructor(private store: Store) {
    this.store.dispatch(GdprReportActions.getGDPRReports());
  }
}
