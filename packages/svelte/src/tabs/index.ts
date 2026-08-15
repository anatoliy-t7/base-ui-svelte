import Root from './tabs-root.svelte';
import List from './tabs-list.svelte';
import Tab from './tabs-tab.svelte';
import Panel from './tabs-panel.svelte';

export const Tabs = {
	Root,
	List,
	Tab,
	Panel
};

export type {
	TabsRootProps,
	TabsContext,
	TabsListProps,
	TabsTabProps,
	TabsPanelProps,
	TabsOrientation
} from './types.js';
