<script lang="ts">
	import { getContext } from 'svelte';
	import { CHECKBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CheckboxContext, CheckboxIndicatorProps } from './types.js';

	let {
		keepMounted = false,
		class: className,
		style,
		children,
		...rest
	}: CheckboxIndicatorProps = $props();

	const ctx = getContext<CheckboxContext>(CHECKBOX_CONTEXT);

	const visible = $derived(ctx.checked || ctx.indeterminate);
	const shouldRender = $derived(keepMounted || visible);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			hidden: keepMounted && !visible ? true : undefined,
			'data-checked': ctx.checked ? '' : undefined,
			'data-unchecked': !ctx.checked && !ctx.indeterminate ? '' : undefined,
			'data-indeterminate': ctx.indeterminate ? '' : undefined,
			'data-disabled': ctx.disabled ? '' : undefined,
		}),
	);
</script>

{#if shouldRender}
	<span
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				{#if ctx.indeterminate}
					<path d="M4 8h8" stroke="currentColor" stroke-width="2" />
				{:else}
					<path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" fill="none" />
				{/if}
			</svg>
		{/if}
	</span>
{/if}
