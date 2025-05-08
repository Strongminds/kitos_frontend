import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbContext } from '../../models/breadcrumbs/breadcrumb-context.model';
import { BreadCrumb } from '../../models/breadcrumbs/breadcrumb.model';
import { ChevronRightIconComponent } from '../icons/chevron-right-icon.component';

@Component({
  selector: 'app-breadcrumb[breadCrumb][context]',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [CommonModule, ChevronRightIconComponent],
})
export class BreadcrumbComponent {
  @Input() public breadCrumb!: BreadCrumb;
  @Input() public context!: BreadCrumbContext;

  constructor(private router: Router) {}

  public itemClicked(event: MouseEvent) {
    const commands = this.context.routerCommands;
    if (!commands) return;

    if (event.ctrlKey || event.button === 1) {
      const url = this.router.serializeUrl(this.router.createUrlTree(commands));
      window.open(url, '_blank');
      return;
    }

    this.router.navigate(commands);
  }
}
