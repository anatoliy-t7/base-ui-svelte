/**
 * Ensure every component docs page imports and renders <ApiReference slug="..." />.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const routes = join(import.meta.dir, '../src/routes');

for (const name of readdirSync(routes)) {
	const page = join(routes, name, '+page.md');
	const demo = join(routes, name, 'demo.svelte');
	if (!existsSync(page) || !existsSync(demo)) continue;

	let md = readFileSync(page, 'utf8');

	if (!md.includes("import ApiReference from '$lib/api/ApiReference.svelte'")) {
		if (md.includes('<script>')) {
			md = md.replace(
				/<script>\n/,
				`<script>\n\timport ApiReference from '$lib/api/ApiReference.svelte';\n`
			);
		} else {
			// Insert script after frontmatter
			md = md.replace(
				/^---\n[\s\S]*?\n---\n/,
				(fm) =>
					`${fm}\n<script>\n\timport ApiReference from '$lib/api/ApiReference.svelte';\n\timport ComponentPreview from '$lib/ComponentPreview.svelte';\n\timport Demo from './demo.svelte';\n\timport demoSource from './demo.svelte?raw';\n</script>\n\n<ComponentPreview code={demoSource}>\n\n{#snippet preview()}\n\t<Demo />\n{/snippet}\n\n</ComponentPreview>\n\n`
			);
		}
	}

	if (!md.includes('<ApiReference')) {
		md = `${md.trimEnd()}\n\n## API Reference\n\n<ApiReference slug="${name}" />\n`;
	}

	writeFileSync(page, md);
	console.log('patched', name);
}
