import Root from './progress-root.svelte';
import Label from './progress-label.svelte';
import Track from './progress-track.svelte';
import Indicator from './progress-indicator.svelte';
import Value from './progress-value.svelte';

export const Progress = {
	Root,
	Label,
	Track,
	Indicator,
	Value
};

export type {
	ProgressRootProps,
	ProgressLabelProps,
	ProgressTrackProps,
	ProgressIndicatorProps,
	ProgressValueProps,
	ProgressContext,
	ProgressStatus
} from './types.js';
