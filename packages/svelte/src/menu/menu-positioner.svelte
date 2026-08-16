<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { MENU_CONTEXT, MENUBAR_CONTEXT } from '../internal/context-keys.js';
	import { createPositioner } from '../internal/floating.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import {
		createAnchoredPopupScrollLock,
		isCoarsePointer,
	} from '../internal/scroll-lock.svelte.js';
	import type { MenubarContext } from '../menubar/types.js';
	import type { MenuContext, MenuPositionerProps } from './types.js';

	let {
		side = 'bottom',
		align = 'start',
		sideOffset = 8,
		class: className,
		style,
		children,
		...rest
	}: MenuPositionerProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);
	const menubar = hasContext(MENUBAR_CONTEXT)
		? getContext<MenubarContext>(MENUBAR_CONTEXT)
		: undefined;

	let positionerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.positioner = positionerEl;
		return () => {
			if (ctx.refs.positioner === positionerEl) {
				ctx.refs.positioner = null;
			}
		};
	});

	createPositioner({
		get open() {
			return ctx.open;
		},
		anchor: () => ctx.refs.trigger,
		floating: () => ctx.refs.positioner,
		arrowEl: () => ctx.refs.arrow,
		get side() {
			return side;
		},
		get align() {
			return align;
		},
		get sideOffset() {
			return sideOffset;
		},
	});

	const menubarModal = $derived(Boolean(menubar?.modal));
	const popupModal = $derived(ctx.modal && ctx.lastOpenChangeReason !== 'trigger-hover');

	createAnchoredPopupScrollLock({
		get enabled() {
			return ctx.open && (menubarModal || popupModal);
		},
		get touchOpen() {
			return isCoarsePointer();
		},
		positioner: () => positionerEl,
		reference: () => ctx.refs.trigger,
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
		}),
	);
</script>

{#if ctx.presence.isPresent}
	<div
		{...mergedProps}
		bind:this={positionerEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
