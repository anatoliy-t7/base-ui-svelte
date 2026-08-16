<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason,
	} from '../internal/controllable.svelte.js';
	import { TOOLTIP_CONTEXT, TOOLTIP_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import { createHoverDelay } from '../internal/hover-delay.svelte.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		TooltipContext,
		TooltipProviderContext,
		TooltipRefs,
		TooltipRootProps,
	} from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		delay,
		openDelay,
		closeDelay,
		handle,
		class: className,
		style,
		id = useId('tooltip'),
		children,
		...rest
	}: TooltipRootProps = $props();

	const provider = hasContext(TOOLTIP_PROVIDER_CONTEXT)
		? getContext<TooltipProviderContext>(TOOLTIP_PROVIDER_CONTEXT)
		: undefined;

	const resolvedOpenDelay = $derived(openDelay ?? delay ?? provider?.delay ?? 600);
	const resolvedCloseDelay = $derived(closeDelay ?? provider?.closeDelay ?? 200);

	const state = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
			if (!next) {
				handle?.clearPayload();
				provider?.markClosed();
			}
		},
		setOpenProp: (next) => {
			open = next;
		},
	});

	const presence = createPresence(() => state.open);
	const hover = createHoverDelay(
		() => (provider?.shouldOpenInstantly() ? 0 : resolvedOpenDelay),
		() => resolvedCloseDelay,
	);

	const refs: TooltipRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null,
	};

	const triggerId = useId('tooltip-trigger');
	const popupId = useId('tooltip-popup');

	function openWithDelay(reason: OpenChangeReason): void {
		if (state.open) {
			hover.cancel();
			return;
		}
		hover.openWithDelay(() => {
			state.setOpen(true, reason);
		});
	}

	function closeWithDelay(reason: OpenChangeReason): void {
		hover.closeWithDelay(() => {
			state.setOpen(false, reason);
		});
	}

	function cancelClose(): void {
		hover.cancel();
	}

	$effect(() => {
		if (!handle) return;
		return handle.attach({
			setOpen: state.setOpen,
			getOpen: () => state.open,
		});
	});

	$effect(() => {
		return () => {
			hover.dispose();
		};
	});

	setContext(TOOLTIP_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen: state.setOpen,
		openWithDelay,
		closeWithDelay,
		cancelClose,
		triggerId,
		popupId,
		refs,
		presence,
		get openDelay() {
			return resolvedOpenDelay;
		},
		get closeDelay() {
			return resolvedCloseDelay;
		},
		get payload() {
			return handle?.payload;
		},
	} satisfies TooltipContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': state.open ? '' : undefined,
			'data-closed': !state.open ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: state.open, payload: handle?.payload })}
	{/if}
</div>
