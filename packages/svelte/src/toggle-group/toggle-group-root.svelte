<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { TOGGLE_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToggleGroupContext, ToggleGroupProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = [],
		onValueChange,
		multiple = false,
		disabled = false,
		orientation = 'horizontal',
		class: className,
		style,
		id = useId('toggle-group'),
		children,
		...rest
	}: ToggleGroupProps = $props();

	let uncontrolled = $state<string[] | undefined>(undefined);

	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(isControlled ? (value ?? []) : (uncontrolled ?? defaultValue));

	function setValue(next: string[], event: Event): void {
		const nextValue = [...next];
		if (isControlled) {
			value = nextValue;
		} else {
			uncontrolled = nextValue;
		}
		onValueChange?.(nextValue, event);
	}

	function toggleValue(itemValue: string, event: Event): void {
		if (disabled) return;

		const current = currentValue;
		const isSelected = current.includes(itemValue);

		if (multiple) {
			if (isSelected) {
				setValue(
					current.filter((v) => v !== itemValue),
					event,
				);
			} else {
				setValue([...current, itemValue], event);
			}
			return;
		}

		if (isSelected) {
			setValue([], event);
		} else {
			setValue([itemValue], event);
		}
	}

	setContext(TOGGLE_GROUP_CONTEXT, {
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		get multiple() {
			return multiple;
		},
		setValue,
		toggleValue,
	} satisfies ToggleGroupContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'group',
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined,
			'data-orientation': orientation,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, disabled })}
	{/if}
</div>
