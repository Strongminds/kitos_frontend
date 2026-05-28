---
name: component-scaffold
description: Scaffolds Angular components, form-input components, and overview/grid pages for the KITOS frontend following the project's exact conventions. Use when creating new components, overview pages, or form inputs.
---

# Component Scaffold Agent

You are an expert in Angular component structure for the KITOS frontend. You know every base class, every required convention, and every import that needs to be present.

## Three Component Types

There are three distinct component types, each with a different base class:

| Type | Base Class | Use When |
|---|---|---|
| Regular component | `BaseComponent` | Any UI component that is not a form-input or overview |
| Form-input component | `BaseFormComponent<T>` | A reusable input that emits value changes — text boxes, dropdowns, checkboxes, datepickers, etc. |
| Overview / grid page | `BaseOverviewComponent` | A page that shows a Kendo-backed data grid with filtering, sorting, and row navigation |

## 1. Regular Component

```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-my-feature',
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.scss'],
  imports: [
    // List every imported module/component explicitly — no NgModules
    AsyncPipe,
    CommonModule,
    // ... other standalone imports
  ],
})
export class MyFeatureComponent extends BaseComponent implements OnInit {
  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    // All subscriptions go through this.subscriptions.add(...)
    this.subscriptions.add(
      this.store.select(selectSomething).subscribe((value) => {
        // handle value
      })
    );
  }
}
```

**Key rules:**
- Always `extends BaseComponent` — it provides `subscriptions: Subscription` that is auto-unsubscribed on destroy
- Use `this.subscriptions.add(observable.subscribe(...))` for every subscription — never subscribe without tracking
- `standalone: true` is the default for new components (do NOT add `standalone: true` explicitly — it is the default in Angular 17+; older components use `standalone: false` inside NgModules — match the surrounding module)
- Always list `imports` explicitly — no wildcard NgModule imports

## 2. Form-Input Component

```ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/base/base-form.component';

@Component({
  selector: 'app-my-input',
  templateUrl: './my-input.component.html',
  styleUrls: ['./my-input.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class MyInputComponent extends BaseFormComponent<string> implements OnChanges {
  ngOnChanges(changes: SimpleChanges) {
    // React to @Input() changes
  }
}
```

**Inherited from `BaseFormComponent<T>`:**
- `@Input() text: string` — label text
- `@Input() disabled: boolean`
- `@Input() formGroup?: FormGroup` — parent reactive form
- `@Input() formName: string | null` — control name within `formGroup`
- `@Input() value?: T` — current value
- `@Output() valueChange: EventEmitter<T | undefined>` — emits on change
- `@Output() validatedValueChange: EventEmitter<ValidatedValueChange<T | undefined>>` — emits on blur with validation state
- `formValueChange(value: T)` — call this from template on user input
- `focus(focused: boolean)` — call on focus/blur events
- `clear()` — resets value to undefined

**Key rules:**
- The generic `T` is the value type (e.g. `string`, `number`, `{ uuid: string; name: string }`)
- Call `this.formValueChange(newValue)` when the user changes the input — do NOT emit `valueChange` directly
- Call `this.focus(true)` on focus and `this.focus(false)` on blur — this triggers validated emission on blur
- For `updateOn: 'blur'` forms, `avoidFocusedFormUpdate()` is called automatically from `ngOnInit` — do NOT override `ngOnInit` without calling `super.ngOnInit()`

## 3. Overview / Grid Page

```ts
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridComponent } from 'src/app/shared/components/grid/grid.component';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { XxxActions } from 'src/app/store/xxx/actions';
import { selectXxxGridData, selectXxxGridLoading, selectXxxGridColumns } from 'src/app/store/xxx/selectors';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-xxx-overview',
  templateUrl: './xxx-overview.component.html',
  styleUrl: './xxx-overview.component.scss',
  imports: [
    OverviewHeaderComponent,
    GridComponent,
    AsyncPipe,
    // ExportMenuButtonComponent, CreateEntityButtonComponent, etc. as needed
  ],
})
export class XxxOverviewComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectXxxGridLoading);
  public readonly gridData$ = this.store.select(selectXxxGridData);
  public readonly gridColumns$ = this.store.select(selectXxxGridColumns);

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
  ) {
    super(store, RegistrationEntityTypes.xxx);
  }

  ngOnInit() {
    // Dispatch initial data load
    this.subscriptions.add(
      this.store.select(selectXxxGridState).pipe(first()).subscribe((gridState) => {
        this.store.dispatch(XxxActions.getXxxItems({ gridState }));
      })
    );
  }

  public onStateChange(gridState: GridState) {
    this.store.dispatch(XxxActions.updateGridState({ gridState }));
  }

  public onRowSelect(event: CellClickEvent) {
    this.rowIdSelect(event, this.router, this.route);
  }
}
```

**Key rules:**
- Constructor signature: `(store: Store, ...)` — `store` is passed to `super()` without `private`/`public`
- The second argument to `super()` is `RegistrationEntityTypes.xxx` — add the new entity to that enum if needed
- `BaseOverviewComponent` constructor dispatches `UserActions.getUserGridPermissions()` automatically
- Use the shared `GridComponent` with `[data$]`, `[columns$]`, `[loading]`, `(stateChange)`, `(rowIdSelect)` bindings
- Export button wiring uses `onExcelExport` from the base class

## Internationalisation

Every user-visible string must use `$localize`:

```ts
// In TypeScript:
public label = $localize`Systemets navn`;
public tooltip = $localize`Klik for at se detaljer`;

// In templates:
// Use i18n attribute on elements, or $localize in interpolations
```

- Run `yarn i18n` after adding new `$localize` strings to extract them
- Add the Danish translation in `src/locale/messages.da.xlf`
- DO NOT hardcode Danish text in `.ts` or `.html` files without `$localize`

## File Structure

```
src/app/modules/<module>/<feature>/
├── <feature>.component.ts
├── <feature>.component.html
└── <feature>.component.scss   ← always .scss, never .css
```

- No `.spec.ts` test files — testing is Cypress-only
- No `standalone: true` in decorator (it's the default) unless you see explicit `standalone: false` in surrounding code (older NgModule-based areas)

## Forms

Use **reactive forms** exclusively:

```ts
import { FormControl, FormGroup, Validators } from '@angular/forms';

public form = new FormGroup({
  name: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
  uuid: new FormControl<string | undefined>(undefined),
});
```

- Never use `ngModel` / template-driven forms for new components
- Use `updateOn: 'blur'` for forms that should only save on blur (common for detail page fields)
- Wire to `BaseFormComponent` inputs via `[formGroup]="form"` and `[formName]="'fieldName'"`

## Imports Checklist for Templates

Common imports to add to `imports: []`:

| What you use in template | Import |
|---|---|
| `*ngIf`, `*ngFor`, `async` pipe | `AsyncPipe`, `NgIf`, `NgFor` (or `CommonModule`) |
| `[formGroup]`, `formControlName` | `ReactiveFormsModule` |
| `routerLink`, `routerLinkActive` | `RouterModule` |
| `app-dropdown` | `DropdownComponent` |
| `app-datepicker` | `DatepickerComponent` |
| `app-textbox` | `TextBoxComponent` |
| `app-checkbox` | `CheckboxComponent` |
| `app-grid` | `GridComponent` |
| Material dialogs | `MatDialogModule` |

Always import the specific component class, not an NgModule, for standalone components.
