import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DirectionProviderTest from './direction-provider.test.svelte';
import DirectionReader from './direction-reader.test.svelte';

describe('DirectionProvider', () => {
	it('defaults to ltr without a provider', () => {
		render(DirectionReader);
		expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
	});

	it('provides rtl through context', () => {
		render(DirectionProviderTest, { props: { direction: 'rtl' } });
		expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
	});
});
