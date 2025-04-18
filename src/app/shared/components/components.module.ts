import { DragDropModule } from '@angular/cdk/drag-drop';
import { Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import '@progress/kendo-angular-intl/locales/da/all';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CreateSubunitDialogComponent } from '../../modules/organization/organization-structure/create-subunit-dialog/create-subunit-dialog.component';
import { DIALOG_DEFAULT_WIDTH } from '../constants/constants';
import { DirectivesModule } from '../directives/directives.module';
import { OnInvalidErrorStateMatcher } from '../helpers/on-invalid-error-state-matcher';
import { PipesModule } from '../pipes/pipes.module';
import { AccordionComponent } from './accordion/accordion.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './buttons/button/button.component';
import { ExportMenuButtonComponent } from './buttons/export-menu-button/export-menu-button.component';
import { IconButtonComponent } from './buttons/icon-button/icon-button.component';
import { MenuButtonItemComponent } from './buttons/menu-button/menu-button-item/menu-button-item.component';
import { MenuButtonComponent } from './buttons/menu-button/menu-button.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipComponent } from './chip/chip.component';
import { CollectionExtensionButtonComponent } from './collection-extension-button/collection-extension-button.component';
import { ContentSpaceBetweenComponent } from './content-space-between/content-space-between.component';
import { ContentVerticalCenterComponent } from './content-vertical-center/content-vertical-center.component';
import { ContentWithInfoComponent } from './content-with-info/content-with-info.component';
import { ContentWithTooltipComponent } from './content-with-tooltip/content-with-tooltip.component';
import { ContentBoxComponent } from './contentbox/contentbox.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DetailsHeaderComponent } from './details-header/details-header.component';
import { DetailsPageLinkComponent } from './details-page-link/details-page-link.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConnectedDropdownDialogComponent } from './dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';
import { DialogActionsComponent } from './dialogs/dialog-actions/dialog-actions.component';
import { DialogHeaderComponent } from './dialogs/dialog/dialog-header/dialog-header.component';
import { DialogComponent } from './dialogs/dialog/dialog.component';
import { ScrollbarDialogComponent } from './dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { DropdownDialogComponent } from './dialogs/dropdown-dialog/dropdown-dialog.component';
import { IconConfirmationDialogComponent } from './dialogs/icon-confirmation-dialog/icon-confirmation-dialog.component';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { LinkWriteDialogComponent } from './dialogs/link-write-dialog/link-write-dialog.component';
import { DividerComponent } from './divider/divider.component';
import { DragAndDropTreeComponent } from './drag-and-drop-tree/drag-and-drop-tree.component';
import { ConnectedDropdownComponent } from './dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from './dropdowns/dropdown/dropdown.component';
import { TreeNodeDropdownComponent } from './dropdowns/tree-node-dropdown/tree-node-dropdown.component';
import { EmptyStateComponent } from './empty-states/empty-state.component';
import { CreateEntityButtonComponent } from './entity-creation/create-entity-button/create-entity-button.component';
import { CreateEntityDialogActionButtonsComponent } from './entity-creation/create-entity-dialog-action-buttons/create-entity-dialog-action-buttons.component';
import { CreateEntityWithNameDialogComponent } from './entity-creation/create-entity-with-name-dialog/create-entity-with-name-dialog.component';
import { ExternalPageLinkComponent } from './external-page-link/external-page-link.component';
import { ExternalReferenceComponent } from './external-reference/external-reference.component';
import { CreateExternalReferenceDialogComponent } from './external-references-management/create-external-reference-dialog/create-external-reference-dialog.component';
import { EditExternalReferenceDialogComponent } from './external-references-management/edit-external-reference-dialog/edit-external-reference-dialog.component';
import { ExternalReferenceDialogComponent } from './external-references-management/external-reference-dialog/external-reference-dialog.component';
import { ExternalReferencesManagementComponent } from './external-references-management/external-references-management.component';
import { FormGridComponent } from './form-grid/form-grid.component';
import { GridOptionsButtonComponent } from './grid-options-button/grid-options-button.component';
import { ChoiceTypeDropdownFilterComponent } from './grid/choice-type-dropdown-filter/choice-type-dropdown-filter.component';
import { DateFilterComponent } from './grid/date-filter/date-filter.component';
import { DropdownColumnDataFilterComponent } from './grid/dropdown-column-data-filter/dropdown-column-data-filter.component';
import { DropdownFilterComponent } from './grid/dropdown-filter/dropdown-filter.component';
import { GridPaginatorComponent } from './grid/grid-paginator/grid-paginator.component';
import { GridComponent } from './grid/grid.component';
import { HideShowButtonComponent } from './grid/hide-show-button/hide-show-button.component';
import { HideShowDialogComponent } from './grid/hide-show-dialog/hide-show-dialog.component';
import { UsageLinkComponent } from './grid/it-system-usage-column/grid-usage-link/grid-usage-link.component';
import { NumericFilterComponent } from './grid/numeric-filter/numeric-filter.component';
import { StringFilterComponent } from './grid/string-filter/string-filter.component';
import { UnitDropdownFilterComponent } from './grid/unit-dropdown-filter/unit-dropdown-filter.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { IconsModule } from './icons/icons.module';
import { LinkTextboxComponent } from './link-textbox/link-textbox.component';
import { LoadingComponent } from './loading/loading.component';
import { NativeTableComponent } from './native-table/native-table.component';
import { NotificationsTableDialogComponent } from './notifications-table/notifications-table-dialog/notifications-table-dialog.component';
import { NotificationsTableSentDialogComponent } from './notifications-table/notifications-table-sent-dialog/notifications-table-sent-dialog.component';
import { NotificationsTableComponent } from './notifications-table/notifications-table.component';
import { NumericInputComponent } from './numeric-input/numeric-input.component';
import { OrgUnitSelectComponent } from './org-unit-select/org-unit-select.component';
import { OverviewHeaderComponent } from './overview-header/overview-header.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { PopupMessagesComponent } from './popup-messages/popup-messages.component';
import { RadioButtonsComponent } from './radio-buttons/radio-buttons.component';
import { RoleTableComponent } from './role-table/role-table.component';
import { RoleTableCreateDialogComponent } from './role-table/role-table.create-dialog/role-table.create-dialog.component';
import { SegmentComponent } from './segment/segment.component';
import { SelectKleDialogComponent } from './select-kle-dialog/select-kle-dialog.component';
import { SelectedOptionTypeTextComponent } from './selected-option-type-text/selected-option-type-text.component';
import { SpacerComponent } from './spacer/spacer.component';
import { StandardVerticalContentGridComponent } from './standard-vertical-content-grid/standard-vertical-content-grid.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { TableRowActionsComponent } from './table-row-actions/table-row-actions.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { EntityTreeComponent } from './tree/entity-tree.component';

import { InputsModule } from '@progress/kendo-angular-inputs';
import '@progress/kendo-angular-intl/locales/da/all';
import { AccordionHeaderComponent } from './accordion-header/accordion-header.component';
import { BooleanCircleComponent } from './boolean-circle/boolean-circle.component';
import { CheckboxButtonComponent } from './buttons/checkbox-button/checkbox-button.component';
import { DetailsPageLinkWithTooltipComponent } from './details-page-link/details-page-link-with-tooltip/details-page-link-with-tooltip.component';
import { BulkActionDialogSectionComponent } from './dialogs/bulk-action-dialog/bulk-action-dialog-section/bulk-action-dialog-section.component';
import { BulkActionDialogComponent } from './dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { CreateHelpTextDialogComponent } from './dialogs/create-help-text-dialog/create-help-text-dialog.component';
import { EditHelpTextDialogComponent } from './dialogs/edit-help-text-dialog/edit-help-text-dialog.component';
import { ContractsDropdownComponent } from './dropdowns/contracts-dropdown/contracts-dropdown.component';
import { MultiSelectDropdownComponent } from './dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { OptionTypeDropdownComponent } from './dropdowns/option-type-dropdown/option-type-dropdown.component';
import { UserDropdownComponent } from './dropdowns/user-dropdown/user-dropdown.component';
import { FileInputComponent } from './file-input/file-input.component';
import { GlobalOptionTypeDialogComponent } from './global-option-type-view/global-option-type-dialog/global-option-type-dialog.component';
import { GlobalOptionTypeGridComponent } from './global-option-type-view/global-option-type-grid/global-option-type-grid.component';
import { GlobalOptionTypeViewComponent } from './global-option-type-view/global-option-type-view.component';
import { GridColumnConfigButtonsComponent } from './grid-options-button/grid-column-config-buttons/grid-column-config-buttons.component';
import { GridFilterButtonsComponent } from './grid-options-button/grid-filter-buttons/grid-filter-buttons.component';
import { ActionButtonsCellComponent } from './grid/grid-cell/cell-types/action-buttons-cell/action-buttons-cell.component';
import { AuditCellComponent } from './grid/grid-cell/cell-types/audit-cell/audit-cell.component';
import { BooleanCellComponent } from './grid/grid-cell/cell-types/boolean-cell/boolean-cell.component';
import { CheckboxCellComponent } from './grid/grid-cell/cell-types/checkbox-cell/checkbox-cell.component';
import { DateCellComponent } from './grid/grid-cell/cell-types/date-cell/date-cell.component';
import { DefaultWrapCellComponent } from './grid/grid-cell/cell-types/default-wrap-cell/default-wrap-cell.component';
import { EnumCellComponent } from './grid/grid-cell/cell-types/enum-cell/enum-cell.component';
import { LinkCellComponent } from './grid/grid-cell/cell-types/link-cell/link-cell.component';
import { PageLinkArrayCellComponent } from './grid/grid-cell/cell-types/page-link-array-cell/page-link-array-cell.component';
import { PageLinkCellComponent } from './grid/grid-cell/cell-types/page-link-cell/page-link-cell.component';
import { PrimaryCellComponent } from './grid/grid-cell/cell-types/primary-cell/primary-cell.component';
import { StatusCellComponent } from './grid/grid-cell/cell-types/status-cell/status-cell.component';
import { TextCellComponent } from './grid/grid-cell/cell-types/text-cell/text-cell.component';
import { ThousandSeperatorCellComponent } from './grid/grid-cell/cell-types/thousand-seperator-cell/thousand-seperator-cell.component';
import { TitleLinkCellComponent } from './grid/grid-cell/cell-types/title-link-cell/title-link-cell.component';
import { UsagesCellComponent } from './grid/grid-cell/cell-types/usages-cell/usages-cell.component';
import { UuidToNameCellComponent } from './grid/grid-cell/cell-types/uuid-to-name-cell/uuid-to-name-cell.component';
import { GridCellComponent } from './grid/grid-cell/grid-cell.component';
import { GridUsagesConsequencesDialogComponent } from './grid/it-system-usage-column/grid-usages-consequences-dialog/grid-usages-consequences-dialog.component';
import { UsageMigrationConsequencesTableComponent } from './grid/it-system-usage-column/grid-usages-consequences-dialog/usage-migration-consequences-table/usage-migration-consequences-table.component';
import { UsageMigrationRelationConsequencesTableComponent } from './grid/it-system-usage-column/grid-usages-consequences-dialog/usage-migration-relation-consequences-table/usage-migration-relation-consequences-table.component';
import { UsageMigrationSystemConsequencesTableComponent } from './grid/it-system-usage-column/grid-usages-consequences-dialog/usage-migration-system-consequences-table/usage-migration-system-consequences-table.component';
import { GridUsagesDialogComponent } from './grid/it-system-usage-column/grid-usages-dialog/grid-usages-dialog.component';
import { GridUsagesDropdownDialogComponent } from './grid/it-system-usage-column/grid-usages-dropdown-dialog/grid-usages-dropdown-dialog.component';
import { UsageProxyCheckboxComponent } from './grid/usage-proxy-checkbox/usage-proxy-checkbox.component';
import { IconComponent } from './icon/icon.component';
import { ReadonlyLinkTextboxComponent } from './link-textbox/readonly-link-textbox/readonly-link-textbox.component';
import { LocalAdminColumnConfigButtonComponent } from './local-admin-column-config-button/local-admin-column-config-button.component';
import { LocalGridComponent } from './local-grid/local-grid.component';
import { ToggleButtonComponent } from './local-grid/toggle-button/toggle-button.component';
import { EditLocalOptionTypeDialogComponent } from './local-option-type-view/edit-local-option-type-dialog/edit-local-option-type-dialog.component';
import { LocalOptionGridComponent } from './local-option-type-view/local-option-grid/local-option-grid.component';
import { LocalOptionTypeViewComponent } from './local-option-type-view/local-option-type-view.component';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';
import { NumberCircleComponent } from './number-circle/number-circle.component';
import { OrganizationDropdownComponent } from './organization-dropdown/organization-dropdown.component';
import { ResetToOrgColumnsConfigButtonComponent } from './reset-to-org-columns-config-button/reset-to-org-columns-config-button.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { RoleRowComponent } from './role-table/role-row/role-row.component';
import { RoleTableContainerComponent } from './role-table/role-table-container/role-table-container.component';
import { SectionComponent } from './section/section.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { SnackbarActionsComponent } from './snackbar-actions/snackbar-actions.component';
import { VerticalContentGridSectionMarginLeftComponent } from './vertical-content-grid-section-margin-left/vertical-content-grid-section-margin-left.component';

export function scrollFactory(overlay: Overlay): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    GridPaginatorComponent,
    LoadingComponent,
    PopupMessageComponent,
    TextBoxComponent,
    TextAreaComponent,
    DropdownComponent,
    DatePickerComponent,
    CheckboxComponent,
    BreadcrumbsComponent,
    ChipComponent,
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    DialogComponent,
    DialogActionsComponent,
    SegmentComponent,
    TextBoxInfoComponent,
    ContentBoxComponent,
    ExternalReferenceComponent,
    ParagraphComponent,
    DetailsPageLinkComponent,
    NativeTableComponent,
    HelpButtonComponent,
    HelpDialogComponent,
    SelectedOptionTypeTextComponent,
    ExternalPageLinkComponent,
    SpacerComponent,
    PopupMessageComponent,
    PopupMessagesComponent,
    TooltipComponent,
    BreadcrumbComponent,
    EntityTreeComponent,
    EmptyStateComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    ConfirmationDialogComponent,
    RoleTableComponent,
    RoleTableCreateDialogComponent,
    ContentWithTooltipComponent,
    ContentSpaceBetweenComponent,
    CollectionExtensionButtonComponent,
    ConnectedDropdownComponent,
    SelectKleDialogComponent,
    DividerComponent,
    StandardVerticalContentGridComponent,
    IconButtonComponent,
    ExternalReferencesManagementComponent,
    ExternalReferenceDialogComponent,
    CreateExternalReferenceDialogComponent,
    EditExternalReferenceDialogComponent,
    TableRowActionsComponent,
    RadioButtonsComponent,
    NumericInputComponent,
    FormGridComponent,
    ContentVerticalCenterComponent,
    NotificationsTableComponent,
    NotificationsTableDialogComponent,
    ScrollbarDialogComponent,
    AccordionComponent,
    LinkTextboxComponent,
    OverviewHeaderComponent,
    InfoDialogComponent,
    IconConfirmationDialogComponent,
    DialogHeaderComponent,
    LinkWriteDialogComponent,
    ConnectedDropdownDialogComponent,
    CreateEntityWithNameDialogComponent,
    CreateEntityButtonComponent,
    CreateEntityDialogActionButtonsComponent,
    NotificationsTableSentDialogComponent,
    DropdownDialogComponent,
    DetailsHeaderComponent,
    ContentWithInfoComponent,
    DateFilterComponent,
    NumericFilterComponent,
    StringFilterComponent,
    HideShowButtonComponent,
    HideShowDialogComponent,
    DropdownFilterComponent,
    UnitDropdownFilterComponent,
    ChoiceTypeDropdownFilterComponent,
    MenuButtonComponent,
    MenuButtonItemComponent,
    GridOptionsButtonComponent,
    DropdownColumnDataFilterComponent,
    GridUsagesDialogComponent,
    UsageLinkComponent,
    LocalAdminColumnConfigButtonComponent,
    ExportMenuButtonComponent,
    CreateSubunitDialogComponent,
    DragAndDropTreeComponent,
    ResetToOrgColumnsConfigButtonComponent,
    RoleRowComponent,
    CheckboxButtonComponent,
    RoleTableContainerComponent,
    NumberCircleComponent,
    BooleanCircleComponent,
    SlideToggleComponent,
    VerticalContentGridSectionMarginLeftComponent,
    MultiSelectDropdownComponent,
    SnackbarActionsComponent,
    AccordionHeaderComponent,
    LocalOptionTypeViewComponent,
    EditLocalOptionTypeDialogComponent,
    NavigationDrawerComponent,
    IconComponent,
    LocalGridComponent,
    NavigationDrawerComponent,
    IconComponent,
    FileInputComponent,
    GlobalOptionTypeViewComponent,
    GlobalOptionTypeDialogComponent,
    UserDropdownComponent,
    OrganizationDropdownComponent,
    EditHelpTextDialogComponent,
    CreateHelpTextDialogComponent,
    OptionTypeDropdownComponent,
    RichTextEditorComponent,
    LocalOptionGridComponent,
    UsageProxyCheckboxComponent,
    GlobalOptionTypeGridComponent,
    ToggleButtonComponent,
    GridFilterButtonsComponent,
    GridColumnConfigButtonsComponent,
    GridUsagesDropdownDialogComponent,
    GridUsagesConsequencesDialogComponent,
    UsageMigrationConsequencesTableComponent,
    UsageMigrationRelationConsequencesTableComponent,
    UsageMigrationSystemConsequencesTableComponent,
    SectionComponent,
    ReadonlyLinkTextboxComponent,
    GridCellComponent,
    TextCellComponent,
    StatusCellComponent,
    ThousandSeperatorCellComponent,
    DefaultWrapCellComponent,
    PrimaryCellComponent,
    BooleanCellComponent,
    DateCellComponent,
    EnumCellComponent,
    LinkCellComponent,
    TitleLinkCellComponent,
    PageLinkCellComponent,
    CheckboxCellComponent,
    UsagesCellComponent,
    PageLinkArrayCellComponent,
    UuidToNameCellComponent,
    ActionButtonsCellComponent,
    DetailsPageLinkWithTooltipComponent,
    AuditCellComponent,
    BulkActionDialogComponent,
    BulkActionDialogSectionComponent,
    ContractsDropdownComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    NgSelectModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    IconsModule,
    PipesModule,
    DirectivesModule,
    RouterModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatTreeModule,
    MatDividerModule,
    MatExpansionModule,
    MatRadioModule,
    EditorModule,
    MatProgressSpinnerModule,
    GridModule,
    ExcelModule,
    DropDownsModule,
    MatMenuModule,
    DragDropModule,
    MatSlideToggleModule,
    InputsModule,
  ],
  exports: [
    CommonModule,
    IconsModule,
    ButtonComponent,
    CheckboxComponent,
    GridComponent,
    GridPaginatorComponent,
    LoadingComponent,
    TextBoxComponent,
    TextAreaComponent,
    DropdownComponent,
    DatePickerComponent,
    TextBoxComponent,
    BreadcrumbsComponent,
    ChipComponent,
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    DialogComponent,
    ScrollbarDialogComponent,
    DialogActionsComponent,
    SegmentComponent,
    TextBoxInfoComponent,
    ContentBoxComponent,
    ExternalReferenceComponent,
    ParagraphComponent,
    DetailsPageLinkComponent,
    NativeTableComponent,
    HelpButtonComponent,
    SelectedOptionTypeTextComponent,
    ExternalPageLinkComponent,
    SpacerComponent,
    PopupMessageComponent,
    PopupMessagesComponent,
    TooltipComponent,
    BreadcrumbComponent,
    EntityTreeComponent,
    EmptyStateComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    RoleTableComponent,
    ContentWithTooltipComponent,
    ContentSpaceBetweenComponent,
    CollectionExtensionButtonComponent,
    StandardVerticalContentGridComponent,
    ConnectedDropdownComponent,
    IconButtonComponent,
    ExternalReferencesManagementComponent,
    TableRowActionsComponent,
    AccordionComponent,
    RadioButtonsComponent,
    NumericInputComponent,
    FormGridComponent,
    ContentVerticalCenterComponent,
    NotificationsTableComponent,
    NotificationsTableDialogComponent,
    LinkTextboxComponent,
    LinkTextboxComponent,
    OverviewHeaderComponent,
    InfoDialogComponent,
    IconConfirmationDialogComponent,
    DialogHeaderComponent,
    LinkWriteDialogComponent,
    ConnectedDropdownDialogComponent,
    CreateEntityButtonComponent,
    CreateEntityDialogActionButtonsComponent,
    DropdownDialogComponent,
    DetailsHeaderComponent,
    ContentWithInfoComponent,
    HideShowButtonComponent,
    MenuButtonComponent,
    MenuButtonItemComponent,
    LocalAdminColumnConfigButtonComponent,
    ExportMenuButtonComponent,
    GridOptionsButtonComponent,
    CreateSubunitDialogComponent,
    DragAndDropTreeComponent,
    ResetToOrgColumnsConfigButtonComponent,
    RoleRowComponent,
    CheckboxButtonComponent,
    RoleTableContainerComponent,
    NumberCircleComponent,
    BooleanCircleComponent,
    DividerComponent,
    SlideToggleComponent,
    VerticalContentGridSectionMarginLeftComponent,
    MultiSelectDropdownComponent,
    SnackbarActionsComponent,
    AccordionHeaderComponent,
    LocalOptionTypeViewComponent,
    NavigationDrawerComponent,
    IconComponent,
    LocalGridComponent,
    FileInputComponent,
    GlobalOptionTypeViewComponent,
    GlobalOptionTypeDialogComponent,
    UserDropdownComponent,
    OrganizationDropdownComponent,
    EditHelpTextDialogComponent,
    CreateHelpTextDialogComponent,
    OptionTypeDropdownComponent,
    RichTextEditorComponent,
    LocalOptionGridComponent,
    UsageProxyCheckboxComponent,
    ToggleButtonComponent,
    GridUsagesDropdownDialogComponent,
    GridUsagesConsequencesDialogComponent,
    UsageMigrationConsequencesTableComponent,
    SectionComponent,
    DetailsPageLinkWithTooltipComponent,
    ContractsDropdownComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnInvalidErrorStateMatcher },
    {
      provide: MAT_DIALOG_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'mat-typography',
        autoFocus: false,
        width: DIALOG_DEFAULT_WIDTH,
      },
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD-MM-yyyy', 'DDMMyyyy'],
        },
        display: {
          dateInput: 'DD-MM-yyyy',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class ComponentsModule {}
