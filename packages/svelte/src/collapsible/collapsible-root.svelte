<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { COLLAPSIBLE_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CollapsibleContext, CollapsibleRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		disabled = false,
		class: className,
		style,
		id = useId('collapsible'),
		children,
		...rest
	}: CollapsibleRootProps = $props();

	const state = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
		},
		setOpenProp: (next) => {
			open = next;
		},
	});

	const presence = createPresence(() => state.open);

	const triggerId = useId('collapsible-trigger');
	const panelId = useId('collapsible-panel');

	setContext(COLLAPSIBLE_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen: state.setOpen,
		get disabled() {
			return disabled;
		},
		triggerId,
		panelId,
		presence,
	} satisfies CollapsibleContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': state.open ? '' : undefined,
			'data-closed': !state.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: state.open })}
	{/if}
</div>
