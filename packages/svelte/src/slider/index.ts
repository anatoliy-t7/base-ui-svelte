import Root from './slider-root.svelte';
import Label from './slider-label.svelte';
import Value from './slider-value.svelte';
import Control from './slider-control.svelte';
import Track from './slider-track.svelte';
import Indicator from './slider-indicator.svelte';
import Thumb from './slider-thumb.svelte';

export const Slider = {
	Root,
	Label,
	Value,
	Control,
	Track,
	Indicator,
	Thumb
};

export type {
	SliderRootProps,
	SliderLabelProps,
	SliderValueProps,
	SliderControlProps,
	SliderTrackProps,
	SliderIndicatorProps,
	SliderThumbProps,
	SliderContext,
	SliderOrientation,
	SliderValue
} from './types.js';
