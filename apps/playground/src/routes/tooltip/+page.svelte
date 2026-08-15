<script lang="ts">
	import { Tooltip } from 'base-ui-svelte/tooltip';
	import '../demo.css';
</script>

<h1>Tooltip</h1>
<div class="demo">
	<Tooltip.Root>
		<Tooltip.Trigger class="btn">Hover me</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Positioner sideOffset={8}>
				<Tooltip.Popup class="popup">Helpful tip</Tooltip.Popup>
			</Tooltip.Positioner>
		</Tooltip.Portal>
	</Tooltip.Root>
</div>
