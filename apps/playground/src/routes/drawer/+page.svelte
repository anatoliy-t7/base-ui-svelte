<script lang="ts">
	import { Drawer } from 'base-ui-svelte/drawer';
	import '../demo.css';
</script>

<h1>Drawer</h1>
<div class="demo">
	<Drawer.Root swipeDirection="right">
		<Drawer.Trigger class="btn">Open drawer</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop class="backdrop" />
			<Drawer.Viewport class="drawer-viewport">
				<Drawer.Popup class="drawer-popup drawer-popup-right">
					<Drawer.Content>
						<Drawer.Title>Notifications</Drawer.Title>
						<Drawer.Description>
							Swipe or use Escape / Close to dismiss. Positioning is CSS-driven.
						</Drawer.Description>
						<Drawer.Close class="btn">Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
</div>
