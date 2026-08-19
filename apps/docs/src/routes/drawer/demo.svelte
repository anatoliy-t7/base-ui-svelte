<script lang="ts">
	import { Drawer } from 'base-ui-svelte/drawer';
</script>

<h2>Sides</h2>
<div class="row">
	<Drawer.Root swipeDirection="right">
		<Drawer.Trigger class="btn">Right</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop class="drawer-backdrop" />
			<Drawer.Viewport class="drawer-viewport">
				<Drawer.Popup class="drawer-popup">
					<Drawer.Content>
						<Drawer.Title class="drawer-title">Right</Drawer.Title>
						<Drawer.Description class="drawer-description"
							>Slides in from the right</Drawer.Description
						>
						<Drawer.Close class="btn">Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
	<Drawer.Root swipeDirection="left">
		<Drawer.Trigger class="btn">Left</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop class="drawer-backdrop" />
			<Drawer.Viewport class="drawer-viewport">
				<Drawer.Popup class="drawer-popup">
					<Drawer.Content>
						<Drawer.Title class="drawer-title">Left</Drawer.Title>
						<Drawer.Description class="drawer-description"
							>Slides in from the left</Drawer.Description
						>
						<Drawer.Close class="btn">Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
	<Drawer.Root swipeDirection="down">
		<Drawer.Trigger class="btn">Bottom</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop class="drawer-backdrop" />
			<Drawer.Viewport class="drawer-viewport">
				<Drawer.Popup class="drawer-popup">
					<Drawer.Content>
						<Drawer.Title class="drawer-title">Bottom</Drawer.Title>
						<Drawer.Description class="drawer-description"
							>Slides up from the bottom</Drawer.Description
						>
						<Drawer.Close class="btn">Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
	<Drawer.Root swipeDirection="up">
		<Drawer.Trigger class="btn">Top</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop class="drawer-backdrop" />
			<Drawer.Viewport class="drawer-viewport">
				<Drawer.Popup class="drawer-popup">
					<Drawer.Content>
						<Drawer.Title class="drawer-title">Top</Drawer.Title>
						<Drawer.Description class="drawer-description"
							>Slides down from the top</Drawer.Description
						>
						<Drawer.Close class="btn">Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
</div>
