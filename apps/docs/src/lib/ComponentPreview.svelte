<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeExample from './CodeExample.svelte';

	let {
		code,
		align = 'center',
		preview,
		children
	}: {
		code: string;
		align?: 'start' | 'center' | 'end';
		/** Live demo (bits-ui style). Falls back to `children`. */
		preview?: Snippet;
		children?: Snippet;
	} = $props();

	let tab = $state<'preview' | 'code'>('preview');
	const demo = $derived(preview ?? children);
</script>

<div class="component-preview">
	<div class="component-preview-tabs" role="tablist" aria-label="Demo">
		<button
			type="button"
			role="tab"
			id="preview-tab"
			class="component-preview-tab"
			class:active={tab === 'preview'}
			aria-selected={tab === 'preview'}
			aria-controls="preview-panel"
			onclick={() => (tab = 'preview')}
		>
			Preview
		</button>
		<button
			type="button"
			role="tab"
			id="code-tab"
			class="component-preview-tab"
			class:active={tab === 'code'}
			aria-selected={tab === 'code'}
			aria-controls="code-panel"
			onclick={() => (tab = 'code')}
		>
			Code
		</button>
	</div>

	{#if tab === 'preview'}
		<div
			id="preview-panel"
			role="tabpanel"
			aria-labelledby="preview-tab"
			class="component-preview-panel demo"
			data-align={align}
		>
			{#if demo}
				{@render demo()}
			{/if}
		</div>
	{:else}
		<div id="code-panel" role="tabpanel" aria-labelledby="code-tab" class="component-preview-code">
			<CodeExample {code} label="demo.svelte" />
		</div>
	{/if}
</div>

<style>
	.component-preview {
		margin: 0 0 1.5rem;
		border: 1px solid var(--docs-border, color-mix(in srgb, #151a21 10%, transparent));
		border-radius: calc(var(--docs-radius, 0.5rem) + 0.1rem);
		overflow: hidden;
		background: var(--docs-surface, #fff);
	}

	.component-preview-tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--docs-border, color-mix(in srgb, #151a21 10%, transparent));
		background: color-mix(in srgb, var(--docs-bg, #f4f2ee) 70%, var(--docs-surface, #fff));
	}

	.component-preview-tab {
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.65rem 1rem;
		border: 0;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		background: transparent;
		color: var(--docs-fg-muted, #4a5560);
		cursor: pointer;
	}

	.component-preview-tab:hover {
		color: var(--docs-fg, #151a21);
	}

	.component-preview-tab.active {
		color: var(--docs-fg, #151a21);
		border-bottom-color: var(--docs-accent, #0052cc);
	}

	.component-preview-panel {
		margin: 0;
		border: 0 !important;
		border-radius: 0;
		min-height: 14rem;
		padding: 2rem 1.5rem;
		background: var(--docs-demo-bg, color-mix(in srgb, var(--docs-bg, #f4f2ee) 40%, #fff));
		container-type: inline-size;
		container-name: preview;
	}

	/* Vertically center the canvas; stretch so section labels stay left-aligned. */
	.component-preview-panel[data-align='center'] {
		display: grid;
		align-content: center;
		justify-items: stretch;
	}

	/* Lone widget demos (menu trigger, context surface, etc.): center in the canvas. */
	.component-preview-panel[data-align='center']:has(> :global(:only-child)) {
		justify-items: center;
	}

	.component-preview-panel[data-align='end'] {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.component-preview-panel[data-align='start'] {
		display: grid;
		align-content: start;
		justify-items: stretch;
	}

	.component-preview-code {
		padding: 0;
	}

	.component-preview-code :global(.code-example) {
		margin: 0;
	}

	.component-preview-code :global(.code-example-bar) {
		border-radius: 0;
		border-left: 0;
		border-right: 0;
	}

	.component-preview-code :global(pre) {
		border-radius: 0;
		border-left: 0;
		border-right: 0;
		border-bottom: 0;
	}
</style>
