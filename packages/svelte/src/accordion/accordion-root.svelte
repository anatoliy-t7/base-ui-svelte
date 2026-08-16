<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { ACCORDION_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AccordionContext, AccordionRootProps, AccordionValue } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue,
		onValueChange,
		multiple = false,
		disabled = false,
		orientation = 'vertical',
		class: className,
		style,
		id = useId('accordion'),
		children,
		...rest
	}: AccordionRootProps = $props();

	function toArray(next: AccordionValue | undefined): string[] {
		if (next === undefined) return [];
		return Array.isArray(next) ? [...next] : [next];
	}

	function fromArray(values: string[]): AccordionValue {
		if (multiple) return values;
		return values[0] ?? '';
	}

	let uncontrolled = $state<string[] | undefined>(undefined);

	const isControlled = $derived(value !== undefined);
	const openValues = $derived(
		isControlled ? toArray(value) : (uncontrolled ?? toArray(defaultValue)),
	);

	function setValues(next: string[]): void {
		const normalized = multiple ? next : next.slice(0, 1);
		if (isControlled) {
			value = fromArray(normalized);
		} else {
			uncontrolled = normalized;
		}
		onValueChange?.(fromArray(normalized));
	}

	function isOpen(itemValue: string): boolean {
		return openValues.includes(itemValue);
	}

	function toggle(itemValue: string): void {
		if (disabled) return;
		if (multiple) {
			if (isOpen(itemValue)) {
				setValues(openValues.filter((v) => v !== itemValue));
			} else {
				setValues([...openValues, itemValue]);
			}
			return;
		}
		if (isOpen(itemValue)) {
			setValues([]);
		} else {
			setValues([itemValue]);
		}
	}

	let registeredItems = $state<string[]>([]);

	function registerItem(itemValue: string): () => void {
		queueMicrotask(() => {
			if (registeredItems.includes(itemValue)) return;
			registeredItems = [...registeredItems, itemValue];
		});
		return () => {
			registeredItems = registeredItems.filter((v) => v !== itemValue);
		};
	}

	function getTriggerId(itemValue: string): string {
		return `${id}-trigger-${itemValue}`;
	}

	function getPanelId(itemValue: string): string {
		return `${id}-panel-${itemValue}`;
	}

	setContext(ACCORDION_CONTEXT, {
		get openValues() {
			return openValues;
		},
		isOpen,
		toggle,
		get multiple() {
			return multiple;
		},
		get disabled() {
			return disabled;
		},
		get orientation() {
			return orientation;
		},
		registerItem,
		getTriggerId,
		getPanelId,
	} satisfies AccordionContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-orientation': orientation,
			'data-disabled': disabled ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ openValues })}
	{/if}
</div>
