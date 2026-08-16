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
		readOnly = false,
		name,
		value,
		uncheckedValue,
		form,
		indeterminate = false,
		parent = false,
		class: className,
		style,
		id = useId('checkbox'),
		children,
		...rest
	}: CheckboxRootProps = $props();

	const groupCtx = hasContext(CHECKBOX_GROUP_CONTEXT)
		? getContext<CheckboxGroupContext>(CHECKBOX_GROUP_CONTEXT)
		: undefined;

	const group = $derived(groupCtx && (parent || value !== undefined) ? groupCtx : undefined);
	const formValue = $derived(value ?? 'on');

	const state = createControllableChecked({
		getChecked: () => checked,
		getDefaultChecked: () => defaultChecked,
		onCheckedChange: (next, event) => {
			onCheckedChange?.(next, event);
		},
		setCheckedProp: (next) => {
			checked = next;
		},
	});

	const isDisabled = $derived(Boolean(disabled || group?.disabled));
	const isReadOnly = $derived(Boolean(readOnly));

	const parentAllValues = $derived(group?.allValues ?? []);
	const parentChecked = $derived(
		parent && group
			? parentAllValues.length > 0 && parentAllValues.every((v) => group.isChecked(v))
			: false,
	);
	const parentIndeterminate = $derived(
		parent && group ? parentAllValues.some((v) => group.isChecked(v)) && !parentChecked : false,
	);

	const isChecked = $derived(
		parent && group
			? parentChecked
			: group && value !== undefined
				? group.isChecked(value)
				: state.checked,
	);

	const resolvedIndeterminate = $derived(parent && group ? parentIndeterminate : indeterminate);

	setContext(CHECKBOX_CONTEXT, {
		get checked() {
			return isChecked;
		},
		get disabled() {
			return isDisabled;
		},
		get indeterminate() {
			return resolvedIndeterminate;
		},
	} satisfies CheckboxContext);

	function toggle(event: Event): void {
		if (isDisabled || isReadOnly) return;
		if (parent && group) {
			group.setAll(!parentChecked, event);
			return;
		}
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
			'aria-checked': resolvedIndeterminate ? 'mixed' : isChecked,
			'aria-required': required || undefined,
			'aria-readonly': isReadOnly || undefined,
			'data-checked': isChecked ? '' : undefined,
			'data-unchecked': !isChecked && !resolvedIndeterminate ? '' : undefined,
			'data-indeterminate': resolvedIndeterminate ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			'data-readonly': isReadOnly ? '' : undefined,
			onclick: (event: MouseEvent) => {
				toggle(event);
			},
			onkeydown: (event: KeyboardEvent) => {
				if (event.key === ' ') {
					event.preventDefault();
					toggle(event);
				}
			},
		}),
	);
</script>

<button {...buttonProps}>
	{#if children}
		{@render children({
			checked: isChecked,
			disabled: isDisabled,
			indeterminate: resolvedIndeterminate,
		})}
	{/if}
</button>

{#if name && !isDisabled}
	<input
		type="checkbox"
		{name}
		{form}
		value={formValue}
		checked={isChecked}
		{required}
		readonly={isReadOnly || undefined}
		tabindex="-1"
		aria-hidden="true"
		style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
	/>
	{#if uncheckedValue !== undefined && !isChecked}
		<input type="hidden" {name} {form} value={uncheckedValue} tabindex="-1" aria-hidden="true" />
	{/if}
{/if}
