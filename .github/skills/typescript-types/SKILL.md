---
name: typescript-types
description: Extract and reuse shared TypeScript types and named values in KITOS when contracts, statuses, or dialog results repeat across components, services, or templates.
---

# TypeScript types

- Search for an existing definition and its consumers before introducing a type. Place type files under `src/app/shared/models/` in the matching domain subdirectory when one exists. Keep types used only by a local implementation inline unless the task calls for extracting them.
- Define values that drive behavior, such as review statuses and dialog outcomes, once. Reuse an existing enum or derive the type from a named `as const` object. Use the same values in producers, comparisons, and Angular templates. Preserve existing literal values and discriminated-union narrowing.
- Import types and values directly from their owning model file. Use type-only imports for symbols erased at runtime. Reuse the named type for a shared component input in its callers.
- Keep localized labels with the UI that displays them. Preserve translation markup and timing when moving labels.
- Use `src/app/shared/models/organization/organization-user/user-deletion-review.types.ts` as an example of a contract shared by a service, dialogs, and a dialog opener.
- After an extraction, search for old definitions and in-scope literal comparisons. Run the Angular type and template checks.
