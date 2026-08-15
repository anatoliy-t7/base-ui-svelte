import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TextDirection } from '../direction-provider/types.js';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderValue = number | number[];

export type SliderContext = {
	readonly values: number[];
	/** First value; kept for single-thumb backward compatibility. */
	readonly value: number;
	readonly range: boolean;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly disabled: boolean;
	readonly orientation: SliderOrientation;
	readonly direction: TextDirection;
	readonly labelId: string;
	readonly thumbId: string;
	readonly percentage: number;
	readonly percentages: number[];
	readonly percentageStart: number;
	readonly percentageEnd: number;
	readonly formattedValue: string;
	readonly formattedValues: string[];
	readonly activeThumbIndex: number;
	claimThumbIndex: (explicit?: number | undefined) => number;
	getThumbId: (index: number) => string;
	setActiveThumbIndex: (index: number) => void;
	setThumbValue: (index: number, next: number, event: Event) => void;
	setValueFromPointer: (pointerValue: number, event: Event, preferredIndex?: number) => void;
};

export type SliderRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onValueChange'> & {
	value?: SliderValue | undefined;
	defaultValue?: SliderValue;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	orientation?: SliderOrientation;
	name?: string | undefined;
	format?: Intl.NumberFormatOptions | undefined;
	locale?: Intl.LocalesArgument | undefined;
	onValueChange?: ((value: SliderValue, event: Event) => void) | undefined;
	children?: Snippet;
};

export type SliderLabelProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type SliderValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet<[formattedValue: string, value: SliderValue]>;
};

export type SliderControlProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SliderTrackProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SliderIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SliderThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	/** Index into the value array for range sliders (recommended for SSR). */
	index?: number | undefined;
	children?: Snippet;
};
