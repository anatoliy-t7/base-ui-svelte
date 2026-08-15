<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { COMBOBOX_CONTEXT, COMBOBOX_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ComboboxContext,
		ComboboxGroupContext,
		ComboboxGroupProps
	} from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ComboboxGroupProps = $props();

	getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	let labelId = $state<string | undefined>(undefined);

	setContext(COMBOBOX_GROUP_CONTEXT, {
		get labelId() {
			return labelId;
		},
		setLabelId: (id) => {
			labelId = id;
		}
	} satisfies ComboboxGroupContext);

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
