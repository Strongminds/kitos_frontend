import { Component } from '@angular/core';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

@Component({
  selector: 'app-gdpr-overview',
  templateUrl: './gdpr-overview.component.html',
  styleUrl: './gdpr-overview.component.scss',
})
export class GdprOverviewComponent {
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'a',
      title: 'test',
      hidden: false,
    },
    {
      field: 'b',
      title: 'test 2',
      hidden: false,
    },
  ];

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly fakeData: any[] = [
    {
      a: '123',
      b: '456',
    },
    {
      a: 'abc',
      b: 'def',
    },
  ];
}
