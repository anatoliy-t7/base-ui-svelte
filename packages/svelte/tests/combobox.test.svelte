<script lang="ts">
	import { Combobox } from '../src/combobox/index.js';
</script>

<Combobox.Root>
	<Combobox.Label data-testid="label">Fruit</Combobox.Label>
	<Combobox.InputGroup data-testid="input-group">
		<Combobox.Input data-testid="input" />
		<Combobox.Trigger data-testid="trigger" />
		<Combobox.Icon data-testid="icon" />
		<Combobox.Clear data-testid="clear" />
		<Combobox.Value data-testid="value" placeholder="Pick a fruit" />
	</Combobox.InputGroup>
	<Combobox.Portal>
		<Combobox.Backdrop data-testid="backdrop" />
		<Combobox.Positioner>
			<Combobox.Popup data-testid="popup">
				<Combobox.Arrow data-testid="arrow" />
				<Combobox.Status data-testid="status">Suggestions</Combobox.Status>
				<Combobox.List data-testid="list">
					<Combobox.Group data-testid="group">
						<Combobox.GroupLabel data-testid="group-label">Citrus</Combobox.GroupLabel>
						<Combobox.Item data-testid="item-apple" value="apple" label="Apple">
							<Combobox.Row data-testid="row-apple">
								<Combobox.ItemIndicator data-testid="indicator-apple" />
								Apple
							</Combobox.Row>
						</Combobox.Item>
						<Combobox.Item data-testid="item-banana" value="banana" label="Banana" />
					</Combobox.Group>
					<Combobox.Separator data-testid="separator" />
					<Combobox.Item data-testid="item-cherry" value="cherry" label="Cherry" />
					<Combobox.Empty data-testid="empty">No fruits</Combobox.Empty>
				</Combobox.List>
			</Combobox.Popup>
		</Combobox.Positioner>
	</Combobox.Portal>
</Combobox.Root>
