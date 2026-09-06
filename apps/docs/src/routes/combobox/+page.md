---
title: Combobox
description: 'An input combined with a listbox of selectable options.'
---

<script>
	import ApiReference from '$lib/api/ApiReference.svelte';
	import ComponentPreview from '$lib/ComponentPreview.svelte';
	import Demo from './demo.svelte';
	import demoSource from './demo.svelte?raw';
</script>

<ComponentPreview code={demoSource}>

{#snippet preview()}
<Demo />
{/snippet}

</ComponentPreview>

## `createItems`

Use `Combobox.createItems()` when selection should store a primitive ID while the list still renders from richer source objects:

```ts
const items = Combobox.createItems(users, {
	getValue: (user) => user.id,
	getLabel: (user) => user.name,
});

// <Combobox.Root {items}>…
```

Pass the collection to `items`. Labels resolve via `getLabel` for values present in the collection; use `itemToStringLabel` as a fallback for values outside the current data set.

## API Reference

<ApiReference slug="combobox" />
