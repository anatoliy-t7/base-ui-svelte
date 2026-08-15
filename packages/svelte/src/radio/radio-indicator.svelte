<script lang="ts">
	import { getContext } from 'svelte';
	import { RADIO_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { RadioContext, RadioIndicatorProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: RadioIndicatorProps = $props();

	const ctx = getContext<RadioContext>(RADIO_CONTEXT);

	const visible = $derived(ctx.checked);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			hidden: !visible ? true : undefined,
			'data-checked': ctx.checked ? '' : undefined,
			'data-unchecked': !ctx.checked ? '' : undefined,
			'data-disabled': ctx.disabled ? '' : undefined
		})
	);
</script>

{#if visible}
	<span {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
		{#if children}
			{@render children()}
		{:else}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<circle cx="8" cy="8" r="4" fill="currentColor" />
			</svg>
		{/if}
	</span>
{/if}
