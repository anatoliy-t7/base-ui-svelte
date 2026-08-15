<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import { createControllableChecked, useId } from '../internal/controllable.svelte.js';
	import { CHECKBOX_CONTEXT, CHECKBOX_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CheckboxGroupContext } from '../checkbox-group/types.js';
	import type { CheckboxContext, CheckboxRootProps } from './types.js';

	let {
		checked = $bindable(undefined),
		defaultChecked = false,
		onCheckedChange,
		disabled = false,
		required = false,
		name,
		value,
		indeterminate = false,
		class: className,
		style,
		id = useId('checkbox'),
		children,
		...rest
	}: CheckboxRootProps & { indeterminate?: boolean } = $props();

	const groupCtx = hasContext(CHECKBOX_GROUP_CONTEXT)
		? getContext<CheckboxGroupContext>(CHECKBOX_GROUP_CONTEXT)
		: undefined;

	const group = $derived(groupCtx && value !== undefined ? groupCtx : undefined);
	const formValue = $derived(value ?? 'on');

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

	const isDisabled = $derived(Boolean(disabled || group?.disabled));
	const isChecked = $derived(
		group && value !== undefined ? group.isChecked(value) : state.checked
	);

	setContext(CHECKBOX_CONTEXT, {
		get checked() {
			return isChecked;
		},
		get disabled() {
			return isDisabled;
		},
		get indeterminate() {
			return indeterminate;
		}
	} satisfies CheckboxContext);

	function toggle(event: Event): void {
		if (isDisabled) return;
		if (group && value !== undefined) {
			group.toggle(value, event);
			return;
		}
		state.setChecked(!state.checked, event);
	}

	const buttonProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type: 'button',
			role: 'checkbox',
			class: className,
			style,
			disabled: isDisabled || undefined,
			'aria-checked': indeterminate ? 'mixed' : isChecked,
			'aria-required': required || undefined,
			'data-checked': isChecked ? '' : undefined,
			'data-unchecked': !isChecked && !indeterminate ? '' : undefined,
			'data-indeterminate': indeterminate ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
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
		{@render children({ checked: isChecked, disabled: isDisabled })}
	{/if}
</button>

{#if name && !isDisabled}
	<input
		type="checkbox"
		{name}
		value={formValue}
		checked={isChecked}
		{required}
		tabindex="-1"
		aria-hidden="true"
		style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
	/>
{/if}
