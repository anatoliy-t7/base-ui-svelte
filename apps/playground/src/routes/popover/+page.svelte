<script lang="ts">
	import { Popover } from 'base-ui-svelte/popover';
	import '../demo.css';
</script>

<h1>Popover</h1>
<div class="demo">
	<Popover.Root>
		<Popover.Trigger class="btn">Notifications</Popover.Trigger>
		<Popover.Portal>
			<Popover.Positioner sideOffset={8}>
				<Popover.Popup class="popup">
					<Popover.Arrow />
					<Popover.Title>Notifications</Popover.Title>
					<Popover.Description>You are all caught up. Good job!</Popover.Description>
					<Popover.Close class="btn">Dismiss</Popover.Close>
				</Popover.Popup>
			</Popover.Positioner>
		</Popover.Portal>
	</Popover.Root>
</div>
