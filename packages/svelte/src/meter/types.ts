import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type MeterStatus = 'progressing' | 'complete';

export type MeterContext = {
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly status: MeterStatus;
	readonly formattedValue: string;
	readonly labelId: string;
};

export type MeterRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value: number;
	min?: number;
	max?: number;
	format?: Intl.NumberFormatOptions | undefined;
	getAriaValueText?: ((formattedValue: string, value: number) => string | undefined) | undefined;
	locale?: Intl.LocalesArgument | undefined;
	children?: Snippet;
};

export type MeterLabelProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type MeterTrackProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type MeterIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type MeterValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet<[formattedValue: string, value: number]>;
};
