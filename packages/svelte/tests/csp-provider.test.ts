import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CspProviderTest from './csp-provider.test.svelte';
import CspReader from './csp-reader.test.svelte';

describe('CspProvider', () => {
	it('returns undefined outside a provider', () => {
		render(CspReader);
		expect(screen.getByTestId('nonce')).toHaveTextContent('none');
	});

	it('provides nonce through context', () => {
		render(CspProviderTest, { props: { nonce: 'abc123' } });
		expect(screen.getByTestId('nonce')).toHaveTextContent('abc123');
	});
});
