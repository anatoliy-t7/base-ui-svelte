<script lang="ts">
	import { getContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToolbarContext, ToolbarInputProps } from './types.js';

	let {
		disabled = false,
		focusableWhenDisabled = true,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		class: className,
		style,
		id: idProp,
		...rest
	}: ToolbarInputProps = $props();

	const fallbackId = useId('toolbar-input');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<ToolbarContext>(TOOLBAR_CONTEXT);

	let uncontrolled = $state<string | undefined>(undefined);
	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue),
	);

	const isFocusable = $derived(!disabled || focusableWhenDisabled);
	const useAriaDisabled = $derived(disabled && focusableWhenDisabled);
	const nativeDisabled = $derived(disabled && !focusableWhenDisabled);

	function setValue(next: string, event: Event): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		onValueChange?.(next, event);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type: 'text',
			class: className,
			style,
			value: currentValue,
			disabled: nativeDisabled || undefined,
			'aria-disabled': useAriaDisabled ? true : undefined,
			tabindex: isFocusable ? ctx.getTabIndex(id) : -1,
			'data-disabled': disabled ? '' : undefined,
			'data-orientation': ctx.orientation,
			onfocus: () => {
				if (isFocusable) ctx.setActiveId(id);
			},
			oninput: (event: Event) => {
				if (disabled) return;
				const target = event.currentTarget as HTMLInputElement;
				setValue(target.value, event);
			},
		}),
	);
</script>

<input
	{...mergedProps}
	{@attach (element) =>
		ctx.registerItem({
			id,
			element,
			kind: 'input',
			disabled,
			focusableWhenDisabled,
		})}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
