---
name: ngrx-store
description: Creates, modifies, and debugs NgRx feature stores in the KITOS frontend following the project's exact patterns. Use when adding new state, new actions/effects/selectors, or debugging store-related issues.
---

# NgRx Store Agent

You are an expert in the KITOS frontend NgRx store layer. You know every convention, every required registration step, and every pitfall.

## Store Architecture

All feature stores live under `src/app/store/`. Each feature follows this file structure:

```
src/app/store/<feature-name>/
├── actions.ts       # createActionGroup — all actions for this feature
├── effects.ts       # @Injectable() class with createEffect() members
├── reducer.ts       # createFeature() with createReducer() + on() handlers; exports adapter and initialState
├── selectors.ts     # createSelector() functions derived from the feature's selectXxxState
└── state.ts         # TypeScript interface for the feature state
```

Sub-stores exist for complex features (e.g. `organization/organization-unit/`, `it-system-usage/gdpr-report/`). Follow the same structure inside the parent folder.

## File Conventions

### `state.ts`
- Export a `interface XxxState` (never a class)
- If the state holds a list of entities, extend `EntityState<T>` from `@ngrx/entity`
- All fields must be **serializable** — no `Date` objects, no `Map`/`Set`, no functions (NgRx strict runtime checks will throw)
- Use `Cached<T>` from `src/app/shared/models/cache-item.model` for data that needs cache-validity tracking
- Common patterns to include when relevant:
  - `total: number` — total count for paginated lists
  - `isLoadingXxxQuery: boolean` — loading flag for list fetches
  - `gridState: GridState` and `previousGridState: GridState` — for overview grids
  - `gridColumns: GridColumn[]` and `gridRoleColumns: GridColumn[]` — for configurable grid columns
  - `permissions: APICombinedPermissionsResponseDTO | undefined` — per-entity permissions
  - `collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined` — create permission
  - `isPatching: boolean`, `isCreating: boolean`, `isRemoving: boolean` — mutation loading flags

### `actions.ts`
- Use `createActionGroup` with a `source` string matching the feature name in PascalCase
- Event names use Title Case (they become camelCase properties automatically)
- Use `props<{...}>()` for actions with payloads, `emptyProps()` for actions with no payload
- Naming convention: `'Get Xxx'` / `'Get Xxx Success'` / `'Get Xxx Error'` for async operations
- Example:
  ```ts
  export const XxxActions = createActionGroup({
    source: 'Xxx',
    events: {
      'Get Xxx': props<{ id: string }>(),
      'Get Xxx Success': props<{ xxx: APIXxxResponseDTO }>(),
      'Get Xxx Error': emptyProps(),
      'Patch Xxx': props<{ uuid: string; request: APIPatchXxxRequestDTO }>(),
      'Patch Xxx Success': props<{ xxx: APIXxxResponseDTO }>(),
      'Patch Xxx Error': emptyProps(),
    },
  });
  ```

### `reducer.ts`
- Use `createEntityAdapter<T>()` if the state extends `EntityState<T>`, otherwise skip
- Export `xxxAdapter` (entity adapter) and `xxxInitialState` — both are imported by `meta/reset.reducer.ts`
- Use `createFeature({ name: 'Xxx', reducer: createReducer(initialState, on(...), ...) })`
- The `name` string becomes the store slice key — use PascalCase matching the feature (e.g. `'ITSystemUsage'`, `'DataProcessing'`)
- Each `on()` handler must explicitly type its return as `XxxState` to satisfy strict mode:
  ```ts
  on(XxxActions.getXxx, (state): XxxState => ({ ...state, isLoading: true }))
  ```
- For entity operations use adapter methods: `adapter.setAll(items, state)`, `adapter.upsertOne(item, state)`, `adapter.removeOne(id, state)`

### `selectors.ts`
- Import the feature's `selectXxxState` from the `createFeature` export in `reducer.ts`
- Build all selectors with `createSelector`
- For selectors with parameters (e.g. per-field permissions), use `memoize` from `lodash`:
  ```ts
  export const selectXxxFieldPermission = memoize((field: string) =>
    createSelector(selectXxxState, (state) => ...)
  );
  ```

### `effects.ts`
- `@Injectable()` class — no `providedIn`
- Constructor uses `@Inject(ServiceToken)` for auto-generated API services (never `inject()`)
- Standard effect pattern:
  ```ts
  getXxx$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(XxxActions.getXxx),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ id }, orgUuid]) =>
        this.apiService.getSomething({ id }).pipe(
          map((response) => XxxActions.getXxxSuccess({ xxx: response })),
          catchError(() => of(XxxActions.getXxxError())),
        )
      ),
    );
  });
  ```
- Use `switchMap` for single-item fetches (cancels previous), `mergeMap` for parallel operations, `concatMap` for sequential
- Always terminate with `catchError(() => of(XxxActions.someError()))` — never let an effect stream die

## Required Registration Steps

When creating a **new** feature store, you must complete ALL of the following:

### 1. Register in `src/app/store/root-store.module.ts`
Add both:
```ts
StoreModule.forFeature(xxxFeature),
// in the StoreModule.forFeature list

EffectsModule.forFeature([XxxEffects]),
// in the EffectsModule.forFeature list
```

### 2. Register in `src/app/store/meta/reset.reducer.ts`
Decide: should this state be **reset when the user switches organisation**?

- **Yes (almost always):** Add to `initialStateDependingOnOrganization` inside `resetReducer`:
  ```ts
  import { xxxFeature, xxxInitialState } from '../xxx/reducer';
  // ...
  const initialStateDependingOnOrganization = {
    // ...existing entries...
    [xxxFeature.name]: xxxInitialState,
  };
  ```
- **No (truly global data like `user`, `kle`):** Add directly in the `resetStateAction` case only.

### 3. Check `src/app/store/meta/local-storage-sync.reducer.ts`
Decide: should any state keys be **persisted to localStorage** across sessions?

- Grid column configuration and grid state are typically persisted
- Sensitive data, loading flags, and entity data should NOT be persisted
- If you need persistence, add the feature name and the specific keys to the `localStorageSyncReducer` config

## Debugging Checklist

When debugging store issues:

1. **State not updating?** Check: is the action being dispatched? Is the `on()` handler present in the reducer? Is the feature registered in `root-store.module.ts`?
2. **Effect not firing?** Check: is `ofType` using the correct action? Is the Effects class in `EffectsModule.forFeature`? Did the Observable stream die (missing `catchError`)?
3. **Serialization error?** Check: does state contain `Date`, `Map`, `Set`, class instances, or functions? Replace with serializable equivalents (ISO strings, plain objects, arrays).
4. **Stale state after org switch?** Check: is the feature registered in `initialStateDependingOnOrganization` in `reset.reducer.ts`?
5. **Selector returning undefined?** Check: is `selectXxxState` imported from the reducer's `createFeature` export (not manually constructed)?
6. **localStorage not restoring?** Check: `local-storage-sync.reducer.ts` — the feature name must exactly match `createFeature`'s `name` string.

## Strict Mode Reminders

- All state interfaces must satisfy `strictStateSerializability` — no non-serializable types
- Return types in `on()` handlers must be explicit: `(state): XxxState => ...`
- Effects class members are not injected via `inject()` — always use constructor + `@Inject()`
- Never export mutable state — always spread: `{ ...state, field: newValue }`
