<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
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

	const refs: PreviewCardRefs = {
		trigger: null,
		popup: null,
		arrow: null,
		positioner: null
	};

	const triggerId = useId('preview-card-trigger');
	const popupId = useId('preview-card-popup');

	let openTimeout: ReturnType<typeof setTimeout> | null = null;
	let closeTimeout: ReturnType<typeof setTimeout> | null = null;

	function cancelOpen(): void {
		if (openTimeout != null) {
			clearTimeout(openTimeout);
			openTimeout = null;
		}
	}

	function cancelClose(): void {
		if (closeTimeout != null) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
	}

	function openWithDelay(reason: OpenChangeReason): void {
		cancelClose();
		cancelOpen();
		if (openDelay <= 0) {
			state.setOpen(true, reason);
			return;
		}
		openTimeout = setTimeout(() => {
			openTimeout = null;
			state.setOpen(true, reason);
		}, openDelay);
	}

	function closeWithDelay(reason: OpenChangeReason): void {
		cancelOpen();
		cancelClose();
		if (closeDelay <= 0) {
			state.setOpen(false, reason);
			return;
		}
		closeTimeout = setTimeout(() => {
			closeTimeout = null;
			state.setOpen(false, reason);
		}, closeDelay);
	}

	$effect(() => {
		return () => {
			cancelOpen();
			cancelClose();
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
