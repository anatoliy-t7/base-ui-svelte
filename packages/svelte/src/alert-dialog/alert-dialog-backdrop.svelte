<script lang="ts">
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AlertDialogBackdropProps, AlertDialogContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: AlertDialogBackdropProps = $props();

	const ctx = getContext<AlertDialogContext>(ALERT_DIALOG_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				'position:fixed;inset:0;',
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
		})
	);
</script>

{#if ctx.presence.isPresent}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
