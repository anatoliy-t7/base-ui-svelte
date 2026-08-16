<script lang="ts">
	import { Tooltip } from '../src/index.js';

	let {
		openDelay = 0,
		closeDelay = 0
	}: {
		openDelay?: number;
		closeDelay?: number;
	} = $props();
</script>

<Tooltip.Root {openDelay} {closeDelay}>
	<Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Positioner>
			<Tooltip.Popup data-testid="popup">Tip content</Tooltip.Popup>
		</Tooltip.Positioner>
	</Tooltip.Portal>
</Tooltip.Root>
