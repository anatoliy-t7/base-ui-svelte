<script lang="ts">
	import { Menu } from '../src/menu/index.js';

	let checked = $state(false);

	let {
		openOnHover = false,
		delay = 0,
		closeDelay = 0,
	}: {
		openOnHover?: boolean;
		delay?: number;
		closeDelay?: number;
	} = $props();
</script>

<Menu.Root {openOnHover} {delay} {closeDelay}>
	<Menu.Trigger data-testid="trigger" {openOnHover}>Open</Menu.Trigger>
	<Menu.Portal>
		<Menu.Backdrop data-testid="backdrop" />
		<Menu.Positioner>
			<Menu.Popup data-testid="popup">
				<Menu.Arrow data-testid="arrow" />
				<Menu.Viewport data-testid="viewport">
					<Menu.Item data-testid="item-1">Item 1</Menu.Item>
					<Menu.CheckboxItem data-testid="checkbox-item" bind:checked defaultChecked={false}>
						{#snippet children({ checked: isChecked })}
							<Menu.CheckboxItemIndicator data-testid="checkbox-indicator" />
							Checkbox ({isChecked ? 'on' : 'off'})
						{/snippet}
					</Menu.CheckboxItem>
					<Menu.RadioGroup data-testid="radio-group" defaultValue="a">
						<Menu.RadioItem data-testid="radio-a" value="a">
							{#snippet children({ checked: isChecked })}
								<Menu.RadioItemIndicator data-testid="radio-indicator-a" />
								Option A ({isChecked ? 'on' : 'off'})
							{/snippet}
						</Menu.RadioItem>
						<Menu.RadioItem data-testid="radio-b" value="b">
							{#snippet children({ checked: isChecked })}
								<Menu.RadioItemIndicator data-testid="radio-indicator-b" />
								Option B ({isChecked ? 'on' : 'off'})
							{/snippet}
						</Menu.RadioItem>
					</Menu.RadioGroup>
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
