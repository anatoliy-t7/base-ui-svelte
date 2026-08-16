<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import {
		createControllableOpen,
		useId,
		type OpenChangeReason
	} from '../internal/controllable.svelte.js';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { createHoverDelay } from '../internal/hover-delay.svelte.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		MenuContext,
		MenuItemEntry,
		MenuRefs,
		MenuSubmenuEntry,
		MenuSubmenuRootProps
	} from './types.js';

	const SUBMENU_OPEN_DELAY = 100;
	const SUBMENU_CLOSE_DELAY = 150;

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		class: className,
		style,
		id = useId('menu-submenu'),
		children,
		...rest
	}: MenuSubmenuRootProps = $props();

	const parentMenu = getContext<MenuContext>(MENU_CONTEXT);
	const menuId = useId('menu-submenu-root');

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

	const hover = createHoverDelay(
		() => SUBMENU_OPEN_DELAY,
		() => SUBMENU_CLOSE_DELAY
	);

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		hover.cancel();
		if (next) {
			parentMenu.closeSubmenus(menuId);
		} else {
			closeSubmenus();
		}
		openState.setOpen(next, reason);
	}

	function openWithHoverDelay(reason: OpenChangeReason): void {
		if (openState.open) {
			hover.cancel();
			return;
		}
		hover.openWithDelay(() => {
			setOpen(true, reason);
		});
	}

	function closeWithHoverDelay(reason: OpenChangeReason): void {
		hover.closeWithDelay(() => {
			setOpen(false, reason);
		});
	}

	function cancelHover(): void {
		hover.cancel();
	}

	const presence = createPresence(() => openState.open);

	const refs: MenuRefs = {
		trigger: null,
		popup: null,
		positioner: null,
		arrow: null
	};

	const triggerId = useId('menu-submenu-trigger');
	const popupId = useId('menu-submenu-popup');

	let items = $state<MenuItemEntry[]>([]);
	let highlightedId = $state<string | null>(null);
	let submenus = $state<MenuSubmenuEntry[]>([]);

	function getEnabledItems(): MenuItemEntry[] {
		return items.filter((item) => !item.disabled);
	}

	function setHighlighted(nextId: string | null): void {
		highlightedId = nextId;
		if (nextId == null) return;
		const entry = items.find((item) => item.id === nextId);
		entry?.element.focus();
	}

	function registerItem(itemId: string, element: HTMLElement, disabled: boolean): () => void {
		queueMicrotask(() => {
			const index = items.findIndex((item) => item.id === itemId);
			const entry: MenuItemEntry = { id: itemId, element, disabled };
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

	function registerSubmenu(entry: MenuSubmenuEntry): () => void {
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

	$effect(() => {
		return parentMenu.registerSubmenu({
			id: menuId,
			triggerId,
			setOpen,
			getOpen: () => openState.open
		});
	});

	$effect(() => {
		return () => {
			hover.dispose();
		};
	});

	setContext(MENU_CONTEXT, {
		get open() {
			return openState.open;
		},
		setOpen,
		openWithHoverDelay,
		closeWithHoverDelay,
		cancelHover,
		get openOnHover() {
			return true;
		},
		get delay() {
			return SUBMENU_OPEN_DELAY;
		},
		get closeDelay() {
			return SUBMENU_CLOSE_DELAY;
		},
		menuId,
		triggerId,
		popupId,
		refs,
		presence,
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
		isSubmenu: true,
		parentMenu,
		registerSubmenu,
		closeSubmenus
	} satisfies MenuContext);

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
