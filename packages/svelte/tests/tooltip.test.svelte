<script lang="ts">
	import { Tooltip } from '../src/index.js';
</script>

<Tooltip.Root>
	<Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Positioner>
			<Tooltip.Popup data-testid="popup">Tip content</Tooltip.Popup>
		</Tooltip.Positioner>
	</Tooltip.Portal>
</Tooltip.Root>
