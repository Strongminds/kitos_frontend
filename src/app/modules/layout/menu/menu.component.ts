import { Component, DoCheck, ElementRef, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChevronDownIconComponent } from '../../../shared/components/icons/chevron-down-icon.component';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
    imports: [
        ButtonComponent,
        RouterLinkActive,
        MatMenuTrigger,
        RouterLink,
        NgIf,
        ChevronDownIconComponent,
        MatMenu,
    ],
})
export class MenuComponent implements DoCheck {
  @Input() title?: string | null = '';
  @Input() subtitle?: string | null = '';
  @Input() path: AppPath = AppPath.root;

  public hasContent = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private menuTimeout?: any;

  @ViewChild('content') private content?: ElementRef;

  ngDoCheck() {
    this.hasContent = !!this.content?.nativeElement.innerHTML.trim();
  }

  public menuEnter(trigger: MatMenuTrigger) {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout);
    }
    trigger.openMenu();
  }

  public menuLeave(trigger: MatMenuTrigger) {
    this.menuTimeout = setTimeout(() => {
      trigger.closeMenu();
    }, 80);
  }
}
