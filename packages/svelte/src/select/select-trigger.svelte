<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: SelectTriggerProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	let triggerEl = $state<HTMLElement | null>(null);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	$effect(() => {
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	function moveHighlight(delta: number): void {
		const visible = ctx.getVisibleItems();
		if (visible.length === 0) return;

		const currentIndex = visible.findIndex((item) => item.value === ctx.highlighted);
		const nextIndex =
			currentIndex === -1
				? delta > 0
					? 0
					: visible.length - 1
				: (currentIndex + delta + visible.length) % visible.length;
		ctx.setHighlighted(visible[nextIndex]?.value ?? null);
	}

	function selectHighlighted(event: Event): void {
		if (ctx.highlighted == null) return;
		ctx.setValue(ctx.highlighted, event);
		ctx.setOpen(false, 'imperative-action');
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (isDisabled) return;

		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				if (!ctx.open) {
					ctx.setOpen(true, 'trigger-press');
				} else {
					moveHighlight(1);
				}
				break;
			}
			case 'ArrowUp': {
				event.preventDefault();
				if (!ctx.open) {
					ctx.setOpen(true, 'trigger-press');
				} else {
					moveHighlight(-1);
				}
				break;
			}
			case 'Enter':
			case ' ': {
				event.preventDefault();
				if (!ctx.open) {
					ctx.setOpen(true, 'trigger-press');
				} else {
					selectHighlighted(event);
				}
				break;
			}
			case 'Escape': {
				if (ctx.open) {
					event.preventDefault();
					ctx.setOpen(false, 'escape-key');
				}
				break;
			}
			case 'Home': {
				if (ctx.open) {
					event.preventDefault();
					const first = ctx.getVisibleItems()[0];
					if (first) ctx.setHighlighted(first.value);
				}
				break;
			}
			case 'End': {
				if (ctx.open) {
					event.preventDefault();
					const visible = ctx.getVisibleItems();
					const last = visible[visible.length - 1];
					if (last) ctx.setHighlighted(last.value);
				}
				break;
			}
		}
	}

	const activeDescendant = $derived(
		ctx.open && ctx.highlighted != null ? ctx.getItemId(ctx.highlighted) : undefined,
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			type: render === 'button' ? 'button' : undefined,
			role: 'combobox',
			class: className,
			style,
			disabled: isDisabled || undefined,
			'aria-haspopup': 'listbox',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.listId,
			'aria-labelledby': ctx.labelId,
			'aria-activedescendant': activeDescendant,
			'aria-disabled': isDisabled || undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: () => {
				if (isDisabled) return;
				ctx.setOpen(!ctx.open, 'trigger-press');
			},
			onkeydown: onKeyDown,
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
