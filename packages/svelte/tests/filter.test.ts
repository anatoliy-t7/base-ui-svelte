import { describe, expect, it } from 'vitest';
import { useFilter } from '../src/internal/filter.js';

describe('useFilter', () => {
	it('matches contains, startsWith, and endsWith', () => {
		const filter = useFilter();

		expect(filter.contains('Hello world', 'ell')).toBe(true);
		expect(filter.contains('Hello world', 'xyz')).toBe(false);
		expect(filter.startsWith('Hello world', 'Hel')).toBe(true);
		expect(filter.startsWith('Hello world', 'wor')).toBe(false);
		expect(filter.endsWith('Hello world', 'rld')).toBe(true);
		expect(filter.endsWith('Hello world', 'Hel')).toBe(false);
	});

	it('uses itemToString and object labels', () => {
		const filter = useFilter();

		expect(filter.contains({ label: 'Apple' }, 'app')).toBe(true);
		expect(
			filter.contains({ id: 1 }, 'pear', (item) => (item.id === 1 ? 'pear' : '')),
		).toBe(true);
	});
});
