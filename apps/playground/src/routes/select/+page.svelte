<script lang="ts">
	import { Select } from 'base-ui-svelte/select';
	import '../demo.css';
</script>

<h1>Select</h1>
<div class="demo">
	<Select.Root defaultValue="apple">
		<Select.Trigger class="btn select-trigger">
			<Select.Value placeholder="Choose fruit" />
			<Select.Icon>▾</Select.Icon>
		</Select.Trigger>
		<Select.Portal>
			<Select.Positioner sideOffset={4}>
				<Select.Popup class="menu-popup">
					<Select.List>
						<Select.Item class="menu-item" value="apple">
							<Select.ItemText>Apple</Select.ItemText>
							<Select.ItemIndicator>✓</Select.ItemIndicator>
						</Select.Item>
						<Select.Item class="menu-item" value="banana">
							<Select.ItemText>Banana</Select.ItemText>
							<Select.ItemIndicator>✓</Select.ItemIndicator>
						</Select.Item>
						<Select.Item class="menu-item" value="cherry">
							<Select.ItemText>Cherry</Select.ItemText>
							<Select.ItemIndicator>✓</Select.ItemIndicator>
						</Select.Item>
					</Select.List>
				</Select.Popup>
			</Select.Positioner>
		</Select.Portal>
	</Select.Root>
</div>
