import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	resolve: {
		conditions: ['browser'],
	},
	test: {
		environment: 'happy-dom',
		setupFiles: ['./vitest-setup.ts'],
		include: ['tests/**/*.{test,spec}.{js,ts}'],
	},
});
