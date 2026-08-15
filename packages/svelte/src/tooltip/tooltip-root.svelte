<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { TOOLTIP_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TooltipContext, TooltipRefs, TooltipRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		closeDelay = 200,
		class: className,
		style,
		id = useId('tooltip'),
		children,
		...rest
	}: TooltipRootProps = $props();

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

	const refs: TooltipRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null
	};

	const triggerId = useId('tooltip-trigger');
	const popupId = useId('tooltip-popup');

	let closeTimeout: ReturnType<typeof setTimeout> | null = null;

	function cancelClose(): void {
		if (closeTimeout != null) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
	}

	function openWithDelay(reason: OpenChangeReason): void {
		cancelClose();
		state.setOpen(true, reason);
	}

	function closeWithDelay(reason: OpenChangeReason): void {
		cancelClose();
		closeTimeout = setTimeout(() => {
			closeTimeout = null;
			state.setOpen(false, reason);
		}, closeDelay);
	}

	$effect(() => {
		return () => {
			cancelClose();
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
		get closeDelay() {
			return closeDelay;
		}
	} satisfies TooltipContext);

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
