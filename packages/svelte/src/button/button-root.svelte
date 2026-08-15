<script lang="ts">
	import { useId } from '../internal/controllable.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ButtonRootProps } from './types.js';

	let {
		disabled = false,
		focusableWhenDisabled = false,
		render = 'button',
		type = 'button',
		class: className,
		style,
		id = useId('button'),
		children,
		...rest
	}: ButtonRootProps = $props();

	const isNativeButton = $derived(render === 'button');
	const useAriaDisabled = $derived(disabled && (focusableWhenDisabled || !isNativeButton));
	const nativeDisabled = $derived(disabled && !focusableWhenDisabled && isNativeButton);

	function activate(event: Event): void {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (disabled) {
			event.preventDefault();
			return;
		}
		if (isNativeButton) return;

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			(event.currentTarget as HTMLElement).click();
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			type: isNativeButton ? type : undefined,
			role: isNativeButton ? undefined : 'button',
			disabled: nativeDisabled || undefined,
			'aria-disabled': useAriaDisabled ? true : undefined,
			tabindex: disabled && !focusableWhenDisabled && !isNativeButton ? -1 : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				activate(event);
			},
			onkeydown: onKeyDown
		})
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ disabled })}
	{/if}
</svelte:element>
