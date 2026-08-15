<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { CHECKBOX_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CheckboxGroupContext, CheckboxGroupRootProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = [],
		onValueChange,
		disabled = false,
		allValues: _allValues,
		class: className,
		style,
		id = useId('checkbox-group'),
		children,
		...rest
	}: CheckboxGroupRootProps = $props();

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

	function isChecked(val: string): boolean {
		return currentValue.includes(val);
	}

	function toggle(val: string, event: Event): void {
		if (disabled) return;
		if (isChecked(val)) {
			setValue(
				currentValue.filter((v) => v !== val),
				event
			);
		} else {
			setValue([...currentValue, val], event);
		}
	}

	setContext(CHECKBOX_GROUP_CONTEXT, {
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		isChecked,
		toggle
	} satisfies CheckboxGroupContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'group',
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, disabled })}
	{/if}
</div>
