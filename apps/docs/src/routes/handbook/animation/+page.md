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

## Experiments

Optional motion recipes in `@base-ui-svelte/styles/motions`. Headless components stay unstyled; these are opt-in CSS plus small helpers that set `data-*` attributes during interaction.

<script>
	import ComponentPreview from '$lib/ComponentPreview.svelte';
	import Demo from './demo.svelte';
	import demoSource from './demo.svelte?raw';
</script>

<ComponentPreview code={demoSource}>

{#snippet preview()}
<Demo />
{/snippet}

</ComponentPreview>

### Install

Import the motions bundle alongside the main styles package (or on its own if you only need motion CSS):

```css
@import '@base-ui-svelte/styles/motions';
```

### Button press motion

Based on [yui540 motion #50](https://yui540.com/motions/50) — a two-layer button (shadow base + floating face) with press and release keyframes.

#### Classes

| Class                     | Role                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `btn-motion-press`        | Base two-layer layout and tokens                                  |
| `btn-motion-press-plus`   | Press down + bounce release                                       |
| `btn-motion-press__icon`  | Icon layer that moves with the face                               |
| `btn-motion-press__label` | Text label centered on the face                                   |
| `btn-motion-press__sizer` | Hidden in-flow sizer for text button width (`aria-hidden="true"`) |

Pair with existing `btn` classes from [Styling](/handbook/styling).

#### Attachment

Use Svelte 5 `{@attach}` with a stable reference — create the attachment once in script, not inline in the template:

```svelte
<script>
	import { Button } from 'base-ui-svelte/button';
	import { buttonMotionPress } from '@base-ui-svelte/styles';

	const attachButtonMotionPress = buttonMotionPress();
</script>

<Button
	class="btn btn-primary btn-lg btn-motion-press btn-motion-press-plus"
	{@attach attachButtonMotionPress}
>
	<span class="btn-motion-press__sizer" aria-hidden="true">Save</span>
	<span class="btn-motion-press__label">Save</span>
</Button>
```

`buttonMotionPress()` listens for pointer and keyboard (Space / Enter), toggles `data-motion-phase="press"` / `"release"`, and respects `prefers-reduced-motion`.

#### TypeScript recipe

`buttonMotionVariants` from `@base-ui-svelte/styles` maps motion variants to the class names above if you use `tailwind-variants` in your app.
