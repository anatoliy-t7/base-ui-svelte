<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { RADIO_CONTEXT, RADIO_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { RadioGroupContext } from '../radio-group/types.js';
	import type { RadioContext, RadioRootProps } from './types.js';

	let {
		value,
		disabled = false,
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: RadioRootProps = $props();

	const fallbackId = useId('radio');
	const id = $derived(idProp ?? fallbackId);

	const group = getContext<RadioGroupContext>(RADIO_GROUP_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || group.disabled));
	const checked = $derived(group.value === value);

	const tabIndex = $derived.by(() => {
		if (isDisabled) return -1;
		if (checked) return 0;
		const radios = group.getRadios().filter((radio) => {
			const el = radio.element;
			return !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
		});
		const anyChecked = radios.some((radio) => radio.value === group.value);
		if (!anyChecked) {
			return radios[0]?.value === value ? 0 : -1;
		}
		return -1;
	});

	function select(event: Event): void {
		if (isDisabled) return;
		group.setValue(value, event);
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (isDisabled) return;

		const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
		if (!keys.includes(event.key)) return;

		const radios = group.getRadios().filter((radio) => {
			const el = radio.element;
			return !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
		});
		if (radios.length === 0) return;

		const currentIndex = radios.findIndex((radio) => radio.value === value);
		if (currentIndex === -1) return;

		event.preventDefault();

		const delta = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
		const nextIndex = (currentIndex + delta + radios.length) % radios.length;
		const next = radios[nextIndex];
		if (!next) return;

		group.setValue(next.value, event);
		next.element.focus();
	}

	setContext(RADIO_CONTEXT, {
		get checked() {
			return checked;
		},
		get disabled() {
			return isDisabled;
		},
	} satisfies RadioContext);

	const buttonProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type: 'button',
			role: 'radio',
			class: className,
			style,
			disabled: isDisabled || undefined,
			tabindex: tabIndex,
			'aria-checked': checked,
			'aria-required': group.required || undefined,
			'data-checked': checked ? '' : undefined,
			'data-unchecked': !checked ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				select(event);
			},
			onkeydown: onKeyDown,
		}),
	);
</script>

<button
	{...buttonProps}
	{@attach (element) => group.registerRadio(id, value, element)}
	style={typeof buttonProps.style === 'string' ? buttonProps.style : undefined}
>
	{#if children}
		{@render children({ checked, disabled: isDisabled })}
	{/if}
</button>

{#if group.name && !isDisabled}
	<input
		type="radio"
		name={group.name}
		{value}
		{checked}
		required={group.required}
		tabindex="-1"
		aria-hidden="true"
		style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
	/>
{/if}
