---
title: Composition
description: Compose parts with Svelte snippets and optional render tag strings.
---

Base UI React leans on a `render` prop and `useRender` for element polymorphism. In Svelte:

- Nest namespace parts (`Popover.Trigger`, `Popover.Popup`, …) as usual
- Pass children as snippets; some parts forward state (`children({ open })`)
- Where supported, set `render="a"` (or another tag) instead of cloning a React element
- There is no `useRender` hook — wrap components or use snippets for richer composition

See also [Differences](/handbook/differences).

Upstream mental model: [Base UI Composition](https://base-ui.com/react/handbook/composition).
