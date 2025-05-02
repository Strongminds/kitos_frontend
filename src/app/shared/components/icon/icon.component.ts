import { Component, Input } from '@angular/core';
import { IconType } from '../../models/icon-type';
import { NgIf } from '@angular/common';
import { ExportIconComponent } from '../icons/export-icon.component';
import { DocumentIconComponent } from '../icons/document-icon.component';
import { OrganizationIconComponent } from '../icons/organization-icon.component';
import { SystemsIconComponent } from '../icons/systems-icon.component';
import { ClipboardIconComponent } from '../icons/clipboard-icon.component';
import { FolderImportantComponent } from '../icons/folder-important.component';
import { BulkCreateIconComponent } from '../icons/bulk-create-icon.component';
import { RolesIconComponent } from '../icons/roles-icon.component';
import { NotificationIconComponent } from '../icons/notification-icon.component';
import { BookmarkIconComponent } from '../icons/bookmark.component';
import { MoneyIconComponent } from '../icons/money-icon.component';
import { TableIconComponent } from '../icons/table-icon.component';
import { LockIconComponent } from '../icons/lock-icon.component';
import { IntersectIconComponent } from '../icons/itersect-icon.component';
import { ArchiveIconComponent } from '../icons/archive-icon.component';
import { HierarchyIconComponent } from '../icons/hierarchy-icon.component';
import { HelpIconComponent } from '../icons/help.component';
import { MoreHorizontalIconComponent } from '../icons/more-horizontal-icon.component';
import { SettingsIconComponent } from '../icons/settings-icon.component';
import { MultipleUsersIconComponent } from '../icons/multiple-users-icon.component';
import { DiskIconComponent } from '../icons/disk-icon.component';
import { PlusIconBlueComponent } from '../icons/plus-icon-blue.component';
import { PlusIconComponent } from '../icons/plus-icon.component';
import { ReloadIconComponent } from '../icons/reload-icon.component';
import { MoreHorizontalWarningIconComponent } from '../icons/more-horizontal-warning-icon.component';
import { ReorderIconComponent } from '../icons/reorder-icon.component';
import { CheckIconComponent } from '../icons/check-icon.component';
import { CollapseCircleIconComponent } from '../icons/collapse-circle-icon.component';
import { ExpandCircleIconComponent } from '../icons/expand-circle-icon.component';
import { XIconComponent } from '../icons/x-icon.component';
import { CalendarIconComponent } from '../icons/calendar-icon.component';
import { MailIconComponent } from '../icons/mail-icon.component';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    host: { style: 'display: contents' },
    imports: [NgIf, ExportIconComponent, DocumentIconComponent, OrganizationIconComponent, SystemsIconComponent, ClipboardIconComponent, FolderImportantComponent, BulkCreateIconComponent, RolesIconComponent, NotificationIconComponent, BookmarkIconComponent, MoneyIconComponent, TableIconComponent, LockIconComponent, IntersectIconComponent, ArchiveIconComponent, HierarchyIconComponent, HelpIconComponent, MoreHorizontalIconComponent, SettingsIconComponent, MultipleUsersIconComponent, DiskIconComponent, PlusIconBlueComponent, PlusIconComponent, ReloadIconComponent, MoreHorizontalWarningIconComponent, ReorderIconComponent, CheckIconComponent, CollapseCircleIconComponent, ExpandCircleIconComponent, XIconComponent, CalendarIconComponent, MailIconComponent]
})
export class IconComponent {
  @Input() iconType!: IconType;
}
