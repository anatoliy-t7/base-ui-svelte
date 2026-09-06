---
title: Avatar
description: 'An image element with a fallback for representing the user.'
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

## `Avatar.Image` `keepMounted`

Set `keepMounted` when a stacked fallback or image optimizer needs the `<img>` node to stay in the DOM even after a load error.

## API Reference

<ApiReference slug="avatar" />
