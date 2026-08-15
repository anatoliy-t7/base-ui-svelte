<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableChecked, useId } from '../internal/controllable.svelte.js';
	import { SWITCH_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SwitchContext, SwitchRootProps } from './types.js';

	let {
		checked = $bindable(undefined),
		defaultChecked = false,
		onCheckedChange,
		disabled = false,
		required = false,
		name,
		value = 'on',
		class: className,
		style,
		id = useId('switch'),
		children,
		...rest
	}: SwitchRootProps = $props();

	const state = createControllableChecked({
		getChecked: () => checked,
		getDefaultChecked: () => defaultChecked,
		onCheckedChange: (next, event) => {
			onCheckedChange?.(next, event);
		},
		setCheckedProp: (next) => {
			checked = next;
		}
	});

	setContext(SWITCH_CONTEXT, {
		get checked() {
			return state.checked;
		},
		get disabled() {
			return disabled;
		}
	} satisfies SwitchContext);

	function toggle(event: Event): void {
		if (disabled) return;
		state.setChecked(!state.checked, event);
	}

	const buttonProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type: 'button',
			role: 'switch',
			class: className,
			style,
			disabled: disabled || undefined,
			'aria-checked': state.checked,
			'aria-required': required || undefined,
			'data-checked': state.checked ? '' : undefined,
			'data-unchecked': !state.checked ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				toggle(event);
			},
			onkeydown: (event: KeyboardEvent) => {
				if (event.key === ' ') {
					event.preventDefault();
					toggle(event);
				}
			}
		})
	);
</script>

<button {...buttonProps}>
	{#if children}
		{@render children({ checked: state.checked, disabled })}
	{/if}
</button>

{#if name && !disabled}
	<input
		type="checkbox"
		{name}
		{value}
		checked={state.checked}
		{required}
		tabindex="-1"
		aria-hidden="true"
		style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
	/>
{/if}
