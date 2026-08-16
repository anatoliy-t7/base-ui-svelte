<script lang="ts">
	import { ScrollArea } from '../src/scroll-area/index.js';
</script>

<ScrollArea.Root data-testid="root">
	<ScrollArea.Viewport data-testid="viewport" style="height:100px;width:200px;">
		<ScrollArea.Content data-testid="content" style="height:400px;width:400px;">
			Long content for scrolling
		</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical" data-testid="scrollbar">
		<ScrollArea.Thumb data-testid="thumb" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar orientation="horizontal" data-testid="scrollbar-x">
		<ScrollArea.Thumb data-testid="thumb-x" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner data-testid="corner" />
</ScrollArea.Root>
