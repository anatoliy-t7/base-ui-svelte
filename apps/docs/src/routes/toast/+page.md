---
title: Toast
description: 'A succinct message that is displayed temporarily.'
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

## Updating toasts

`useToastManager().update` accepts a partial object or a function of the current toast. Omitted fields are preserved:

```ts
const toastManager = Toast.useToastManager();

toastManager.update(id, (prev) => ({
	title: 'Upload complete',
	description: prev.description
}));
```

## API Reference

<ApiReference slug="toast" />
