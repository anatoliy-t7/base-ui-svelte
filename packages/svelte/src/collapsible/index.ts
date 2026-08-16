import Root from './collapsible-root.svelte';
import Trigger from './collapsible-trigger.svelte';
import Panel from './collapsible-panel.svelte';

export const Collapsible = {
	Root,
	Trigger,
	Panel,
};

export type {
	CollapsibleRootProps,
	CollapsibleTriggerProps,
	CollapsiblePanelProps,
	CollapsibleContext,
} from './types.js';
