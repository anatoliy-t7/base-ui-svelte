import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';

export type MenubarOrientation = 'horizontal' | 'vertical';

export type MenubarMenuEntry = {
	id: string;
	setOpen: (open: boolean, reason: OpenChangeReason) => void;
	getOpen: () => boolean;
};

export type MenubarTriggerEntry = {
	menuId: string;
	element: HTMLElement;
};

export type MenubarContext = {
	readonly orientation: MenubarOrientation;
	readonly openOnHover: boolean;
	readonly closeDelay: number;
	readonly modal: boolean;
	registerMenu(entry: MenubarMenuEntry): () => void;
	registerTrigger(menuId: string, element: HTMLElement): () => void;
	moveFocus(fromMenuId: string, direction: 1 | -1): void;
	onMenuOpenChange(menuId: string, open: boolean): void;
	closeOthers(exceptMenuId: string): void;
	cancelClose(): void;
	closeWithDelay(): void;
};

export type MenubarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
	orientation?: MenubarOrientation;
	/** Delay before closing after pointer leaves (ms). @default 150 */
	closeDelay?: number;
	/**
	 * Whether menus in this menubar lock document scroll when open.
	 * @default true
	 */
	modal?: boolean;
	children?: Snippet;
};
