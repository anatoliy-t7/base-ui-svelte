<script lang="ts">
	import { Popover } from 'base-ui-svelte/popover';
</script>

<Popover.Root>
	<Popover.Trigger class="btn">Notifications</Popover.Trigger>
	<Popover.Portal>
		<Popover.Backdrop class="popover-backdrop" />
		<Popover.Viewport>
			<Popover.Positioner sideOffset={8}>
				<Popover.Popup class="popover-popup">
					<Popover.Arrow class="popover-arrow" />
					<Popover.Title class="popover-title">Notifications</Popover.Title>
					<Popover.Description class="popover-description">
						You are all caught up. Good job!
					</Popover.Description>
					<Popover.Close class="btn">Dismiss</Popover.Close>
				</Popover.Popup>
			</Popover.Positioner>
		</Popover.Viewport>
	</Popover.Portal>
</Popover.Root>
