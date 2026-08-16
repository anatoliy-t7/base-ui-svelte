<script lang="ts">
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AlertDialogContext, AlertDialogDescriptionProps } from './types.js';

	let { class: className, style, children, ...rest }: AlertDialogDescriptionProps = $props();

	const ctx = getContext<AlertDialogContext>(ALERT_DIALOG_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.descriptionId,
			class: className,
			style,
		}),
	);
</script>

<p {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</p>
