import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, pairwise, startWith, Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-connected-multi-select-dropdown',
  imports: [MultiSelectDropdownComponent, AsyncPipe, FormsModule],
  templateUrl: './connected-multi-select-dropdown.component.html',
  styleUrl: './connected-multi-select-dropdown.component.scss',
})
export class ConnectedMultiSelectDropdownComponent<T> extends BaseComponent {
  @Input() public text!: string;
  @Input() public textField: string = 'name';
  @Input() public itemDescriptionField: string = 'description';
  @Input() public valueField!: string;
  @Input() public data$?: Observable<MultiSelectDropdownItem<T>[]>;
  @Input() public isLoading$?: Observable<boolean>;
  @Input() public showSearchHelpText$?: Observable<boolean>;
  @Input() public includeItemDescription = false;
  @Input() public addTag = false;
  @Input() public addTagText = $localize`Vælg`;
  @Input() public resetSubject$?: Subject<void>;
  @Output() public filterChange = new EventEmitter<string>();
  @Output() public valueChange = new EventEmitter<T[]>();

  private searchTermsSource$ = new Subject<string | undefined>();
  private lastTwoSearchTerms$ = this.searchTermsSource$.pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]) => ({ previous: previous, current: current }))
  );

  ngOnInit() {
    this.filterChange.emit(undefined);
    this.subscriptions.add(
      this.lastTwoSearchTerms$.subscribe((terms) => {
        if (terms.previous != terms.current) {
          this.filterChange.emit(terms.current);
        }
      })
    );
  }

  //since the dropdown is filtered externally, accept every item
  public externalSearch(_: string, __: any) {
    return true;
  }

  public onValueChange(value?: any) {
    this.valueChange.emit(value);
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
