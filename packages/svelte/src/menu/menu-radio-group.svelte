<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { MENU_CONTEXT, MENU_RADIO_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuContext, MenuRadioGroupContext, MenuRadioGroupProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: MenuRadioGroupProps = $props();

	getContext<MenuContext>(MENU_CONTEXT);

	let uncontrolled = $state<string | undefined>(undefined);

	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value) : (uncontrolled ?? defaultValue)
	);

	function setValue(next: string, event: Event): void {
		if (disabled) return;
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		onValueChange?.(next, event);
	}

	setContext(MENU_RADIO_GROUP_CONTEXT, {
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		setValue
	} satisfies MenuRadioGroupContext);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'group',
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue })}
	{/if}
</div>
