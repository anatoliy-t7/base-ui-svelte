import Root from './tabs-root.svelte';
import List from './tabs-list.svelte';
import Tab from './tabs-tab.svelte';
import Panel from './tabs-panel.svelte';
import Indicator from './tabs-indicator.svelte';

export const Tabs = {
	Root,
	List,
	Tab,
	Panel,
	Indicator
};

export type {
	TabsRootProps,
	TabsContext,
	TabsListProps,
	TabsTabProps,
	TabsPanelProps,
	TabsIndicatorProps,
	TabsOrientation
} from './types.js';
