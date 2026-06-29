import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { APIArchiveReferenceResponseDTO, APIShallowOrganizationResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { CardHeaderComponent } from 'src/app/shared/components/card-header/card-header.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { organizationNameWithCvr } from 'src/app/shared/helpers/string.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageArchive } from 'src/app/store/it-system-usage-archive/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectItSystemName } from 'src/app/store/it-system/selectors';
import { EditUrlSectionComponent } from '../../../shared/edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-it-system-usage-archive-details-frontpage',
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
  templateUrl: './it-system-usage-archive-details-frontpage.component.html',
  styleUrl: './it-system-usage-archive-details-frontpage.component.scss',
})
export class ItSystemUsageArchiveDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly itSystemUsageArchive$ = this.store.select(selectItSystemUsageArchive).pipe(filterNullish());
  public readonly currentItSystemName$ = this.store.select(selectItSystemName).pipe(filterNullish());

  public readonly archiveForm = new FormGroup({
    takenIntoUsageDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    archivingDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    referenceName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    note: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    archiveReferences: new FormArray([this.createReferenceFormGroup()]),
    legacyName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    localName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    localId: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    organization: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    currentSystemName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

  constructor(private readonly store: Store) {
    super();
  }

  private setupArchiveReferenceFormGroups(referenceDtos: APIArchiveReferenceResponseDTO[]) {
    if (referenceDtos.length === 0) return;

    const dtoReferenceFormGroups = referenceDtos.map(
      (dto) =>
        new FormGroup({
          name: new FormControl<string | undefined>(dto.name ?? ''),
          url: new FormControl<string | undefined>(dto.url ?? ''),
        }),
    );
    this.archiveReferences.clear();
    dtoReferenceFormGroups.forEach((formGroup) => this.archiveReferences.push(formGroup));
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.itSystemUsageArchive$
        .pipe(
          map((usageArchive) => {
            this.store.dispatch(ITSystemActions.getITSystem(usageArchive.itSystemUuid));
          }),
        )
        .subscribe(),
    );

    this.subscriptions.add(
      combineLatest([this.itSystemUsageArchive$, this.currentItSystemName$]).subscribe(
        ([usageArchive, currentItSystemName]) => {
          this.archiveForm.patchValue({
            takenIntoUsageDate: usageArchive.takenIntoUsageDate
              ? new Date(usageArchive.takenIntoUsageDate)
              : undefined,
            archivingDate: usageArchive.archivingDate ? new Date(usageArchive.archivingDate) : undefined,
            referenceName: usageArchive.referenceName,
            note: usageArchive.note,
            legacyName: usageArchive.legacyName,
            localName: usageArchive.localName,
            localId: usageArchive.localId,
            organization: this.getOrganizationName(usageArchive.organization),
            currentSystemName: currentItSystemName,
          });
          this.setupArchiveReferenceFormGroups(usageArchive.archiveReferences ?? []);
        },
      ),
    );
  }

  private getOrganizationName(organization: APIShallowOrganizationResponseDTO | undefined) {
    if (!organization) return '';
    return organizationNameWithCvr(organization.name, organization.cvr);
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
