<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { TABS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TabsContext, TabsRootProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		orientation = 'horizontal',
		class: className,
		style,
		id = useId('tabs'),
		children,
		...rest
	}: TabsRootProps = $props();

	let uncontrolled = $state<string | undefined>(undefined);

	const isControlled = $derived(value !== undefined);
	const currentValue = $derived(
		isControlled ? String(value) : (uncontrolled ?? defaultValue)
	);

	type TabEntry = {
		id: string;
		value: string;
		element: HTMLElement;
	};

	let tabs = $state<TabEntry[]>([]);

	function setValue(next: string): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		onValueChange?.(next);
	}

	function activateTab(tabValue: string): void {
		setValue(tabValue);
		const entry = tabs.find((tab) => tab.value === tabValue);
		entry?.element.focus();
	}

	function registerTab(tabId: string, tabValue: string, element: HTMLElement): () => void {
		queueMicrotask(() => {
			if (tabs.some((tab) => tab.id === tabId)) return;
			tabs.push({ id: tabId, value: tabValue, element });
		});
		return () => {
			tabs = tabs.filter((tab) => tab.id !== tabId);
		};
	}

	function getTabId(tabValue: string): string {
		return `${id}-tab-${tabValue}`;
	}

	function getPanelId(panelValue: string): string {
		return `${id}-panel-${panelValue}`;
	}

	const context: TabsContext & {
		activateTab: (tabValue: string) => void;
		getTabs: () => TabEntry[];
	} = {
		get value() {
			return currentValue;
		},
		get orientation() {
			return orientation;
		},
		registerTab,
		setValue,
		getTabId,
		getPanelId,
		activateTab,
		getTabs: () => tabs
	};

	setContext(TABS_CONTEXT, context);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-orientation': orientation
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, orientation })}
	{/if}
</div>
