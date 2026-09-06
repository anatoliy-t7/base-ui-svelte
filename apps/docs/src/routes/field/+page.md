---
title: Field
description: 'A form control with label, description, and validation messaging.'
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

## Validation notes

- Controlled `Field.Control` / `Input` values sync filled and dirty state when the prop changes (not only on input).
- While an async `validate` is in flight, validity is neutral (`valid: null`) unless a native constraint already fails, or a prior custom error is kept in `onBlur` / `onChange` modes.
- Field only clears custom validity messages it owns; foreign `setCustomValidity` messages are restored when Field’s message is cleared.

## API Reference

<ApiReference slug="field" />
