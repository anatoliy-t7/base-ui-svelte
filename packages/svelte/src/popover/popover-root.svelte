<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason,
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
		modal = false,
		handle,
		class: className,
		style,
		id = useId('popover'),
		children,
		...rest
	}: PopoverRootProps = $props();

	const openState = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
			if (!next) {
				handle?.clearPayload();
			}
		},
		setOpenProp: (next) => {
			open = next;
		},
	});

	const presence = createPresence(() => openState.open);
	const hover = createHoverDelay(
		() => delay,
		() => closeDelay,
	);

	const refs: PopoverRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null,
	};

	const triggerId = useId('popover-trigger');
	const titleId = useId('popover-title');
	const descriptionId = useId('popover-description');
	const popupId = useId('popover-popup');

	let lastOpenChangeReason = $state<OpenChangeReason | null>(null);

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		hover.cancel();
		lastOpenChangeReason = reason;
		openState.setOpen(next, reason);
	}

	$effect(() => {
		if (!handle) return;
		return handle.attach({
			setOpen,
			getOpen: () => openState.open,
		});
	});

	function openWithHoverDelay(reason: OpenChangeReason): void {
		if (openState.open) {
			hover.cancel();
			return;
		}
		hover.openWithDelay(() => {
			lastOpenChangeReason = reason;
			openState.setOpen(true, reason);
		});
	}

	function closeWithHoverDelay(reason: OpenChangeReason): void {
		hover.closeWithDelay(() => {
			lastOpenChangeReason = reason;
			openState.setOpen(false, reason);
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
			return openState.open;
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
		get modal() {
			return modal;
		},
		get lastOpenChangeReason() {
			return lastOpenChangeReason;
		},
		triggerId,
		titleId,
		descriptionId,
		popupId,
		refs,
		presence,
		get payload() {
			return handle?.payload;
		},
	} satisfies PopoverContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: openState.open, payload: handle?.payload })}
	{/if}
</div>
