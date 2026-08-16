import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const routes = join(import.meta.dir, '../src/routes');

const special: Record<string, string> = {
	button: `<Callout title="Svelte notes">
	<p>
		Single-part export: <code>&lt;Button /&gt;</code> (not <code>Button.Root</code>). Style with
		<code>btn btn-primary btn-sm</code> from <a href="/handbook/styling">@base-ui-svelte/styles</a>.
		Optional <code>render</code> is an HTML tag string — see
		<a href="/handbook/differences">Differences</a>.
	</p>
</Callout>`,
	form: `<Callout title="Svelte notes">
	<p>
		<code>onFormSubmit</code> receives <code>(formData: FormData, event: SubmitEvent)</code>, not a
		React values object. See <a href="/handbook/differences">Differences</a> and
		<a href="https://base-ui.com/react/handbook/forms" target="_blank" rel="noopener noreferrer">Base UI Forms ↗</a>.
	</p>
</Callout>`,
	'checkbox-group': `<Callout title="Svelte notes">
	<p>
		Single-part <code>&lt;CheckboxGroup /&gt;</code>; children use compound <code>Checkbox.*</code>.
		See <a href="/handbook/differences">Differences</a>.
	</p>
</Callout>`,
	menubar: `<Callout title="Svelte notes">
	<p>
		Single-part <code>&lt;Menubar /&gt;</code> (not <code>Menubar.Root</code>). See
		<a href="/handbook/differences">Differences</a>.
	</p>
</Callout>`,
	input: `<Callout title="Svelte notes">
	<p>
		Single-part <code>&lt;Input /&gt;</code>. Style with <code>input input-md</code> from
		<a href="/handbook/styling">styles</a>.
	</p>
</Callout>`,
	separator: `<Callout title="Svelte notes">
	<p>
		Single-part <code>&lt;Separator /&gt;</code>. See <a href="/handbook/differences">Differences</a>.
	</p>
</Callout>`,
	toggle: `<Callout title="Svelte notes">
	<p>
		<code>Toggle</code> and <code>ToggleGroup</code> are single-part exports. Style with
		<code>toggle</code> / <code>toggle-group</code> classes from
		<a href="/handbook/styling">styles</a>.
	</p>
</Callout>`,
	radio: `<Callout title="Svelte notes">
	<p>
		<code>RadioGroup</code> is a single-part export; <code>Radio</code> is compound
		(<code>Radio.Root</code>). See <a href="/handbook/differences">Differences</a>.
	</p>
</Callout>`
};

const defaultCallout = `<Callout title="Svelte notes">
	<p>
		API and a11y match Base UI. See <a href="/handbook/differences">Differences</a> for Svelte
		adaptations, and <a href="/handbook/styling">Styling</a> for optional class names used in this demo.
	</p>
</Callout>`;

const skip = new Set(['overview', 'handbook', 'utils']);

for (const name of readdirSync(routes)) {
	const page = join(routes, name, '+page.svelte');
	if (!existsSync(page)) continue;
	if (skip.has(name)) continue;

	let src = readFileSync(page, 'utf8');
	if (!src.includes('<h1>')) continue;
	if (src.includes('DocHeader')) continue;

	const h1Match = src.match(/<h1>([^<]+)<\/h1>/);
	if (!h1Match) continue;
	const title = h1Match[1]!;

	if (!src.includes('$lib/DocHeader.svelte')) {
		src = src.replace(
			/<script lang="ts">\n/,
			`<script lang="ts">
	import DocHeader from '$lib/DocHeader.svelte';
	import Callout from '$lib/Callout.svelte';
`
		);
	}

	const callout = special[name] ?? defaultCallout;
	const replacement = `<DocHeader title="${title}" />

${callout}`;
	src = src.replace(`<h1>${title}</h1>`, replacement);

	writeFileSync(page, src);
	console.log('updated', name);
}
