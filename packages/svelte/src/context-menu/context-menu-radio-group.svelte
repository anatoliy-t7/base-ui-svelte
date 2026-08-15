<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import {
		CONTEXT_MENU_CONTEXT,
		CONTEXT_MENU_RADIO_GROUP_CONTEXT
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ContextMenuContext,
		ContextMenuRadioGroupContext,
		ContextMenuRadioGroupProps
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ContextMenuRadioGroupProps = $props();

	getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

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

	setContext(CONTEXT_MENU_RADIO_GROUP_CONTEXT, {
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		setValue
	} satisfies ContextMenuRadioGroupContext);

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
