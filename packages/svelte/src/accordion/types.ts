import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { createPresence } from '../internal/presence.svelte.js';

export type AccordionOrientation = 'horizontal' | 'vertical';

export type AccordionValue = string | string[];

export type AccordionContext = {
	readonly openValues: string[];
	isOpen(value: string): boolean;
	toggle(value: string): void;
	readonly multiple: boolean;
	readonly disabled: boolean;
	readonly orientation: AccordionOrientation;
	registerItem(value: string): () => void;
	getTriggerId(value: string): string;
	getPanelId(value: string): string;
};

export type AccordionItemContext = {
	readonly value: string;
	readonly open: boolean;
	readonly disabled: boolean;
	readonly triggerId: string;
	readonly panelId: string;
	readonly presence: ReturnType<typeof createPresence>;
};

export type AccordionRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: AccordionValue | undefined;
	defaultValue?: AccordionValue;
	onValueChange?: ((value: AccordionValue) => void) | undefined;
	multiple?: boolean;
	disabled?: boolean;
	orientation?: AccordionOrientation;
	children?: Snippet<[{ openValues: string[] }]>;
};

export type AccordionItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string;
	disabled?: boolean;
	children?: Snippet<[{ open: boolean; disabled: boolean }]>;
};

export type AccordionHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AccordionTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	children?: Snippet;
};

export type AccordionPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
	keepMounted?: boolean;
	role?: string | undefined;
	children?: Snippet;
};
