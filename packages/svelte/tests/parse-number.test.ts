import { describe, expect, it } from 'vitest';
import { parseLocalizedNumber, parseNumberInput } from '../src/number-field/parse-number.js';

describe('parseNumberInput', () => {
	it('parses ASCII numbers when no locale or format is set', () => {
		expect(parseNumberInput('12.5')).toBe(12.5);
		expect(parseNumberInput('-3')).toBe(-3);
		expect(parseNumberInput('')).toBeNull();
		expect(parseNumberInput('1,234')).toBeNull();
	});

	it('parses grouping separators for en-US', () => {
		expect(parseNumberInput('1,234.5', 'en-US')).toBe(1234.5);
		expect(parseNumberInput('1,000', 'en-US')).toBe(1000);
	});

	it('parses comma decimals for de-DE', () => {
		expect(parseNumberInput('1,5', 'de-DE')).toBe(1.5);
		expect(parseNumberInput('1.234,5', 'de-DE')).toBe(1234.5);
	});

	it('parses currency-formatted strings that Number() cannot', () => {
		const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' };
		const formatted = new Intl.NumberFormat('en-US', options).format(1234.5);
		expect(Number(formatted)).toBeNaN();
		expect(parseLocalizedNumber(formatted, 'en-US', options)).toBe(1234.5);
	});

	it('parses percent style back to a ratio', () => {
		const options: Intl.NumberFormatOptions = { style: 'percent' };
		const formatted = new Intl.NumberFormat('en-US', options).format(0.25);
		expect(parseLocalizedNumber(formatted, 'en-US', options)).toBe(0.25);
	});

	it('rejects leftover non-numeric text instead of truncating', () => {
		expect(parseNumberInput('12px', 'en-US')).toBeNull();
		expect(parseNumberInput('abc', 'en-US')).toBeNull();
	});
});
