import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { saveAs } from '@progress/kendo-file-saver';
import { mergeMap, Observable } from 'rxjs';
import { ExcelExportService } from 'src/app/shared/services/excel-export.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface State {}

@Injectable()
export class ITSystemUsageDetailsComponentStore extends ComponentStore<State> {
  constructor(
    private excelExportService: ExcelExportService,
    private notificationService: NotificationService,
  ) {
    super({});
  }

  public exportToExcel = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) =>
        this.excelExportService.exportITSystemUsageToExcel(systemUsageUuid).pipe(
          tapResponse({
            next: (file) => {
              saveAs (file.blob, file.fileName);
            },
            error: (error) => {
              console.error('Export failed:', error);
              this.notificationService.showError($localize`Eksport til Excel mislykkedes`);
            },
          }),
        ),
      ),
    ),
  );
}
