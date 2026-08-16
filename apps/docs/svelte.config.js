import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mdsvexHighlighter } from './src/lib/highlight.ts';
import { rehypeBaseUiLinks } from './src/lib/rehype-base-ui-links.js';

const root = dirname(fileURLToPath(import.meta.url));

/** Canonical origin used while prerendering (sitemap, OG URLs, llms.txt). */
const prerenderOrigin = process.env.PUBLIC_SITE_ORIGIN ?? 'http://sveltekit-prerender';

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
			rehypePlugins: [rehypeSlug, rehypeBaseUiLinks]
		}),
		vitePreprocess()
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			origin: prerenderOrigin,
			entries: ['*', '/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt'],
			// Demo components use placeholder hash links (e.g. href="#docs").
			handleMissingId: 'warn'
		}
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
