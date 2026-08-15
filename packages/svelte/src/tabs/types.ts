import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type TabsOrientation = 'horizontal' | 'vertical';

export type TabsRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string) => void) | undefined;
	orientation?: TabsOrientation;
	children?: Snippet<[{ value: string; orientation: TabsOrientation }]>;
};

export type TabsContext = {
	readonly value: string;
	readonly orientation: TabsOrientation;
	registerTab(id: string, value: string, element: HTMLElement): () => void;
	setValue(next: string): void;
	getTabId(value: string): string;
	getPanelId(value: string): string;
};

export type TabsListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type TabsTabProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'value'> & {
	value: string;
	disabled?: boolean;
	children?: Snippet<[{ selected: boolean; disabled: boolean }]>;
};

export type TabsPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value: string;
	children?: Snippet;
};
