<script lang="ts">
	import { ContextMenu } from 'base-ui-svelte/context-menu';
</script>

<h1>Context Menu</h1>

<section class="demo">
	<ContextMenu.Root>
		<ContextMenu.Trigger class="context-surface">Right-click this area</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Positioner>
				<ContextMenu.Popup class="context-menu-popup">
					<ContextMenu.Item class="context-menu-item">Copy</ContextMenu.Item>
					<ContextMenu.Item class="context-menu-item">Paste</ContextMenu.Item>
					<ContextMenu.Separator class="context-menu-separator" />
					<ContextMenu.Item class="context-menu-item">Delete</ContextMenu.Item>
				</ContextMenu.Popup>
			</ContextMenu.Positioner>
		</ContextMenu.Portal>
	</ContextMenu.Root>
</section>
