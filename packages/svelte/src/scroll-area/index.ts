import Root from './scroll-area-root.svelte';
import Viewport from './scroll-area-viewport.svelte';
import Content from './scroll-area-content.svelte';
import Scrollbar from './scroll-area-scrollbar.svelte';
import Thumb from './scroll-area-thumb.svelte';
import Corner from './scroll-area-corner.svelte';

export const ScrollArea = {
	Root,
	Viewport,
	Content,
	Scrollbar,
	Thumb,
	Corner
};

export type {
	ScrollAreaRootProps,
	ScrollAreaViewportProps,
	ScrollAreaContentProps,
	ScrollAreaScrollbarProps,
	ScrollAreaThumbProps,
	ScrollAreaCornerProps,
	ScrollAreaContext,
	ScrollAreaMetrics,
	ScrollAreaOrientation
} from './types.js';
