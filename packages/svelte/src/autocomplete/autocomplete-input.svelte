<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteContext, AutocompleteInputProps } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		...rest
	}: AutocompleteInputProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

	let inputEl = $state<HTMLElement | null>(null);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	$effect(() => {
		ctx.refs.input = inputEl;
		return () => {
			if (ctx.refs.input === inputEl) {
				ctx.refs.input = null;
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
		const item = ctx.getVisibleItems().find((entry) => entry.value === ctx.highlighted);
		if (!item) return;
		ctx.selectItem(item.value, item.label, event);
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
			case 'Enter': {
				if (ctx.open && ctx.highlighted != null) {
					event.preventDefault();
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
		ctx.open && ctx.highlighted != null ? ctx.getItemId(ctx.highlighted) : undefined
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.inputId,
			type: 'text',
			role: 'combobox',
			class: className,
			style,
			disabled: isDisabled || undefined,
			value: ctx.inputValue,
			autocomplete: 'off',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.listId,
			'aria-autocomplete': 'list',
			'aria-labelledby': ctx.labelId,
			'aria-activedescendant': activeDescendant,
			'aria-disabled': isDisabled || undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			oninput: (event: Event) => {
				const target = event.currentTarget;
				if (!(target instanceof HTMLInputElement)) return;
				ctx.setInputValue(target.value, event);
				if (!ctx.open) {
					ctx.setOpen(true, 'trigger-press');
				} else {
					const visible = ctx.getVisibleItems();
					const stillVisible = visible.some((item) => item.value === ctx.highlighted);
					if (!stillVisible) {
						ctx.setHighlighted(visible[0]?.value ?? null);
					}
				}
			},
			onfocus: () => {
				if (isDisabled) return;
				ctx.setOpen(true, 'trigger-focus');
			},
			onkeydown: onKeyDown
		})
	);
</script>

<input
	{...mergedProps}
	bind:this={inputEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
