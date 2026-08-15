<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { POPOVER_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PopoverContext, PopoverRefs, PopoverRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		class: className,
		style,
		id = useId('popover'),
		children,
		...rest
	}: PopoverRootProps = $props();

	const state = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
		},
		setOpenProp: (next) => {
			open = next;
		}
	});

	const presence = createPresence(() => state.open);

	const refs: PopoverRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null
	};

	const triggerId = useId('popover-trigger');
	const titleId = useId('popover-title');
	const descriptionId = useId('popover-description');
	const popupId = useId('popover-popup');

	setContext(POPOVER_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen: state.setOpen,
		triggerId,
		titleId,
		descriptionId,
		popupId,
		refs,
		presence
	} satisfies PopoverContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': state.open ? '' : undefined,
			'data-closed': !state.open ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: state.open })}
	{/if}
</div>
