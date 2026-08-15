<script lang="ts">
	import { Menu } from 'base-ui-svelte/menu';
	import { Menubar } from 'base-ui-svelte/menubar';
	import '../demo.css';
</script>

<h1>Menubar</h1>
<div class="demo">
	<Menubar.Root class="menubar" aria-label="Application">
		<Menu.Root>
			<Menu.Trigger class="btn">File</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner sideOffset={4} align="start">
					<Menu.Popup class="menu-popup">
						<Menu.Item class="menu-item">New</Menu.Item>
						<Menu.Item class="menu-item">Open</Menu.Item>
						<Menu.Separator class="menu-sep" />
						<Menu.Item class="menu-item">Save</Menu.Item>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
		<Menu.Root>
			<Menu.Trigger class="btn">Edit</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner sideOffset={4} align="start">
					<Menu.Popup class="menu-popup">
						<Menu.Item class="menu-item">Undo</Menu.Item>
						<Menu.Item class="menu-item">Redo</Menu.Item>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	</Menubar.Root>
</div>
