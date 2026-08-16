<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogContext, DialogTitleProps } from './types.js';

	let { class: className, style, children, ...rest }: DialogTitleProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.titleId,
			class: className,
			style,
		}),
	);
</script>

<h2 {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</h2>
