/**
 * Fetch and parse Base UI component markdown for API descriptions.
 * Used by gen-api-registry.ts when generating docs registry.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { structureDescription } from '../src/lib/api/structure-description.js';

const repoRoot = join(import.meta.dir, '../../..');
const cacheDir = join(import.meta.dir, '.cache/base-ui');
const BASE_UI_COMPONENT_URL = 'https://base-ui.com/react/components';

export type BaseUiProp = {
	name: string;
	type: string;
	defaultValue: string;
	description: string;
};

export type BaseUiDataAttr = {
	name: string;
	description: string;
};

export type BaseUiPart = {
	name: string;
	description: string;
	props: BaseUiProp[];
	dataAttributes: BaseUiDataAttr[];
};

export type BaseUiComponentApi = {
	slug: string;
	parts: BaseUiPart[];
};

/** Slugs that share Base UI docs with another slug when fetching by route name. */
const BASE_UI_SLUG_ALIASES: Record<string, string> = {
	'radio-group': 'radio'
};

function normalizeDefault(value: string): string {
	const trimmed = stripBackticks(value.trim());
	if (!trimmed || trimmed === '-' || trimmed === '—') return '—';
	return trimmed;
}

function stripBackticks(value: string): string {
	return value.replace(/^`(.+)`$/s, '$1').trim();
}

function splitTableRow(line: string): string[] {
	const cells: string[] = [];
	let current = '';
	let inBackticks = false;
	const content = line.trim().replace(/^\|/, '').replace(/\|$/, '');

	for (const char of content) {
		if (char === '`') {
			inBackticks = !inBackticks;
			current += char;
			continue;
		}
		if (char === '|' && !inBackticks) {
			cells.push(current.trim());
			current = '';
			continue;
		}
		current += char;
	}

	cells.push(current.trim());
	return cells;
}

function parseMarkdownTableRows(tableText: string): string[][] {
	const lines = tableText.split('\n');
	const rows: string[][] = [];
	let current: string[] | null = null;

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		if (trimmed.startsWith('|')) {
			const cells = splitTableRow(trimmed);
			if (cells.every((cell) => /^:?-+:?$/.test(cell.replace(/\s/g, '')))) {
				continue;
			}
			current = cells;
			rows.push(current);
			continue;
		}

		if (current) {
			current[current.length - 1] = `${current[current.length - 1] ?? ''} ${trimmed}`.trim();
		}
	}

	return rows;
}

function parsePropsTable(tableText: string): BaseUiProp[] {
	const rows = parseMarkdownTableRows(tableText);
	if (rows.length <= 1) return [];

	const header = rows[0]?.map((cell) => cell.toLowerCase()) ?? [];
	const propIndex = header.findIndex((cell) => cell.includes('prop'));
	const typeIndex = header.findIndex((cell) => cell === 'type');
	const defaultIndex = header.findIndex((cell) => cell.includes('default'));
	const descriptionIndex = header.findIndex((cell) => cell.includes('description'));

	if (propIndex === -1 || descriptionIndex === -1) return [];

	return rows.slice(1).map((row) => ({
		name: stripBackticks(row[propIndex] ?? ''),
		type: stripBackticks(row[typeIndex] ?? ''),
		defaultValue: normalizeDefault(row[defaultIndex] ?? ''),
		description: (row[descriptionIndex] ?? '').trim().replace(/^-$/, '')
	}));
}

function parseDataAttrTable(tableText: string): BaseUiDataAttr[] {
	const rows = parseMarkdownTableRows(tableText);
	if (rows.length <= 1) return [];

	const header = rows[0]?.map((cell) => cell.toLowerCase()) ?? [];
	const nameIndex = header.findIndex((cell) => cell.includes('attribute') || cell.includes('data'));
	const descriptionIndex = header.findIndex((cell) => cell.includes('description'));

	if (nameIndex === -1 || descriptionIndex === -1) return [];

	return rows.slice(1).map((row) => ({
		name: stripBackticks(row[nameIndex] ?? ''),
		description: (row[descriptionIndex] ?? '').trim()
	}));
}

function extractSection(markdown: string, label: string): string {
	const pattern = new RegExp(
		`\\*\\*${escapeRegExp(label)}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Za-z][^*]*:\\*\\*|$)`,
		'i'
	);
	const match = markdown.match(pattern);
	return match?.[1]?.trim() ?? '';
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseBaseUiMarkdown(slug: string, markdown: string): BaseUiComponentApi {
	const apiStart = markdown.indexOf('## API reference');
	const apiSection = apiStart === -1 ? markdown : markdown.slice(apiStart);
	const partSections = apiSection.split(/^### /m).slice(1);

	const parts: BaseUiPart[] = [];

	for (const section of partSections) {
		const headingLine = section.split('\n')[0]?.trim() ?? '';
		if (!headingLine || headingLine.includes('.')) continue;
		if (headingLine === 'External Types' || headingLine === 'Canonical Types') break;

		const partName = headingLine;
		const propsLabel = `${partName} Props`;
		const attrsLabel = `${partName} Data Attributes`;

		const propsMarker = section.indexOf(`**${propsLabel}:**`);
		const attrsMarker = section.indexOf(`**${attrsLabel}:**`);

		const firstMarker = [propsMarker, attrsMarker]
			.filter((index) => index >= 0)
			.sort((a, b) => a - b)[0];

		const lede =
			firstMarker === undefined
				? section.slice(headingLine.length).trim()
				: section.slice(headingLine.length, firstMarker).trim();

		const propsTable = extractSection(section, propsLabel);
		const attrsTable = extractSection(section, attrsLabel);

		parts.push({
			name: partName,
			description: lede.replace(/\s+/g, ' ').trim(),
			props: parsePropsTable(propsTable),
			dataAttributes: parseDataAttrTable(attrsTable)
		});
	}

	return { slug, parts };
}

export function adaptDescriptionForSvelte(description: string, propName: string): string {
	let out = description;

	out = out.replace(/\bclassName\b/g, 'class');
	out = out.replace(/`className`/g, '`class`');
	out = out.replace(/\bonClick\b/g, 'onclick');
	out = out.replace(/\bonChange\b/g, 'onchange');

	if (propName === 'render') {
		out =
			`${out} In this Svelte port, use \`render?: string\` with \`<svelte:element>\` — see [Composition](/handbook/composition).`.trim();
	}

	if (/React\.Ref|inputRef/.test(description) || propName === 'inputRef') {
		out = `${out} Use \`bind:this\` on the host element in Svelte.`.trim();
	}

	return structureDescription(out);
}

export function resolveBaseUiPartName(part: { name: string; heading: string }): string {
	if (part.heading.startsWith('RadioGroup.')) return 'RadioGroup';
	if (part.heading.startsWith('ToggleGroup.')) return 'ToggleGroup';

	const dotIndex = part.heading.indexOf('.');
	if (dotIndex === -1) return part.name;
	return part.heading.slice(dotIndex + 1);
}

async function fetchComponentMarkdown(slug: string, refresh: boolean): Promise<string | null> {
	const fetchSlug = BASE_UI_SLUG_ALIASES[slug] ?? slug;
	const cacheFile = join(cacheDir, `${fetchSlug}.md`);

	if (!refresh && existsSync(cacheFile)) {
		return readFileSync(cacheFile, 'utf8');
	}

	mkdirSync(cacheDir, { recursive: true });

	const url = `${BASE_UI_COMPONENT_URL}/${fetchSlug}.md`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.warn(`  [base-ui] ${slug}: fetch failed (${response.status})`);
			if (existsSync(cacheFile)) return readFileSync(cacheFile, 'utf8');
			return null;
		}
		const text = await response.text();
		writeFileSync(cacheFile, text);
		return text;
	} catch (error) {
		console.warn(`  [base-ui] ${slug}: fetch error`, error);
		if (existsSync(cacheFile)) return readFileSync(cacheFile, 'utf8');
		return null;
	}
}

const apiCache = new Map<string, BaseUiComponentApi | null>();

export async function loadBaseUiComponentApi(
	slug: string,
	refresh = false
): Promise<BaseUiComponentApi | null> {
	if (!refresh && apiCache.has(slug)) {
		return apiCache.get(slug) ?? null;
	}

	const markdown = await fetchComponentMarkdown(slug, refresh);
	if (!markdown) {
		apiCache.set(slug, null);
		return null;
	}

	const api = parseBaseUiMarkdown(slug, markdown);
	apiCache.set(slug, api);
	return api;
}

export async function preloadBaseUiApis(slugs: string[], refresh = false): Promise<void> {
	for (const slug of slugs) {
		await loadBaseUiComponentApi(slug, refresh);
	}
}

export function findBaseUiPart(
	api: BaseUiComponentApi | null,
	part: { name: string; heading: string }
): BaseUiPart | undefined {
	if (!api) return undefined;
	const partKey = resolveBaseUiPartName(part);
	return api.parts.find((entry) => entry.name === partKey);
}

export type MergeableProp = {
	name: string;
	type: string;
	description: string;
	defaultValue: string;
};

export type MergeableDataAttr = {
	name: string;
	description: string;
};

export type MergeablePart = {
	name: string;
	heading: string;
	description: string;
	props: MergeableProp[];
	dataAttributes: MergeableDataAttr[];
};

export function mergePartWithBaseUi(
	part: MergeablePart,
	baseUiPart: BaseUiPart | undefined
): MergeablePart {
	if (!baseUiPart) return part;

	const props = part.props.map((prop) => {
		const upstream = baseUiPart.props.find((entry) => entry.name === prop.name);
		if (!upstream) return prop;

		const description =
			upstream.description && upstream.description !== '-'
				? adaptDescriptionForSvelte(upstream.description, prop.name) || prop.description
				: prop.description;

		const defaultValue =
			prop.defaultValue !== '—'
				? prop.defaultValue
				: upstream.defaultValue !== '—'
					? upstream.defaultValue
					: prop.defaultValue;

		return {
			...prop,
			description,
			defaultValue
		};
	});

	const dataAttributes = part.dataAttributes.map((attr) => {
		const upstream = baseUiPart.dataAttributes.find((entry) => entry.name === attr.name);
		if (!upstream) return attr;
		return {
			...attr,
			description: upstream.description || attr.description
		};
	});

	return {
		...part,
		description: baseUiPart.description || part.description,
		props,
		dataAttributes
	};
}

/** CLI entry when run directly. */
if (import.meta.main) {
	const refresh = process.argv.includes('--refresh');
	const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
	const docsRoutes = slugs.length
		? slugs
		: readdirSync(join(repoRoot, 'apps/docs/src/routes')).filter((name) =>
				existsSync(join(repoRoot, 'apps/docs/src/routes', name, 'demo.svelte'))
			);

	await preloadBaseUiApis(docsRoutes.sort(), refresh);

	for (const slug of docsRoutes) {
		const api = await loadBaseUiComponentApi(slug, refresh);
		if (!api) {
			console.log(`${slug}: (no Base UI data)`);
			continue;
		}
		const propCount = api.parts.reduce((sum, part) => sum + part.props.length, 0);
		console.log(`${slug}: ${api.parts.length} parts, ${propCount} props`);
	}
}
