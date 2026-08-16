import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mdsvexHighlighter } from './src/lib/highlight.ts';
import { rehypeBaseUiLinks } from './src/lib/rehype-base-ui-links.js';

const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			layout: {
				_: join(root, 'src/lib/MdPage.svelte')
			},
			highlight: {
				highlighter: mdsvexHighlighter
			},
			rehypePlugins: [rehypeBaseUiLinks]
		}),
		vitePreprocess()
	],
	kit: {
		adapter: adapter()
	},
	// Do not force runes globally — mdsvex layouts still emit $$props.
	// .svelte files that use $props() compile in runes mode automatically.
	vitePlugin: {
		inspector: true,
		dynamicCompileOptions({ filename }) {
			if (filename.endsWith('.md')) {
				return { runes: false };
			}
		}
	}
};

export default config;
