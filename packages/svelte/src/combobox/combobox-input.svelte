<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxContext, ComboboxInputProps } from './types.js';

	let { disabled = false, class: className, style, ...rest }: ComboboxInputProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	let inputEl = $state<HTMLElement | null>(null);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));
	const isReadOnly = $derived(Boolean(ctx.readOnly));

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
		if (currentIndex === -1) {
			ctx.setHighlighted((delta > 0 ? visible[0] : visible[visible.length - 1])?.value ?? null);
			return;
		}

		const nextIndex = currentIndex + delta;
		if (ctx.loopFocus) {
			const wrapped = (nextIndex + visible.length) % visible.length;
			ctx.setHighlighted(visible[wrapped]?.value ?? null);
			return;
		}
		if (nextIndex < 0 || nextIndex >= visible.length) return;
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
				if (ctx.open && ctx.highlighted != null && !isReadOnly) {
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
		ctx.open && ctx.highlighted != null ? ctx.getItemId(ctx.highlighted) : undefined,
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.inputId,
			type: 'text',
			role: 'combobox',
			class: className,
			style,
			disabled: isDisabled || undefined,
			readonly: isReadOnly || undefined,
			required: ctx.required || undefined,
			value: ctx.inputValue,
			autocomplete: 'off',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.listId,
			'aria-autocomplete': 'list',
			'aria-labelledby': ctx.labelId,
			'aria-activedescendant': activeDescendant,
			'aria-disabled': isDisabled || undefined,
			'aria-readonly': isReadOnly || undefined,
			'aria-required': ctx.required || undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			'data-readonly': isReadOnly ? '' : undefined,
			oninput: (event: Event) => {
				if (isReadOnly) return;
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
			onclick: () => {
				if (isDisabled || !ctx.openOnInputClick) return;
				if (!ctx.open) {
					ctx.setOpen(true, 'trigger-press');
				}
			},
			onfocus: () => {
				if (isDisabled || !ctx.openOnInputClick) return;
				ctx.setOpen(true, 'trigger-focus');
			},
			onkeydown: onKeyDown,
		}),
	);
</script>

<input
	{...mergedProps}
	bind:this={inputEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
