import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BreadcrumbsComponent } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import {
  NavigationDrawerComponent,
  NavigationDrawerItem,
} from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemArchiveActions } from 'src/app/store/it-system-archive/actions';
import {
  selectItSystemArchive,
  selectItSystemArchiveLegacyName,
  selectItSystemArchiveLoading,
  selectItSystemArchiveUuid,
} from 'src/app/store/it-system-archive/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-it-system-archive-details',
  imports: [AsyncPipe, BreadcrumbsComponent, LoadingComponent, NavigationDrawerComponent, RouterOutlet],
  templateUrl: './it-system-archive-details.component.html',
  styleUrl: './it-system-archive-details.component.scss',
})
export class ItSystemArchiveDetailsComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectItSystemArchiveLoading);
  public readonly systemArchive$ = this.store.select(selectItSystemArchive);
  public readonly systemArchiveLegacyName$ = this.store.select(selectItSystemArchiveLegacyName).pipe(filterNullish());
  public readonly systemArchiveUuid$ = this.store.select(selectItSystemArchiveUuid).pipe(filterNullish());

  public readonly organizationName$ = this.store.select(selectOrganizationName);

  public readonly breadCrumbs$ = combineLatest([
    this.systemArchiveLegacyName$,
    this.systemArchiveUuid$,
    this.organizationName$,
  ]).pipe(
    map(([systemArchiveLegacyName, systemArchiveUuid, organizationName]): BreadCrumb[] => [
      {
        text: $localize`Historik for IT Systemer i ${organizationName}`,
        routerLink: `${AppPath.itSystems}/${AppPath.itSystemArchive}`,
      },
      {
        text: systemArchiveLegacyName,
        routerLink: `${systemArchiveUuid}`,
      },
    ]),
    filterNullish(),
  );

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Arkivforside`,
      iconType: 'document',
      route: AppPath.frontpage,
    },
  ];

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged(),
        )
        .subscribe((systemArchiveUuid) =>
          this.store.dispatch(ITSystemArchiveActions.getITSystemArchive(systemArchiveUuid)),
        ),
    );
  }
}
