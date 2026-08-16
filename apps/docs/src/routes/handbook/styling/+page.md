---
title: Styling
description: Style headless parts with data attributes, class names, and the optional @base-ui-svelte/styles package — including how to rewrite theme CSS variables. Base UI React has no official styles package.
---

<script>
	import InstallationBlock from '$lib/InstallationBlock.svelte';
</script>

Components expose state as `data-*` attributes (for example `data-open`, `data-closed`, `data-disabled`, `data-orientation`). Prefer those hooks over brittle class toggles of your own. `base-ui-svelte` stays unstyled; visual styles are yours or optional via `@base-ui-svelte/styles`.

## Approaches

1. **Bring your own CSS** targeting `data-*` and part class names you pass via `class`.
2. **Optional package** `@base-ui-svelte/styles` — Tailwind v4 + utility class names (`btn`, `dialog-popup`, …). See [below](#optional-styles-package).
3. **CSS-in-JS / other** — any solution works; the headless package stays unstyled.

## Svelte notes

- Pass `class` (not `className`).
- Portaled popups still receive your classes; stack them with the portal setup from [Quick start](/).

## Optional styles package

### Install

Install the styles package using a package manager.

<InstallationBlock packages={['@base-ui-svelte/styles', 'tailwindcss']} />

### Import CSS

```css
@import '@base-ui-svelte/styles';
```

Or CSS-only entry:

```css
@import '@base-ui-svelte/styles/css';
```

### Class names

Bootstrap-style modifiers (not BEM):

```html
<button class="btn btn-primary btn-sm">Save</button>
```

Compound parts use `{component}-{part}`:

```html
<div class="dialog-popup dialog-popup-md">...</div>
```

Pass classes through the headless components’ `class` prop (see demos in the sidebar).

### TypeScript recipes

```ts
import { buttonVariants, dialogVariants } from '@base-ui-svelte/styles';

buttonVariants({ size: 'sm', variant: 'primary' });
const { popup, backdrop } = dialogVariants({ size: 'md' });
```

### Dark mode

```html
<html class="dark">
	<!-- or -->
	<html data-theme="dark"></html>
</html>
```

### Rewrite CSS variables

The default theme is CSS custom properties from `@base-ui-svelte/styles/themes/default`. Override any of them **after** importing the package (on `:root`, `.dark`, or a scoped container). Prefer base tokens (`--accent`, `--radius`, `--background`, …); many hover/soft values derive from them with `color-mix`.

```css
@import '@base-ui-svelte/styles';

:root {
	--accent: oklch(0.55 0.2 145); /* your value */
}
```

Tailwind utilities read the same tokens through an `@theme inline` bridge (`--color-accent` → `var(--accent)`, …). Override the semantic names below.

#### Light (current defaults)

```css
:root,
.light,
.default,
[data-theme='light'],
[data-theme='default'] {
	color-scheme: light;

	--white: oklch(100% 0 0);
	--black: oklch(0% 0 0);
	--snow: oklch(0.9911 0 0);
	--eclipse: oklch(0.2103 0.0059 285.89);

	--spacing: 0.25rem;

	--border-width: 1px;
	--field-border-width: 1px;
	--disabled-opacity: 0.5;

	--ring-offset-width: 2px;

	--cursor-interactive: pointer;
	--cursor-disabled: not-allowed;

	--radius: 0.5rem;
	--field-radius: calc(var(--radius) * 1.5);

	--background: oklch(0.9702 0 0);
	--foreground: var(--eclipse);

	--surface: var(--white);
	--surface-foreground: var(--foreground);
	--surface-secondary: oklch(0.9524 0.0013 286.37);
	--surface-secondary-foreground: var(--foreground);
	--surface-tertiary: oklch(0.9373 0.0013 286.37);
	--surface-tertiary-foreground: var(--foreground);

	--overlay: var(--white);
	--overlay-foreground: var(--foreground);

	--muted: oklch(0.5517 0.0138 285.94);

	--scrollbar-thumb: color-mix(in oklch, var(--foreground) 15%, transparent);
	--scrollbar-track: transparent;
	--scrollbar-gutter: auto;
	--scrollbar-width: thin;
	--scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
	--scrollbar: var(--scrollbar-thumb);

	--default: oklch(94% 0.001 286.375);
	--default-foreground: var(--eclipse);

	--accent: oklch(0.55 0.19 255);
	--accent-foreground: var(--snow);

	--field-background: var(--white);
	--field-foreground: oklch(0.2103 0.0059 285.89);
	--field-placeholder: var(--muted);
	--field-border: oklch(0.86 0.01 255);

	--success: oklch(0.7329 0.1935 150.81);
	--success-foreground: var(--eclipse);

	--warning: oklch(0.7819 0.1585 72.33);
	--warning-foreground: var(--eclipse);

	--danger: oklch(0.6532 0.2328 25.74);
	--danger-foreground: var(--snow);

	--segment: var(--white);
	--segment-foreground: var(--eclipse);

	--border: oklch(0.86 0.01 255);
	--separator: oklch(0.9 0.004 286.32);
	--focus: var(--accent);
	--link: var(--accent);

	--backdrop: oklch(0.2 0.02 255 / 45%);

	--surface-hover: color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%);
	--background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%);
	--background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%);
	--background-inverse: var(--foreground);

	--default-hover: color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%);
	--accent-hover: color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%);
	--success-hover: color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%);
	--warning-hover: color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%);
	--danger-hover: color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%);

	--field-hover: color-mix(
		in oklab,
		var(--field-background, var(--default)) 90%,
		var(--field-foreground, var(--foreground)) 2%
	);
	--field-focus: var(--field-background, var(--default));
	--field-border-hover: color-mix(
		in oklab,
		var(--field-border, var(--border)) 88%,
		var(--field-foreground, var(--foreground)) 10%
	);
	--field-border-focus: color-mix(
		in oklab,
		var(--field-border, var(--border)) 74%,
		var(--field-foreground, var(--foreground)) 22%
	);

	--default-soft: color-mix(in oklab, var(--default) 50%, transparent);
	--default-soft-foreground: var(--default-foreground);
	--default-soft-hover: color-mix(in oklab, var(--default) 60%, transparent);

	--accent-soft: color-mix(in oklab, var(--accent) 15%, transparent);
	--accent-soft-foreground: color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%);
	--accent-soft-hover: color-mix(in oklab, var(--accent) 20%, transparent);

	--danger-soft: color-mix(in oklab, var(--danger) 15%, transparent);
	--danger-soft-foreground: color-mix(in oklab, var(--danger) 70%, var(--foreground) 40%);
	--danger-soft-hover: color-mix(in oklab, var(--danger) 20%, transparent);

	--warning-soft: color-mix(in oklab, var(--warning) 15%, transparent);
	--warning-soft-foreground: color-mix(in oklab, var(--warning) 80%, var(--foreground) 70%);
	--warning-soft-hover: color-mix(in oklab, var(--warning) 20%, transparent);

	--success-soft: color-mix(in oklab, var(--success) 15%, transparent);
	--success-soft-foreground: color-mix(in oklab, var(--success) 80%, var(--foreground) 60%);
	--success-soft-hover: color-mix(in oklab, var(--success) 20%, transparent);

	--separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%);
	--separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%);
	--border-secondary: color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%);
	--border-tertiary: color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%);

	--surface-shadow:
		0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06);
	--overlay-shadow: 0 4px 16px 0 rgba(24, 24, 27, 0.08), 0 8px 24px 0 rgba(24, 24, 27, 0.09);
	--field-shadow:
		0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06);
}
```

#### Dark (current defaults)

```css
.dark,
[data-theme='dark'] {
	color-scheme: dark;

	--background: oklch(12% 0.005 285.823);
	--foreground: var(--snow);

	--surface: oklch(0.2103 0.0059 285.89);
	--surface-foreground: var(--foreground);
	--surface-secondary: oklch(0.257 0.0037 286.14);
	--surface-tertiary: oklch(0.2721 0.0024 247.91);

	--overlay: oklch(0.2103 0.0059 285.89);
	--overlay-foreground: var(--foreground);

	--muted: oklch(70.5% 0.015 286.067);

	--default: oklch(27.4% 0.006 286.033);
	--default-foreground: var(--snow);

	--field-background: oklch(0.2103 0.0059 285.89);
	--field-foreground: var(--foreground);
	--field-border: oklch(0.35 0.01 255);

	--warning: oklch(0.8203 0.1388 76.34);
	--warning-foreground: var(--eclipse);

	--danger: oklch(0.594 0.1967 24.63);
	--danger-foreground: var(--snow);

	--segment: oklch(0.3964 0.01 285.93);
	--segment-foreground: var(--foreground);

	--border: oklch(28% 0.006 286.033);
	--separator: oklch(25% 0.006 286.033);
	--focus: var(--accent);
	--link: var(--accent);

	--backdrop: oklch(0 0 0 / 60%);

	--surface-shadow: 0 0 0 0 transparent;
	--overlay-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.3) inset;
	--field-shadow: 0 0 0 0 transparent;

	--surface-hover: color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%);
	--background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%);
	--background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%);
	--background-inverse: var(--foreground);

	--default-hover: color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%);
	--accent-hover: color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%);
	--success-hover: color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%);
	--warning-hover: color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%);
	--danger-hover: color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%);

	--field-hover: color-mix(
		in oklab,
		var(--field-background, var(--default)) 90%,
		var(--field-foreground, var(--foreground)) 2%
	);
	--field-focus: var(--field-background, var(--default));
	--field-border-hover: color-mix(
		in oklab,
		var(--field-border, var(--border)) 88%,
		var(--field-foreground, var(--foreground)) 10%
	);
	--field-border-focus: color-mix(
		in oklab,
		var(--field-border, var(--border)) 74%,
		var(--field-foreground, var(--foreground)) 22%
	);

	--default-soft: color-mix(in oklab, var(--default) 50%, transparent);
	--default-soft-foreground: var(--default-foreground);
	--default-soft-hover: color-mix(in oklab, var(--default) 60%, transparent);

	--accent-soft: color-mix(in oklab, var(--accent) 12%, transparent);
	--accent-soft-foreground: color-mix(in oklab, var(--accent) 80%, var(--foreground) 30%);
	--accent-soft-hover: color-mix(in oklab, var(--accent) 16%, transparent);

	--danger-soft: color-mix(in oklab, var(--danger) 15%, transparent);
	--danger-soft-foreground: color-mix(in oklab, var(--danger) 80%, var(--foreground) 30%);
	--danger-soft-hover: color-mix(in oklab, var(--danger) 20%, transparent);

	--warning-soft: color-mix(in oklab, var(--warning) 12%, transparent);
	--warning-soft-foreground: color-mix(in oklab, var(--warning) 80%, var(--foreground) 30%);
	--warning-soft-hover: color-mix(in oklab, var(--warning) 16%, transparent);

	--success-soft: color-mix(in oklab, var(--success) 12%, transparent);
	--success-soft-foreground: color-mix(in oklab, var(--success) 80%, var(--foreground) 30%);
	--success-soft-hover: color-mix(in oklab, var(--success) 16%, transparent);

	--separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%);
	--separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%);
	--border-secondary: color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%);
	--border-tertiary: color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%);
}
```

### Selective imports

```css
@import 'tailwindcss';
@import '@base-ui-svelte/styles/components/button.css' layer(components);
@import '@base-ui-svelte/styles/themes/default' layer(theme);
```

Upstream concepts: [Base UI Styling](https://base-ui.com/react/handbook/styling).
