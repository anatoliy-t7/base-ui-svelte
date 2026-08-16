import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';

export type NumberFieldContext = {
	readonly value: number | null;
	readonly inputValue: string;
	setValue(value: number | null, event: Event): void;
	setInputValue(value: string, event?: Event): void;
	commitInput(event: Event): void;
	increment(event: Event): void;
	decrement(event: Event): void;
	setInputFocused(focused: boolean): void;
	readonly scrubbing: boolean;
	startScrub(clientX: number, event: PointerEvent, pixelSensitivity?: number): void;
	moveScrub(clientX: number, event: PointerEvent): void;
	endScrub(event?: Event): void;
	readonly scrubPointer: { x: number; y: number } | null;
	readonly min: number | undefined;
	readonly max: number | undefined;
	readonly step: number;
	readonly smallStep: number;
	readonly largeStep: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly name: string | undefined;
	readonly form: string | undefined;
	readonly inputId: string;
	readonly canIncrement: boolean;
	readonly canDecrement: boolean;
};

export type NumberFieldRootProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'onValueChange'
> & {
	value?: number | null | undefined;
	defaultValue?: number | null;
	onValueChange?: ((value: number | null, event: Event) => void) | undefined;
	/** Called when the value is committed (blur, Enter, scrub end). */
	onValueCommitted?: ((value: number | null, event: Event) => void) | undefined;
	min?: number | undefined;
	max?: number | undefined;
	step?: number;
	/** Step used with Alt. @default 1 */
	smallStep?: number;
	/** Step used with Shift. @default 10 */
	largeStep?: number;
	/** When true, skip min/max clamping. @default false */
	allowOutOfRange?: boolean;
	/** When true, snap to step from min. @default true */
	snapOnStep?: boolean;
	locale?: Intl.LocalesArgument | undefined;
	format?: Intl.NumberFormatOptions | undefined;
	disabled?: boolean;
	readOnly?: boolean;
	name?: string | undefined;
	form?: string | undefined;
	required?: boolean;
	children?: Snippet<[{ value: number | null; disabled: boolean }]>;
};

export type NumberFieldGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type NumberFieldInputProps = Omit<
	HTMLInputAttributes,
	'children' | 'disabled' | 'type' | 'value' | 'readonly'
> & {
	disabled?: boolean;
	readOnly?: boolean;
};

export type NumberFieldDecrementProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type NumberFieldIncrementProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type NumberFieldScrubAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	pixelSensitivity?: number;
	children?: Snippet;
};

export type NumberFieldScrubAreaCursorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};
