import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
	},
	compilerOptions: {
		runes: true,
	},
	vitePlugin: {
		// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md
		inspector: true,
	},
};

export default config;
