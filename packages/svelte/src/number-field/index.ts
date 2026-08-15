import Root from './number-field-root.svelte';
import Group from './number-field-group.svelte';
import Decrement from './number-field-decrement.svelte';
import Input from './number-field-input.svelte';
import Increment from './number-field-increment.svelte';
import ScrubArea from './number-field-scrub-area.svelte';
import ScrubAreaCursor from './number-field-scrub-area-cursor.svelte';

export const NumberField = {
	Root,
	Group,
	Decrement,
	Input,
	Increment,
	ScrubArea,
	ScrubAreaCursor
};

export type {
	NumberFieldRootProps,
	NumberFieldGroupProps,
	NumberFieldDecrementProps,
	NumberFieldInputProps,
	NumberFieldIncrementProps,
	NumberFieldScrubAreaProps,
	NumberFieldScrubAreaCursorProps,
	NumberFieldContext
} from './types.js';
