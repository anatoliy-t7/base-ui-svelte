<script lang="ts">
	import { getContext, hasContext, onDestroy, setContext, untrack } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { DRAWER_CONTEXT, DRAWER_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		DrawerContext,
		DrawerProviderContext,
		DrawerRefs,
		DrawerRootProps
	} from './types.js';
	import type { OpenChangeReason } from '../internal/controllable.svelte.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		swipeDirection = 'down',
		modal = true,
		disablePointerDismissal = false,
		class: className,
		style,
		id = useId('drawer'),
		children,
		...rest
	}: DrawerRootProps = $props();

	const provider = hasContext(DRAWER_PROVIDER_CONTEXT)
		? getContext<DrawerProviderContext>(DRAWER_PROVIDER_CONTEXT)
		: undefined;

	const resolvedSwipeDirection = $derived(swipeDirection ?? provider?.swipeDirection ?? 'down');

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

	const refs: DrawerRefs = {
		trigger: null,
		popup: null
	};

	const triggerId = useId('drawer-trigger');
	const titleId = useId('drawer-title');
	const descriptionId = useId('drawer-description');
	const popupId = useId('drawer-popup');

	let unregisterOpen: (() => void) | undefined;

	function syncProviderRegistration(nextOpen: boolean): void {
		if (!provider) return;
		if (nextOpen) {
			if (!unregisterOpen) {
				unregisterOpen = provider.registerOpen();
			}
			return;
		}
		unregisterOpen?.();
		unregisterOpen = undefined;
	}

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		state.setOpen(next, reason);
	}

	$effect(() => {
		const nextOpen = state.open;
		untrack(() => {
			syncProviderRegistration(nextOpen);
		});
	});

	onDestroy(() => {
		unregisterOpen?.();
		unregisterOpen = undefined;
	});

	setContext(DRAWER_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen,
		get swipeDirection() {
			return resolvedSwipeDirection;
		},
		get modal() {
			return modal;
		},
		get disablePointerDismissal() {
			return disablePointerDismissal;
		},
		triggerId,
		titleId,
		descriptionId,
		popupId,
		refs,
		presence
	} satisfies DrawerContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': state.open ? '' : undefined,
			'data-closed': !state.open ? '' : undefined,
			'data-swipe-direction': resolvedSwipeDirection
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: state.open })}
	{/if}
</div>
