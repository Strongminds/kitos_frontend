import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { NgMultiLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown/multi-select-dropdown.component';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';
import { ConnectedDropdownComponent } from '../connected-dropdown/connected-dropdown.component';
import { map, Observable, pairwise, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-connected-multi-select-dropdown',
  imports: [
    MultiSelectDropdownComponent,
    AsyncPipe,
    FormsModule,
    NgSelectComponent,
    NgOptionTemplateDirective,
    NgMultiLabelTemplateDirective,
    ParagraphComponent,
  ],
  templateUrl: './connected-multi-select-dropdown.component.html',
  styleUrl: './connected-multi-select-dropdown.component.scss',
})
export class ConnectedMultiSelectDropdownComponent<T extends MultiSelectDropdownItem<U>, U> extends BaseComponent {

@Input() public text!: string;
  @Input() public textField: string = 'name';
  @Input() public itemDescriptionField: string = 'description';
  @Input() public valueField!: string;
  @Input() public data$?: Observable<T[]>;
  @Input() public isLoading$?: Observable<boolean>;
  @Input() public showSearchHelpText$?: Observable<boolean>;
  @Input() public formGroup!: FormGroup<any>;
  @Input() public formName!: string;
  @Input() public includeItemDescription = false;
  @Input() public addTag = false;
  @Input() public addTagText = $localize`Vælg`;
  @Output() public filterChange = new EventEmitter<string>();
  @Output() public valueChange = new EventEmitter<string>();

  private searchTermsSource$ = new Subject<string | undefined>();
  private lastTwoSearchTerms$ = this.searchTermsSource$.pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]) => ({ previous: previous, current: current })),
  );

  ngOnInit() {
    this.filterChange.emit(undefined);
    this.subscriptions.add(
      this.lastTwoSearchTerms$.subscribe((terms) => {
        if (terms.previous != terms.current) {
          this.filterChange.emit(terms.current);
        }
      }),
    );
  }

  //since the dropdown is filtered externally, accept every item
  public externalSearch(_: string, __: any) {
    return true;
  }

  public onValueChange(selectedUuid?: string) {
    this.valueChange.emit(selectedUuid);
  }

  public onFilterChange(searchTerm?: string) {
    this.publishActiveSearchTerm(searchTerm);
  }

  public onFocus() {
    this.resetActiveSearchTerm();
  }

  private publishActiveSearchTerm(term?: string) {
    this.searchTermsSource$.next(term);
  }

  public onOpen() {
    this.resetActiveSearchTerm();
  }

  private resetActiveSearchTerm() {
    this.publishActiveSearchTerm();
  }
}
