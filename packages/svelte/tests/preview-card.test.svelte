<script lang="ts">
	import { PreviewCard } from '../src/preview-card/index.js';
</script>

<PreviewCard.Root openDelay={0} closeDelay={0}>
	<PreviewCard.Trigger href="#preview" data-testid="trigger">Preview</PreviewCard.Trigger>
	<PreviewCard.Portal>
		<PreviewCard.Positioner>
			<PreviewCard.Popup data-testid="popup">
				<PreviewCard.Viewport>Card content</PreviewCard.Viewport>
			</PreviewCard.Popup>
		</PreviewCard.Positioner>
	</PreviewCard.Portal>
</PreviewCard.Root>
