---
title: Accessibility
description: Accessible compound components for Svelte 5, matching Base UI behavior where possible.
---

`base-ui-svelte` aims for the same accessibility model as Base UI: correct roles, keyboard support, focus management, and `aria-*` relationships on compound parts.

## What this port provides

- Headless components with the same part structure as Base UI React
- `data-*` state attributes for styling (`data-open`, `data-disabled`, …)
- Focus traps, dismiss, and portals for overlays (Dialog, Menu, Popover, …)

## Svelte-specific notes

- Prefer native elements and the library’s built-in keyboard handling over custom ARIA
- Use `bind:` / `on*Change` so assistive tech stays in sync with controlled state
- See [Differences](/handbook/differences) for `class`, snippets, and `render` tag strings

Upstream: [Base UI Accessibility](https://base-ui.com/react/overview/accessibility).
