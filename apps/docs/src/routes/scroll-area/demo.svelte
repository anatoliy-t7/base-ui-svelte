<script lang="ts">
	import { ScrollArea } from 'base-ui-svelte/scroll-area';
</script>

<div class="demo-wide">
	<ScrollArea.Root class="scroll-area">
		<ScrollArea.Viewport class="scroll-area-viewport">
			<ScrollArea.Content class="scroll-area-content">
				{#each Array.from({ length: 24 }, (_, i) => i + 1) as n}
					<p>Line {n} — scrollable content for the custom scrollbar demo.</p>
				{/each}
			</ScrollArea.Content>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar class="scroll-area-scrollbar" orientation="vertical">
			<ScrollArea.Thumb class="scroll-area-thumb" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner class="scroll-area-corner" />
	</ScrollArea.Root>
</div>
