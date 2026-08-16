<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { MENUBAR_CONTEXT } from '../internal/context-keys.js';
	import { createHoverDelay } from '../internal/hover-delay.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		MenubarContext,
		MenubarMenuEntry,
		MenubarProps,
		MenubarTriggerEntry,
	} from './types.js';

	let {
		orientation = 'horizontal',
		closeDelay = 150,
		modal = true,
		class: className,
		style,
		id = useId('menubar'),
		children,
		...rest
	}: MenubarProps = $props();

	let menus = $state<MenubarMenuEntry[]>([]);
	let triggers = $state<MenubarTriggerEntry[]>([]);
	let openMenuId = $state<string | null>(null);

	const openOnHover = $derived(openMenuId != null);
	const hover = createHoverDelay(
		() => 0,
		() => closeDelay,
	);

	function registerMenu(entry: MenubarMenuEntry): () => void {
		queueMicrotask(() => {
			const index = menus.findIndex((menu) => menu.id === entry.id);
			if (index >= 0) {
				menus[index] = entry;
			} else {
				menus.push(entry);
			}
		});
		return () => {
			menus = menus.filter((menu) => menu.id !== entry.id);
			if (openMenuId === entry.id) {
				openMenuId = null;
			}
		};
	}

	function registerTrigger(menuId: string, element: HTMLElement): () => void {
		queueMicrotask(() => {
			const index = triggers.findIndex((trigger) => trigger.menuId === menuId);
			const entry: MenubarTriggerEntry = { menuId, element };
			if (index >= 0) {
				triggers[index] = entry;
			} else {
				triggers.push(entry);
			}
		});
		return () => {
			triggers = triggers.filter((trigger) => trigger.menuId !== menuId);
		};
	}

	function closeOthers(exceptMenuId: string): void {
		for (const menu of menus) {
			if (menu.id !== exceptMenuId && menu.getOpen()) {
				menu.setOpen(false, 'imperative-action');
			}
		}
	}

	function onMenuOpenChange(menuId: string, open: boolean): void {
		if (open) {
			hover.cancel();
			closeOthers(menuId);
			openMenuId = menuId;
			return;
		}
		if (openMenuId === menuId) {
			openMenuId = menus.some((menu) => menu.id !== menuId && menu.getOpen())
				? (menus.find((menu) => menu.id !== menuId && menu.getOpen())?.id ?? null)
				: null;
		}
	}

	function cancelClose(): void {
		hover.cancel();
	}

	function closeWithDelay(): void {
		hover.closeWithDelay(() => {
			const idToClose = openMenuId;
			if (idToClose == null) return;
			const menu = menus.find((entry) => entry.id === idToClose);
			menu?.setOpen(false, 'trigger-hover');
		});
	}

	function moveFocus(fromMenuId: string, direction: 1 | -1): void {
		if (triggers.length === 0) return;
		const currentIndex = triggers.findIndex((trigger) => trigger.menuId === fromMenuId);
		if (currentIndex < 0) return;

		const nextIndex = (currentIndex + direction + triggers.length) % triggers.length;
		const next = triggers[nextIndex];
		if (!next) return;

		const shouldOpen = openMenuId != null || menus.some((menu) => menu.getOpen());
		hover.cancel();
		closeOthers(next.menuId);
		if (shouldOpen) {
			const nextMenu = menus.find((menu) => menu.id === next.menuId);
			nextMenu?.setOpen(true, 'imperative-action');
			openMenuId = next.menuId;
		} else {
			openMenuId = null;
		}
		next.element.focus();
	}

	$effect(() => {
		return () => {
			hover.dispose();
		};
	});

	setContext(MENUBAR_CONTEXT, {
		get orientation() {
			return orientation;
		},
		get openOnHover() {
			return openOnHover;
		},
		get closeDelay() {
			return closeDelay;
		},
		get modal() {
			return modal;
		},
		registerMenu,
		registerTrigger,
		moveFocus,
		onMenuOpenChange,
		closeOthers,
		cancelClose,
		closeWithDelay,
	} satisfies MenubarContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'menubar',
			class: className,
			style,
			'aria-orientation': orientation,
			'data-orientation': orientation,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
