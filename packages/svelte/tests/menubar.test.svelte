<script lang="ts">
	import { Menu } from '../src/menu/index.js';
	import { Menubar } from '../src/menubar/index.js';
</script>

<Menubar data-testid="menubar">
	<Menu.Root>
		<Menu.Trigger data-testid="file-trigger">File</Menu.Trigger>
		<Menu.Portal>
			<Menu.Positioner>
				<Menu.Popup data-testid="file-popup">
					<Menu.Item data-testid="file-item-new">New</Menu.Item>
					<Menu.Item data-testid="file-item-open">Open</Menu.Item>
					<Menu.Item data-testid="file-item-save">Save</Menu.Item>
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	</Menu.Root>
	<Menu.Root>
		<Menu.Trigger data-testid="edit-trigger">Edit</Menu.Trigger>
		<Menu.Portal>
			<Menu.Positioner>
				<Menu.Popup data-testid="edit-popup">
					<Menu.Item data-testid="edit-item">Undo</Menu.Item>
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	</Menu.Root>
</Menubar>
