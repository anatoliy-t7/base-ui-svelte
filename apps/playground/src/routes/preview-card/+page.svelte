<script lang="ts">
	import { PreviewCard } from 'base-ui-svelte/preview-card';
</script>

<h1>Preview Card</h1>

<section class="demo">
	<p>
		Hover
		<PreviewCard.Root openDelay={0} closeDelay={100}>
			<PreviewCard.Trigger href="#base-ui" class="preview-card-trigger">Base UI</PreviewCard.Trigger
			>
			<PreviewCard.Portal>
				<PreviewCard.Positioner sideOffset={8}>
					<PreviewCard.Popup class="preview-card-popup">
						<PreviewCard.Arrow />
						<PreviewCard.Viewport>
							<strong>Base UI</strong>
							<p style="margin:0.35rem 0 0;font-size:0.9rem;color:#5a6570;">
								Unstyled accessible components for design systems.
							</p>
						</PreviewCard.Viewport>
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
		to preview.
	</p>
</section>
