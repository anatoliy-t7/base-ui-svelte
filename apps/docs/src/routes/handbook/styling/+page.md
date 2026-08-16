---
title: Styling
description: Style headless parts with data attributes, class names, and the optional @base-ui-svelte/styles package. Base UI React has no official styles package.
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

### Selective imports

```css
@import 'tailwindcss';
@import '@base-ui-svelte/styles/components/button.css' layer(components);
@import '@base-ui-svelte/styles/themes/default' layer(theme);
```

Upstream concepts: [Base UI Styling](https://base-ui.com/react/handbook/styling).
