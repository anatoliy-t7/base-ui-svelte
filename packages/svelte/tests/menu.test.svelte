<script lang="ts">
	import { Menu } from '../src/menu/index.js';

	let checked = $state(false);
</script>

<Menu.Root>
	<Menu.Trigger data-testid="trigger">Open</Menu.Trigger>
	<Menu.Portal>
		<Menu.Backdrop data-testid="backdrop" />
		<Menu.Positioner>
			<Menu.Popup data-testid="popup">
				<Menu.Arrow data-testid="arrow" />
				<Menu.Viewport data-testid="viewport">
					<Menu.Item data-testid="item-1">Item 1</Menu.Item>
					<Menu.CheckboxItem
						data-testid="checkbox-item"
						bind:checked
						defaultChecked={false}
					>
						{#snippet children({ checked: isChecked })}
							<Menu.CheckboxItemIndicator data-testid="checkbox-indicator" />
							Checkbox ({isChecked ? 'on' : 'off'})
						{/snippet}
					</Menu.CheckboxItem>
					<Menu.Separator />
					<Menu.SubmenuRoot>
						<Menu.SubmenuTrigger data-testid="submenu-trigger">More</Menu.SubmenuTrigger>
						<Menu.Portal>
							<Menu.Positioner side="right">
								<Menu.Popup data-testid="submenu-popup">
									<Menu.Item data-testid="submenu-item">Nested</Menu.Item>
								</Menu.Popup>
							</Menu.Positioner>
						</Menu.Portal>
					</Menu.SubmenuRoot>
					<Menu.Group>
						<Menu.GroupLabel>More</Menu.GroupLabel>
						<Menu.Item data-testid="item-2">Item 2</Menu.Item>
					</Menu.Group>
				</Menu.Viewport>
			</Menu.Popup>
		</Menu.Positioner>
	</Menu.Portal>
</Menu.Root>
