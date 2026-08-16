<script lang="ts">
	import { getContext, hasContext, onMount } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldContext } from '../field/types.js';
	import type { InputProps } from './types.js';

	let {
		disabled = false,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		class: className,
		style,
		id,
		...rest
	}: InputProps = $props();

	const field = hasContext(FIELD_CONTEXT) ? getContext<FieldContext>(FIELD_CONTEXT) : undefined;
	const fallbackId = useId('input');
	const inputId = $derived(field?.controlId ?? id ?? fallbackId);

	let uncontrolled = $state<string | undefined>(undefined);
	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue),
	);
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	onMount(() => {
		field?.setValue(currentValue);
	});

	function commit(next: string, event: Event): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		field?.setValue(next, event);
		onValueChange?.(next, event);
	}

	const fieldAttrs: Record<string, unknown> = $derived(
		field
			? {
					'aria-invalid': field.valid === false ? true : undefined,
					'aria-describedby': field.getDescribedBy(),
					'data-valid': field.valid === true ? '' : undefined,
					'data-invalid': field.valid === false ? '' : undefined,
					'data-dirty': field.dirty ? '' : undefined,
					'data-touched': field.touched ? '' : undefined,
					'data-filled': field.filled ? '' : undefined,
					'data-focused': field.focused ? '' : undefined,
				}
			: {},
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, fieldAttrs, {
			id: inputId,
			name: field?.name,
			class: className,
			style,
			value: currentValue,
			disabled: isDisabled || undefined,
			'data-disabled': isDisabled ? '' : undefined,
			oninput: (event: Event) => {
				if (isDisabled) return;
				const target = event.currentTarget as HTMLInputElement;
				commit(target.value, event);
			},
			onfocus: () => {
				field?.setFocused(true);
			},
			onblur: () => {
				field?.setFocused(false);
				field?.setTouched(true);
			},
		}),
	);
</script>

<input
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
