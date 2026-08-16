# @base-ui-svelte/styles

Framework-agnostic CSS and TypeScript style recipes for [base-ui-svelte](https://github.com/anatoliy-t7/base-ui-svelte). Built on Tailwind CSS v4.

## Install

```bash
bun add @base-ui-svelte/styles tailwindcss
```

## Usage

```css
@import "@base-ui-svelte/styles";
```

Or import CSS only:

```css
@import "@base-ui-svelte/styles/css";
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
@import "tailwindcss";
@import "@base-ui-svelte/styles/components/button.css" layer(components);
@import "@base-ui-svelte/styles/themes/default" layer(theme);
```
