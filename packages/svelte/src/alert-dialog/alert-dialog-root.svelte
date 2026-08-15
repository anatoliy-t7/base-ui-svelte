<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		AlertDialogContext,
		AlertDialogRefs,
		AlertDialogRootProps
	} from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		class: className,
		style,
		id = useId('alert-dialog'),
		children,
		...rest
	}: AlertDialogRootProps = $props();

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

	const refs: AlertDialogRefs = {
		trigger: null,
		popup: null
	};

	const triggerId = useId('alert-dialog-trigger');
	const titleId = useId('alert-dialog-title');
	const descriptionId = useId('alert-dialog-description');
	const popupId = useId('alert-dialog-popup');

	setContext(ALERT_DIALOG_CONTEXT, {
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
	} satisfies AlertDialogContext);

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
