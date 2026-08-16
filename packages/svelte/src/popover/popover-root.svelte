<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { POPOVER_CONTEXT } from '../internal/context-keys.js';
	import { createHoverDelay } from '../internal/hover-delay.svelte.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PopoverContext, PopoverRefs, PopoverRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		openOnHover = false,
		delay = 0,
		closeDelay = 0,
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
	const hover = createHoverDelay(
		() => delay,
		() => closeDelay
	);

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

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		hover.cancel();
		state.setOpen(next, reason);
	}

	function openWithHoverDelay(reason: OpenChangeReason): void {
		if (state.open) {
			hover.cancel();
			return;
		}
		hover.openWithDelay(() => {
			state.setOpen(true, reason);
		});
	}

	function closeWithHoverDelay(reason: OpenChangeReason): void {
		hover.closeWithDelay(() => {
			state.setOpen(false, reason);
		});
	}

	function cancelHover(): void {
		hover.cancel();
	}

	$effect(() => {
		return () => {
			hover.dispose();
		};
	});

	setContext(POPOVER_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen,
		openWithHoverDelay,
		closeWithHoverDelay,
		cancelHover,
		get openOnHover() {
			return openOnHover;
		},
		get delay() {
			return delay;
		},
		get closeDelay() {
			return closeDelay;
		},
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
