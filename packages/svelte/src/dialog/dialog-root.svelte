<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogContext, DialogRefs, DialogRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		modal = true,
		disablePointerDismissal = false,
		onOpenChangeComplete,
		handle,
		class: className,
		style,
		id = useId('dialog'),
		children,
		...rest
	}: DialogRootProps = $props();

	const state = createControllableOpen({
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

	const presence = createPresence(() => state.open);

	const refs: DialogRefs = {
		trigger: null,
		popup: null,
	};

	const triggerId = useId('dialog-trigger');
	const titleId = useId('dialog-title');
	const descriptionId = useId('dialog-description');
	const popupId = useId('dialog-popup');

	let lastReportedOpen: boolean | undefined = undefined;
	let hasSyncedComplete = false;

	$effect(() => {
		if (!handle) return;
		return handle.attach({
			setOpen: state.setOpen,
			getOpen: () => state.open,
		});
	});

	$effect(() => {
		const present = presence.isPresent;
		const ending = presence.isEnding;
		const starting = presence.isStarting;
		const openNow = state.open;

		if (!hasSyncedComplete) {
			hasSyncedComplete = true;
			lastReportedOpen = openNow;
			return;
		}

		if (openNow && present && !starting) {
			if (lastReportedOpen !== true) {
				lastReportedOpen = true;
				onOpenChangeComplete?.(true);
			}
			return;
		}
		if (!openNow && !present && !ending) {
			if (lastReportedOpen !== false) {
				lastReportedOpen = false;
				onOpenChangeComplete?.(false);
			}
		}
	});

	setContext(DIALOG_CONTEXT, {
		get open() {
			return state.open;
		},
		setOpen: state.setOpen,
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
		presence,
		get payload() {
			return handle?.payload;
		},
	} satisfies DialogContext);

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
