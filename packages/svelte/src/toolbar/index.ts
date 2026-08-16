import Root from './toolbar-root.svelte';
import Button from './toolbar-button.svelte';
import Link from './toolbar-link.svelte';
import Separator from './toolbar-separator.svelte';
import Group from './toolbar-group.svelte';
import Input from './toolbar-input.svelte';

export const Toolbar = {
	Root,
	Button,
	Link,
	Separator,
	Group,
	Input,
};

export type {
	ToolbarRootProps,
	ToolbarButtonProps,
	ToolbarLinkProps,
	ToolbarSeparatorProps,
	ToolbarGroupProps,
	ToolbarInputProps,
	ToolbarContext,
	ToolbarOrientation,
} from './types.js';
