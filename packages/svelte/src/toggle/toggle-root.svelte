<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { createControllableChecked, useId } from '../internal/controllable.svelte.js';
	import { TOGGLE_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToggleGroupContext } from '../toggle-group/types.js';
	import type { ToggleProps } from './types.js';

	let {
		pressed = $bindable(undefined),
		defaultPressed = false,
		onPressedChange,
		disabled = false,
		value,
		class: className,
		style,
		id = useId('toggle'),
		children,
		...rest
	}: ToggleProps = $props();

	const group = hasContext(TOGGLE_GROUP_CONTEXT)
		? getContext<ToggleGroupContext>(TOGGLE_GROUP_CONTEXT)
		: undefined;

	const state = createControllableChecked({
		getChecked: () => pressed,
		getDefaultChecked: () => defaultPressed,
		onCheckedChange: (next, event) => {
			onPressedChange?.(next, event);
		},
		setCheckedProp: (next) => {
			pressed = next;
		}
	});

	const isDisabled = $derived(Boolean(disabled || group?.disabled));
	const isPressed = $derived(
		group && value !== undefined ? group.value.includes(value) : state.checked
	);

	function toggle(event: Event): void {
		if (isDisabled) return;
		if (group && value !== undefined) {
			group.toggleValue(value, event);
			return;
		}
		state.setChecked(!state.checked, event);
	}

	const buttonProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type: 'button',
			class: className,
			style,
			disabled: isDisabled || undefined,
			'aria-pressed': isPressed,
			'data-pressed': isPressed ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				toggle(event);
			},
			onkeydown: (event: KeyboardEvent) => {
				if (event.key === ' ') {
					event.preventDefault();
					toggle(event);
				}
			}
		})
	);
</script>

<button {...buttonProps}>
	{#if children}
		{@render children({ pressed: isPressed, disabled: isDisabled })}
	{/if}
</button>
