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
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue)
	);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	onMount(() => {
		ctx.setValue(currentValue);
		if (inputEl) {
			ctx.registerControl(inputEl);
			ctx.syncNativeValidity(inputEl);
		}
		return () => {
			ctx.registerControl(null);
		};
	});

	function commit(next: string, event: Event): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		ctx.setValue(next, event);
		onValueChange?.(next, event);
	}

	function syncFromEvent(event: Event): void {
		const target = event.currentTarget as HTMLInputElement;
		ctx.syncNativeValidity(target);
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
			onblur: (event: FocusEvent) => {
				ctx.setFocused(false);
				ctx.setTouched(true);
				syncFromEvent(event);
			}
		})
	);
</script>

<input
	bind:this={inputEl}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
