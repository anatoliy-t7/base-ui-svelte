<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { SELECT_CONTEXT, SELECT_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectGroupContext, SelectGroupProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SelectGroupProps = $props();

	getContext<SelectContext>(SELECT_CONTEXT);

	let labelId = $state<string | undefined>(undefined);

	setContext(SELECT_GROUP_CONTEXT, {
		get labelId() {
			return labelId;
		},
		setLabelId: (id) => {
			labelId = id;
		}
	} satisfies SelectGroupContext);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'group',
			class: className,
			style,
			'aria-labelledby': labelId
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
