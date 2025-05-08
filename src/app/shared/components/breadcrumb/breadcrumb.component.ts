import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbContext } from '../../models/breadcrumbs/breadcrumb-context.model';
import { BreadCrumb } from '../../models/breadcrumbs/breadcrumb.model';
import { NgClass, NgIf } from '@angular/common';
import { ChevronRightIconComponent } from '../icons/chevron-right-icon.component';

@Component({
  selector: 'app-breadcrumb[breadCrumb][context]',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [NgClass, NgIf, ChevronRightIconComponent],
})
export class BreadcrumbComponent {
  @Input() public breadCrumb!: BreadCrumb;
  @Input() public context!: BreadCrumbContext;

  constructor(private router: Router) {}

  public itemClicked() {
    const commands = this.context.routerCommands;
    if (commands) {
      this.router.navigate(commands);
    }
  }
}
