---
title: Animation
description: Animate open and close with CSS transitions driven by data attributes and presence.
---

Overlays and disclosures use presence so exit animations can finish before unmount. Style enter/exit with the same `data-open` / `data-closed` (and related) attributes Base UI documents.

## Tips for this port

- Prefer CSS transitions on the popup / panel parts you control with `class`
- Keep motion behind `@media (prefers-reduced-motion: no-preference)` when adding custom motion in your app
- Optional styles in `@base-ui-svelte/styles` already include enter/exit patterns for several overlays

Upstream: [Base UI Animation](https://base-ui.com/react/handbook/animation).
