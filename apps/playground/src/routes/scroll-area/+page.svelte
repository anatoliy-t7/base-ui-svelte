<script lang="ts">
	import { ScrollArea } from 'base-ui-svelte/scroll-area';
	import '../demo.css';
</script>

<h1>Scroll Area</h1>
<div class="demo">
	<ScrollArea.Root class="scroll-root">
		<ScrollArea.Viewport class="scroll-viewport">
			<ScrollArea.Content class="scroll-content">
				{#each Array.from({ length: 24 }, (_, i) => i + 1) as n}
					<p>Line {n} — scrollable content for the custom scrollbar demo.</p>
				{/each}
			</ScrollArea.Content>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar class="scroll-bar" orientation="vertical">
			<ScrollArea.Thumb class="scroll-thumb" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner />
	</ScrollArea.Root>
</div>
