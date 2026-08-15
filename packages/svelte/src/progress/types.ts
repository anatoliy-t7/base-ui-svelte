import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ProgressStatus = 'indeterminate' | 'progressing' | 'complete';

export type ProgressContext = {
	readonly value: number | null;
	readonly min: number;
	readonly max: number;
	readonly status: ProgressStatus;
	readonly formattedValue: string | null;
	readonly labelId: string;
};

export type ProgressRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: number | null;
	min?: number;
	max?: number;
	format?: Intl.NumberFormatOptions | undefined;
	getAriaValueText?:
		| ((formattedValue: string | null, value: number | null) => string | undefined)
		| undefined;
	locale?: Intl.LocalesArgument | undefined;
	children?: Snippet;
};

export type ProgressLabelProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type ProgressTrackProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ProgressIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ProgressValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet<[formattedValue: string | null, value: number | null]>;
};
