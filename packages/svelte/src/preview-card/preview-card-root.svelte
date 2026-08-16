<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
	import { createHoverDelay } from '../internal/hover-delay.svelte.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PreviewCardContext, PreviewCardRefs, PreviewCardRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		openDelay = 600,
		closeDelay = 300,
		class: className,
		style,
		id = useId('preview-card'),
		children,
		...rest
	}: PreviewCardRootProps = $props();

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
		() => openDelay,
		() => closeDelay
	);

	const refs: PreviewCardRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null
	};

	const triggerId = useId('preview-card-trigger');
	const popupId = useId('preview-card-popup');

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
		return () => {
			hover.dispose();
		};
	});

	setContext(PREVIEW_CARD_CONTEXT, {
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
			return openDelay;
		},
		get closeDelay() {
			return closeDelay;
		}
	} satisfies PreviewCardContext);

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
