---
title: Drawer
description: 'A panel that slides in from the edge of the screen.'
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

## Canceling snap-point changes

`onSnapPointChange` receives event details. Call `cancel()` to reject a snap, including swipe-to-dismiss:

```ts
onSnapPointChange={(snapPoint, eventDetails) => {
	if (snapPoint === null) {
		eventDetails.cancel();
	}
}}
```

## API Reference

<ApiReference slug="drawer" />
