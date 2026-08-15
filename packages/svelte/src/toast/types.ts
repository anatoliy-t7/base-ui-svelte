import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ToastData, ToastManager } from './manager.svelte.js';

export type ToastContext = ToastManager & {
	readonly toast: ToastData | null;
};

export type ToastProviderProps = {
	toaster?: ToastManager | undefined;
	children?: Snippet;
};

export type ToastPortalProps = {
	children?: Snippet;
};

export type ToastViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToastRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	toast: ToastData;
	children?: Snippet;
};

export type ToastContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToastTitleProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ToastDescriptionProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
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

export type { ToastData, ToastAddInput, ToastManager, ToastActionPropsData } from './manager.svelte.js';
