<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToolbarContext, ToolbarItemRegistration, ToolbarRootProps } from './types.js';

	let {
		orientation = 'horizontal',
		class: className,
		style,
		id = useId('toolbar'),
		children,
		...rest
	}: ToolbarRootProps = $props();

	let items = $state<ToolbarItemRegistration[]>([]);
	let activeId = $state<string | null>(null);

	function isItemFocusable(item: ToolbarItemRegistration): boolean {
		if (!item.disabled) return true;
		return item.focusableWhenDisabled;
	}

	function getFocusableItems(): ToolbarItemRegistration[] {
		return items.filter(isItemFocusable);
	}

	function ensureActiveId(): void {
		const focusable = getFocusableItems();
		if (focusable.length === 0) {
			activeId = null;
			return;
		}
		if (activeId && focusable.some((item) => item.id === activeId)) return;
		activeId = focusable[0]?.id ?? null;
	}

	function registerItem(item: ToolbarItemRegistration): () => void {
		queueMicrotask(() => {
			if (items.some((existing) => existing.id === item.id)) {
				items = items.map((existing) => (existing.id === item.id ? item : existing));
			} else {
				items = [...items, item];
			}
			ensureActiveId();
		});
		return () => {
			items = items.filter((existing) => existing.id !== item.id);
			ensureActiveId();
		};
	}

	function setActiveId(next: string): void {
		activeId = next;
	}

	function focusItem(nextId: string): void {
		activeId = nextId;
		const item = items.find((entry) => entry.id === nextId);
		item?.element.focus();
	}

	function moveFocus(fromId: string, direction: 1 | -1): void {
		const focusable = getFocusableItems();
		if (focusable.length === 0) return;
		const currentIndex = focusable.findIndex((item) => item.id === fromId);
		if (currentIndex === -1) return;
		const nextIndex = (currentIndex + direction + focusable.length) % focusable.length;
		const next = focusable[nextIndex];
		if (next) focusItem(next.id);
	}

	function getTabIndex(itemId: string): 0 | -1 {
		return activeId === itemId ? 0 : -1;
	}

	setContext(TOOLBAR_CONTEXT, {
		get orientation() {
			return orientation;
		},
		get activeId() {
			return activeId;
		},
		registerItem,
		setActiveId,
		focusItem,
		moveFocus,
		getTabIndex,
	} satisfies ToolbarContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'toolbar',
			class: className,
			style,
			'aria-orientation': orientation,
			'data-orientation': orientation,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ orientation })}
	{/if}
</div>
