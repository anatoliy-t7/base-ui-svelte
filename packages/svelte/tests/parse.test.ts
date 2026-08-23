import { describe, expect, it } from 'vitest';
import { getNumberLocaleDetails, parseNumber } from '../src/number-field/utils/parse.js';

describe('NumberField parse', () => {
	describe('getNumberLocaleDetails', () => {
		it('returns the number locale details', () => {
			const details = getNumberLocaleDetails('en-US');
			expect(details.decimal).toBe('.');
			expect(details.group).toBe(',');
			expect(details.currency).toBe(undefined);
			expect(details.unit).toBe(undefined);
		});
	});

	describe('parseNumber', () => {
		it('parses a number', () => {
			const numberString = new Intl.NumberFormat().format(1234.56);
			expect(parseNumber(numberString)).toBe(1234.56);
		});

		it('parses percentages by default', () => {
			expect(parseNumber('12%')).toBe(0.12);
		});

		it('parses a number with Han numerals', () => {
			expect(parseNumber('一,二三四.五六')).toBe(1234.56);
		});

		it('parses percentages with Han numerals', () => {
			expect(parseNumber('一二%')).toBe(0.12);
		});

		it('returns null for an invalid number', () => {
			expect(parseNumber('invalid')).toBe(null);
		});

		it('handles percentages with style: "percent"', () => {
			expect(parseNumber('12%', 'en-US', { style: 'percent' })).toBe(0.12);
		});

		it('parses prefix percentages', () => {
			const format = { style: 'percent', maximumFractionDigits: 2 } as const;
			const formatted = new Intl.NumberFormat('tr-TR', format).format(0.0123);

			expect(parseNumber(formatted, 'tr-TR', format)).toBe(0.0123);
		});

		it('parses scientific notation percentages', () => {
			expect(parseNumber('1e-7%', 'en-US', { style: 'percent' })).toBe(1e-9);
		});

		it('handles percentages with style: "unit" and unit: "percent"', () => {
			expect(parseNumber('12%', 'en-US', { style: 'unit', unit: 'percent' })).toBe(12);
		});

		it('strips an interleaved percent sign (1%2)', () => {
			expect(parseNumber('1%2', 'en-US', { style: 'percent' })).toBe(0.12);
			expect(parseNumber('1%2', 'en-US', { style: 'unit', unit: 'percent' })).toBe(12);
		});

		it('parses fullwidth digits and punctuation', () => {
			expect(parseNumber('１，２３４．５６')).toBe(1234.56);
			expect(parseNumber('１２％')).toBe(0.12);
		});

		it('parses Persian digits', () => {
			expect(parseNumber('۱۲۳۴')).toBe(1234);
			expect(parseNumber('۱۲٫۳۴')).toBe(12.34);
			expect(parseNumber('۱۲٪')).toBe(0.12);
		});

		it('parses Persian digits with Arabic thousands and decimal characters', () => {
			expect(parseNumber('۱۲٬۳۴۵٫۶۷')).toBe(12345.67);
		});

		it('parses permille values', () => {
			expect(parseNumber('12‰')).toBe(0.012);
			expect(parseNumber('12؉')).toBe(0.012);
		});

		it('strips bidi/control characters', () => {
			expect(parseNumber('1\u200E234.56')).toBe(1234.56);
			expect(parseNumber('\u200E12\u200F%')).toBe(0.12);
		});

		it('handles unicode minus and plus signs', () => {
			expect(parseNumber('−1234')).toBe(-1234);
			expect(parseNumber('1234−')).toBe(-1234);
			expect(parseNumber('＋1234')).toBe(1234);
			expect(parseNumber('1234＋')).toBe(1234);
		});

		it('parses french formatted numbers with narrow no-break space grouping', () => {
			const fr = new Intl.NumberFormat('fr-FR').format(1234.5);
			expect(parseNumber(fr, 'fr-FR')).toBe(1234.5);
			expect(parseNumber(`${fr}−`, 'fr-FR')).toBe(-1234.5);
		});

		it('parses currency when options specify currency style', () => {
			expect(parseNumber('$1,234.56', 'en-US', { style: 'currency', currency: 'USD' })).toBe(
				1234.56,
			);
		});

		it('parses units when options specify unit style', () => {
			expect(parseNumber('12 kg', 'en-US', { style: 'unit', unit: 'kilogram' })).toBe(12);
		});

		it('returns null for Infinity-like inputs', () => {
			expect(parseNumber('Infinity')).toBe(null);
			expect(parseNumber('-Infinity')).toBe(null);
			expect(parseNumber('∞')).toBe(null);
		});

		it('collapses extra dots from mixed-locale inputs', () => {
			expect(parseNumber('1.234.567.89')).toBe(1234567.89);
		});

		it('parses de-DE grouping and decimal separators', () => {
			expect(parseNumber('1,5', 'de-DE')).toBe(1.5);
			expect(parseNumber('1.234,5', 'de-DE')).toBe(1234.5);
		});
	});
});
