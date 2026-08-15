<script lang="ts">
	import { ContextMenu } from '../src/context-menu/index.js';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger data-testid="trigger">Right click me</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Positioner>
			<ContextMenu.Popup data-testid="popup">
				<ContextMenu.Arrow data-testid="arrow" />
				<ContextMenu.Item data-testid="item-1">Item 1</ContextMenu.Item>
				<ContextMenu.CheckboxItem data-testid="checkbox-item" defaultChecked>
					<ContextMenu.CheckboxItemIndicator />
					Checked
				</ContextMenu.CheckboxItem>
				<ContextMenu.Separator />
				<ContextMenu.Item data-testid="item-2">Item 2</ContextMenu.Item>
			</ContextMenu.Popup>
		</ContextMenu.Positioner>
	</ContextMenu.Portal>
</ContextMenu.Root>
