<script lang="ts">
	import { ContextMenu } from 'base-ui-svelte/context-menu';
	import '../demo.css';
</script>

<h1>Context Menu</h1>
<div class="demo">
	<ContextMenu.Root>
		<ContextMenu.Trigger class="context-surface">Right-click this area</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Positioner>
				<ContextMenu.Popup class="menu-popup">
					<ContextMenu.Item class="menu-item">Copy</ContextMenu.Item>
					<ContextMenu.Item class="menu-item">Paste</ContextMenu.Item>
					<ContextMenu.Separator class="menu-sep" />
					<ContextMenu.Item class="menu-item">Delete</ContextMenu.Item>
				</ContextMenu.Popup>
			</ContextMenu.Positioner>
		</ContextMenu.Portal>
	</ContextMenu.Root>
</div>
