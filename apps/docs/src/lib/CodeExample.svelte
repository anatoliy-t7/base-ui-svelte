<script lang="ts">
	import { highlightCode } from './highlight.js';

	let {
		code,
		label = 'Example',
		lang = 'svelte'
	}: {
		code: string;
		label?: string;
		lang?: string;
	} = $props();

	let copied = $state(false);

	async function copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			window.setTimeout(() => {
				copied = false;
			}, 1600);
		} catch {
			copied = false;
		}
	}
</script>

<div class="code-example">
	<div class="code-example-bar">
		<span class="code-example-label">{label}</span>
		<button type="button" class="code-example-copy" onclick={copy}>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	{#await highlightCode(code, lang)}
		<pre><code>{code.trim()}</code></pre>
	{:then highlighted}
		<div class="code-example-body">
			{@html highlighted}
		</div>
	{:catch}
		<pre><code>{code.trim()}</code></pre>
	{/await}
</div>

<style>
	.code-example {
		margin: 1.25rem 0 0;
	}

	.code-example-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.45rem 0.75rem;
		border: 1px solid color-mix(in srgb, #151a21 80%, #fff);
		border-bottom: 0;
		border-radius: 0.55rem 0.55rem 0 0;
		background: #1c242e;
		color: #c5ced8;
	}

	.code-example-label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.code-example-copy {
		font: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.55rem;
		border-radius: 0.3rem;
		border: 1px solid color-mix(in srgb, #fff 18%, transparent);
		background: color-mix(in srgb, #fff 8%, transparent);
		color: #e8ecf1;
		cursor: pointer;
	}

	.code-example-copy:hover {
		background: color-mix(in srgb, #fff 14%, transparent);
	}

	.code-example :global(pre) {
		margin: 0;
		border-radius: 0 0 0.55rem 0.55rem;
	}

	.code-example-body :global(pre) {
		margin: 0;
		padding: 0.95rem 1.05rem;
		overflow-x: auto;
		border-radius: 0 0 0.55rem 0.55rem;
		border: 1px solid color-mix(in srgb, #151a21 80%, #fff);
		border-top: 0;
		font-size: 0.84rem;
		line-height: 1.5;
		scrollbar-color: color-mix(in srgb, #fff 28%, transparent) transparent;
	}

	.code-example-body :global(pre::-webkit-scrollbar-thumb) {
		background-color: color-mix(in srgb, #fff 28%, transparent);
	}

	.code-example-body :global(pre::-webkit-scrollbar-thumb:hover) {
		background-color: color-mix(in srgb, #fff 42%, transparent);
	}

	.code-example-body :global(pre::-webkit-scrollbar-thumb:active) {
		background-color: color-mix(in srgb, #fff 55%, transparent);
	}

	.code-example-body :global(pre code) {
		padding: 0;
		background: transparent;
		font-size: inherit;
		font-family: var(--font-mono, ui-monospace, monospace);
	}
</style>
