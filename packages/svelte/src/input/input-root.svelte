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

	let inputEl = $state<HTMLInputElement | undefined>(undefined);
	let uncontrolled = $state<string | undefined>(undefined);
	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue),
	);
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	let previousControlled: string | undefined = undefined;
	let mounted = $state(false);

	onMount(() => {
		field?.setValue(currentValue);
		if (field && inputEl) {
			field.registerControl(inputEl);
			field.syncNativeValidity(inputEl);
		}
		if (isControlled) {
			previousControlled = currentValue;
		}
		mounted = true;
		return () => {
			field?.registerControl(null);
		};
	});

	$effect(() => {
		if (!mounted || !isControlled || !field) return;
		const next = currentValue;
		if (previousControlled === undefined) {
			previousControlled = next;
			return;
		}
		if (previousControlled === next) return;
		previousControlled = next;
		field.syncControlledValue(next);
	});

	function commit(next: string, event: Event): void {
		if (isControlled) {
			value = next;
			onValueChange?.(next, event);
			return;
		}
		uncontrolled = next;
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
				if (isControlled && field && inputEl) {
					const blurValue = inputEl.value;
					queueMicrotask(() => {
						if (!inputEl || !field) return;
						const domValue = inputEl.value;
						if (domValue === blurValue) return;
						if (domValue === String(field.initialValue ?? '')) return;
						field.syncControlledValue(domValue);
					});
				}
			},
		}),
	);
</script>

<input
	bind:this={inputEl}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
