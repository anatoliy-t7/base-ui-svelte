<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { RADIO_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { RadioEntry, RadioGroupContext, RadioGroupRootProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		disabled = false,
		name,
		required = false,
		class: className,
		style,
		id = useId('radio-group'),
		children,
		...rest
	}: RadioGroupRootProps = $props();

	let uncontrolled = $state<string | undefined>(undefined);
	let radios = $state<RadioEntry[]>([]);

	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value) : (uncontrolled ?? defaultValue)
	);

	function setValue(next: string, event: Event): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		onValueChange?.(next, event);
	}

	function registerRadio(radioId: string, radioValue: string, element: HTMLElement): () => void {
		queueMicrotask(() => {
			if (radios.some((radio) => radio.id === radioId)) return;
			radios.push({ id: radioId, value: radioValue, element });
		});
		return () => {
			radios = radios.filter((radio) => radio.id !== radioId);
		};
	}

	setContext(RADIO_GROUP_CONTEXT, {
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		get name() {
			return name;
		},
		get required() {
			return required;
		},
		setValue,
		registerRadio,
		getRadios: () => radios
	} satisfies RadioGroupContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'radiogroup',
			class: className,
			style,
			'aria-required': required || undefined,
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, disabled })}
	{/if}
</div>
