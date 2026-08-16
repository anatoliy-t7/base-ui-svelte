---
title: TypeScript
description: Strict typing with Svelte 5 props, snippets, and bindable state.
---

Component props extend Svelte’s HTML attribute types (`svelte/elements`). Optional props respect `exactOptionalPropertyTypes`.

## Patterns in this port

- `$props()` / `$bindable` for controlled values
- Snippet types for `children` and render-state children
- Namespace objects for compound components (`typeof Popover`)

Shared naming still tracks Base UI; React-specific types (`useRender.ComponentProps`, etc.) do not apply. See [Differences](/handbook/differences) and [Composition](/handbook/composition).

Upstream: [Base UI TypeScript](https://base-ui.com/react/handbook/typescript).
