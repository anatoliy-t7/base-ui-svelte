<script lang="ts">
	import { Menu } from 'base-ui-svelte/menu';
	import { Menubar } from 'base-ui-svelte/menubar';
</script>

<h1>Menubar</h1>

<section class="demo">
	<Menubar class="menubar" aria-label="Application">
		<Menu.Root>
			<Menu.Trigger class="menubar-trigger">File</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner sideOffset={4} align="start">
					<Menu.Popup class="menubar-popup">
						<Menu.Item class="menubar-item">New</Menu.Item>
						<Menu.Item class="menubar-item">Open</Menu.Item>
						<Menu.Separator class="menu-separator" />
						<Menu.Item class="menubar-item">Save</Menu.Item>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
		<Menu.Root>
			<Menu.Trigger class="menubar-trigger">Edit</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner sideOffset={4} align="start">
					<Menu.Popup class="menubar-popup">
						<Menu.Item class="menubar-item">Undo</Menu.Item>
						<Menu.Item class="menubar-item">Redo</Menu.Item>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	</Menubar>
</section>
