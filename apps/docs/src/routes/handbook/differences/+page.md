---
title: Differences
description: Where base-ui-svelte deliberately diverges from Base UI React because of Svelte.
---

Match Base UI part names, props, and `data-*` attributes unless Svelte requires a different shape. Prefer upstream docs for behavior; use this page for the Svelte mapping.

## Package and imports

- Install `base-ui-svelte` (not `@base-ui/react`).
- Import from subpaths: `import { Popover } from 'base-ui-svelte/popover'`.
- Optional visuals: [`@base-ui-svelte/styles`](/handbook/styling).

## DOM props and events

- Use `class`, not `className`.
- Use Svelte event props (`onclick`, …), not React `onClick`.
- [`mergeProps`](/utils/merge-props) concatenates `class` and composes `on*` handlers.

## Composition and children

- Children are Svelte snippets. Some parts expose state via snippet args, e.g. `children({ open })`.
- There is no React `useRender` / `nativeButton` composition API — see [Composition](/handbook/composition).

## `render` prop

Where Base UI uses render props / element cloning, this port often accepts `render?: string` and renders via `<svelte:element>`. Example: Button treats `render === 'button'` as a native button; other tags get `role="button"` and keyboard handling.

## Controlled state

Open/value/checked state supports Svelte `bind:` (`bind:open`, `bind:value`, …) plus uncontrolled `default*` and `on*Change` callbacks — same ideas as Base UI, expressed with runes and `$bindable`.

## Forms

`Form`’s `onFormSubmit` receives native `(formData: FormData, event: SubmitEvent)`. Base UI React passes a values object and richer event details — see [Forms](/handbook/forms).

## Single-part vs compound

Export shapes follow Base UI: single-part components are used directly (`<Button />`, `<Input />`, `<Form />`, `<Menubar />`, …). Compound components use a namespace with `.Root` (`<Popover.Root>`, `<Dialog.Root>`, …).

## TypeScript

Props extend Svelte HTML attribute types. See [TypeScript](/handbook/typescript) for this port’s patterns.

## Prop placement (same behavior, different parent)

Some props live on a different part than in Base UI React so the Svelte tree stays ergonomic:

- **Popover / Tooltip open delays** — configured on `Root` (React often documents them on `Trigger`).
- **OTP complete callback** — `onComplete` on `OTPField.Root` (React may use `onValueComplete`).

## Imperative APIs

- Prefer `bind:this` over React `ref` / `inputRef`.
- Prefer `handle` / `createHandle` over React `actionsRef` where the port exposes imperative control.

## Still diverging / deferred

- **List virtualization** (`virtualized` / virtualized collections on Combobox & Autocomplete) is not ported yet — highest risk; use external virtualizers with `filteredItems` / `limit` for now.
- Combobox / Select **object values** are supported via `itemToStringLabel`, `itemToStringValue`, and `isItemEqualToValue` while the public `value` remains string-based for form serialization.
