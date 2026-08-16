<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		href = 'https://github.com/anatoliy-t7/base-ui-svelte',
		class: className = '',
		...rest
	}: HTMLAnchorAttributes & { href?: string } = $props();
</script>

<a
	{href}
	class="github-link {className}"
	target="_blank"
	rel="noopener noreferrer"
	aria-label="GitHub repository"
	title="GitHub"
	{...rest}
>
	<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
		/>
	</svg>
	<span class="sr-only">GitHub (opens in new tab)</span>
</a>

<style>
	.github-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--docs-border-strong);
		border-radius: 0.4rem;
		background: var(--docs-surface);
		color: var(--docs-fg-muted);
		text-decoration: none;
	}

	.github-link:hover {
		color: var(--docs-fg);
		background: var(--docs-bg);
	}

	.icon {
		width: 1.1rem;
		height: 1.1rem;
	}
</style>
