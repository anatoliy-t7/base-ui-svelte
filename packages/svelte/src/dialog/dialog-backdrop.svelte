<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogBackdropProps, DialogContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		forceRender = false,
		children,
		...rest
	}: DialogBackdropProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	const shouldRender = $derived(forceRender || ctx.presence.isPresent);

	/**
	 * Intentional outside-press: ignore trailing clicks whose pointerdown
	 * began before the dialog was open (e.g. drag-release from a menu item).
	 * Keyboard/programmatic clicks (`detail === 0`) still dismiss.
	 */
	let pressBeganWhileOpen = $state(false);

	$effect(() => {
		if (!ctx.open || !shouldRender) {
			pressBeganWhileOpen = false;
			return;
		}

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			pressBeganWhileOpen = true;
		};

		document.addEventListener('pointerdown', onPointerDown, true);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown, true);
		};
	});

	function onClick(event: MouseEvent): void {
		if (ctx.disablePointerDismissal) return;
		// Keyboard-generated / programmatic clicks always dismiss.
		if (event.detail !== 0 && !pressBeganWhileOpen) return;
		ctx.setOpen(false, 'outside-press');
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: ['position:fixed;inset:0;', typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
			hidden: forceRender && !ctx.presence.isPresent ? true : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			onclick: onClick,
		}),
	);
</script>

{#if shouldRender}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
