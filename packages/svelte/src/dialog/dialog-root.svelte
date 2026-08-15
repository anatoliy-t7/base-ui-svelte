<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogContext, DialogRefs, DialogRootProps } from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
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
		},
		setOpenProp: (next) => {
			open = next;
		}
	});

	const presence = createPresence(() => state.open);

	const refs: DialogRefs = {
		trigger: null,
		popup: null
	};

	const triggerId = useId('dialog-trigger');
	const titleId = useId('dialog-title');
	const descriptionId = useId('dialog-description');
	const popupId = useId('dialog-popup');

	setContext(DIALOG_CONTEXT, {
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
	} satisfies DialogContext);

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
