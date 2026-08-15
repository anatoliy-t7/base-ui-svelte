<script lang="ts">
	import { getContext } from 'svelte';
	import { SWITCH_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SwitchContext, SwitchThumbProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SwitchThumbProps = $props();

	const ctx = getContext<SwitchContext>(SWITCH_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-checked': ctx.checked ? '' : undefined,
			'data-unchecked': !ctx.checked ? '' : undefined,
			'data-disabled': ctx.disabled ? '' : undefined
		})
	);
</script>

<span {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</span>
