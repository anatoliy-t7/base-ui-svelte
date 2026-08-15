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

	let uncontrolled = $state<string | undefined>(undefined);
	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value ?? '') : (uncontrolled ?? defaultValue)
	);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	onMount(() => {
		ctx.setValue(currentValue);
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
			},
			onfocus: () => {
				ctx.setFocused(true);
			},
			onblur: () => {
				ctx.setFocused(false);
				ctx.setTouched(true);
			}
		})
	);
</script>

<input {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined} />
