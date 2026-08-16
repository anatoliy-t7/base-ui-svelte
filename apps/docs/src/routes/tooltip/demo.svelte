<script lang="ts">
	import { Tooltip } from 'base-ui-svelte/tooltip';
</script>

<Tooltip.Provider>
	<div class="flex flex-wrap gap-3">
		<Tooltip.Root>
			<Tooltip.Trigger class="btn">Hover me</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Viewport>
					<Tooltip.Positioner sideOffset={10}>
						<Tooltip.Popup class="tooltip-popup">
							<Tooltip.Arrow class="tooltip-arrow" />
							Helpful tip
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Viewport>
			</Tooltip.Portal>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger class="btn btn-secondary">Focus me</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Viewport>
					<Tooltip.Positioner side="right" sideOffset={10}>
						<Tooltip.Popup class="tooltip-popup">
							<Tooltip.Arrow class="tooltip-arrow" />
							Opens on focus too
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Viewport>
			</Tooltip.Portal>
		</Tooltip.Root>
	</div>
</Tooltip.Provider>
