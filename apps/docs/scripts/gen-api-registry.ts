/**
 * Generate apps/docs/src/lib/api/registry.ts from packages/svelte component types.
 */
import ts from 'typescript';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = join(import.meta.dir, '../../..');
const svelteSrc = join(repoRoot, 'packages/svelte/src');
const outDir = join(import.meta.dir, '../src/lib/api');
const outFile = join(outDir, 'registry.ts');

type PropDef = {
	name: string;
	type: string;
	optional: boolean;
	description: string;
	defaultValue: string;
};

type DataAttrDef = {
	name: string;
	description: string;
};

type PartDef = {
	name: string;
	heading: string;
	extendsNote: string;
	props: PropDef[];
	dataAttributes: DataAttrDef[];
};

type ComponentApi = {
	slug: string;
	exportName: string;
	kind: 'single' | 'compound';
	parts: PartDef[];
};

function typeNodeText(sourceText: string, node: ts.Node): string {
	return sourceText.slice(node.getStart(), node.getEnd()).replace(/\s+/g, ' ').trim();
}

function jsDocText(node: ts.Node): string {
	const docs = ts.getJSDocCommentsAndTags(node);
	const parts: string[] = [];
	for (const d of docs) {
		if (typeof d.comment === 'string') parts.push(d.comment);
		else if (Array.isArray(d.comment)) {
			for (const c of d.comment) {
				if (typeof c === 'string') parts.push(c);
				else if ('text' in c) parts.push(String(c.text));
			}
		}
	}
	return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function extractLiteralProps(sourceText: string, typeNode: ts.TypeNode): PropDef[] {
	const literals: ts.TypeLiteralNode[] = [];
	function walk(n: ts.TypeNode): void {
		if (ts.isTypeLiteralNode(n)) literals.push(n);
		else if (ts.isIntersectionTypeNode(n)) n.types.forEach(walk);
		else if (ts.isParenthesizedTypeNode(n)) walk(n.type);
	}
	walk(typeNode);

	const props: PropDef[] = [];
	const seen = new Set<string>();
	for (const lit of literals) {
		for (const member of lit.members) {
			if (!ts.isPropertySignature(member) || !member.name) continue;
			if (!ts.isIdentifier(member.name) && !ts.isStringLiteral(member.name)) continue;
			const name = member.name.text;
			if (seen.has(name)) continue;
			seen.add(name);
			const type = member.type ? typeNodeText(sourceText, member.type) : 'unknown';
			const description = jsDocText(member);
			let defaultValue = '—';
			const defaultMatch = description.match(/@default\s+(.+?)(?:\.|$)/i);
			if (defaultMatch) defaultValue = defaultMatch[1]!.trim();
			const cleaned = description.replace(/@default\s+.+?(?:\.|$)/gi, '').trim();
			props.push({
				name,
				type,
				optional: Boolean(member.questionToken),
				description: cleaned,
				defaultValue
			});
		}
	}
	return enrichKnownDefaults(props);
}

/** Defaults / descriptions aligned with Base UI where the Svelte types omit them. */
function enrichKnownDefaults(props: PropDef[]): PropDef[] {
	const defaults: Record<string, { defaultValue?: string; description?: string }> = {
		disabled: {
			defaultValue: 'false',
			description: 'Whether the control ignores user interaction.'
		},
		focusableWhenDisabled: {
			defaultValue: 'false',
			description: 'Whether the control remains focusable when disabled.'
		},
		render: {
			description: 'HTML element tag to render instead of the default host element.'
		},
		type: {
			description: 'Native control type when rendering a native element.'
		},
		open: { description: 'Whether the component is open (controlled).' },
		defaultOpen: { description: 'Whether the component is initially open (uncontrolled).' },
		onOpenChange: { description: 'Event handler called when the open state changes.' },
		value: { description: 'Controlled value.' },
		defaultValue: { description: 'Uncontrolled initial value.' },
		onValueChange: { description: 'Event handler called when the value changes.' },
		checked: { description: 'Controlled checked state.' },
		defaultChecked: { description: 'Uncontrolled initial checked state.' },
		onCheckedChange: { description: 'Event handler called when the checked state changes.' },
		pressed: { description: 'Controlled pressed state.' },
		defaultPressed: { description: 'Uncontrolled initial pressed state.' },
		onPressedChange: { description: 'Event handler called when the pressed state changes.' },
		children: { description: 'Content rendered inside the part.' },
		orientation: { defaultValue: "'horizontal'" }
	};

	return props.map((prop) => {
		const known = defaults[prop.name];
		if (!known) return prop;
		return {
			...prop,
			defaultValue:
				prop.defaultValue !== '—' ? prop.defaultValue : (known.defaultValue ?? prop.defaultValue),
			description: prop.description || known.description || prop.description
		};
	});
}

function extractExtendsNote(sourceText: string, typeNode: ts.TypeNode): string {
	const chunks: string[] = [];
	function walk(n: ts.TypeNode): void {
		if (ts.isTypeReferenceNode(n) || ts.isTypeOperatorNode(n)) {
			chunks.push(typeNodeText(sourceText, n));
		} else if (ts.isIntersectionTypeNode(n)) {
			for (const t of n.types) {
				if (!ts.isTypeLiteralNode(t)) walk(t);
			}
		} else if (ts.isParenthesizedTypeNode(n)) walk(n.type);
	}
	walk(typeNode);
	const note = chunks.join(' & ');
	if (!note) return '';
	if (note.includes('HTMLButton')) return 'Extends button HTML attributes.';
	if (note.includes('HTMLInput')) return 'Extends input HTML attributes.';
	if (note.includes('HTMLAnchor')) return 'Extends anchor HTML attributes.';
	if (note.includes('HTMLTextArea')) return 'Extends textarea HTML attributes.';
	if (note.includes('HTMLLabel')) return 'Extends label HTML attributes.';
	if (note.includes('HTMLFieldSet') || note.includes('HTMLFieldset'))
		return 'Extends fieldset HTML attributes.';
	if (note.includes('HTMLForm')) return 'Extends form HTML attributes.';
	if (note.includes('HTMLHeading')) return 'Extends heading HTML attributes.';
	if (note.includes('HTMLParagraph')) return 'Extends paragraph HTML attributes.';
	if (note.includes('HTMLSpan')) return 'Extends span HTML attributes.';
	if (note.includes('HTMLDivElement')) return 'Extends div HTML attributes.';
	if (note.includes('HTMLElement')) return 'Extends HTML element attributes.';
	if (note.includes('HTMLAttributes')) return 'Extends HTML attributes for the rendered element.';
	return 'Also accepts native HTML attributes for the rendered element.';
}

function parsePropsFile(filePath: string): Map<string, { props: PropDef[]; extendsNote: string }> {
	const sourceText = readFileSync(filePath, 'utf8');
	const sf = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
	const map = new Map<string, { props: PropDef[]; extendsNote: string }>();
	for (const stmt of sf.statements) {
		if (!ts.isTypeAliasDeclaration(stmt)) continue;
		const name = stmt.name.text;
		if (!name.endsWith('Props')) continue;
		map.set(name, {
			props: extractLiteralProps(sourceText, stmt.type),
			extendsNote: extractExtendsNote(sourceText, stmt.type)
		});
	}
	return map;
}

function collectDataAttributes(dir: string): Map<string, DataAttrDef[]> {
	const byFile = new Map<string, DataAttrDef[]>();
	const descriptions: Record<string, string> = {
		'data-disabled': 'Present when the part is disabled.',
		'data-open': 'Present when the part is open.',
		'data-closed': 'Present when the part is closed.',
		'data-checked': 'Present when the part is checked.',
		'data-unchecked': 'Present when the part is unchecked.',
		'data-indeterminate': 'Present when the checkbox is indeterminate.',
		'data-pressed': 'Present when the toggle is pressed.',
		'data-orientation': 'The orientation of the component.',
		'data-starting-style': 'Present while the enter animation can run.',
		'data-ending-style': 'Present while the exit animation can run.',
		'data-popup-open': 'Present when a related popup is open.',
		'data-placeholder': 'Present when showing placeholder content.',
		'data-valid': 'Present when the field is valid.',
		'data-invalid': 'Present when the field is invalid.',
		'data-dirty': 'Present when the field value has changed.',
		'data-touched': 'Present when the field has been touched.',
		'data-filled': 'Present when the field has a value.',
		'data-focused': 'Present when the field is focused.',
		'data-selected': 'Present when the item is selected.',
		'data-highlighted': 'Present when the item is highlighted.',
		'data-side': 'The side the popup is placed on.',
		'data-align': 'The alignment of the popup.',
		'data-swipe-direction': 'Direction of an active toast swipe.',
		'data-index': 'Index of the item within a collection.',
		'data-active': 'Present when the item is active.',
		'data-readonly': 'Present when the control is read-only.'
	};

	for (const file of readdirSync(dir)) {
		if (!file.endsWith('.svelte')) continue;
		const text = readFileSync(join(dir, file), 'utf8');
		const found = new Set<string>();
		for (const match of text.matchAll(/['"](data-[a-z0-9-]+)['"]/g)) {
			found.add(match[1]!);
		}
		const attrs: DataAttrDef[] = [...found].sort().map((name) => ({
			name,
			description: descriptions[name] ?? 'Present on the element when applicable.'
		}));
		byFile.set(file.replace(/\.svelte$/, ''), attrs);
	}
	return byFile;
}

function pascalFromKebab(slug: string): string {
	return slug
		.split('-')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join('');
}

/** Map part file stem → part name: accordion-trigger → Trigger */
function partNameFromFile(slug: string, stem: string): string | null {
	const prefix = slug + '-';
	if (!stem.startsWith(prefix) && stem !== slug) return null;
	if (stem === slug) return null; // single-file components handled separately
	const rest = stem.slice(prefix.length);
	return rest
		.split('-')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join('');
}

function analyzeComponent(slug: string): ComponentApi | null {
	const dir = join(svelteSrc, slug);
	if (!existsSync(dir)) return null;
	const typesPath = join(dir, 'types.ts');
	const indexPath = join(dir, 'index.ts');
	if (!existsSync(typesPath) || !existsSync(indexPath)) return null;

	const propsMap = parsePropsFile(typesPath);
	const dataByFile = collectDataAttributes(dir);
	const indexText = readFileSync(indexPath, 'utf8');
	// Special cases
	const nameMap: Record<string, string> = {
		'alert-dialog': 'AlertDialog',
		'checkbox-group': 'CheckboxGroup',
		'context-menu': 'ContextMenu',
		'navigation-menu': 'NavigationMenu',
		'number-field': 'NumberField',
		'otp-field': 'OTPField',
		'preview-card': 'PreviewCard',
		'scroll-area': 'ScrollArea',
		'radio-group': 'RadioGroup',
		'toggle-group': 'ToggleGroup'
	};
	/** TypeScript `*Props` prefix when it differs from the public export name. */
	const propsNameMap: Record<string, string> = {
		'otp-field': 'OtpField'
	};
	const componentName = nameMap[slug] ?? pascalFromKebab(slug);
	const propsPrefix = propsNameMap[slug] ?? componentName;

	const isCompound = /export const \w+ = \{/.test(indexText);
	const parts: PartDef[] = [];

	if (isCompound) {
		// Discover parts from *.svelte files + matching *Props
		for (const file of readdirSync(dir)) {
			if (!file.endsWith('.svelte')) continue;
			const stem = file.replace(/\.svelte$/, '');
			const part = partNameFromFile(slug, stem);
			if (!part) continue;
			const propsName = `${propsPrefix}${part}Props`;
			const entry = propsMap.get(propsName);
			if (!entry) continue;
			parts.push({
				name: part,
				heading: `${componentName}.${part}`,
				extendsNote: entry.extendsNote,
				props: entry.props,
				dataAttributes: dataByFile.get(stem) ?? []
			});
		}
		// Stable order: Root first, then alpha
		parts.sort((a, b) => {
			if (a.name === 'Root') return -1;
			if (b.name === 'Root') return 1;
			if (a.name === 'Provider') return -1;
			if (b.name === 'Provider') return 1;
			return a.name.localeCompare(b.name);
		});
	} else {
		const propsName = `${propsPrefix}Props`;
		const entry = propsMap.get(propsName);
		if (!entry) return null;
		const svelteStem =
			readdirSync(dir)
				.find((f) => f.endsWith('.svelte') && f.startsWith(slug))
				?.replace(/\.svelte$/, '') ?? slug;
		parts.push({
			name: componentName,
			heading: componentName,
			extendsNote: entry.extendsNote,
			props: entry.props,
			dataAttributes: dataByFile.get(svelteStem) ?? dataByFile.get(`${slug}-root`) ?? []
		});
	}

	if (parts.length === 0) return null;

	return {
		slug,
		exportName: componentName,
		kind: isCompound ? 'compound' : 'single',
		parts
	};
}

// Docs routes that need API pages (component demos)
const docsRoutes = readdirSync(join(repoRoot, 'apps/docs/src/routes')).filter((name) => {
	const demo = join(repoRoot, 'apps/docs/src/routes', name, 'demo.svelte');
	return existsSync(demo);
});

const registry: Record<string, ComponentApi> = {};

for (const slug of docsRoutes.sort()) {
	// radio page demos Radio + RadioGroup — prefer radio folder; also include radio-group via radio page
	const api = analyzeComponent(slug === 'radio' ? 'radio' : slug);
	if (api) registry[slug] = api;
}

// Attach RadioGroup onto radio page if exists
const radioGroup = analyzeComponent('radio-group');
if (radioGroup && registry.radio) {
	registry.radio.parts.push(
		...radioGroup.parts.map((p) => ({
			...p,
			heading: p.heading.startsWith('RadioGroup') ? p.heading : `RadioGroup.${p.name}`
		}))
	);
}

const toggleGroup = analyzeComponent('toggle-group');
if (toggleGroup && registry.toggle) {
	registry.toggle.parts.push(
		...toggleGroup.parts.map((p) => ({
			...p,
			heading: p.heading
		}))
	);
}

mkdirSync(outDir, { recursive: true });

const serialized = JSON.stringify(registry, null, '\t');

const file = `/* eslint-disable */
/* Auto-generated by apps/docs/scripts/gen-api-registry.ts — do not edit by hand. */

export type ApiProp = {
	name: string;
	type: string;
	optional: boolean;
	description: string;
	defaultValue: string;
};

export type ApiDataAttr = {
	name: string;
	description: string;
};

export type ApiPart = {
	name: string;
	heading: string;
	extendsNote: string;
	props: ApiProp[];
	dataAttributes: ApiDataAttr[];
};

export type ComponentApi = {
	slug: string;
	exportName: string;
	kind: 'single' | 'compound';
	parts: ApiPart[];
};

export const apiRegistry: Record<string, ComponentApi> = ${serialized};

export function getComponentApi(slug: string): ComponentApi | undefined {
	return apiRegistry[slug];
}
`;

writeFileSync(outFile, file);
console.log(`Wrote ${outFile} (${Object.keys(registry).length} components)`);
for (const [slug, api] of Object.entries(registry)) {
	console.log(`  ${slug}: ${api.parts.map((p) => p.heading).join(', ')}`);
}
