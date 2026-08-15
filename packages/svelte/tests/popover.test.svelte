<script lang="ts">
	import { Popover } from '../src/index.js';
</script>

<Popover.Root>
	<Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
	<Popover.Portal>
		<Popover.Positioner>
			<Popover.Popup data-testid="popup">
				<Popover.Title>Title</Popover.Title>
				<Popover.Description>Description</Popover.Description>
				<Popover.Close data-testid="close">Close</Popover.Close>
			</Popover.Popup>
		</Popover.Positioner>
	</Popover.Portal>
</Popover.Root>
