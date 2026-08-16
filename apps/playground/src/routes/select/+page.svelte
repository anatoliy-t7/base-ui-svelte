<script lang="ts">
	import { Select } from 'base-ui-svelte/select';
</script>

<h1>Select</h1>

<section class="demo">
	<Select.Root defaultValue="apple">
		<Select.Trigger class="select-trigger">
			<Select.Value class="select-value" placeholder="Choose fruit" />
			<Select.Icon class="select-icon">▾</Select.Icon>
		</Select.Trigger>
		<Select.Portal>
			<Select.Positioner sideOffset={4}>
				<Select.Popup class="select-popup">
					<Select.List>
						<Select.Item class="select-item" value="apple">
							<Select.ItemText>Apple</Select.ItemText>
							<Select.ItemIndicator class="select-item-indicator">✓</Select.ItemIndicator>
						</Select.Item>
						<Select.Item class="select-item" value="banana">
							<Select.ItemText>Banana</Select.ItemText>
							<Select.ItemIndicator class="select-item-indicator">✓</Select.ItemIndicator>
						</Select.Item>
						<Select.Item class="select-item" value="cherry">
							<Select.ItemText>Cherry</Select.ItemText>
							<Select.ItemIndicator class="select-item-indicator">✓</Select.ItemIndicator>
						</Select.Item>
					</Select.List>
				</Select.Popup>
			</Select.Positioner>
		</Select.Portal>
	</Select.Root>
</section>
