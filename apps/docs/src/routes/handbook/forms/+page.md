---
title: Forms
description: Field, Fieldset, and Form for accessible validation in Svelte.
---

Use `Field`, `Fieldset`, and `Form` from `base-ui-svelte` the same way Base UI structures form primitives.

## Svelte difference

`Form`’s `onFormSubmit` receives `(formData: FormData, event: SubmitEvent)`, not a React values object / `eventDetails` bag. See [Differences](/handbook/differences).

## Related demos

- [Field](/field)
- [Fieldset](/fieldset)
- [Form](/form)

Upstream patterns: [Base UI Forms](https://base-ui.com/react/handbook/forms).
