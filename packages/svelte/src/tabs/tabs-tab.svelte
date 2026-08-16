<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TabsContext, TabsTabProps } from './types.js';

	type TabEntry = {
		id: string;
		value: string;
		element: HTMLElement;
	};

	type TabsContextInternal = TabsContext & {
		activateTab: (tabValue: string) => void;
		getTabs: () => TabEntry[];
	};

	let {
		value,
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: TabsTabProps = $props();

	const ctx = getContext<TabsContextInternal>(TABS_CONTEXT);

	const selected = $derived(ctx.value === value);
	const tabId = $derived(ctx.getTabId(value));
	const panelId = $derived(ctx.getPanelId(value));

	function activate(tabValue: string): void {
		if (disabled) return;
		ctx.activateTab(tabValue);
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (disabled) return;

		const { orientation } = ctx;
		const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
		const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

		const tabs = ctx.getTabs().filter((tab) => {
			const el = tab.element;
			return !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
		});

		if (tabs.length === 0) return;

		const currentIndex = tabs.findIndex((tab) => tab.value === value);
		if (currentIndex === -1) return;

		let nextIndex = currentIndex;

		if (event.key === prevKey) {
			event.preventDefault();
			nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
		} else if (event.key === nextKey) {
			event.preventDefault();
			nextIndex = (currentIndex + 1) % tabs.length;
		} else if (event.key === 'Home') {
			event.preventDefault();
			nextIndex = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			nextIndex = tabs.length - 1;
		} else {
			return;
		}

		const next = tabs[nextIndex];
		if (next) activate(next.value);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: tabId,
			type: 'button',
			role: 'tab',
			class: className,
			style,
			disabled: disabled || undefined,
			tabindex: selected ? 0 : -1,
			'aria-selected': selected,
			'aria-controls': panelId,
			'aria-disabled': disabled || undefined,
			'data-selected': selected ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			'data-orientation': ctx.orientation,
			onclick: () => {
				activate(value);
			},
			onkeydown: onKeyDown,
		}),
	);
</script>

<button
	{...mergedProps}
	{@attach (element) => ctx.registerTab(ctx.getTabId(value), value, element)}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ selected, disabled })}
	{/if}
</button>
