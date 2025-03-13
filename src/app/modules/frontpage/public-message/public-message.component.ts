import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { IconType } from 'src/app/shared/models/icon-type';
import { PublicMessageDialogComponent } from './public-message-dialog/public-message-dialog.component';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { map, Observable } from 'rxjs';
import { FrontpageComponentStore } from '../frontpage.component-store';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';

export interface PublicMessageConfig {
  iconType: IconType;
  index: number;
}

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrls: ['./public-message.component.scss'],
  host: {
    '[style.width]': "mode === 'compact' ? '352px' : '452px'",
  },
})
export class PublicMessageComponent implements OnInit {
  @Input() config!: PublicMessageConfig;
  @Input() mode: 'normal' | 'compact' = 'normal';

  public publicMessage$!: Observable<PublicMessage>;
  public readonly statusDisplayType = BooleanValueDisplayType.NormalUnstable;

  constructor(private dialog: MatDialog, private readonly componentStore: FrontpageComponentStore) {}

  public ngOnInit(): void {
    this.publicMessage$ = this.componentStore.publicMessages$.pipe(
      filterNullish(),
      map((messages) => messages[this.config.index])
    );
  }

  public openPublicMessageDialog(): void {
    const dialogRef = this.dialog.open(PublicMessageDialogComponent);
    dialogRef.componentInstance.publicMessage$ = this.publicMessage$;
  }

  public hasValidUrl(publicMessage: PublicMessage): boolean {
    const url = publicMessage.link;
    return !!url && validateUrl(url);
  }

  public activeStatus(publicMessage: PublicMessage): boolean | undefined {
    switch (publicMessage.status?.value) {
      case APIPublicMessageRequestDTO.StatusEnum.Active:
        return true;
      case APIPublicMessageRequestDTO.StatusEnum.Inactive:
        return false;
      default:
        return undefined;
    }
  }
}
