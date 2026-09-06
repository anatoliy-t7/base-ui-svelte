<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldContext, FieldControlProps } from './types.js';

	let {
		disabled,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		class: className,
		style,
		...rest
	}: FieldControlProps = $props();

	const ctx = getContext<FieldContext>(FIELD_CONTEXT);

	let inputEl = $state<HTMLInputElement | undefined>(undefined);
	let uncontrolled = $state<string | undefined>(undefined);
	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue),
	);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	/** Tracks previous controlled value to detect prop-driven changes. */
	let previousControlled: string | undefined = undefined;
	let mounted = $state(false);

	onMount(() => {
		ctx.setValue(currentValue);
		if (inputEl) {
			ctx.registerControl(inputEl);
			ctx.syncNativeValidity(inputEl);
		}
		if (isControlled) {
			previousControlled = currentValue;
		}
		mounted = true;
		return () => {
			ctx.registerControl(null);
		};
	});

	// Sync field state when the controlled value prop changes (programmatic clears, etc.).
	$effect(() => {
		if (!mounted || !isControlled) return;
		const next = currentValue;
		if (previousControlled === undefined) {
			previousControlled = next;
			return;
		}
		if (previousControlled === next) return;
		previousControlled = next;
		ctx.syncControlledValue(next);
	});

	function commit(next: string, event: Event): void {
		if (isControlled) {
			value = next;
			// Controlled: wait for the prop to settle via syncControlledValue.
			// Still notify the consumer immediately.
			onValueChange?.(next, event);
			return;
		}
		uncontrolled = next;
		ctx.setValue(next, event);
		onValueChange?.(next, event);
	}

	function syncFromEvent(event: Event): void {
		const target = event.currentTarget as HTMLInputElement;
		ctx.syncNativeValidity(target);
	}

	function onBlur(event: FocusEvent): void {
		ctx.setFocused(false);
		ctx.setTouched(true);
		syncFromEvent(event);

		// After blur validation, if controlled consumer normalized the value,
		// re-sync from the DOM when it differs from the blur-time value and
		// is not a reset back to the initial value.
		if (isControlled && inputEl) {
			const blurValue = inputEl.value;
			queueMicrotask(() => {
				if (!inputEl) return;
				const domValue = inputEl.value;
				if (domValue === blurValue) return;
				if (domValue === String(ctx.initialValue ?? '')) return;
				ctx.syncControlledValue(domValue);
			});
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.controlId,
			name: ctx.name,
			class: className,
			style,
			value: currentValue,
			disabled: isDisabled || undefined,
			'aria-invalid': ctx.valid === false ? true : undefined,
			'aria-describedby': ctx.getDescribedBy(),
			'data-disabled': isDisabled ? '' : undefined,
			'data-valid': ctx.valid === true ? '' : undefined,
			'data-invalid': ctx.valid === false ? '' : undefined,
			'data-dirty': ctx.dirty ? '' : undefined,
			'data-touched': ctx.touched ? '' : undefined,
			'data-filled': ctx.filled ? '' : undefined,
			'data-focused': ctx.focused ? '' : undefined,
			oninput: (event: Event) => {
				if (isDisabled) return;
				const target = event.currentTarget as HTMLInputElement;
				commit(target.value, event);
				ctx.syncNativeValidity(target);
			},
			onchange: (event: Event) => {
				syncFromEvent(event);
			},
			onfocus: () => {
				ctx.setFocused(true);
			},
			onblur: onBlur,
		}),
	);
</script>

<input
	bind:this={inputEl}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
