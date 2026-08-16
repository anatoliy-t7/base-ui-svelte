import type { Snippet } from 'svelte';
import type {
	HTMLAnchorAttributes,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes,
} from 'svelte/elements';

export type ToolbarOrientation = 'horizontal' | 'vertical';

export type ToolbarItemKind = 'button' | 'link' | 'input';

export type ToolbarItemRegistration = {
	id: string;
	element: HTMLElement;
	kind: ToolbarItemKind;
	disabled: boolean;
	focusableWhenDisabled: boolean;
};

export type ToolbarContext = {
	readonly orientation: ToolbarOrientation;
	readonly activeId: string | null;
	registerItem: (item: ToolbarItemRegistration) => () => void;
	setActiveId: (id: string) => void;
	focusItem: (id: string) => void;
	moveFocus: (fromId: string, direction: 1 | -1) => void;
	getTabIndex: (id: string) => 0 | -1;
};

export type ToolbarRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	orientation?: ToolbarOrientation;
	children?: Snippet<[{ orientation: ToolbarOrientation }]>;
};

export type ToolbarButtonProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'type'> & {
	disabled?: boolean;
	focusableWhenDisabled?: boolean;
	type?: 'button' | 'submit' | 'reset' | undefined;
	children?: Snippet<[{ disabled: boolean }]>;
};

export type ToolbarLinkProps = Omit<HTMLAnchorAttributes, 'children'> & {
	children?: Snippet;
};

export type ToolbarSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	orientation?: ToolbarOrientation | undefined;
};

export type ToolbarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToolbarInputProps = Omit<HTMLInputAttributes, 'children' | 'disabled' | 'value'> & {
	disabled?: boolean;
	focusableWhenDisabled?: boolean;
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	children?: Snippet;
};
