<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import {
		CONTEXT_MENU_CONTEXT,
		CONTEXT_MENU_GROUP_CONTEXT
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ContextMenuContext,
		ContextMenuGroupContext,
		ContextMenuGroupProps
	} from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ContextMenuGroupProps = $props();

	getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

	let labelId = $state<string | undefined>(undefined);

	setContext(CONTEXT_MENU_GROUP_CONTEXT, {
		get labelId() {
			return labelId;
		},
		setLabelId: (id) => {
			labelId = id;
		}
	} satisfies ContextMenuGroupContext);

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
