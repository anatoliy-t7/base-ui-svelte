import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ScrollAreaOrientation = 'vertical' | 'horizontal';

export type ScrollAreaMetrics = {
	readonly scrollTop: number;
	readonly scrollLeft: number;
	readonly scrollHeight: number;
	readonly scrollWidth: number;
	readonly clientHeight: number;
	readonly clientWidth: number;
};

export type ScrollAreaContext = {
	readonly viewport: HTMLElement | null;
	readonly metrics: ScrollAreaMetrics;
	readonly scrolling: boolean;
	setViewport: (node: HTMLElement | null) => void;
	scrollTo: (options: { top?: number; left?: number }) => void;
	refreshMetrics: () => void;
	markScrolling: () => void;
};

export type ScrollAreaRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	/**
	 * Distance from an edge (px) at which overflow data attributes become active.
	 * @default 0
	 */
	overflowEdgeThreshold?: number | { top?: number; right?: number; bottom?: number; left?: number };
	children?: Snippet;
};

export type ScrollAreaViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ScrollAreaContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ScrollAreaScrollbarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	orientation?: ScrollAreaOrientation;
	keepMounted?: boolean;
	children?: Snippet;
};

export type ScrollAreaThumbProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ScrollAreaCornerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ScrollbarContext = {
	readonly orientation: ScrollAreaOrientation;
};
