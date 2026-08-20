const PERCENT_RE = /[%٪％﹪]/;
const PERCENT_GLOBAL_RE = /[%٪％﹪]/g;
const FORMAT_CONTROL_GLOBAL_RE = /\p{Cf}/gu;
const ANY_MINUS_RE = /[-−－‒–—﹣]/gu;
const ANY_PLUS_RE = /[+＋﹢]/gu;

function getLocaleSymbols(
	locale?: Intl.LocalesArgument | undefined,
	options?: Intl.NumberFormatOptions | undefined,
): {
	group: string | undefined;
	decimal: string;
	currency: string | undefined;
	unit: string | undefined;
	percentSign: string | undefined;
	literal: string | undefined;
} {
	const formatted = new Intl.NumberFormat(locale, options).formatToParts(-11111.1);
	const plainDecimal =
		new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')
			?.value ?? '.';

	const byType: Partial<Record<Intl.NumberFormatPartTypes, string>> = {};
	for (const part of formatted) {
		byType[part.type] = part.value;
	}

	return {
		group: byType.group,
		decimal: byType.decimal ?? plainDecimal,
		currency: byType.currency,
		unit: byType.unit,
		percentSign: byType.percentSign,
		literal: byType.literal,
	};
}

function stripAll(source: string, value: string | undefined): string {
	if (!value) return source;
	return source.split(value).join('');
}

/**
 * Parse a user-typed or formatted number using the same locale/format that
 * `Intl.NumberFormat` used to display it. `Number("1,234.50")` is `NaN`, so
 * committing a formatted input without this step wipes the value.
 */
export function parseLocalizedNumber(
	formattedNumber: string,
	locale?: Intl.LocalesArgument | undefined,
	options?: Intl.NumberFormatOptions | undefined,
): number | null {
	let input = formattedNumber.replace(FORMAT_CONTROL_GLOBAL_RE, '').trim();
	if (input === '') return null;

	input = input.replace(ANY_MINUS_RE, '-').replace(ANY_PLUS_RE, '+');

	let isNegative = false;
	input = input.replace(/([+-])\s*$/, (_, sign: string) => {
		if (sign === '-') isNegative = true;
		return '';
	});
	input = input.replace(/^\s*([+-])/, (_, sign: string) => {
		if (sign === '-') isNegative = true;
		return '';
	});

	if (input === '' || /^infinity$/i.test(input) || input.includes('∞')) {
		return null;
	}

	const { group, decimal, currency, unit, percentSign, literal } = getLocaleSymbols(
		locale,
		options,
	);

	let unformatted = input;
	if (group) {
		const isSpaceGroup = /\p{Zs}/u.test(group);
		unformatted = isSpaceGroup
			? unformatted.replace(/\p{Zs}/gu, '')
			: unformatted.split(group).join('');
	}
	if (decimal && decimal !== '.') {
		unformatted = unformatted.split(decimal).join('.');
	}
	unformatted = unformatted.replace(/[．٫]/g, '.').replace(/[，٬]/g, '');
	unformatted = stripAll(unformatted, currency);
	unformatted = stripAll(unformatted, unit);
	unformatted = stripAll(unformatted, percentSign);
	unformatted = stripAll(unformatted, literal);
	unformatted = unformatted.replace(PERCENT_GLOBAL_RE, '');
	unformatted = unformatted.replace(/\s+/g, '');

	const lastDot = unformatted.lastIndexOf('.');
	if (lastDot !== -1) {
		unformatted = `${unformatted.slice(0, lastDot).replace(/\./g, '')}.${unformatted.slice(lastDot + 1).replace(/\./g, '')}`;
	}

	if (unformatted === '' || unformatted === '.') {
		return null;
	}

	if (!/^\d*\.?\d*(?:[eE][+-]?\d+)?$/.test(unformatted)) {
		return null;
	}

	let num = Number((isNegative ? '-' : '') + unformatted);
	if (!Number.isFinite(num)) return null;

	const style = options?.style;
	const hasPercentSymbol = PERCENT_RE.test(formattedNumber) || style === 'percent';
	if (hasPercentSymbol && style !== 'unit') {
		num /= 100;
	}

	return num;
}

export function isIncompleteNumberInput(
	raw: string,
	locale?: Intl.LocalesArgument | undefined,
	options?: Intl.NumberFormatOptions | undefined,
): boolean {
	const trimmed = raw.trim();
	if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') {
		return true;
	}
	const decimal = getLocaleSymbols(locale, options).decimal;
	return trimmed === decimal;
}

export function parseNumberInput(
	raw: string,
	locale?: Intl.LocalesArgument | undefined,
	options?: Intl.NumberFormatOptions | undefined,
): number | null {
	const trimmed = raw.trim();
	const localized = locale != null || options != null;
	if (isIncompleteNumberInput(trimmed, locale, options)) {
		return null;
	}
	if (!localized) {
		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return parseLocalizedNumber(trimmed, locale, options);
}
