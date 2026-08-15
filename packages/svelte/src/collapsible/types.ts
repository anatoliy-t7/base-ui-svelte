import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type CollapsibleContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly disabled: boolean;
	readonly triggerId: string;
	readonly panelId: string;
	readonly presence: ReturnType<typeof createPresence>;
};

export type CollapsibleRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	disabled?: boolean;
	children?: Snippet<[{ open: boolean }]>;
};

export type CollapsibleTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	children?: Snippet;
};

export type CollapsiblePanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
	keepMounted?: boolean;
	role?: string | undefined;
	children?: Snippet;
};
