import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IconType } from '../../models/icon-type';
import { CardComponent } from '../card/card.component';
import { NgClass, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../buttons/button/button.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { DividerComponent } from '../divider/divider.component';

@Component({
    selector: 'app-navigation-drawer',
    templateUrl: './navigation-drawer.component.html',
    styleUrl: './navigation-drawer.component.scss',
    imports: [CardComponent, NgClass, NgFor, NgIf, ButtonComponent, RouterLinkActive, RouterLink, IconComponent, DividerComponent, AsyncPipe]
})
export class NavigationDrawerComponent {
  @Input() items: NavigationDrawerItem[] = [];

  public isExpanded = true;

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}

export interface NavigationDrawerItem {
  label: string;
  iconType: IconType;
  route: string;
  dataCy?: string;
  enabled$?: Observable<boolean>;
}
