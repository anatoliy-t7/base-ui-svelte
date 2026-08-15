import Root from './meter-root.svelte';
import Label from './meter-label.svelte';
import Track from './meter-track.svelte';
import Indicator from './meter-indicator.svelte';
import Value from './meter-value.svelte';

export const Meter = {
	Root,
	Label,
	Track,
	Indicator,
	Value
};

export type {
	MeterRootProps,
	MeterLabelProps,
	MeterTrackProps,
	MeterIndicatorProps,
	MeterValueProps,
	MeterContext,
	MeterStatus
} from './types.js';
