import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ToastData, ToastManager } from './manager.svelte.js';

export type ToastContext = ToastManager & {
	readonly toast: ToastData | null;
	readonly toastIndex: number;
	readonly toastVisibleIndex: number;
	readonly toastOffsetY: number;
	readonly toastOpen: boolean;
	readonly presenceStarting: boolean;
	readonly presenceEnding: boolean;
};

export type ToastProviderProps = {
	toaster?: ToastManager | undefined;
	timeout?: number | undefined;
	limit?: number | undefined;
	children?: Snippet;
};

export type ToastPortalProps = {
	children?: Snippet;
};

export type ToastViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToastSwipeDirection = 'up' | 'down' | 'left' | 'right';

export type ToastRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	toast: ToastData;
	swipeDirection?: ToastSwipeDirection | ToastSwipeDirection[] | undefined;
	children?: Snippet;
};

export type ToastContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToastTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	children?: Snippet;
};

export type ToastDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type ToastCloseProps = Omit<HTMLButtonAttributes, 'children'> & {
	children?: Snippet;
};

export type ToastActionProps = Omit<HTMLButtonAttributes, 'children'> & {
	children?: Snippet;
};

export type ToastPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	children?: Snippet;
};

export type ToastArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type {
	ToastData,
	ToastAddInput,
	ToastManager,
	ToastActionPropsData,
	ToastManagerOptions,
	ToastPromiseOptions,
	ToastTransitionStatus,
	ToastUpdateInput,
} from './manager.svelte.js';
