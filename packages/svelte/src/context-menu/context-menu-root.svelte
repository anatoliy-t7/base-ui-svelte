<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ContextMenuAnchorPoint,
		ContextMenuContext,
		ContextMenuItemEntry,
		ContextMenuRefs,
		ContextMenuRootProps,
		ContextMenuSubmenuEntry
	} from './types.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		class: className,
		style,
		id = useId('context-menu'),
		children,
		...rest
	}: ContextMenuRootProps = $props();

	const menuId = useId('context-menu-root');

	const openState = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
		},
		setOpenProp: (next) => {
			open = next;
		}
	});

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		if (!next) {
			closeSubmenus();
		}
		openState.setOpen(next, reason);
	}

	const presence = createPresence(() => openState.open);

	const refs: ContextMenuRefs = {
		trigger: null,
		popup: null,
		positioner: null,
		arrow: null
	};

	const triggerId = useId('context-menu-trigger');
	const popupId = useId('context-menu-popup');

	let items = $state<ContextMenuItemEntry[]>([]);
	let highlightedId = $state<string | null>(null);
	let anchorPoint = $state<ContextMenuAnchorPoint | null>(null);
	let submenus = $state<ContextMenuSubmenuEntry[]>([]);

	function getEnabledItems(): ContextMenuItemEntry[] {
		return items.filter((item) => !item.disabled);
	}

	function setHighlighted(nextId: string | null): void {
		highlightedId = nextId;
		if (nextId == null) return;
		const entry = items.find((item) => item.id === nextId);
		entry?.element.focus();
	}

	function setAnchorPoint(point: ContextMenuAnchorPoint | null): void {
		anchorPoint = point;
	}

	function registerItem(itemId: string, element: HTMLElement, disabled: boolean): () => void {
		queueMicrotask(() => {
			const index = items.findIndex((item) => item.id === itemId);
			const entry: ContextMenuItemEntry = { id: itemId, element, disabled };
			if (index >= 0) {
				items[index] = entry;
			} else {
				items.push(entry);
			}
		});
		return () => {
			items = items.filter((item) => item.id !== itemId);
			if (highlightedId === itemId) {
				highlightedId = null;
			}
		};
	}

	function registerSubmenu(entry: ContextMenuSubmenuEntry): () => void {
		queueMicrotask(() => {
			const index = submenus.findIndex((submenu) => submenu.id === entry.id);
			if (index >= 0) {
				submenus[index] = entry;
			} else {
				submenus.push(entry);
			}
		});
		return () => {
			submenus = submenus.filter((submenu) => submenu.id !== entry.id);
		};
	}

	function closeSubmenus(exceptId?: string): void {
		for (const submenu of submenus) {
			if (exceptId !== undefined && submenu.id === exceptId) continue;
			if (submenu.getOpen()) {
				submenu.setOpen(false, 'imperative-action');
			}
		}
	}

	function highlightNext(): void {
		const enabled = getEnabledItems();
		if (enabled.length === 0) return;
		const current = enabled.findIndex((item) => item.id === highlightedId);
		const next = enabled[(current + 1) % enabled.length];
		if (next) setHighlighted(next.id);
	}

	function highlightPrevious(): void {
		const enabled = getEnabledItems();
		if (enabled.length === 0) return;
		const current = enabled.findIndex((item) => item.id === highlightedId);
		const next = enabled[current <= 0 ? enabled.length - 1 : current - 1];
		if (next) setHighlighted(next.id);
	}

	function highlightFirst(): void {
		const enabled = getEnabledItems();
		if (enabled[0]) setHighlighted(enabled[0].id);
	}

	function highlightLast(): void {
		const enabled = getEnabledItems();
		const last = enabled[enabled.length - 1];
		if (last) setHighlighted(last.id);
	}

	function activateHighlighted(): void {
		const entry = items.find((item) => item.id === highlightedId && !item.disabled);
		entry?.element.click();
	}

	$effect(() => {
		if (!openState.open) {
			highlightedId = null;
		}
	});

	setContext(CONTEXT_MENU_CONTEXT, {
		get open() {
			return openState.open;
		},
		setOpen,
		menuId,
		triggerId,
		popupId,
		refs,
		presence,
		get anchorPoint() {
			return anchorPoint;
		},
		setAnchorPoint,
		get highlightedId() {
			return highlightedId;
		},
		setHighlighted,
		registerItem,
		getItems: () => items,
		highlightNext,
		highlightPrevious,
		highlightFirst,
		highlightLast,
		activateHighlighted,
		isSubmenu: false,
		parentMenu: null,
		registerSubmenu,
		closeSubmenus
	} satisfies ContextMenuContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: openState.open })}
	{/if}
</div>
