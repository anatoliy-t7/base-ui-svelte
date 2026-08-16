<script lang="ts">
	import { Select } from '../src/select/index.js';
</script>

<Select.Root multiple data-testid="select-root">
	<Select.Trigger data-testid="trigger">
		<Select.Value data-testid="value" placeholder="Pick fruits" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Positioner>
			<Select.Popup data-testid="popup">
				<Select.List>
					<Select.Item data-testid="item-apple" value="apple">
						<Select.ItemText>Apple</Select.ItemText>
						<Select.ItemIndicator />
					</Select.Item>
					<Select.Item data-testid="item-banana" value="banana">
						<Select.ItemText>Banana</Select.ItemText>
						<Select.ItemIndicator />
					</Select.Item>
				</Select.List>
			</Select.Popup>
		</Select.Positioner>
	</Select.Portal>
</Select.Root>
