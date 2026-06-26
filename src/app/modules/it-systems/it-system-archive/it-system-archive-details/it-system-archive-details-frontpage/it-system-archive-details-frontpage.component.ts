import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { APIArchiveReferenceResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { CardHeaderComponent } from 'src/app/shared/components/card-header/card-header.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemArchive } from 'src/app/store/it-system-archive/selectors';
import { EditUrlSectionComponent } from '../../../shared/edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-it-system-archive-details-frontpage',
  imports: [
    CardComponent,
    CardHeaderComponent,
    DatePickerComponent,
    TextBoxComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
    EditUrlSectionComponent,
  ],
  templateUrl: './it-system-archive-details-frontpage.component.html',
  styleUrl: './it-system-archive-details-frontpage.component.scss',
})
export class ItSystemArchiveDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly itSystemArchive$ = this.store.select(selectItSystemArchive).pipe(filterNullish());

  public readonly archiveForm = new FormGroup({
    takenIntoUsageDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    archivingDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    referenceName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    note: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    archiveReferences: new FormArray([this.createReferenceFormGroup()]),
  });

  constructor(private readonly store: Store) {
    super();
  }

  private setupArchiveReferenceFormGroups(referenceDtos: APIArchiveReferenceResponseDTO[]) {
    if (referenceDtos.length === 0) return;

    const dtoReferenceFormGroups = referenceDtos.map(
      (dto) =>
        new FormGroup({
          name: new FormControl<string | undefined>({ value: dto.name ?? '', disabled: true }),
          url: new FormControl<string | undefined>({ value: dto.url ?? '', disabled: true }),
        }),
    );
    this.archiveReferences.clear();
    dtoReferenceFormGroups.forEach((formGroup) => this.archiveReferences.push(formGroup));
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.itSystemArchive$.subscribe((systemArchive) => {
        this.archiveForm.patchValue({
          takenIntoUsageDate: systemArchive.takenIntoUsageDate ? new Date(systemArchive.takenIntoUsageDate) : undefined,
          archivingDate: systemArchive.archivingDate ? new Date(systemArchive.archivingDate) : undefined,
          referenceName: systemArchive.referenceName,
          note: systemArchive.note,
        });
        this.setupArchiveReferenceFormGroups(systemArchive.archiveReferences ?? []);
      }),
    );
  }

  public getReferenceObservable$(index: number): Observable<SimpleLink | undefined> {
    const reference = this.archiveReferences.at(index);
    return reference.valueChanges.pipe(
      startWith(reference.value),
      map(
        ({ name, url }) =>
          ({
            name: name || undefined,
            url: url || undefined,
          }) as SimpleLink,
      ),
    );
  }

  public get archiveReferences() {
    return this.archiveForm.controls.archiveReferences;
  }

  private createReferenceFormGroup() {
    return new FormGroup({
      name: new FormControl<string | undefined>({ value: undefined, disabled: true }),
      url: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    });
  }
}
