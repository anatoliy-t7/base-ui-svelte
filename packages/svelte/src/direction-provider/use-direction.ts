import { getContext, hasContext } from 'svelte';
import { DIRECTION_CONTEXT } from '../internal/context-keys.js';
import type { DirectionContext, TextDirection } from './types.js';

/**
 * Reads the current text direction from the nearest DirectionProvider.
 * Defaults to `'ltr'` when no provider is present.
 */
export function useDirection(): TextDirection {
	if (!hasContext(DIRECTION_CONTEXT)) {
		return 'ltr';
	}
	return getContext<DirectionContext>(DIRECTION_CONTEXT).direction;
}
