import { getContext, hasContext } from 'svelte';
import { CSP_CONTEXT } from '../internal/context-keys.js';
import type { CspContext } from './types.js';

/**
 * Reads the CSP nonce from the nearest CspProvider, if any.
 */
export function useNonce(): string | undefined {
	if (!hasContext(CSP_CONTEXT)) {
		return undefined;
	}
	return getContext<CspContext>(CSP_CONTEXT).nonce;
}
