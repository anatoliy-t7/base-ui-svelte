---
title: Select
description: 'Displays a list of options for the user to pick from.'
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

## `readOnly`

`readOnly` locks the value, not the interaction. The popup still opens for browsing; item presses, Enter-to-select, and closed-trigger typeahead commits stay blocked.

## API Reference

<ApiReference slug="select" />
