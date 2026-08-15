import type { Snippet } from 'svelte';

export type CspContext = {
	readonly nonce: string | undefined;
};

export type CspProviderProps = {
	/** Nonce applied to future inline `<style>` tags for CSP compliance. */
	nonce?: string | undefined;
	children?: Snippet;
};
