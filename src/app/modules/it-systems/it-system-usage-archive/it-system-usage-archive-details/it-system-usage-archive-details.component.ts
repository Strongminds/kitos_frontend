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
import { ITSystemUsageArchiveActions } from 'src/app/store/it-system-usage-archive/actions';
import {
  selectItSystemUsageArchive,
  selectItSystemUsageArchiveLegacyName,
  selectItSystemUsageArchiveLoading,
  selectItSystemUsageArchiveUuid,
} from 'src/app/store/it-system-usage-archive/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-it-system-usage-archive-details',
  imports: [AsyncPipe, BreadcrumbsComponent, LoadingComponent, NavigationDrawerComponent, RouterOutlet],
  templateUrl: './it-system-usage-archive-details.component.html',
  styleUrl: './it-system-usage-archive-details.component.scss',
})
export class ItSystemUsageArchiveDetailsComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectItSystemUsageArchiveLoading);
  public readonly usageArchive$ = this.store.select(selectItSystemUsageArchive);
  public readonly usageArchiveLegacyName$ = this.store
    .select(selectItSystemUsageArchiveLegacyName)
    .pipe(filterNullish());
  public readonly usageArchiveUuid$ = this.store.select(selectItSystemUsageArchiveUuid).pipe(filterNullish());

  public readonly organizationName$ = this.store.select(selectOrganizationName);

  public readonly breadCrumbs$ = combineLatest([
    this.usageArchiveLegacyName$,
    this.usageArchiveUuid$,
    this.organizationName$,
  ]).pipe(
    map(([usageArchiveLegacyName, usageArchiveUuid, organizationName]): BreadCrumb[] => [
      {
        text: $localize`Historik for IT Systemer i ${organizationName}`,
        routerLink: `${AppPath.itSystems}/${AppPath.itSystemUsageArchive}`,
      },
      {
        text: usageArchiveLegacyName,
        routerLink: `${usageArchiveUuid}`,
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
        .subscribe((usageArchiveUuid) =>
          this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchive(usageArchiveUuid)),
        ),
    );
  }
}
